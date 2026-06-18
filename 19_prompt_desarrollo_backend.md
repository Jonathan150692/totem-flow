# 19 — Prompt de Inicio de Desarrollo: Backend / Lógica de Negocio

**Proyecto:** TOTEM Flow
**Versión:** 1.0

Este prompt cubre la capa de lógica de negocio (Server Actions, motores de checklist/SLA/estados), que en la arquitectura elegida (Documento 03) vive dentro del mismo proyecto Next.js, no como un servicio separado.

---

## Prompt

```
Eres un desarrollador backend senior especializado en Next.js Server Actions, 
TypeScript y PostgreSQL. Vas a construir la lógica de negocio de "TOTEM Flow", 
una plataforma interna de gestión automatizada de proyectos para TOTEM, empresa 
ecuatoriana de seguridad electrónica.

CONTEXTO DEL PROYECTO
La plataforma gestiona proyectos comerciales desde su creación hasta la entrega 
a Operaciones, mediante tres motores de negocio centrales que debes construir 
como módulos desacoplados en lib/engines/:

1. MOTOR DE CHECKLIST DINÁMICO (lib/engines/checklist-engine.ts)
   Responsabilidad: dado un proyecto recién creado (con sus soluciones, tipo, 
   monto, localidades y flags técnicos), generar las filas correspondientes en 
   project_checklist_items, basándose en las reglas almacenadas en checklist_rules 
   (no hardcodear reglas en el código — deben ser configurables desde base de datos).
   Reglas de activación a soportar: por solución (SOLUTION), por tipo de proyecto 
   (PROJECT_TYPE), por tipo de negocio (BUSINESS_TYPE), por umbral de monto 
   (AMOUNT_THRESHOLD), por número de localidades (LOCATION_COUNT), y por flags 
   booleanos (FLAG, ej. requires_import=true).
   Si una regla tiene is_repeatable_per_location=true, debe generar una instancia 
   del ítem por cada localidad del proyecto.
   Debe exponer también una función para recalcular el % de avance del checklist 
   (excluyendo de los pendientes obligatorios los ítems marcados NO_APLICA, que 
   requieren un not_applicable_reason no nulo).

2. MOTOR DE SLA Y ESCALAMIENTO (lib/engines/sla-engine.ts)
   Responsabilidad: calcular en cada fase activa (project_phases) el estado SLA 
   (DENTRO_TIEMPO / POR_VENCER / VENCIDO) comparando el tiempo transcurrido 
   (excluyendo paused_hours acumulado por suspensiones) contra max_hours_allowed, 
   usando los umbrales warning_threshold_pct (default 80%) y 
   escalation_threshold_pct (default 150%).
   Debe exponer:
   - Una función de cálculo síncrono usada al consultar dashboard/detalle de 
     proyecto (no debe escribir en base de datos, solo calcular y devolver el 
     estado para mostrar en tiempo real).
   - Una función para el cron de verificación periódica (a ejecutarse vía Vercel 
     Cron) que SÍ actualiza sla_status en base de datos, dispara notificaciones 
     al responsable y al jefe de área cuando una fase pasa a VENCIDO, y escala 
     a un segundo nivel (Gerencia) cuando se supera escalation_threshold_pct.
   - Una función para iniciar una fase (registra started_at, copia max_hours 
     desde sla_definitions como snapshot).
   - Una función para cerrar una fase (registra ended_at, congela el sla_status 
     final para histórico).
   - Una función para pausar/reanudar el proyecto completo, acumulando 
     paused_hours correctamente.

3. MOTOR DE TRANSICIÓN DE ESTADOS (lib/engines/status-engine.ts)
   Responsabilidad: implementar la máquina de estados finita de los 18 estados 
   del proyecto (ver docs/08_estados_proyecto.md para el catálogo completo y la 
   matriz de transiciones válidas — debes modelar esa matriz explícitamente en 
   código, no como una validación implícita).
   Debe exponer una función transitionProjectStatus(projectId, newStatus, userId, 
   comment?) que:
   - Verifica que la transición desde el estado actual hacia newStatus está 
     permitida según la matriz.
   - Verifica que el rol del userId está autorizado para ejecutar esa transición 
     específica (ver docs/07_matriz_roles_permisos.md).
   - Exige comment no nulo si la transición es hacia DEVUELTO_COMERCIAL, 
     SUSPENDIDO o CANCELADO.
   - Aplica los "gates" de negocio correspondientes antes de permitir ciertas 
     transiciones (ej. no permitir pasar a REUNION_PENDIENTE si existen 
     preguntas obligatorias no cerradas; no permitir pasar a APROBADO_FASE_NINJA 
     si el checklist obligatorio no está al 100%).
   - Si la transición es válida: actualiza projects.current_status, inserta el 
     registro en project_status_history, y dispara los efectos secundarios 
     correspondientes (cerrar/iniciar fase vía sla-engine, notificaciones).
   - Si no es válida: rechaza con un error explícito (qué regla específica 
     bloqueó la transición), nunca falla de forma silenciosa.

SERVICIOS DE SOPORTE A CONSTRUIR
- lib/engines/audit-log.ts: función writeAuditLog(projectId, userId, eventType, 
  description, metadata?) usada por los tres motores anteriores y por cualquier 
  Server Action que ejecute una acción relevante. Nunca debe permitir UPDATE ni 
  DELETE sobre audit_log desde la aplicación.
- lib/integrations/email.ts: servicio de envío de notificaciones por correo 
  (en el MVP, vía Resend o SMTP simple; diseñarlo con una interfaz que permita 
  sustituir el proveedor por Microsoft Graph API en Fase 2 sin tocar el código 
  que lo invoca).
- lib/documents/generate-word.ts, generate-pdf.ts, generate-excel.ts: generador 
  del documento final de la Fase Ninja. CRÍTICO: debe rechazar la generación si 
  detecta que alguna fuente de datos consolidada no proviene de un registro en 
  estado aprobado (ver docs/01_requerimientos_funcionales.md, RF-NINJA-005).

SERVER ACTIONS A EXPONER (capa que conecta el frontend con los motores)
Organiza las Server Actions por dominio (app/(dashboard)/proyectos/actions.ts, 
.../checklist/actions.ts, etc.). Cada Server Action debe:
1. Validar el input con un esquema Zod.
2. Verificar autorización del usuario actual para esa acción específica (no 
   confiar únicamente en RLS — defensa en profundidad, ver 
   docs/15_recomendaciones_seguridad.md).
3. Invocar el motor de negocio correspondiente.
4. Devolver un resultado tipado (éxito con datos, o error con mensaje claro).

REGLAS DE NEGOCIO QUE DEBES RESPETAR EN TODO EL DESARROLLO
Consulta docs/09_reglas_negocio_indicadores.md para el catálogo completo 
(RN-001 a RN-011). Estas reglas no son opcionales ni se pueden relajar para 
"simplificar" una primera versión del motor — son la razón de ser de la 
plataforma.

INSTRUCCIONES DE TRABAJO
1. Empieza por el motor de transición de estados (es el que más se referencia 
   desde los otros dos).
2. Luego el motor de SLA.
3. Luego el motor de checklist dinámico.
4. Construye pruebas unitarias para cada motor a medida que lo desarrollas 
   (ver docs/16_plan_pruebas.md, secciones 3 a 5, para los casos específicos 
   que debes cubrir) — no dejes las pruebas para el final.
5. Si encuentras un caso de negocio ambiguo no resuelto en los documentos de 
   diseño, señálalo explícitamente antes de asumir un comportamiento.

Empieza por revisar docs/04_modelo_base_datos.md y docs/08_estados_proyecto.md, 
y luego implementa el motor de transición de estados con sus pruebas unitarias.
```

## Notas para quien use este prompt

- Este prompt asume que el esquema de base de datos (Documento 20) ya existe; si no, conviene ejecutar primero el prompt de base de datos.
- Los tres motores deben quedar completamente desacoplados de Next.js en su lógica interna (funciones puras que reciben datos y devuelven resultados), para que sean fácilmente extraíbles a un servicio separado en el futuro si la complejidad lo justifica (ver Documento 03, sección 5).
