# 16 — Plan de Pruebas

**Proyecto:** TOTEM Flow
**Versión:** 1.0

---

## 1. Enfoque general

Las pruebas se organizan en cuatro niveles, priorizando la lógica de negocio crítica (motores de checklist, SLA y estados) por ser el corazón diferenciador de la plataforma y el área de mayor riesgo de error (ver Documento 14, R-01 y R-02).

| Nivel | Qué cubre | Herramienta sugerida |
|---|---|---|
| Unitarias | Funciones puras de los motores de negocio | Vitest o Jest |
| Integración | Server Actions contra una base de datos de prueba | Vitest + cliente Supabase de test |
| RLS / seguridad por rol | Que cada rol solo acceda a lo permitido | Scripts SQL de prueba + pruebas de integración autenticadas por rol |
| End-to-end (E2E) | Flujo completo de usuario en navegador | Playwright |

## 2. Trazabilidad

Cada caso de prueba referencia el requerimiento funcional (RF-XXX, Documento 01) y/o la regla de negocio (RN-XXX, Documento 09) que valida, para asegurar cobertura completa antes de cerrar el MVP.

## 3. Pruebas unitarias — motor de checklist dinámico

| Caso | RF/RN relacionado |
|---|---|
| Al marcar solución CCTV, se activan exactamente los ítems de la sección CCTV definidos en `checklist_items_master`. | RF-CHK-002 |
| Al marcar solución Control de Acceso, se activan los ítems correspondientes. | RF-CHK-003 |
| Al agregar una segunda localidad, las secciones marcadas como `is_repeatable_per_location` se duplican correctamente. | RF-CHK-005 |
| Al superar el umbral configurado de monto, se activa automáticamente el bloque de Aprobación Financiera. | RF-CHK-006, RN-001 |
| Al marcar `requires_import = true`, se activa el bloque de checklist de importaciones. | RF-CHK-007 |
| Un ítem marcado `NO_APLICA` sin `not_applicable_reason` es rechazado por la validación. | RF-CHK-011 |
| El cálculo de % de avance excluye correctamente los ítems `NO_APLICA` del denominador de obligatorios pendientes. | RF-CHK-012 |

## 4. Pruebas unitarias — motor de SLA

| Caso | RF/RN relacionado |
|---|---|
| Una fase con tiempo transcurrido menor al umbral de advertencia tiene `sla_status = DENTRO_TIEMPO`. | RF-SLA-003 |
| Una fase que supera el umbral de advertencia pero no el 100% tiene `sla_status = POR_VENCER`. | RF-SLA-003 |
| Una fase que supera el 100% del tiempo máximo tiene `sla_status = VENCIDO` y dispara notificación. | RF-SLA-003, RF-ESC-001, RF-ESC-002 |
| El tiempo en estado `SUSPENDIDO` se excluye correctamente del cálculo de tiempo transcurrido. | RF-SLA-004, RN-011 |
| Al superar el umbral de escalamiento (150%), se notifica al segundo nivel (Gerencia). | RF-ESC-004 |
| El cron de verificación de SLA marca como vencidas todas las fases correspondientes en una sola ejecución, sin omitir registros. | RF-ESC-001 |

## 5. Pruebas unitarias — motor de transición de estados

| Caso | RF/RN relacionado |
|---|---|
| Una transición listada como válida en la matriz del Documento 08 es aceptada. | RF-FLOW-001 |
| Una transición no listada en la matriz es rechazada con mensaje explícito. | RF-FLOW-001 |
| Una transición hacia `DEVUELTO_COMERCIAL` sin comentario es rechazada. | RF-FLOW-003, RN-003 |
| El sistema bloquea el avance a `REUNION_PENDIENTE` si existe al menos una pregunta obligatoria no cerrada. | RF-FLOW-005, RN-005 |
| El sistema bloquea el avance a `APROBADO_FASE_NINJA` si el checklist obligatorio no está al 100%. | RF-FLOW-006 |
| Solo el rol Operaciones (o Administrador) puede ejecutar la transición a `ENTREGADO_OPERACIONES`. | RF-FLOW-007, RN-007 |
| Una suspensión es posible desde cualquier estado activo y conserva el estado anterior para poder reanudar. | RF-FLOW-008 |

## 6. Pruebas de integración — preguntas y respuestas

| Caso | RF relacionado |
|---|---|
| Crear una pregunta calcula correctamente `due_date` según la definición de SLA de la fase correspondiente. | RF-QA-002 |
| Una pregunta no respondida tras superar `due_date` cambia automáticamente a `VENCIDA`. | RF-QA-004 |
| Notificación al responsable al crearse una pregunta. | RF-QA-005 |
| Notificación al área que preguntó cuando se responde. | RF-QA-006 |

## 7. Pruebas de RLS por rol

Para cada rol del Documento 07, se ejecuta una batería de pruebas que verifica:
- Puede leer únicamente los proyectos permitidos según la matriz de visibilidad (Documento 07, sección 3).
- No puede ejecutar transiciones de estado fuera de su permiso (intento directo vía API, no solo bloqueo de UI).
- No puede leer ni escribir en `audit_log` fuera de lo permitido (ninguna escritura directa, solo lectura según corresponda).
- Un intento de acceso cruzado (ej. Comercial intentando leer un proyecto que no es suyo) devuelve resultado vacío o error de permiso, nunca datos parciales filtrados incorrectamente.

## 8. Pruebas end-to-end (Playwright)

| Escenario E2E | Cobertura |
|---|---|
| Flujo feliz completo: Comercial crea proyecto → Revisor aprueba → Checklist completado → Preguntas generadas y cerradas → Reunión registrada como aprobada → Fase Ninja → Documento generado → Operaciones recibe. | Flujo completo del Documento 06 |
| Flujo de devolución: Revisor devuelve en revisión inicial, Comercial corrige, vuelve a aprobarse. | RF-FLOW-003, gate de revisión inicial |
| Flujo de ajuste técnico: reunión interna decide "requiere ajuste técnico", se generan nuevas preguntas, se vuelve a evaluar. | Bucle de retrabajo, Documento 06 sección 3 |
| Intento de generar documento final con datos no aprobados es bloqueado. | RF-NINJA-005, RN-006 |
| Vencimiento de fase dispara notificación visible en el centro de notificaciones del responsable. | RF-ESC-002, RF-NOTIF-002 |

## 9. Criterios de salida para considerar el MVP listo para producción

- 100% de los casos de la sección 3 (checklist), 4 (SLA) y 5 (estados) pasando.
- 0 hallazgos críticos o altos abiertos en las pruebas de RLS por rol.
- Al menos un recorrido E2E completo del "flujo feliz" ejecutado exitosamente contra el ambiente de staging con datos de un proyecto piloto real.
- Cobertura de pruebas automatizadas ≥ 70% en los tres motores de negocio (objetivo del Documento 02).
