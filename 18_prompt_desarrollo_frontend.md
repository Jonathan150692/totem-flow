# 18 — Prompt de Inicio de Desarrollo: Frontend

**Proyecto:** TOTEM Flow
**Versión:** 1.0

Este prompt está diseñado para ser usado directamente con un asistente de desarrollo (ej. Claude Code) o entregado a un desarrollador frontend como punto de partida. Asume que el modelo de base de datos (Documento 04) y el esquema Drizzle (Documento 20) ya existen o se desarrollan en paralelo.

---

## Prompt

```
Eres un desarrollador frontend senior especializado en Next.js 15 (App Router), 
TypeScript y Tailwind CSS. Vas a construir el frontend de "TOTEM Flow", una 
plataforma interna de gestión automatizada de proyectos para TOTEM, empresa 
ecuatoriana de seguridad electrónica (CCTV, control de acceso, redes, incendio, 
software, monitoreo).

CONTEXTO DEL PROYECTO
La plataforma gestiona el ciclo de vida completo de un proyecto comercial desde 
su creación hasta la entrega a Operaciones, mediante un checklist dinámico que 
se activa según las características del proyecto (soluciones involucradas, 
tipo de proyecto, monto, número de localidades), un flujo de 18 estados 
controlados, un sistema de preguntas y respuestas interáreas, control de 
tiempos (SLA) con semáforo visual, y generación de un documento final 
consolidado (PDF/Word).

STACK A UTILIZAR
- Next.js 15 (App Router), TypeScript estricto
- Tailwind CSS + shadcn/ui para componentes base
- React Server Components por defecto; Client Components solo donde se 
  requiera interactividad (formularios, wizard, drag and drop)
- Zod + react-hook-form para validación de formularios
- TanStack Table para tablas con filtros/ordenamiento
- Recharts para gráficos del dashboard
- @dnd-kit/core para la vista Kanban
- date-fns para manejo de fechas (zona horaria GMT-5, Ecuador)

ROLES DE USUARIO (8 roles — implementar control de UI según rol, sabiendo que 
la autorización real ocurre en el servidor vía RLS y validación en Server Actions, 
nunca confiar solo en ocultar elementos de UI):
ADMIN, COMERCIAL, REVISOR_PROYECTOS, PROYECTOS, INGENIERIA, PRESUPUESTO, 
OPERACIONES, GERENCIA. Un usuario puede tener más de un rol.

PANTALLAS A CONSTRUIR (en este orden de prioridad para el MVP):
1. Login (email/password)
2. Layout general: menú lateral con navegación condicionada por rol, header 
   con usuario actual y centro de notificaciones
3. Dashboard principal: tarjetas de indicadores (proyectos activos, % cumplimiento 
   SLA, vencidos, % devueltos), filtros (fecha, cliente, ejecutivo, responsable, 
   estado, tipo, prioridad, área), panel de distribución por fase (barras), 
   panel de "próximos a vencer"
4. Listado de proyectos en tabla (filtrable, ordenable, paginado)
5. Vista Kanban de proyectos agrupados por estado, con tarjetas arrastrables 
   (drag and drop solo habilitado para roles autorizados)
6. Wizard de creación de proyecto en 4 pasos: (1) datos generales y cliente, 
   (2) localidades (lista expandible, "+ agregar localidad"), (3) datos 
   financieros, (4) datos técnicos y selección de soluciones (tarjetas tipo 
   checkbox grande). Mostrar pantalla de resumen antes de confirmar, indicando 
   qué secciones de checklist se activarán.
7. Vista de detalle de proyecto: header con nombre, código, badge de estado 
   (color según su categoría) y badge de SLA (semáforo verde/amarillo/rojo/
   azul/gris), navegación por tabs: Resumen | Checklist | Preguntas | Reunión | 
   Documentos | Bitácora
8. Checklist dinámico: secciones colapsables agrupadas por solución, barra de 
   progreso por sección y total, ítems con input según tipo (texto, número, 
   booleano, select, archivo), manejo visual distintivo para ítems "no aplica"
9. Preguntas y respuestas: lista filtrable por área/estado/responsable con 
   badges de color, vista de detalle tipo hilo de conversación
10. Reunión interna: formulario de fecha/hora, participantes (multi-select), 
    acuerdos, observaciones, selector de decisión final (7 opciones)
11. Fase Ninja: previsualización del documento consolidado antes de exportar, 
    botones de exportación PDF/Word, alerta bloqueante si hay datos no aprobados
12. Bitácora: timeline visual de eventos del proyecto
13. Centro de notificaciones
14. Reportes e indicadores (solo Admin/Gerencia)
15. Panel de configuración (solo Admin): usuarios y roles, tiempos SLA, tipos 
    de proyecto, plantillas de checklist

PRINCIPIOS DE DISEÑO VISUAL
- Semáforo de SLA consistente en toda la plataforma: verde (dentro de tiempo), 
  amarillo (por vencer), rojo (vencido), azul (en proceso/informativo), 
  gris (suspendido/cancelado)
- Densidad de información alta pero legible — TOTEM gestiona muchos proyectos 
  en paralelo
- Responsive: soporte completo en escritorio; en móvil, las vistas de creación/
  edición pueden degradar a "solo consulta" en el MVP

INSTRUCCIONES DE TRABAJO
1. Empieza por el layout general y el sistema de autenticación.
2. Construye cada pantalla como Server Component cuando sea posible, usando 
   Server Actions para mutaciones (no construyas una API REST separada salvo 
   que se indique lo contrario).
3. Usa los tipos generados desde el esquema de base de datos (Drizzle) como 
   fuente de verdad para los tipos de TypeScript en todo el frontend — no 
   dupliques definiciones de tipos manualmente.
4. Antes de implementar cada pantalla, pregunta si necesitas el contrato exacto 
   de la Server Action correspondiente (request/response) si aún no existe.
5. Prioriza el orden de pantallas indicado arriba; no avances a Fase Ninja sin 
   tener primero el checklist y las preguntas funcionando, ya que dependen de 
   ese flujo.

Empieza generando la estructura de carpetas del frontend según 
docs/17_estructura_repositorio.md, y luego el layout general con navegación 
condicionada por rol.
```

## Notas para quien use este prompt

- Si se usa con Claude Code, conviene adjuntar o referenciar directamente los Documentos 01 (requerimientos funcionales), 04 (modelo de datos), 07 (roles), 08 (estados) y 10 (wireframes) como contexto adicional, ya que el prompt los resume pero no los reemplaza.
- El prompt asume que el esquema de base de datos ya está definido (Documento 20) para poder generar tipos compartidos; si el frontend se desarrolla en paralelo sin ese esquema, ajustar el punto 3 de "Instrucciones de trabajo".
