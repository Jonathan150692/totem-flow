# 15 — Recomendaciones de Seguridad

**Proyecto:** TOTEM Flow
**Versión:** 1.0

Este documento profundiza más allá de los requerimientos no funcionales de seguridad ya listados en el Documento 02, con recomendaciones concretas de implementación.

---

## 1. Row Level Security (RLS) — políticas específicas

Más allá del enfoque general descrito en el Documento 04, sección 4, se recomienda:

- Definir una función SQL `current_user_roles()` que devuelva el conjunto de roles del usuario autenticado, reutilizable en todas las políticas (evita repetir la misma subconsulta en cada tabla).
- Definir `user_can_access_project(project_id uuid)` como `SECURITY DEFINER` para que pueda evaluar la pertenencia sin que cada tabla relacionada necesite repetir la lógica de roles.
- Aplicar políticas separadas para `SELECT`, `INSERT`, `UPDATE` y `DELETE` en lugar de una política genérica `ALL`, ya que los permisos de lectura y escritura difieren bastante entre roles (ver Documento 07).
- La tabla `audit_log` no debe tener política de `UPDATE` ni `DELETE` para ningún rol de aplicación (ni siquiera Administrador) — solo el rol de servicio (`service_role` de Supabase, usado exclusivamente por procesos internos) puede insertar.
- Probar cada política con el rol específico antes de pasar a producción, no solo con el rol de servicio (es un error común validar RLS solo desde un contexto que ya tiene bypass de RLS).

## 2. Gestión de secretos

- Ninguna credencial (claves de Supabase, client secret de Azure AD, tokens de Resend/Graph API) debe estar en el código fuente ni en el repositorio, incluso en archivos de configuración de ejemplo (usar `.env.example` con valores ficticios).
- Variables de entorno gestionadas a través del panel de Vercel (separadas por ambiente: dev/staging/prod) y nunca compartidas entre ambientes.
- La `service_role key` de Supabase (que bypassa RLS) se usa exclusivamente en funciones de servidor que corren en el backend (Server Actions, cron jobs), nunca expuesta al cliente.
- Rotación periódica de credenciales sensibles (al menos cada 6–12 meses, o inmediatamente si hay sospecha de exposición).

## 3. Validación de entradas

- Todo input de usuario se valida con esquemas Zod compartidos entre cliente y servidor — la validación de cliente mejora la experiencia de usuario, pero la validación de servidor es la que realmente protege los datos (nunca confiar solo en la validación de formulario del navegador).
- Sanitización de campos de texto libre que eventualmente se renderizan en el documento final (Fase Ninja) para evitar inyección de HTML/script si en algún punto se visualizan en una vista web antes de exportar a PDF/Word.
- Validación estricta de tipo MIME y extensión en la carga de archivos adjuntos, además del límite de tamaño (Documento 02), rechazando archivos ejecutables o con extensiones no permitidas.

## 4. Protección contra ataques comunes

| Vector | Mitigación |
|---|---|
| Inyección SQL | Uso exclusivo de queries parametrizadas vía el ORM (Drizzle); prohibido concatenar strings SQL con input de usuario |
| Cross-Site Scripting (XSS) | React escapa por defecto el contenido renderizado; evitar `dangerouslySetInnerHTML` salvo casos controlados y sanitizados |
| Cross-Site Request Forgery (CSRF) | Server Actions de Next.js incluyen protección CSRF nativa; verificar que los Route Handlers expuestos como API también validen origen/token cuando corresponda |
| Fuerza bruta en login | Límite de intentos de inicio de sesión (rate limiting), bloqueo temporal tras N intentos fallidos (configurable en Supabase Auth) |
| Exposición de IDs secuenciales adivinables | Uso de UUID en lugar de IDs autoincrementales en todas las tablas con datos sensibles, evitando que un usuario adivine o enumere proyectos ajenos |
| Fuga de datos entre ambientes | Proyectos Supabase completamente separados para dev/staging/prod, sin compartir credenciales ni base de datos |

## 5. Hardening de Supabase y Vercel

- Activar autenticación de dos factores (2FA) en las cuentas administrativas de Supabase y Vercel que gestionan el proyecto.
- Restringir el acceso al panel de administración de Supabase solo al equipo de desarrollo, no a usuarios finales de TOTEM.
- Configurar políticas de backup automático (incluidas en el plan Pro de Supabase) y probar al menos una vez el proceso de restauración antes de ir a producción.
- En Vercel, restringir las variables de entorno de producción para que no sean visibles en Preview Deployments si contienen secretos sensibles de producción.

## 6. Seguridad en integraciones (Fase 2)

- El registro de la aplicación en Azure AD debe solicitar únicamente los permisos (`scopes`) estrictamente necesarios (ver Documento 02, sección 5.1), evitando permisos amplios como `Mail.ReadWrite` para todo el tenant si solo se necesita un buzón compartido específico.
- Los tokens de acceso de Graph API deben almacenarse cifrados si se persisten, y renovarse vía refresh token sin exponer el flujo al cliente.

## 7. Revisión periódica

Se recomienda una revisión de seguridad (checklist de este documento + prueba de penetración básica o auditoría de dependencias vía `npm audit`/Dependabot) antes de cada hito mayor: fin de MVP, fin de Fase 2, y luego semestralmente.
