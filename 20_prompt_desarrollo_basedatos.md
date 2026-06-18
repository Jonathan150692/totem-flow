# 20 — Prompt de Inicio de Desarrollo: Base de Datos

**Proyecto:** TOTEM Flow
**Versión:** 1.0

---

## Prompt

```
Eres un ingeniero de bases de datos senior especializado en PostgreSQL, 
Supabase y Drizzle ORM. Vas a construir el esquema completo de base de datos 
para "TOTEM Flow", una plataforma interna de gestión automatizada de proyectos 
para TOTEM, empresa ecuatoriana de seguridad electrónica.

CONTEXTO
El esquema completo de 30 tablas está especificado en docs/04_modelo_base_datos.md 
y el detalle de dominios de valores, validaciones y campos calculados en 
docs/05_diccionario_datos.md. Tu tarea es traducir esa especificación a:
1. Esquema Drizzle ORM (lib/db/schema.ts)
2. Migraciones SQL generadas a partir de ese esquema
3. Políticas de Row Level Security (RLS) en Postgres
4. Datos semilla (drizzle/seed/) para desarrollo y pruebas

TABLAS A IMPLEMENTAR (ver docs/04_modelo_base_datos.md para columnas exactas, 
tipos y relaciones de cada una):
users, roles, user_roles, project_types, projects, project_contacts, 
project_locations, project_financials, project_financial_items, 
project_technical_info, project_solutions, project_attachments, 
checklist_templates, checklist_rules, checklist_items_master, 
project_checklist_items, phase_definitions, sla_definitions, project_phases, 
project_status_history, questions, question_responses, question_attachments, 
internal_meetings, meeting_participants, final_documents, document_folders, 
document_files, notifications, audit_log.

REQUISITOS ESPECÍFICOS DE IMPLEMENTACIÓN

1. Tipos de columna:
   - Todas las claves primarias transaccionales usan uuid con 
     default gen_random_uuid(), excepto roles, project_types, phase_definitions 
     y sla_definitions que usan serial.
   - Todos los timestamps usan timestamptz, almacenados en UTC.
   - Los campos enumerados (priority, current_status, solution_code, etc.) se 
     implementan como text con CHECK constraint sobre los valores permitidos 
     (ver docs/05_diccionario_datos.md sección 1 para cada dominio completo), 
     no como tipos ENUM nativos de Postgres, para facilitar agregar valores 
     nuevos sin migración bloqueante.

2. Relaciones y claves foráneas:
   - Todas las FK deben tener ON DELETE RESTRICT por defecto (no se permite 
     borrar un usuario o proyecto referenciado), excepto las tablas hijas 
     puramente dependientes (ej. project_locations, project_checklist_items) 
     que pueden usar ON DELETE CASCADE respecto a su proyecto padre, dado que 
     el borrado físico de proyectos no está permitido de todas formas 
     (RN-011 — soft delete únicamente).

3. Índices (ver docs/04_modelo_base_datos.md sección 3):
   - projects(current_status), projects(commercial_executive_id), 
     projects(project_type_id)
   - project_phases(project_id, sla_status)
   - questions(project_id, status)
   - audit_log(project_id, created_at)
   - document_files(folder_id, subfolder_code)

4. Validaciones a nivel de base de datos (constraints):
   - project_checklist_items: CHECK que si status='NO_APLICA' entonces 
     not_applicable_reason IS NOT NULL.
   - project_status_history: CHECK que si new_status IN ('DEVUELTO_COMERCIAL', 
     'SUSPENDIDO', 'CANCELADO') entonces comment IS NOT NULL.
   - project_financials: validar que expected_margin corresponda a 
     estimated_value - estimated_cost (vía trigger o columna generada, a tu 
     criterio según lo que sea más mantenible).

5. Row Level Security — implementa según docs/15_recomendaciones_seguridad.md 
   sección 1:
   - Crea una función SQL current_user_roles() que devuelva los roles del 
     usuario autenticado (a partir de auth.uid() y la tabla user_roles).
   - Crea una función SECURITY DEFINER user_can_access_project(project_id uuid) 
     que evalúe la matriz de visibilidad de docs/07_matriz_roles_permisos.md 
     sección 3: ADMIN/GERENCIA ven todo; COMERCIAL solo proyectos donde es 
     commercial_executive_id; OPERACIONES solo proyectos con current_status 
     en (APROBADO_FASE_NINJA, EN_FASE_NINJA, DOCUMENTO_FINAL_GENERADO, 
     ENTREGADO_OPERACIONES); PROYECTOS/INGENIERIA/PRESUPUESTO según preguntas 
     o ítems de checklist asignados (déjalo como función extensible, este 
     punto específico está marcado como pendiente de confirmación de negocio).
   - Aplica políticas separadas de SELECT, INSERT, UPDATE, DELETE por tabla 
     (no una política ALL genérica), siguiendo la matriz de permisos completa 
     de docs/07_matriz_roles_permisos.md.
   - audit_log: ninguna política de UPDATE ni DELETE para ningún rol de 
     aplicación. Solo INSERT vía función de servidor con privilegios elevados.

6. Datos semilla (drizzle/seed/):
   - Los 8 roles del catálogo (docs/07_matriz_roles_permisos.md sección 1).
   - Los 4 tipos de proyecto (PEQUENO, MEDIANO, GRANDE, ESPECIAL).
   - Las 5 fases medibles por SLA (REVISION_INICIAL, PREGUNTAS_INTERNAS, 
     RESPUESTA_COMERCIAL, REUNION_INTERNA, FASE_NINJA).
   - checklist_templates y checklist_items_master iniciales para al menos 
     CCTV y Control de Acceso (usa como referencia los ítems mencionados en 
     docs/01_requerimientos_funcionales.md RF-CHK-002 y RF-CHK-003: para CCTV 
     — cantidad de cámaras, tipo de cámaras, grabación, almacenamiento, 
     analítica, red, energía, monitoreo, planos, licencias, vigencia de 
     equipos; para Control de Acceso — puertas, lectoras, cerraduras, 
     biométricos, torniquetes, horarios, usuarios, software, integración, 
     energía de respaldo).
   - Usuarios de prueba con cada rol, para facilitar pruebas de RLS.

INSTRUCCIONES DE TRABAJO
1. Define primero las tablas de catálogo (roles, project_types, 
   phase_definitions) y users/user_roles.
2. Luego projects y sus tablas relacionadas 1:1 y 1:N directas.
3. Luego las tablas de checklist (templates, rules, master, instancia).
4. Luego fases, estados, preguntas, reunión, documentos finales y carpetas.
5. Luego notifications y audit_log al final (dependen de casi todo lo anterior).
6. Genera las políticas RLS solo después de que el esquema esté completo y 
   migrado, para poder probarlas contra datos reales de seed.
7. Si alguna regla de validación no está clara o genera ambigüedad con lo 
   especificado en docs/05_diccionario_datos.md, señálalo explícitamente antes 
   de decidir un comportamiento por tu cuenta.

Empieza generando lib/db/schema.ts con las tablas de catálogo y users/user_roles, 
y la primera migración correspondiente.
```

## Notas para quien use este prompt

- Este prompt es el punto de partida natural antes de los Documentos 18 (frontend) y 19 (backend), ya que ambos dependen de que el esquema y los tipos generados por Drizzle existan.
- El punto 5 (RLS) deja explícitamente como pendiente de decisión de negocio el alcance de visibilidad de Ingeniería/Presupuesto — no se debe resolver arbitrariamente en el código sin antes confirmar con TOTEM (ver Documento 02, sección 9 y Documento 14, riesgo aceptado en sección 2).
