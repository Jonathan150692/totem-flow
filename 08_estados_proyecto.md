# 08 — Estados del Proyecto

**Proyecto:** TOTEM Flow
**Versión:** 1.0

---

## 1. Catálogo completo de estados

| # | Código | Nombre | Color sugerido | Descripción |
|---|---|---|---|---|
| 1 | CREADO | Proyecto creado | Azul | Recién registrado, antes de cualquier revisión |
| 2 | PENDIENTE_REVISION_INICIAL | Pendiente revisión inicial | Amarillo | Esperando que el Revisor de Proyectos valide la información |
| 3 | DEVUELTO_COMERCIAL | Devuelto a Comercial | Rojo | Información incompleta o incorrecta, requiere corrección |
| 4 | REVISION_APROBADA | Revisión inicial aprobada | Verde | El Revisor confirmó que la información base es correcta |
| 5 | CHECKLIST_EN_DESARROLLO | Checklist en desarrollo | Azul | Las áreas están completando el checklist dinámico |
| 6 | PREGUNTAS_GENERADAS | Preguntas internas generadas | Amarillo | Una o más áreas generaron preguntas hacia Comercial u otra área |
| 7 | PENDIENTE_RESPUESTA_COMERCIAL | Pendiente respuesta Comercial | Amarillo | Esperando que se respondan las preguntas abiertas |
| 8 | PREGUNTAS_RESPONDIDAS | Preguntas respondidas | Azul | Las respuestas fueron registradas, pendientes de validación de cierre |
| 9 | PREGUNTAS_CERRADAS | Preguntas cerradas | Verde | Todas las preguntas obligatorias están cerradas |
| 10 | REUNION_PENDIENTE | Reunión interna pendiente | Amarillo | Se puede agendar la reunión, aún no se ha hecho |
| 11 | REUNION_AGENDADA | Reunión interna agendada | Azul | Fecha y participantes confirmados |
| 12 | EN_REVISION_EQUIPO | En revisión de equipo | Azul | La reunión se realizó, se está documentando la decisión |
| 13 | APROBADO_FASE_NINJA | Aprobado para fase Ninja | Verde | Decisión de reunión positiva, listo para consolidación |
| 14 | EN_FASE_NINJA | En fase Ninja | Azul | Sistema consolidando datos para el documento final |
| 15 | DOCUMENTO_FINAL_GENERADO | Documento final generado | Verde | PDF/Word/Excel generados y disponibles |
| 16 | ENTREGADO_OPERACIONES | Entregado a Operaciones | Verde (cierre) | Estado final exitoso del proceso |
| 17 | SUSPENDIDO | Suspendido | Gris | Pausado con justificación, SLA detenido |
| 18 | CANCELADO | Cancelado | Gris | Finalizado sin completarse, historial conservado |

## 2. Matriz de transiciones válidas

| Desde \ Hacia | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **1. Creado** | – | ✔ | | | | | | | | | | | | | | | ✔ | ✔ |
| **2. Pend. revisión inicial** | | – | ✔ | ✔ | | | | | | | | | | | | | ✔ | ✔ |
| **3. Devuelto a Comercial** | | ✔ | – | | | | | | | | | | | | | | ✔ | ✔ |
| **4. Revisión aprobada** | | | | – | ✔ | | | | | | | | | | | | ✔ | ✔ |
| **5. Checklist en desarrollo** | | | | | – | ✔ | | | | | | | | | | | ✔ | ✔ |
| **6. Preguntas generadas** | | | | | | – | ✔ | | | | | | | | | | ✔ | ✔ |
| **7. Pend. respuesta Comercial** | | | | | | ✔ | – | ✔ | | | | | | | | | ✔ | ✔ |
| **8. Preguntas respondidas** | | | | | | ✔ | | – | ✔ | | | | | | | | ✔ | ✔ |
| **9. Preguntas cerradas** | | | | | | | | | – | ✔ | | | | | | | ✔ | ✔ |
| **10. Reunión pendiente** | | | | | | | | | | – | ✔ | | | | | | ✔ | ✔ |
| **11. Reunión agendada** | | | | | | | | | | | – | ✔ | | | | | ✔ | ✔ |
| **12. En revisión de equipo** | | | ✔ | | | ✔* | | | | | | – | ✔ | | | | ✔ | ✔ |
| **13. Aprobado fase Ninja** | | | | | | | | | | | | | – | ✔ | | | ✔ | ✔ |
| **14. En fase Ninja** | | | | | | | | | | | | | | – | ✔ | | ✔ | ✔ |
| **15. Documento final generado** | | | | | | | | | | | | | | | – | ✔ | ✔ | ✔ |
| **16. Entregado a Operaciones** | | | | | | | | | | | | | | | | – | | |
| **17. Suspendido** | | ✔ | | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | | – | ✔ |
| **18. Cancelado** | | | | | | | | | | | | | | | | | | – |

`*` Desde "En revisión de equipo", la decisión "requiere ajuste técnico" o "requiere ajuste financiero" regresa el proyecto a generación de nuevas preguntas dirigidas (estado 6), no necesariamente reabre todo el checklist.

Notas sobre la matriz:
- El estado 16 (Entregado a Operaciones) y el 18 (Cancelado) son estados terminales: no permiten transición de salida.
- El estado 17 (Suspendido) puede reanudarse hacia prácticamente cualquier estado activo anterior, retomando el punto donde se pausó.
- Toda fila vacía indica una transición no permitida por el motor de estados; un intento de transición no listada debe ser rechazado por la lógica de negocio con un mensaje explícito.

## 3. Reglas de auditoría por transición

Cada transición registrada en `project_status_history` exige como mínimo:
- `changed_by` (no puede ser nulo salvo transiciones 100% automáticas del sistema, ej. vencimiento de SLA).
- `comment` obligatorio en transiciones hacia: `DEVUELTO_COMERCIAL`, `SUSPENDIDO`, `CANCELADO`.
- Validación de que el rol de `changed_by` está autorizado para esa transición específica según el Documento 07.
