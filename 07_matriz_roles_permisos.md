# 07 — Matriz de Roles y Permisos

**Proyecto:** TOTEM Flow
**Versión:** 1.0

---

## 1. Roles del sistema

| Código | Rol | Descripción |
|---|---|---|
| ADMIN | Administrador | Configuración total del sistema |
| COMERCIAL | Comercial | Crea y gestiona proyectos desde el origen |
| REVISOR_PROYECTOS | Revisor de Proyectos ("Diego") | Filtro de calidad de la información inicial |
| PROYECTOS | Proyectos | Coordina el proceso interno, preguntas y reunión |
| INGENIERIA | Ingeniería | Valida factibilidad técnica |
| PRESUPUESTO | Presupuesto | Valida viabilidad financiera |
| OPERACIONES | Operaciones | Receptor final del proyecto validado |
| GERENCIA | Consulta / Gerencia | Visualización de indicadores, sin edición |

Un usuario puede tener más de un rol asignado (ej. alguien de Proyectos que también es Revisor).

## 2. Matriz de permisos por módulo

Leyenda: **C** = Crear, **L** = Leer, **E** = Editar, **A** = Aprobar/Transicionar estado, **X** = Sin acceso

| Módulo / Acción | ADMIN | COMERCIAL | REVISOR_PROYECTOS | PROYECTOS | INGENIERIA | PRESUPUESTO | OPERACIONES | GERENCIA |
|---|---|---|---|---|---|---|---|---|
| Dashboard general | CLEA | L (solo propios) | L | L | L | L | L (solo aprobados+) | L |
| Crear proyecto | CLEA | C, L, E (propios) | L | L | L | L | X | L |
| Editar datos generales/cliente | CLEA | E (propios, antes de aprobación) | L | L | X | X | X | L |
| Editar localidades | CLEA | E (propios) | L | L | L (técnico) | X | X | L |
| Editar datos financieros | CLEA | E (propios) | L | L | X | E | X | L |
| Editar datos técnicos iniciales | CLEA | E (propios) | L | L | E | X | X | L |
| Aprobar/devolver revisión inicial | CLEA | X | A | L | X | X | X | L |
| Completar checklist | CLEA | E (campos comerciales) | L | E | E (campos técnicos) | E (campos financieros) | X | L |
| Marcar ítem "No aplica" | CLEA | X | E | E | E | E | X | X |
| Crear preguntas | CLEA | X | X | C | C | C | C | X |
| Responder preguntas | CLEA | E (si asignado) | X | E (si asignado) | E (si asignado) | E (si asignado) | E (si asignado) | X |
| Cerrar preguntas | CLEA | X | X | A | A | A | A | X |
| Agendar reunión interna | CLEA | X | X | C, E | L | L | L | L |
| Registrar decisión de reunión | CLEA | X | X | A | A (input técnico) | A (input financiero) | L | L |
| Ver/generar documento final (Fase Ninja) | CLEA | L | L | CLEA | L | L | L | L |
| Recibir y cerrar entrega a Operaciones | CLEA | X | X | L | X | X | A | L |
| Adjuntar documentos | CLEA | C | C | C | C | C | C | X |
| Ver bitácora completa | CLEA | L (propios) | L | L | L | L | L (proyectos aprobados+) | L |
| Configurar usuarios y roles | CLEA | X | X | X | X | X | X | X |
| Configurar tiempos SLA | CLEA | X | X | X | X | X | X | X |
| Configurar tipos de proyecto | CLEA | X | X | X | X | X | X | X |
| Configurar checklist base / reglas | CLEA | X | X | X | X | X | X | X |
| Ver todos los proyectos (sin restricción) | CLEA | X | L | L | L | L | L | L |
| Ver reportes e indicadores | CLEA | L (propios) | L | L | L | L | L | L |
| Suspender/cancelar proyecto | CLEA | X | A | A | X | X | X | X |
| Reasignar responsable de fase vencida | CLEA | X | A | A | X | X | X | X |

## 3. Reglas de visibilidad de datos (complementa RLS — Documento 04, sección 4)

- **Comercial** solo visualiza y edita los proyectos donde figura como `commercial_executive_id`, salvo que tenga también rol ADMIN o GERENCIA.
- **Operaciones** únicamente visualiza proyectos cuyo `current_status` esté en `APROBADO_FASE_NINJA` o posterior. No tiene visibilidad de proyectos en fases comerciales o de revisión temprana.
- **Gerencia/Consulta** tiene visibilidad total de lectura sobre todos los proyectos e indicadores, pero ningún permiso de edición salvo los explícitamente marcados.
- **Ingeniería** y **Presupuesto** ven los proyectos donde tengan una pregunta asignada o un ítem de checklist técnico/financiero pendiente; la visibilidad ampliada a "todos los proyectos activos de su área" es una decisión de negocio a confirmar con TOTEM (ver punto abierto en Documento 02).

## 4. Principio de menor privilegio aplicado

Cada rol solo puede ejecutar las transiciones de estado que le correspondan según el Documento 06 (Flujo de proceso) y el Documento 08 (Estados). Ningún rol distinto de Operaciones o Administrador puede marcar un proyecto como "Entregado a Operaciones", incluso si tiene acceso de lectura a ese estado.
