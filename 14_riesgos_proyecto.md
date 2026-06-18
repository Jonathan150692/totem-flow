# 14 — Riesgos del Proyecto

**Proyecto:** TOTEM Flow
**Versión:** 1.0

---

## 1. Matriz de riesgos

| ID | Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|---|
| R-01 | Las reglas del checklist dinámico definidas en el diseño no cubren todos los casos reales de proyectos de TOTEM, requiriendo retrabajo del motor de reglas. | Alta | Media | Diseñar el motor basado en configuración (no hardcodeado) desde el inicio, validar con un proyecto piloto real antes de cerrar el MVP |
| R-02 | Los tiempos SLA del brief (tabla de la Sección 14) no reflejan la realidad operativa de TOTEM y generan alertas constantes que el equipo empieza a ignorar ("fatiga de alertas"). | Media | Alta | Validar la tabla SLA con las áreas involucradas antes de producción; permitir ajuste fácil por el Administrador; monitorear cumplimiento real en las primeras semanas y recalibrar |
| R-03 | Resistencia al cambio: los usuarios continúan coordinando por correo/WhatsApp en paralelo a la plataforma, fragmentando la trazabilidad. | Alta | Alta | Acompañamiento en la adopción, capacitación por rol, y que la plataforma sea visiblemente más rápida que el proceso actual desde el primer uso |
| R-04 | Dependencia de la disponibilidad de licencias Microsoft 365 para las integraciones de Fase 2 (correo, calendario, SharePoint, Teams). | Media | Media | Diseñar la Fase 1 (MVP) completamente independiente de M365; confirmar licenciamiento antes de iniciar Fase 2 |
| R-05 | El catálogo de rubros, equipos y centros de costo no existe formalizado en ningún sistema, generando datos inconsistentes al cargarlos en la plataforma. | Media | Media | Levantar el catálogo en paralelo durante la Fase 0/1, con Presupuesto como dueño de la información |
| R-06 | Sobrecarga de campos obligatorios en la creación de proyecto desincentiva su uso por Comercial (fricción percibida vs. el proceso actual más informal). | Media | Alta | Wizard de pasos en vez de formulario único; permitir guardar como borrador antes de completar el 100%; revisar con usuarios reales de Comercial antes de cerrar el diseño de formulario |
| R-07 | El motor de SLA asíncrono (cron) no se ejecuta con la frecuencia necesaria o falla silenciosamente, dejando fases vencidas sin alertar. | Baja | Alta | Monitoreo del propio cron vía Sentry/logs, alerta si el cron no se ejecuta en el intervalo esperado |
| R-08 | Migración futura de Supabase a un servidor propio de TOTEM resulta más compleja de lo estimado si se acumulan dependencias específicas del proveedor (ej. funciones de Supabase no estándar). | Baja | Media | Mantener la lógica de negocio en código de aplicación (no en funciones propietarias de Supabase) siempre que sea razonable, limitando el uso de Postgres/Supabase a almacenamiento, RLS y Auth estándar |
| R-09 | Información sensible de clientes y proyectos comerciales queda expuesta por una configuración incorrecta de RLS. | Baja | Alta | Pruebas específicas de seguridad por rol (Documento 16), revisión de políticas RLS antes de cada despliegue a producción |
| R-10 | El alcance del brief original (24 secciones) genera expectativa de una plataforma "completa" desde el día uno, sin entender que es un roadmap de fases. | Media | Media | Este conjunto de documentos deja explícito qué es MVP y qué es Fase 2/3 (Documentos 12 y 13); comunicación constante de expectativas con los stakeholders de TOTEM |

## 2. Riesgos aceptados conscientemente para el MVP

- No tener SSO con Azure AD desde el día uno (se acepta login con email/password temporalmente).
- No tener sincronización física con SharePoint desde el día uno (la estructura lógica de carpetas existe, pero los archivos viven en Supabase Storage hasta la Fase 2).
- Visibilidad de Ingeniería/Presupuesto sobre "todos los proyectos de su área" vs. "solo los que tienen asignados" queda como un punto abierto a decidir con el negocio antes del Sprint 1, sin bloquear el inicio del desarrollo del resto del sistema.
