# 03 — Arquitectura General del Sistema

**Proyecto:** TOTEM Flow
**Versión:** 1.0

---

## 1. Diagrama de arquitectura (vista lógica)

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USUARIOS (8 ROLES)                          │
│  Administrador · Comercial · Revisor Proyectos · Proyectos           │
│  Ingeniería · Presupuesto · Operaciones · Consulta/Gerencia          │
└───────────────────────────────┬────────────────────────────────────┘
                                  │ HTTPS
┌─────────────────────────────────▼────────────────────────────────────┐
│                     FRONTEND — Next.js (Vercel)                       │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────────────┐ │
│  │  Dashboard    │ │  Crear/Editar │ │  Checklist    │ │  Reportes   │ │
│  │              │ │  Proyecto     │ │  dinámico     │ │             │ │
│  └──────────────┘ └──────────────┘ └──────────────┘ └─────────────┘ │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────────────┐ │
│  │  Preguntas/   │ │  Reunión      │ │  Fase Ninja /  │ │  Bitácora   │ │
│  │  Respuestas   │ │  interna      │ │  Doc. final    │ │  / Timeline │ │
│  └──────────────┘ └──────────────┘ └──────────────┘ └─────────────┘ │
└───────────────────────────────┬────────────────────────────────────┘
                                  │ Server Actions / API Routes
┌─────────────────────────────────▼────────────────────────────────────┐
│              LÓGICA DE NEGOCIO (Next.js server runtime)               │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────────────┐  │
│  │ Motor de        │ │ Motor de SLA    │ │ Motor de transición de  │  │
│  │ Checklist       │ │ y escalamiento  │ │ estados                 │  │
│  │ Dinámico        │ │                 │ │                         │  │
│  └────────────────┘ └────────────────┘ └────────────────────────┘  │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────────────┐  │
│  │ Generador de    │ │ Servicio de     │ │ Servicio de             │  │
│  │ Documento Final │ │ Notificaciones  │ │ Bitácora (append-only)  │  │
│  └────────────────┘ └────────────────┘ └────────────────────────┘  │
└───────┬─────────────────┬──────────────────┬─────────────────┬─────┘
        │                 │                  │                 │
┌────────▼──────┐  ┌────────▼───────┐ ┌────────▼────────┐ ┌──────▼──────┐
│  PostgreSQL    │  │  Supabase       │ │  Microsoft       │ │  GitHub     │
│  (Supabase)    │  │  Storage        │ │  Graph API       │ │  (versión   │
│  + RLS         │  │  (archivos)     │ │  (correo, cal.,  │ │  de código) │
│  + Auth        │  │                 │ │  Teams, SP)      │ │             │
└───────────────┘  └────────────────┘ └─────────────────┘ └─────────────┘
                                                │
                                       ┌─────────▼─────────┐
                                       │   SharePoint        │
                                       │   (Fase 2)          │
                                       └────────────────────┘
