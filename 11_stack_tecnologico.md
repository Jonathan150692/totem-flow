# 11 — Propuesta de Stack Tecnológico

**Proyecto:** TOTEM Flow
**Versión:** 1.0

---

## 1. Stack consolidado

| Capa | Tecnología | Versión sugerida | Notas |
|---|---|---|---|
| Frontend framework | Next.js | 15.x (App Router) | SSR + Server Actions |
| Lenguaje | TypeScript | 5.x | Tipado estricto en todo el proyecto |
| Estilos | Tailwind CSS | 3.x / 4.x | + shadcn/ui para componentes base (tablas, modales, formularios) |
| Gestión de estado de cliente | React Server Components + Zustand (solo donde sea necesario estado de cliente complejo, ej. wizard de creación) | — | Minimizar estado de cliente innecesario |
| Validación de formularios | Zod + react-hook-form | — | Validación compartida cliente/servidor (mismo schema Zod) |
| Backend / lógica de negocio | Next.js Server Actions + Route Handlers | — | Sin servidor separado en el MVP |
| Base de datos | PostgreSQL | 15+ | Vía Supabase |
| ORM / capa de acceso a datos | Drizzle ORM o Prisma | — | Recomendado Drizzle por mejor control de SQL generado en consultas complejas de reportes |
| Autenticación | Supabase Auth | — | Email/password en MVP, preparado para OIDC/Azure AD |
| Almacenamiento de archivos | Supabase Storage | — | Migración a SharePoint en Fase 2 |
| Generación de Word | librería `docx` (npm) | — | Server-side, sin dependencia de Office instalado |
| Generación de PDF | `pdf-lib` o Puppeteer (renderizado de HTML a PDF) | — | Puppeteer da más control de diseño para el documento final |
| Generación de Excel | `exceljs` | — | Para exportación de tablas de equipos/cantidades |
| Notificaciones por correo | Microsoft Graph API (si hay licencia M365) con fallback a Resend | — | Decisión final depende de confirmación de licencias M365 en TOTEM |
| Tareas programadas (cron) | Vercel Cron Jobs o Supabase Edge Functions con `pg_cron` | — | Para el motor de SLA asíncrono |
| Hosting | Vercel | — | Despliegue continuo desde GitHub |
| Control de versiones | GitHub | — | Repositorio privado |
| CI/CD | GitHub Actions | — | Lint, type-check, pruebas, build, despliegue |
| Monitoreo de errores | Sentry | Tier gratuito en MVP | |
| Reportes avanzados | Power BI | — | Fase 3, conexión directa a Postgres o export de datasets |

## 2. Librerías de soporte recomendadas

| Necesidad | Librería |
|---|---|
| Tablas de datos con filtros/ordenamiento | TanStack Table |
| Gráficos del dashboard | Recharts |
| Manejo de fechas y SLA | `date-fns` o `luxon` (con soporte explícito de zona horaria GMT-5) |
| Drag and drop (Kanban) | `@dnd-kit/core` |
| Componentes de UI accesibles | shadcn/ui (basado en Radix UI) |
| Subida de archivos con progreso | `react-dropzone` + Supabase Storage SDK |

## 3. Justificación de elecciones no triviales

- **Drizzle sobre Prisma**: dado que varios reportes (Documento 09) requieren agregaciones SQL complejas (promedios por fase, porcentajes condicionales), Drizzle permite escribir y depurar SQL crudo con tipado cuando el ORM estándar no es suficientemente expresivo, sin perder la seguridad de tipos en el resto de la aplicación.
- **Puppeteer para PDF**: genera el documento final renderizando una plantilla HTML/CSS, lo que permite reutilizar el mismo sistema de diseño (Tailwind, marca TOTEM) tanto en pantalla como en el PDF exportado, en vez de mantener dos sistemas de maquetado distintos.
- **Vercel Cron sobre un servidor dedicado para el motor de SLA**: evita levantar infraestructura adicional solo para un proceso periódico; si la frecuencia de verificación necesaria fuera menor a un minuto, se reevaluaría esta decisión.

## 4. Compatibilidad con integración a Microsoft 365

Todo el stack es compatible con consumir Microsoft Graph API desde Route Handlers de Next.js sin cambios estructurales — la integración se añade como un módulo más de la capa de integración descrita en el Documento 03, no como una reescritura.

## 5. Ruta de migración futura (si se requiere)

Si TOTEM decide en el futuro estandarizar en infraestructura Microsoft (servidor propio, SQL Server), la migración afecta:
- Capa de datos: de Postgres/Supabase a SQL Server (requiere traducir el esquema, no el modelo conceptual del Documento 04).
- Almacenamiento: de Supabase Storage a SharePoint nativo (ya contemplado como Fase 2 de todas formas).
- Autenticación: de Supabase Auth a Azure AD nativo (el flujo OIDC ya queda preparado desde el MVP).

El frontend Next.js y la lógica de negocio (motores de checklist, SLA, estados) permanecen sin cambios estructurales en ese escenario.
