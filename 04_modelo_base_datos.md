# 04 — Modelo de Base de Datos

**Proyecto:** TOTEM Flow
**Motor:** PostgreSQL (Supabase)
**Versión:** 1.0

---

## 1. Diagrama entidad-relación (vista simplificada)

```
users ──┬─< user_roles >──┬── roles
        │                  │
        │                  │
projects ──┬─< project_locations
           ├─< project_contacts
           ├─< project_financials (1:1)
           ├─< project_technical_info (1:1)
           ├─< project_attachments
           ├─< project_phases >── phase_definitions
           ├─< project_checklist_items >── checklist_rules >── checklist_templates
           ├─< questions ──< question_responses
           │              └─< question_attachments
           ├─< internal_meetings ──< meeting_participants
           │                      └─< meeting_attachments
           ├─< final_documents
           ├─< audit_log
           ├─< notifications
           └─< document_folders >── document_files

project_types ── checklist_templates
sla_definitions ── project_types, phase_definitions
```

## 2. Tablas principales

### 2.1 `users`
Usuarios del sistema (sincronizado con Supabase Auth vía `auth.users`).

| Columna | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | = `auth.users.id` |
| full_name | text | |
| email | text (unique) | |
| phone | text | |
| area | text | Comercial, Proyectos, Ingeniería, Presupuesto, Operaciones, etc. |
| active | boolean | default true |
| created_at | timestamptz | |

### 2.2 `roles`
| Columna | Tipo | Notas |
|---|---|---|
| id | serial (PK) | |
| code | text (unique) | `ADMIN`, `COMERCIAL`, `REVISOR_PROYECTOS`, `PROYECTOS`, `INGENIERIA`, `PRESUPUESTO`, `OPERACIONES`, `GERENCIA` |
| name | text | Nombre visible |
| description | text | |

### 2.3 `user_roles`
Relación N:N — un usuario puede tener más de un rol.

| Columna | Tipo | Notas |
|---|---|---|
| user_id | uuid (FK → users) | |
| role_id | int (FK → roles) | |
| PK compuesta | (user_id, role_id) | |

### 2.4 `project_types`
| Columna | Tipo | Notas |
|---|---|---|
| id | serial (PK) | |
| code | text | `PEQUENO`, `MEDIANO`, `GRANDE`, `ESPECIAL` |
| name | text | |
| min_amount | numeric | Rango orientativo de monto (opcional, soporte de clasificación) |
| max_amount | numeric | |

### 2.5 `projects`
Tabla central.

| Columna | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | |
| project_code | text (unique) | Generado automático, ej. `TOT-2026-0001` |
| name | text | |
| client_name | text | |
| client_tax_id | text | RUC / identificación |
| commercial_executive_id | uuid (FK → users) | |
| created_by | uuid (FK → users) | |
| priority | text | `NORMAL`, `ALTA`, `URGENTE` |
| project_type_id | int (FK → project_types) | |
| business_type | text | `VENTA`, `RENTA`, `SERVICIO`, `MANTENIMIENTO`, `MIXTO` |
| description | text | |
| base_gtt_reference | text | Referencia o número de GTT/correo base |
| current_status | text | Uno de los 18 estados (Documento 08) |
| current_phase_id | uuid (FK → project_phases), nullable | Fase activa |
| document_folder_id | uuid (FK → document_folders) | |
| created_at | timestamptz | |
| updated_at | timestamptz | |
| is_suspended | boolean | default false |
| is_cancelled | boolean | default false |

### 2.6 `project_contacts`
| Columna | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | |
| project_id | uuid (FK → projects) | |
| contact_type | text | `PRINCIPAL`, `LOCALIDAD` (si aplica a una localidad específica) |
| name | text | |
| position | text | Cargo |
| phone | text | |
| email | text | |
| address | text | |
| latitude | numeric, nullable | |
| longitude | numeric, nullable | |

