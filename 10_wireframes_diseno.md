# 10 — Wireframes y Diseño Preliminar de Pantallas

**Proyecto:** TOTEM Flow
**Versión:** 1.0

Nota: los wireframes visuales de referencia (Dashboard, Checklist dinámico y Vista Kanban) se generaron como mockups interactivos durante la sesión de diseño. Este documento describe la estructura completa de pantallas, incluyendo las que no se mockearon visualmente, para que el equipo de desarrollo tenga la especificación completa.

---

## 1. Inventario de pantallas

| # | Pantalla | Rol(es) principal(es) | Referencia de requerimientos |
|---|---|---|---|
| 1 | Login | Todos | RF-AUTH |
| 2 | Dashboard principal | Todos (vista filtrada por rol) | RF-DASH |
| 3 | Listado de proyectos (tabla) | Todos | RF-DASH |
| 4 | Vista Kanban de proyectos | Todos | RF-DASH-016 |
| 5 | Crear/Editar proyecto (wizard de 4 pasos) | Comercial, Admin | RF-CREATE |
| 6 | Detalle de proyecto (vista maestra con tabs) | Todos | Transversal |
| 7 | Checklist dinámico | Comercial, Proyectos, Ingeniería, Presupuesto | RF-CHK |
| 8 | Listado y detalle de preguntas | Proyectos, Ingeniería, Presupuesto, Operaciones, Comercial | RF-QA |
| 9 | Agendar/gestionar reunión interna | Proyectos | RF-MEET |
| 10 | Fase Ninja / Documento final | Proyectos, Operaciones | RF-NINJA |
| 11 | Gestión documental (carpetas) | Todos (según permiso) | RF-DOC |
| 12 | Bitácora / Timeline del proyecto | Todos | RF-LOG |
| 13 | Centro de notificaciones | Todos | RF-NOTIF |
| 14 | Reportes e indicadores | Admin, Gerencia | RF-REP |
| 15 | Panel de configuración (usuarios, roles, SLA, tipos de proyecto, checklist base) | Admin | RF-CHK-013, configuración general |

## 2. Descripción de pantallas clave

### 2.1 Dashboard principal
Layout de tres zonas: menú lateral fijo, barra de filtros superior (fecha, cliente, ejecutivo, responsable, estado, tipo, prioridad, área, vencido/dentro de tiempo), y cuerpo con tarjetas de indicadores (4 columnas) seguidas de dos paneles: distribución de proyectos por fase (barras horizontales) y lista de "próximos a vencer" con semáforo de color. Ver wireframe de referencia generado.

### 2.2 Crear/Editar proyecto — wizard de 4 pasos
En lugar de un formulario único extenso (que el brief especifica con ~25+ campos), se recomienda un wizard de pasos para reducir la carga cognitiva:
1. **Datos generales y cliente** (nombre, cliente, RUC, ejecutivo, prioridad, tipo, tipo de negocio, descripción, GTT, adjuntos, contacto principal).
2. **Localidades** (agregar N localidades con su formulario embebido — patrón "lista expandible", cada localidad se agrega con un botón "+ Agregar localidad").
3. **Datos financieros** (valor, costo, margen calculado automáticamente, condiciones, rubros, flags de aprobación).
4. **Datos técnicos iniciales** (selección múltiple de soluciones con checkboxes grandes tipo tarjeta — CCTV, Control de Acceso, etc. — y flags sí/no de visita técnica, diseño, plano, memoria de cálculo, integración).

Al confirmar el paso 4, el sistema muestra una pantalla de resumen antes de "Crear proyecto", indicando qué secciones de checklist se activarán automáticamente (transparencia sobre el motor de reglas).

### 2.3 Detalle de proyecto (vista maestra)
Header con nombre del proyecto, código, cliente, badge de estado actual (color según Documento 08) y badge de SLA (semáforo). Debajo, navegación por tabs: **Resumen | Checklist | Preguntas | Reunión | Documentos | Bitácora**. Esta vista es el punto de entrada principal para cualquier rol que interactúe con un proyecto específico.

### 2.4 Checklist dinámico
Secciones colapsables agrupadas por solución/bloque (CCTV, Control de Acceso, Aprobación Financiera, etc.), cada una con su barra de progreso. Ítems individuales con checkbox/input según `input_type`. Ítems "no aplica" muestran un ícono distintivo y el motivo en texto secundario. Ver wireframe de referencia generado.

### 2.5 Preguntas y respuestas
Vista de lista filtrable (por área, estado, responsable) con badges de color por estado (pendiente=amarillo, vencida=rojo, cerrada=verde). Al abrir una pregunta: panel con texto de la pregunta, adjuntos, historial de respuestas en formato de hilo de conversación, y campo para nueva respuesta. Botón "Cerrar pregunta" visible solo para el área que la generó originalmente.

### 2.6 Reunión interna
Formulario simple: fecha/hora (selector), participantes (multi-select de usuarios con su área visible), campo de acuerdos, campo de observaciones, y selector de decisión final (las 7 opciones del brief) que dispara la transición de estado correspondiente al guardar.

### 2.7 Fase Ninja / Documento final
Vista de previsualización del documento consolidado (renderizado en pantalla antes de exportar), con botones de exportación PDF / Word / Excel. Si algún dato fuente no está aprobado, se muestra una alerta bloqueante explicando qué falta.

### 2.8 Vista Kanban
Columnas por estado (las más relevantes para el día a día, no necesariamente las 18 completas — se sugiere agrupar visualmente algunas para no saturar el tablero), tarjetas con nombre de cliente, tipo y un indicador rápido de SLA. Ver wireframe de referencia generado.

### 2.9 Panel de configuración (solo Administrador)
Sub-secciones: Usuarios y roles · Tiempos SLA por tipo de proyecto y fase · Tipos de proyecto · Plantillas y reglas de checklist base. Cada sub-sección es una tabla editable con formularios modales para crear/editar entradas, evitando que cualquier cambio de reglas de negocio requiera intervención de desarrollo.

## 3. Principios de diseño visual aplicados

- Semáforo de SLA consistente en toda la plataforma: verde (dentro de tiempo), amarillo (por vencer), rojo (vencido), azul (en proceso/informativo), gris (suspendido/cancelado) — tal como especifica el punto 21 del brief.
- Densidad de información alta pero legible: TOTEM gestiona muchos proyectos en paralelo, por lo que las vistas de listado priorizan tablas y tarjetas compactas sobre formularios largos visibles de inicio.
- Mobile: en el MVP, el acceso móvil es de solo consulta (dashboard, estado de proyectos, notificaciones); la creación y edición de proyectos se diseña primero para escritorio dado el volumen de datos por capturar.
