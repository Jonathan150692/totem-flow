# 02 — Documento de Requerimientos Técnicos

**Proyecto:** TOTEM Flow
**Versión:** 1.0

---

## 1. Requerimientos no funcionales detallados

| Categoría | Requerimiento | Métrica objetivo |
|---|---|---|
| Rendimiento | Tiempo de respuesta de API en operaciones CRUD | < 300ms p95 (sin contar generación de documentos) |
| Rendimiento | Tiempo de carga de dashboard | < 2s con hasta 500 proyectos activos |
| Rendimiento | Generación de documento final (PDF/Word) | < 10s |
| Disponibilidad | Uptime en horario laboral (Ecuador, GMT-5, 07:00–19:00) | 99% |
| Escalabilidad | Usuarios concurrentes soportados sin degradación | 50 (MVP), 200 (post Fase 2) |
| Escalabilidad | Proyectos activos simultáneos | 1,000+ sin rediseño |
| Seguridad | Cifrado en tránsito | TLS 1.2+ obligatorio en toda comunicación |
| Seguridad | Cifrado en reposo | Activado a nivel de proveedor de base de datos (Supabase/Postgres) |
| Seguridad | Control de acceso a datos | Row Level Security (RLS) por rol y por proyecto |
| Seguridad | Gestión de secretos | Variables de entorno + vault del proveedor; nunca hardcoded |
| Auditoría | Inmutabilidad de bitácora | Tabla append-only, sin permisos UPDATE/DELETE para roles de aplicación |
| Usabilidad | Responsive | Soporte completo desktop, soporte funcional tablet; móvil de solo consulta en MVP |
| Compatibilidad | Navegadores soportados | Chrome, Edge, Firefox (últimas 2 versiones mayores) |
| Mantenibilidad | Cobertura de pruebas automatizadas en lógica de negocio crítica (motor de checklist, SLA, transición de estados) | ≥ 70% |
| Observabilidad | Logging de errores de aplicación | Centralizado (ej. Sentry o equivalente) desde el MVP |

## 2. Arquitectura de capas (resumen — detalle en Documento 03)

1. **Capa de presentación**: Next.js (App Router), React Server Components donde aplique, Tailwind CSS.
2. **Capa de lógica de negocio**: Server Actions / API Routes de Next.js que encapsulan reglas del motor de checklist, SLA, transición de estados y generación de documentos.
3. **Capa de datos**: PostgreSQL administrado por Supabase, con Row Level Security como mecanismo primario de control de acceso.
4. **Capa de almacenamiento de archivos**: Supabase Storage (MVP) → SharePoint (Fase 2, sincronizado vía Microsoft Graph API).
5. **Capa de integración**: Microsoft Graph API (correo, calendario, Teams, SharePoint), Resend/SendGrid o Graph para correo transaccional, GitHub API para CI/CD y trazabilidad de versiones.

## 3. Stack tecnológico propuesto

| Componente | Tecnología | Justificación |
|---|---|---|
| Frontend | Next.js 15 (App Router) + TypeScript | SSR/SSG, Server Actions reducen necesidad de API separada, ecosistema maduro |
| Estilos | Tailwind CSS + shadcn/ui | Velocidad de desarrollo, componentes accesibles por defecto |
| Backend | Next.js Server Actions + API Routes (Node.js runtime) | Evita mantener un backend separado en el MVP; migrable a NestJS si la complejidad lo justifica |
| Base de datos | PostgreSQL vía Supabase | Relacional real, RLS nativo, sin gestión de servidor |
| Autenticación | Supabase Auth (email/password) + preparado para SSO Azure AD (OIDC) | Incluido sin costo adicional, extensible |
| Almacenamiento de archivos | Supabase Storage (MVP) | Incluido en el mismo proveedor, sin infraestructura adicional |
| Generación de documentos | `docx` (npm) para Word, `pdf-lib`/Puppeteer para PDF, `exceljs` para Excel | Generación server-side controlada, sin dependencias de Office instalado |
| Notificaciones por correo | Microsoft Graph API (si hay licencia M365) o Resend como alterna | Flexibilidad según disponibilidad de licencias en TOTEM |
| Hosting | Vercel (frontend + funciones serverless) | Cero mantenimiento de servidores, despliegue continuo desde GitHub |
| Control de versiones | GitHub (repositorio privado de TOTEM) | Estándar de la industria, integración nativa con Vercel |
| Monitoreo de errores | Sentry (tier gratuito en MVP) | Visibilidad de errores en producción desde el día uno |
| Reportes avanzados | Power BI (Fase 3, vía export de datasets o conexión directa a Postgres) | Solicitado explícitamente en el brief |