```

## 2. Componentes principales

### 2.1 Frontend (Next.js)
Aplicación única que sirve tanto la interfaz de usuario como las funciones de servidor (Server Actions), evitando duplicar lógica entre cliente y un backend separado. Organizada por módulos que reflejan el brief: Dashboard, Crear Proyecto, Checklist, Preguntas/Respuestas, Reunión Interna, Fase Ninja, Bitácora, Reportes.

### 2.2 Motor de Checklist Dinámico
Componente de lógica de negocio responsable de evaluar las reglas de activación (Sección 4 del brief) y construir el árbol de ítems aplicable a un proyecto específico. Se implementa como un motor de reglas basado en configuración almacenada en base de datos (no hardcodeado), para que el Administrador pueda modificar reglas sin requerir un despliegue de código. Ver Documento 04 (modelo de datos) para el esquema `checklist_templates` / `checklist_rules`.

### 2.3 Motor de SLA y Escalamiento
Proceso que calcula en cada fase el tiempo transcurrido vs. el máximo permitido, determina el estado SLA (verde/amarillo/rojo), y dispara las acciones de escalamiento (Sección 15 del brief). Se ejecuta de dos formas:
- **Síncrono**: al consultar el dashboard o detalle de proyecto, se calcula el estado SLA en tiempo real.
- **Asíncrono (cron job)**: una función programada (Vercel Cron o Supabase Edge Function con `pg_cron`) revisa periódicamente (ej. cada hora) las fases activas, marca vencimientos y dispara notificaciones/escalamiento, para que las alertas no dependan de que alguien tenga la app abierta.

### 2.4 Motor de Transición de Estados
Máquina de estados finita que valida que cada cambio de estado solicitado sea una transición permitida desde el estado actual, según el rol del usuario que la solicita. Se modela explícitamente (no como simples updates de un campo) para poder auditar y para que el Documento 08 (estados) sea la fuente única de verdad reflejada en código.

### 2.5 Generador de Documento Final
Servicio que, en la fase Ninja, consulta todos los datos consolidados del proyecto (cliente, localidades, checklist, preguntas cerradas, equipos, riesgos, etc.) y genera los archivos PDF/Word/Excel usando los datos exclusivamente desde tablas con estado "aprobado".

### 2.6 Servicio de Notificaciones
Capa que escucha eventos del sistema (creación de proyecto, vencimiento de fase, pregunta respondida, etc.) y despacha notificaciones por los canales habilitados (correo vía Graph API o Resend, notificación interna en base de datos, Teams en Fase 2).

### 2.7 Servicio de Bitácora
Cada acción relevante del sistema escribe un registro inmutable en la tabla `audit_log`. Se implementa como trigger de base de datos donde sea posible (para garantizar que no se pueda omitir desde la aplicación) complementado con registros explícitos desde la lógica de negocio para eventos que no son cambios directos de fila (ej. "se envió notificación").

## 3. Flujo de datos típico (ejemplo: creación de proyecto)

1. Usuario Comercial llena el formulario "Crear Proyecto" en el frontend.
2. El frontend invoca una Server Action `createProject(formData)`.
3. La Server Action valida los datos, inserta el registro en `projects` y tablas relacionadas (`project_locations`, `project_contacts`, `project_financials`, `project_technical_info`).
4. Se invoca el Motor de Checklist Dinámico, que lee `checklist_rules` y genera las filas correspondientes en `project_checklist_items`.
5. Se crea la carpeta documental (estructura de 10 subcarpetas) en Supabase Storage, asociada al proyecto.
6. Se inicia el contador SLA de la primera fase ("Pendiente revisión inicial") insertando un registro en `project_phases`.
7. Se dispara una notificación al Revisor de Proyectos.
8. Se escribe la entrada de bitácora "Proyecto creado".
9. El sistema responde al frontend con el proyecto creado y redirige al detalle.

## 4. Decisiones de arquitectura clave (ADR resumido)

| Decisión | Alternativa considerada | Por qué se eligió esta opción |
|---|---|---|
| Next.js full-stack en vez de NestJS separado | Backend NestJS independiente | Reduce superficie operativa sin infraestructura propia; migrable después si se requiere separar backend/frontend |
| Supabase (Postgres) en vez de servidor propio | VPS con Postgres autoadministrado | Cero mantenimiento de servidor; backups y RLS incluidos |
| Reglas de checklist en base de datos en vez de hardcodeadas | Lógica de checklist en código | Permite que el Administrador configure nuevos tipos de proyecto sin requerir despliegue (RF-CHK-013) |
| Graph API como capa de integración M365 en vez de Power Platform como núcleo | Power Apps + Power Automate como plataforma completa | Costo mensual por usuario alto y lógica condicional compleja es más rígida en low-code; ver evaluación de costos discutida con el cliente |
| Máquina de estados explícita en vez de campo de estado libre | Campo `status` de texto libre actualizado directamente | Garantiza que solo transiciones válidas ocurran y centraliza las reglas de negocio del flujo (Documento 08) |

## 5. Consideraciones de escalabilidad futura

- Si el volumen de proyectos o la complejidad de reglas de negocio crece sustancialmente, el motor de checklist y el motor de SLA pueden extraerse a un servicio NestJS independiente sin afectar el frontend, ya que ambos están diseñados como módulos de lógica desacoplados de la capa de presentación.
- La base de datos Postgres es portable a cualquier proveedor (incluyendo un servidor propio de TOTEM) sin cambios de esquema.
