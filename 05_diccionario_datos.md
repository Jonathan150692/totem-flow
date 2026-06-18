# 05 — Diccionario de Datos

**Proyecto:** TOTEM Flow
**Versión:** 1.0

Este documento complementa el Modelo de Base de Datos (Documento 04) detallando dominios de valores, reglas de validación y significado de negocio de los campos críticos.

---

## 1. Dominios de valores controlados (enumeraciones)

### `priority` (projects.priority)
| Valor | Significado |
|---|---|
| NORMAL | Prioridad estándar, sin urgencia adicional |
| ALTA | Requiere atención prioritaria sobre proyectos normales |
| URGENTE | Máxima prioridad, puede requerir reasignación de recursos |

### `project_type` (project_types.code)
| Valor | Significado | Referencia de uso |
|---|---|---|
| PEQUENO | Proyecto de bajo monto/complejidad | Define SLA más cortos (Documento 14) |
| MEDIANO | Complejidad media | |
| GRANDE | Alto monto/complejidad, múltiples soluciones o localidades | |
| ESPECIAL | Casos fuera de los patrones estándar (ej. proyectos especiales del brief) | SLA más amplios |

### `business_type` (projects.business_type)
| Valor | Significado |
|---|---|
| VENTA | Venta de equipos/soluciones |
| RENTA | Modalidad de arrendamiento |
| SERVICIO | Prestación de servicio (ej. monitoreo) |
| MANTENIMIENTO | Contrato de mantenimiento |
| MIXTO | Combinación de dos o más tipos anteriores |

### `current_status` (projects.current_status) — ver Documento 08 para detalle completo
Valores: `CREADO`, `PENDIENTE_REVISION_INICIAL`, `DEVUELTO_COMERCIAL`, `REVISION_APROBADA`, `CHECKLIST_EN_DESARROLLO`, `PREGUNTAS_GENERADAS`, `PENDIENTE_RESPUESTA_COMERCIAL`, `PREGUNTAS_RESPONDIDAS`, `PREGUNTAS_CERRADAS`, `REUNION_PENDIENTE`, `REUNION_AGENDADA`, `EN_REVISION_EQUIPO`, `APROBADO_FASE_NINJA`, `EN_FASE_NINJA`, `DOCUMENTO_FINAL_GENERADO`, `ENTREGADO_OPERACIONES`, `SUSPENDIDO`, `CANCELADO`.

### `solution_code` (project_solutions.solution_code)
Valores: `CCTV`, `CONTROL_ACCESO`, `INTRUSION`, `INCENDIO`, `REDES`, `ENERGIA`, `SOFTWARE`, `MONITOREO`, `OTROS`.

### `checklist item status` (project_checklist_items.status)
| Valor | Significado | Regla |
|---|---|---|
| PENDIENTE | No iniciado | Estado inicial al generar el checklist |
| EN_PROGRESO | Capturando información | |
| COMPLETO | Validado y cerrado | Cuenta para el % de avance obligatorio |
| NO_APLICA | Excluido del proyecto | Requiere `not_applicable_reason` no nulo |

### `sla_status` (project_phases.sla_status)
| Valor | Color sugerido | Regla de cálculo |
|---|---|---|
| DENTRO_TIEMPO | Verde | tiempo_transcurrido < (max_hours × warning_threshold_pct / 100) |
| POR_VENCER | Amarillo | warning_threshold_pct ≤ tiempo_transcurrido < 100% del max_hours |
| VENCIDO | Rojo | tiempo_transcurrido ≥ max_hours |

Nota: `EN_PROCESO` (azul) y `SUSPENDIDO/CANCELADO` (gris) del punto 21 del brief son estados visuales a nivel de proyecto completo, no de fase individual — se calculan combinando `current_status` con `sla_status` de la fase activa.

### `question.status`
Valores: `PENDIENTE`, `RESPONDIDA`, `DEVUELTA`, `CERRADA`, `VENCIDA`.

Regla: una pregunta pasa a `VENCIDA` automáticamente (vía proceso programado) si `due_date < now()` y `status` no es `CERRADA`. El paso a `VENCIDA` no impide que luego se responda; es informativo para el reporte de cumplimiento, pero si la pregunta es `is_mandatory = true`, sigue bloqueando el avance del proyecto hasta llegar a `CERRADA`.