### 2.7 `project_locations`
| Columna | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | |
| project_id | uuid (FK → projects) | |
| name | text | |
| address | text | |
| latitude | numeric, nullable | |
| longitude | numeric, nullable | |
| responsible_contact_id | uuid (FK → project_contacts), nullable | |
| phone | text | |
| email | text | |
| observations | text | |
| scope | text | Alcance específico de esta localidad |

### 2.8 `project_financials`
Relación 1:1 con `projects`.

| Columna | Tipo | Notas |
|---|---|---|
| project_id | uuid (PK, FK → projects) | |
| estimated_value | numeric | |
| estimated_cost | numeric | |
| expected_margin | numeric | |
| payment_terms | text | |
| commercial_conditions | text | |
| cost_center | text | |
| project_code_financial | text | Código contable, si difiere del `project_code` |
| requires_financial_validation | boolean | |
| requires_financial_approval | boolean | |

### 2.9 `project_financial_items`
Rubros requeridos (relación N:1 a `projects`).

| Columna | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | |
| project_id | uuid (FK → projects) | |
| item_name | text | |
| is_new_item | boolean | Activa checklist de "creación de rubros" si true |
| amount | numeric, nullable | |

### 2.10 `project_technical_info`
Relación 1:1 con `projects`.

| Columna | Tipo | Notas |
|---|---|---|
| project_id | uuid (PK, FK → projects) | |
| requires_site_visit | boolean | |
| requires_design | boolean | |
| requires_blueprint | boolean | |
| requires_calculation_memo | boolean | |
| requires_existing_system_integration | boolean | |
| requires_import | boolean | Activa checklist de importaciones |
| technical_observations | text | |

### 2.11 `project_solutions`
Soluciones involucradas (N:N conceptual, modelada como tabla simple).

| Columna | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | |
| project_id | uuid (FK → projects) | |
| solution_code | text | `CCTV`, `CONTROL_ACCESO`, `INTRUSION`, `INCENDIO`, `REDES`, `ENERGIA`, `SOFTWARE`, `MONITOREO`, `OTROS` |
| main_equipment | text | |
| estimated_quantity | int, nullable | |

### 2.12 `project_attachments`
| Columna | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | |
| project_id | uuid (FK → projects) | |
| file_id | uuid (FK → document_files) | |
| context | text | `GTT_BASE`, `GENERAL`, etc. |
| uploaded_by | uuid (FK → users) | |
| uploaded_at | timestamptz | |

### 2.13 `checklist_templates`
Plantillas base configurables por el Administrador.

| Columna | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | |
| name | text | Ej. "Checklist CCTV estándar" |
| solution_code | text, nullable | Si aplica a una solución específica |
| active | boolean | |

### 2.14 `checklist_rules`
Reglas de activación del motor de checklist dinámico.

| Columna | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | |
| template_id | uuid (FK → checklist_templates) | |
| trigger_type | text | `SOLUTION`, `PROJECT_TYPE`, `BUSINESS_TYPE`, `AMOUNT_THRESHOLD`, `LOCATION_COUNT`, `FLAG` |
| trigger_value | text | Ej. `CCTV`, `GRANDE`, `>50000`, `requires_import=true` |
| section_label | text | Nombre de la sección que se activa |
| is_repeatable_per_location | boolean | Si debe replicarse por cada localidad |

### 2.15 `checklist_items_master`
Catálogo maestro de ítems posibles (independiente del proyecto).

| Columna | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | |
| template_id | uuid (FK → checklist_templates) | |
| label | text | Ej. "Cantidad de cámaras" |
| is_mandatory | boolean | |
| input_type | text | `TEXT`, `NUMBER`, `BOOLEAN`, `SELECT`, `FILE` |
| order_index | int | |

### 2.16 `project_checklist_items`
Instancia real del checklist para un proyecto específico (generada por el motor).