## 4. Por qué este stack y no NestJS/SQL Server desde el inicio

TOTEM no cuenta hoy con infraestructura propia (servidor, VPS) ni con un equipo de DevOps dedicado. Next.js + Supabase + Vercel elimina la necesidad de aprovisionar y mantener servidores, certificados SSL, backups manuales o balanceo de carga — todo eso lo gestiona el proveedor. Esto no es una limitación permanente: como Supabase es PostgreSQL estándar, si en el futuro TOTEM decide migrar a un servidor corporativo propio (por ejemplo, bajo un estándar Microsoft con SQL Server), la migración afecta la capa de datos y no obliga a reescribir la lógica de negocio ni el frontend.

## 5. Requerimientos de integración detallados

### 5.1 Microsoft Graph API
- Permisos requeridos: `Mail.Send`, `Mail.Read` (buzón compartido de proyectos), `Calendars.ReadWrite`, `Sites.ReadWrite.All` (SharePoint), `ChannelMessage.Send` (Teams, opcional).
- Autenticación: OAuth2 client credentials flow (aplicación registrada en Azure AD de TOTEM) para operaciones de servicio (envío de notificaciones, lectura de buzón); flujo delegado para acciones que requieran identidad del usuario (crear evento en su propio calendario).
- Requiere que TOTEM registre una aplicación en Azure AD y otorgue consentimiento de administrador.

### 5.2 SharePoint
- Estructura de destino: `Clientes/{NombreCliente}/{CódigoProyecto}-{NombreProyecto}/` con las 10 subcarpetas estándar.
- Sincronización: al generar/subir un documento en TOTEM Flow, se replica vía Graph API a la biblioteca de documentos de SharePoint correspondiente.
- Esto se implementa en Fase 2, no en el MVP (Sección 9 del brief original lo permite explícitamente: "puede generarse inicialmente en servidor local").

### 5.3 GitHub
- Repositorio privado por proyecto de software (la plataforma misma, no los proyectos comerciales de TOTEM).
- Integración CI/CD: GitHub Actions ejecuta pruebas y despliega a Vercel en cada merge a `main`.
- Ver Documento 17 para estructura completa del repositorio.

### 5.4 Power BI (Fase 3)
- Conexión directa a la base de datos Postgres (vía connector nativo de Power BI) o exportación periódica de datasets a un esquema de solo lectura.

## 6. Requerimientos de seguridad

- Autenticación obligatoria para cualquier acceso a datos de proyectos.
- RLS en Postgres: cada tabla con política que valida `auth.uid()` contra el rol y la relación del usuario con el proyecto (ej. Comercial solo ve proyectos donde es el ejecutivo asignado; Operaciones solo ve proyectos en estado ≥ "Aprobado para fase Ninja").
- Registro de auditoría inmutable (ver RF-LOG).
- Validación de entrada en frontend y backend (doble validación, nunca confiar solo en el cliente).
- Política de contraseñas mínima: 8 caracteres, combinación de tipos (configurable).
- Tokens de sesión con expiración razonable y renovación segura (manejado por Supabase Auth).
- Archivos adjuntos: validación de tipo MIME y tamaño máximo antes de aceptar la carga.

## 7. Requerimientos de datos y retención

- Los proyectos cancelados o suspendidos no se eliminan físicamente; se marcan con estado y conservan toda su bitácora e historial.
- Política de retención de documentos: mínimo 5 años (ajustable según política interna de TOTEM, no definida en el brief — queda como punto a confirmar con el negocio).
- Backups automáticos diarios (incluidos en el plan Pro de Supabase).

## 8. Ambientes

| Ambiente | Propósito | Infraestructura |
|---|---|---|
| Desarrollo (`dev`) | Desarrollo activo, datos de prueba | Proyecto Supabase separado + rama `develop` en Vercel |
| Staging/QA | Pruebas de aceptación antes de producción | Proyecto Supabase separado + Preview Deployments de Vercel |
| Producción (`prod`) | Uso real por TOTEM | Proyecto Supabase de producción + dominio propio en Vercel |

## 9. Puntos a confirmar con TOTEM antes de iniciar desarrollo

1. ¿TOTEM ya tiene tenant de Microsoft 365 activo y quién puede autorizar el registro de una aplicación en Azure AD?
2. Política real de retención documental (legal/fiscal en Ecuador) para definir cuánto tiempo se conservan los documentos finales.
3. Umbral monetario exacto que activa "Aprobación Financiera obligatoria" en el checklist.
4. Catálogo actual de rubros y centros de costo (si existe en algún sistema, para no duplicarlo).