### `internal_meetings.final_decision`
Valores: `APROBADO`, `APROBADO_CON_OBSERVACIONES`, `DEVUELTO_COMERCIAL`, `AJUSTE_TECNICO`, `AJUSTE_FINANCIERO`, `SUSPENDIDO`, `CANCELADO`.

Regla: solo `APROBADO` y `APROBADO_CON_OBSERVACIONES` habilitan la transición de `current_status` a `APROBADO_FASE_NINJA`.

### `audit_log.event_type`
Valores: `CREACION`, `CAMBIO_ESTADO`, `CARGA_ARCHIVO`, `PREGUNTA_CREADA`, `RESPUESTA`, `APROBACION`, `DEVOLUCION`, `COMENTARIO`, `REUNION`, `ALERTA`, `RETRASO`, `CONFIG`.

## 2. Reglas de validación de campos críticos

| Campo | Regla |
|---|---|
| `projects.client_tax_id` | Formato RUC/cédula ecuatoriano: 10 o 13 dígitos numéricos (validación de formato, no de existencia legal). |
| `projects.project_code` | Generado automáticamente, formato `TOT-{AAAA}-{NNNN}` correlativo anual, inmutable tras creación. |
| `project_financials.expected_margin` | Debe ser `estimated_value - estimated_cost`, calculado, no editable directamente (campo derivado, o validado contra el cálculo al guardar). |
| `project_checklist_items.not_applicable_reason` | Obligatorio (NOT NULL a nivel de aplicación) cuando `status = 'NO_APLICA'`. |
| `project_status_history.comment` | Obligatorio cuando `new_status` ∈ {`DEVUELTO_COMERCIAL`, `SUSPENDIDO`, `CANCELADO`} o cuando proviene de una decisión de reunión distinta a `APROBADO`. |
| `questions.due_date` | Calculado automáticamente como `created_at + sla_definitions.max_hours` para la fase `PREGUNTAS_INTERNAS` o `RESPUESTA_COMERCIAL` según corresponda, no editable manualmente salvo por Administrador. |
| `project_phases.max_hours_allowed` | Se copia (snapshot) desde `sla_definitions` en el momento de iniciar la fase, para que cambios posteriores en la configuración no alteren retroactivamente proyectos ya en curso. |
| `document_files.size_bytes` | Validar contra límite máximo configurable (sugerido 50 MB por archivo en MVP). |

## 3. Campos calculados (no almacenados directamente, derivados en consulta o vista)

| Campo calculado | Fórmula | Dónde se usa |
|---|---|---|
| `% avance checklist` | `COUNT(items WHERE status IN ('COMPLETO','NO_APLICA')) / COUNT(items total) × 100` | RF-CHK-012, vista de detalle de proyecto |
| `% cumplimiento SLA` | `COUNT(fases cerradas dentro de tiempo) / COUNT(fases cerradas) × 100` | Documento 09, dashboard |
| `tiempo total del proyecto` | `entregado_operaciones.changed_at - projects.created_at` | Documento 09, reportes |
| `% proyectos devueltos` | `COUNT(proyectos con al menos un DEVUELTO_COMERCIAL en status_history) / COUNT(proyectos totales) × 100` | Documento 09 |
| `% aprobados sin reproceso` | `COUNT(proyectos aprobados sin ningún DEVUELTO_COMERCIAL previo) / COUNT(proyectos aprobados) × 100` | Documento 09 |
| `preguntas promedio por proyecto` | `COUNT(questions) / COUNT(DISTINCT projects con al menos una pregunta)` | Documento 09 |

## 4. Convenciones generales

- Todas las claves primarias usan `uuid` generado por la aplicación o por `gen_random_uuid()` de Postgres, excepto catálogos pequeños y estables (`roles`, `project_types`, `phase_definitions`) que usan `serial` por simplicidad de referencia en configuración.
- Todas las tablas con datos transaccionales incluyen `created_at` con `timestamptz` en UTC; la conversión a hora local de Ecuador (GMT-5) se hace en la capa de presentación.
- Los campos de texto libre que alimentan el documento final (Fase Ninja) no tienen límite de longitud artificial a nivel de base de datos; el límite se controla en la interfaz si es necesario por motivos de diseño del documento exportado.