| Columna | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | |
| project_id | uuid (FK → projects) | |
| location_id | uuid (FK → project_locations), nullable | Si es específico de una localidad |
| master_item_id | uuid (FK → checklist_items_master) | |
| status | text | `PENDIENTE`, `EN_PROGRESO`, `COMPLETO`, `NO_APLICA` |
| value | text, nullable | Valor capturado |
| not_applicable_reason | text, nullable | Obligatorio si status = NO_APLICA |
| updated_by | uuid (FK → users), nullable | |
| updated_at | timestamptz, nullable | |

### 2.17 `phase_definitions`
Catálogo de fases del proceso (no las 18 estados del proyecto, sino los tramos medibles por SLA: Revisión inicial, Preguntas internas, Respuesta Comercial, Reunión interna, Fase Ninja).

| Columna | Tipo | Notas |
|---|---|---|
| id | serial (PK) | |
| code | text | `REVISION_INICIAL`, `PREGUNTAS_INTERNAS`, `RESPUESTA_COMERCIAL`, `REUNION_INTERNA`, `FASE_NINJA` |
| name | text | |
| order_index | int | |

### 2.18 `sla_definitions`
Tiempos máximos configurables por tipo de proyecto y fase.

| Columna | Tipo | Notas |
|---|---|---|
| id | serial (PK) | |
| project_type_id | int (FK → project_types) | |
| phase_id | int (FK → phase_definitions) | |
| max_hours | numeric | |
| warning_threshold_pct | numeric | default 80 (cuándo se considera "por vencer") |
| escalation_threshold_pct | numeric | default 150 (cuándo se escala a segundo nivel) |

### 2.19 `project_phases`
Instancia real de cada fase recorrida por un proyecto.

| Columna | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | |
| project_id | uuid (FK → projects) | |
| phase_id | int (FK → phase_definitions) | |
| responsible_id | uuid (FK → users), nullable | |
| started_at | timestamptz | |
| ended_at | timestamptz, nullable | |
| max_hours_allowed | numeric | Copiado de `sla_definitions` al iniciar (snapshot histórico) |
| paused_hours | numeric | default 0 — tiempo excluido del cómputo por suspensión |
| sla_status | text | `DENTRO_TIEMPO`, `POR_VENCER`, `VENCIDO` |
| delay_justification | text, nullable | |

### 2.20 `project_status_history`
Historial de transición de los 18 estados (Documento 08).

| Columna | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | |
| project_id | uuid (FK → projects) | |
| previous_status | text, nullable | |
| new_status | text | |
| changed_by | uuid (FK → users) | |
| comment | text, nullable | Obligatorio si new_status implica devolución |
| changed_at | timestamptz | |

### 2.21 `questions`
| Columna | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | |
| project_id | uuid (FK → projects) | |
| asking_area | text | `PROYECTOS`, `INGENIERIA`, `PRESUPUESTO`, `OPERACIONES` |
| asked_by | uuid (FK → users) | |
| assigned_to | uuid (FK → users) | |
| question_text | text | |
| is_mandatory | boolean | Si bloquea el avance a reunión interna |
| due_date | timestamptz | Calculada según SLA |
| status | text | `PENDIENTE`, `RESPONDIDA`, `DEVUELTA`, `CERRADA`, `VENCIDA` |
| created_at | timestamptz | |
| closed_at | timestamptz, nullable | |

### 2.22 `question_responses`
| Columna | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | |
| question_id | uuid (FK → questions) | |
| responded_by | uuid (FK → users) | |
| response_text | text | |
| created_at | timestamptz | |

### 2.23 `question_attachments`
| Columna | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | |
| question_id | uuid (FK → questions) | |
| file_id | uuid (FK → document_files) | |

### 2.24 `internal_meetings`
| Columna | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | |
| project_id | uuid (FK → projects) | |
| scheduled_at | timestamptz | |
| meeting_link | text, nullable | |
| agreements | text, nullable | |
| observations | text, nullable | |
| final_decision | text, nullable | `APROBADO`, `APROBADO_CON_OBSERVACIONES`, `DEVUELTO_COMERCIAL`, `AJUSTE_TECNICO`, `AJUSTE_FINANCIERO`, `SUSPENDIDO`, `CANCELADO` |
| created_by | uuid (FK → users) | |

