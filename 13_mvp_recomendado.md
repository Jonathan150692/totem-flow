# 13 — MVP Recomendado

**Proyecto:** TOTEM Flow
**Versión:** 1.0

---

## 1. Alcance exacto del MVP

El MVP corresponde a la Fase 1 del roadmap (Documento 12) y debe entregar un ciclo completo y funcional del proceso, sin integraciones externas a Microsoft 365. Específicamente:

### Incluido en el MVP

| Capacidad | Detalle |
|---|---|
| Login y roles básicos | Email/password, los 8 roles del Documento 07, RLS funcional |
| Crear proyecto | Wizard completo de 4 pasos (Documento 10) con todos los campos del brief |
| Checklist dinámico | Motor de reglas funcional para CCTV, Control de Acceso, y al menos 2 soluciones adicionales configuradas como ejemplo (Intrusión, Incendio); reglas de monto, localidades múltiples e importación |
| Estados del proyecto | Los 18 estados con máquina de transición validada (Documento 08) |
| Preguntas y respuestas | Módulo completo con SLA por pregunta |
| Reunión interna | Registro manual (sin integración de calendario automática) |
| Fase Ninja | Consolidación y generación de documento final en PDF y Word |
| Carga de archivos | Adjuntos por proyecto, fase y pregunta, en Supabase Storage |
| Carpeta documental | Generación automática de la estructura de 10 subcarpetas (lógica, no física en SharePoint todavía) |
| Bitácora | Registro inmutable de todos los eventos críticos, vista de timeline |
| Notificaciones | Por correo electrónico (vía Resend o SMTP simple) para los eventos críticos del Documento 01 (RF-NOTIF) |
| Dashboard básico | Indicadores principales y filtros (Documento 01, RF-DASH) |
| Control de tiempos por fase | Motor de SLA con semáforo visual, sin escalamiento a Teams (solo correo + bitácora) |

### Explícitamente fuera del MVP (Fase 2 o posterior)

- Integración con SharePoint (la estructura de carpetas existe lógicamente desde el MVP, lista para sincronizar después).
- Integración con calendario (Outlook/Teams/Google) para reuniones — se registra manualmente en el MVP.
- Creación de proyectos desde correo entrante con lectura automática de GTT.
- Notificaciones a Teams.
- Power BI.
- IA para lectura automática de GTT y sugerencia de checklist.
- SSO con Azure AD (login queda con email/password en el MVP, pero la arquitectura de Supabase Auth lo soporta sin retrabajo cuando se active).

## 2. Criterio de éxito del MVP

El MVP se considera exitoso si, para al menos un proyecto piloto real de TOTEM, es posible completar el ciclo completo — desde la creación por Comercial hasta la entrega formal a Operaciones — utilizando únicamente la plataforma, sin recurrir a correos paralelos, Excel de seguimiento manual, o WhatsApp para coordinar las aprobaciones internas.

## 3. Por qué este alcance y no uno más reducido

Se evaluó reducir aún más el MVP (por ejemplo, omitiendo el motor de SLA o las preguntas y respuestas), pero ambos son el corazón de lo que diferencia esta plataforma de un simple gestor de tareas: sin control de tiempos por fase no hay manera de medir cumplimiento ni cuellos de botella (objetivo central del brief), y sin preguntas y respuestas estructuradas el proceso de validación interáreas seguiría dependiendo de correos sueltos, que es exactamente el problema que se busca resolver.

## 4. Datos semilla necesarios antes de la puesta en marcha

- Catálogo de usuarios reales de TOTEM con su rol asignado.
- Tabla de tiempos SLA confirmada por tipo de proyecto y fase (validar la tabla del brief con el negocio antes de cargarla como definitiva).
- Plantillas de checklist base para cada solución (CCTV, Control de Acceso, Intrusión, Incendio, Redes, Energía, Software, Monitoreo) — se sugiere completar primero CCTV y Control de Acceso (detallados en el brief) y construir las demás en colaboración con Ingeniería durante el Sprint 2.
- Umbral monetario que activa aprobación financiera obligatoria.
