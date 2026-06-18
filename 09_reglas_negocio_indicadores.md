# 09 — Reglas de Negocio e Indicadores

**Proyecto:** TOTEM Flow
**Versión:** 1.0

---

## 1. Reglas de negocio obligatorias (catálogo maestro)

| ID | Regla | Mecanismo de aplicación |
|---|---|---|
| RN-001 | No se puede avanzar de fase con campos obligatorios incompletos. | Validación en Server Action + constraint a nivel de UI (botón deshabilitado) |
| RN-002 | No se puede cerrar una fase sin responsable asignado. | Validación en `project_phases.responsible_id NOT NULL` antes de `ended_at` |
| RN-003 | Toda devolución debe tener comentario obligatorio. | Validación en `project_status_history.comment` (ver Documento 08, sección 3) |
| RN-004 | Toda aprobación debe registrar usuario, fecha y hora. | Automático — campos `changed_by`, `changed_at` siempre poblados por el sistema, no editables por el usuario |
| RN-005 | Toda pregunta obligatoria debe estar cerrada antes de pasar a reunión. | Gate de transición estado 9 → 10 (Documento 06) |
| RN-006 | Todo documento final debe generarse únicamente con información aprobada. | El generador de documento (RF-NINJA-005) valida estado de cada fuente de datos antes de incluirla |
| RN-007 | Operaciones solo puede recibir proyectos en estado aprobado. | Restricción de rol en la transición a `ENTREGADO_OPERACIONES` (solo desde `DOCUMENTO_FINAL_GENERADO`) |
| RN-008 | Toda fase vencida debe generar alerta automática. | Proceso programado (cron) descrito en Documento 03, sección 2.3 |
| RN-009 | Todo cambio debe quedar registrado en bitácora. | Triggers de base de datos + registro explícito desde la lógica de negocio (Documento 03, sección 2.7) |
| RN-010 | Los usuarios solo deben visualizar o editar según su rol. | RLS de Postgres + validación de permisos en la capa de Server Actions (defensa en profundidad) |
| RN-011 | Los proyectos cancelados o suspendidos deben conservar historial. | Soft-delete únicamente — nunca DELETE físico sobre `projects` ni tablas relacionadas |

## 2. Indicadores y fórmulas

### 2.1 Cumplimiento SLA

```
Cumplimiento SLA (%) = (Fases cerradas dentro de tiempo / Total de fases cerradas) × 100
```

- "Dentro de tiempo" = `project_phases.sla_status` era `DENTRO_TIEMPO` en el momento de `ended_at` (no el estado actual, ya que una fase cerrada conserva su estado SLA histórico).
- Se calcula global, por tipo de proyecto, por área responsable y por fase individual.

### 2.2 Tiempo total del proyecto

```
Tiempo total = Fecha de "Entregado a Operaciones" − Fecha de "Proyecto creado"
```

- Se excluyen del cómputo los periodos en estado `SUSPENDIDO` (se resta `paused_hours` acumulado).

### 2.3 Porcentaje de proyectos devueltos

```
% Proyectos devueltos = (Proyectos con al menos un paso por "Devuelto a Comercial") / (Total de proyectos creados) × 100
```

### 2.4 Preguntas promedio por proyecto

```
Preguntas promedio = Total de preguntas generadas / Total de proyectos con al menos una pregunta
```

Nota: se sugiere también calcular una variante "Total de preguntas / Total de proyectos creados" para no sesgar el promedio excluyendo proyectos sin preguntas; ambas métricas son útiles y se recomienda mostrar las dos en el reporte.

### 2.5 Porcentaje de proyectos aprobados sin reproceso

```
% Aprobados sin reproceso = (Proyectos aprobados sin ninguna "Devuelto a Comercial" ni decisión de reunión distinta a "Aprobado") / (Total de proyectos aprobados) × 100
```

### 2.6 Indicadores adicionales recomendados (no solicitados explícitamente, pero útiles dado el resto del diseño)

| Indicador | Fórmula | Valor de negocio |
|---|---|---|
| Tiempo promedio por fase, por tipo de proyecto | `AVG(ended_at - started_at)` agrupado por `phase_id, project_type_id` | Identifica si el SLA configurado es realista |
| Cuello de botella por área | Área con mayor `COUNT(fases con sla_status='VENCIDO')` o mayor tiempo promedio relativo a su SLA | Foco de mejora de proceso |
| Tasa de vencimiento de preguntas | `COUNT(questions con status='VENCIDA' en algún momento) / COUNT(questions totales)` | Mide disciplina de respuesta por área |
| Proyectos en riesgo (próximos a vencer) | `COUNT(project_phases con sla_status='POR_VENCER')` | Alimenta el dashboard en tiempo real |

## 3. Reglas de escalamiento de retrasos (detalle operativo)

1. Al superar `warning_threshold_pct` (default 80%) del tiempo máximo → `sla_status = POR_VENCER`, notificación al responsable.
2. Al superar 100% del tiempo máximo → `sla_status = VENCIDO`, notificación al responsable + notificación al jefe de área, registro en bitácora, solicitud de justificación obligatoria al responsable.
3. Al superar `escalation_threshold_pct` (default 150%) → escalamiento automático a Gerencia, el proyecto se muestra en rojo intensificado en el dashboard, se habilita la opción de reasignar responsable o convocar reunión de desbloqueo.
4. En cualquier punto, un usuario autorizado (Revisor de Proyectos, Proyectos, o Administrador) puede pausar el proyecto con justificación obligatoria, lo cual congela el conteo de SLA de la fase activa hasta su reanudación.

## 4. Relación entre reglas de negocio y requerimientos funcionales

Cada regla de negocio (RN-XXX) tiene trazabilidad directa a uno o más requerimientos funcionales del Documento 01 (prefijo RF-). Esta tabla cruzada se mantiene durante el desarrollo para asegurar que ninguna regla quede sin implementar ni sin prueba asociada (ver Documento 16 — Plan de pruebas).
