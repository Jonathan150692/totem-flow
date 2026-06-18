# 12 — Roadmap de Implementación por Fases

**Proyecto:** TOTEM Flow
**Versión:** 1.0

---

## 1. Visión general de fases

| Fase | Nombre | Duración estimada | Objetivo |
|---|---|---|---|
| 0 | Preparación | 1 semana | Infraestructura base, repositorio, confirmaciones pendientes con TOTEM |
| 1 | MVP funcional | 6–8 semanas | Plataforma operativa end-to-end sin integraciones externas (ver Documento 13) |
| 2 | Integraciones M365 | 3–4 semanas | SharePoint, Outlook, Teams, calendario, creación desde correo |
| 3 | Inteligencia y reportes avanzados | 3–4 semanas | Power BI, IA para lectura de GTT, automatizaciones avanzadas |
| 4 | Estabilización y escalamiento | Continuo | Ajustes según uso real, optimización de SLA configurados |

Estimaciones asumen un equipo de 1–2 desarrolladores full-stack trabajando de forma dedicada; ajustar proporcionalmente si el equipo es distinto.

## 2. Fase 0 — Preparación (1 semana)

- Crear repositorio en GitHub con la estructura del Documento 17.
- Crear proyectos Supabase (dev, staging, prod).
- Configurar Vercel con las tres ramas/ambientes.
- Obtener respuesta a los puntos abiertos del Documento 02, sección 9 (licencias M365, política de retención, umbral financiero, catálogo de rubros).
- Definir los tiempos SLA reales con el negocio (validar o ajustar la tabla del brief original).
- Cargar el checklist base inicial (CCTV, Control de Acceso, y las demás soluciones) como datos semilla en `checklist_templates` / `checklist_items_master`.

## 3. Fase 1 — MVP (6–8 semanas), desglosada en sprints

### Sprint 1 (semanas 1–2): Fundaciones
- Autenticación (login, roles, recuperación de contraseña).
- Modelo de base de datos completo (Documento 04) con migraciones.
- RLS básico por rol.
- Layout general (menú lateral, navegación).

### Sprint 2 (semanas 3–4): Creación de proyectos y checklist
- Wizard de creación de proyecto (4 pasos).
- Motor de checklist dinámico (reglas de activación + render de secciones).
- Generación automática de carpeta documental (estructura de 10 subcarpetas en Storage).
- Carga de archivos adjuntos.

### Sprint 3 (semanas 5–6): Flujo de estados, preguntas y SLA
- Máquina de estados (18 estados, transiciones validadas).
- Módulo de preguntas y respuestas.
- Motor de SLA (cálculo síncrono + cron de verificación).
- Notificaciones por correo (eventos críticos).
- Bitácora de trazabilidad.

### Sprint 4 (semanas 7–8): Reunión, Fase Ninja, dashboard y cierre de MVP
- Módulo de reunión interna.
- Fase Ninja: consolidación de datos + generación de documento final (PDF/Word).
- Dashboard básico con los indicadores principales.
- Pruebas de aceptación end-to-end (ver Documento 16).
- Corrección de hallazgos y despliegue a producción.

## 4. Fase 2 — Integraciones M365 (3–4 semanas)

- Registro de aplicación en Azure AD, consentimiento de administrador.
- Integración de envío de correo vía Graph API (reemplaza/complementa Resend).
- Sincronización de carpetas documentales hacia SharePoint.
- Creación de reuniones en calendario (Outlook) con invitación a participantes.
- Notificaciones a Teams (canal o chat directo).
- Creación de proyectos desde correo entrante con GTT adjunta (lectura de buzón compartido, extracción de adjuntos, pre-llenado de campos detectables).

## 5. Fase 3 — Inteligencia y reportes avanzados (3–4 semanas)

- Conexión de Power BI a la base de datos (vista de solo lectura optimizada para reportes).
- IA para lectura de GTT y generación automática de checklist sugerido (usando la API de Claude, dado que TOTEM ya tiene experiencia con esta integración en TOTEM Propuestas).
- Automatizaciones avanzadas adicionales identificadas durante el uso real del MVP (a definir según retroalimentación de usuarios).

## 6. Fase 4 — Estabilización (continuo)

- Ajuste de tiempos SLA según datos reales de cumplimiento observados.
- Refinamiento de reglas del checklist dinámico según casos no previstos en el diseño inicial.
- Optimización de rendimiento si el volumen de proyectos crece significativamente.

## 7. Hitos de decisión (go/no-go)

| Hito | Pregunta de decisión |
|---|---|
| Fin de Sprint 2 | ¿El motor de checklist dinámico cubre los casos de CCTV y Control de Acceso correctamente con datos reales de un proyecto piloto? |
| Fin de Fase 1 (MVP) | ¿El flujo completo (creación → entrega a Operaciones) funciona sin intervención manual fuera de la plataforma para al menos un proyecto piloto real? |
| Antes de Fase 2 | ¿TOTEM confirmó la disponibilidad de licencias M365 y el registro de la aplicación en Azure AD? |