### 2.25 `meeting_participants`
| Columna | Tipo | Notas |
|---|---|---|
| meeting_id | uuid (FK → internal_meetings) | |
| user_id | uuid (FK → users) | |
| area | text | |
| attended | boolean, nullable | |
| PK compuesta | (meeting_id, user_id) | |

### 2.26 `final_documents`
| Columna | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | |
| project_id | uuid (FK → projects) | |
| version | int | |
| format | text | `PDF`, `WORD`, `EXCEL` |
| file_id | uuid (FK → document_files) | |
| generated_by | uuid (FK → users) | |
| generated_at | timestamptz | |

### 2.27 `document_folders`
| Columna | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | |
| project_id | uuid (FK → projects) | |
| sharepoint_path | text, nullable | Se llena en Fase 2 |

### 2.28 `document_files`
| Columna | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | |
| folder_id | uuid (FK → document_folders) | |
| subfolder_code | text | `01_GTT` … `10_Anexos` |
| storage_path | text | Ruta en Supabase Storage |
| original_name | text | |
| mime_type | text | |
| size_bytes | bigint | |
| uploaded_by | uuid (FK → users) | |
| uploaded_at | timestamptz | |
| related_phase_id | uuid (FK → project_phases), nullable | |
| related_question_id | uuid (FK → questions), nullable | |

### 2.29 `notifications`
| Columna | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | |
| user_id | uuid (FK → users) | Destinatario |
| project_id | uuid (FK → projects), nullable | |
| event_type | text | Ver catálogo de eventos (Documento 02) |
| message | text | |
| read | boolean | default false |
| sent_via_email | boolean | |
| created_at | timestamptz | |

### 2.30 `audit_log`
Append-only, sin UPDATE/DELETE permitido a roles de aplicación.

| Columna | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | |
| project_id | uuid (FK → projects), nullable | Null para eventos globales (ej. cambios de configuración) |
| user_id | uuid (FK → users), nullable | Null para eventos automáticos del sistema |
| event_type | text | `CREACION`, `CAMBIO_ESTADO`, `CARGA_ARCHIVO`, `PREGUNTA_CREADA`, `RESPUESTA`, `APROBACION`, `DEVOLUCION`, `COMENTARIO`, `REUNION`, `ALERTA`, `RETRASO`, `CONFIG` |
| description | text | |
| metadata | jsonb, nullable | Datos estructurados adicionales del evento |
| created_at | timestamptz | |

## 3. Índices recomendados

- `projects(current_status)`, `projects(commercial_executive_id)`, `projects(project_type_id)` — usados constantemente por filtros del dashboard.
- `project_phases(project_id, sla_status)` — para el cálculo de fases vencidas.
- `questions(project_id, status)` — para validar bloqueo de avance a reunión.
- `audit_log(project_id, created_at)` — para renderizar el timeline ordenado.
- `document_files(folder_id, subfolder_code)`.

## 4. Row Level Security (RLS) — enfoque general

Cada tabla relacionada a `projects` aplica una política basada en una función `user_can_access_project(project_id, user_id)` que evalúa:
- Si el usuario tiene rol `ADMIN` o `GERENCIA` → acceso total de lectura.
- Si el usuario es el `commercial_executive_id` del proyecto → acceso de lectura/escritura a sus propios proyectos.
- Si el usuario tiene rol `OPERACIONES` → solo lectura, y solo si `current_status` ∈ {`Aprobado para fase Ninja`, `En fase Ninja`, `Documento final generado`, `Entregado a Operaciones`}.
- Si el usuario tiene rol `PROYECTOS`, `INGENIERIA`, `PRESUPUESTO` → acceso a proyectos donde tengan una pregunta asignada, una fase asignada como responsable, o en general a todo proyecto activo (a definir con TOTEM si el acceso debe ser global por área o restringido por asignación — queda como punto a confirmar).

El detalle exacto de cada política SQL se desarrolla en la fase de construcción, no en este documento de diseño.
