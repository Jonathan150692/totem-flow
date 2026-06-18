# 01 — Documento de Requerimientos Funcionales

**Proyecto:** TOTEM Flow — Plataforma de Gestión Automatizada de Proyectos mediante Checklist Dinámico
**Empresa:** TOTEM (soluciones electrónicas de seguridad, CCTV, control de acceso, redes, incendio, software, monitoreo)
**Versión:** 1.0
**Fecha:** Junio 2026

---

## 1. Propósito del documento

Definir de manera completa y verificable las funcionalidades que debe cumplir la plataforma TOTEM Flow, sirviendo de base para el diseño técnico, el desarrollo y las pruebas de aceptación.

## 2. Alcance funcional

La plataforma cubre el ciclo de vida completo de un proyecto interno desde su creación (a partir de una GTT, correo o formulario) hasta la entrega formal a Operaciones, incluyendo: checklist dinámico, control de campos obligatorios, asignación de responsables, preguntas y respuestas interáreas, control de tiempos/SLA, notificaciones, gestión documental, generación de documento final, y reportes de cumplimiento.

No cubre (fuera de alcance de esta versión): ejecución del proyecto en campo, facturación, contabilidad, control de inventario de equipos, ni gestión de RR.HH. Estos pueden integrarse a futuro vía API.

## 3. Requerimientos funcionales por módulo

Cada requerimiento tiene un ID único con el formato `RF-XX-###` para trazabilidad hacia el plan de pruebas (documento 16).

### 3.1 Autenticación y control de acceso (RF-AUTH)

| ID | Requerimiento | Prioridad |
|---|---|---|
| RF-AUTH-001 | El sistema debe permitir login con correo corporativo y contraseña. | Must |
| RF-AUTH-002 | El sistema debe soportar inicio de sesión vía Microsoft 365 / Azure AD (SSO). | Should (Fase 2) |
| RF-AUTH-003 | El sistema debe asignar un rol único (o múltiples roles) a cada usuario. | Must |
| RF-AUTH-004 | El sistema debe registrar cada inicio y cierre de sesión (usuario, fecha, hora, IP). | Must |
| RF-AUTH-005 | El sistema debe restringir el acceso a módulos y datos según el rol del usuario (ver Documento 07 — Matriz de roles). | Must |
| RF-AUTH-006 | El sistema debe permitir recuperación de contraseña por correo. | Must |
| RF-AUTH-007 | El sistema debe cerrar sesión automáticamente tras un periodo de inactividad configurable. | Should |

### 3.2 Dashboard principal (RF-DASH)

| ID | Requerimiento | Prioridad |
|---|---|---|
| RF-DASH-001 | El sistema debe mostrar el total de proyectos creados en un periodo seleccionable. | Must |
| RF-DASH-002 | El sistema debe mostrar la distribución de proyectos por estado (de los 18 estados definidos). | Must |
| RF-DASH-003 | El sistema debe mostrar proyectos agrupados por responsable actual. | Must |
| RF-DASH-004 | El sistema debe mostrar proyectos vencidos (fase activa fuera de SLA). | Must |
| RF-DASH-005 | El sistema debe mostrar proyectos por tipo (pequeño, mediano, grande, especial). | Must |
| RF-DASH-006 | El sistema debe mostrar proyectos por prioridad (normal, alta, urgente). | Must |
| RF-DASH-007 | El sistema debe mostrar proyectos agrupados por fase actual. | Must |
| RF-DASH-008 | El sistema debe listar fases próximas a vencer (umbral configurable, ej. 80% del tiempo consumido). | Must |
| RF-DASH-009 | El sistema debe calcular y mostrar el % de cumplimiento SLA general. | Must |
| RF-DASH-010 | El sistema debe calcular el tiempo promedio por fase, por tipo de proyecto. | Must |
| RF-DASH-011 | El sistema debe identificar y mostrar cuellos de botella por área (área con mayor tiempo promedio o mayor cantidad de fases vencidas). | Should |
| RF-DASH-012 | El sistema debe mostrar el número y % de proyectos devueltos. | Must |
| RF-DASH-013 | El sistema debe mostrar el número y % de proyectos aprobados sin reproceso. | Must |
| RF-DASH-014 | El dashboard debe permitir filtrar por: fecha, cliente, ejecutivo comercial, responsable, estado, tipo de proyecto, prioridad, área, y condición de vencimiento. | Must |
| RF-DASH-015 | El dashboard debe permitir exportar las vistas filtradas a Excel/PDF. | Should |
| RF-DASH-016 | El sistema debe ofrecer una vista Kanban de proyectos agrupados por estado, con tarjetas arrastrables solo para usuarios autorizados. | Should |

### 3.3 Creación de proyecto (RF-CREATE)

| ID | Requerimiento | Prioridad |
|---|---|---|
| RF-CREATE-001 | El sistema debe exponer un botón "Crear Proyecto" visible para el rol Comercial (y Administrador). | Must |
| RF-CREATE-002 | El formulario de creación debe capturar todos los datos generales: nombre, cliente, RUC/identificación, ejecutivo comercial, fecha de creación (automática), prioridad, tipo de proyecto, tipo de negocio, descripción, GTT/correo base, adjuntos. | Must |
| RF-CREATE-003 | El sistema debe capturar los datos del cliente: contacto principal, cargo, teléfono, correo, dirección, coordenadas (opcional). | Must |
| RF-CREATE-004 | El sistema debe permitir agregar una o más localidades, cada una con: nombre, dirección, coordenadas, contacto responsable, teléfono, correo, observaciones y alcance específico. | Must |
| RF-CREATE-005 | El sistema debe capturar datos financieros: valor estimado, costo estimado, margen esperado, forma de pago, condiciones comerciales, centro de costo, código de proyecto, rubros requeridos, flags de validación/aprobación financiera. | Must |
| RF-CREATE-006 | El sistema debe capturar datos técnicos iniciales: soluciones involucradas (multi-selección), equipos principales, cantidades estimadas, y flags sí/no de visita técnica, diseño, plano, memoria de cálculo, integración con sistemas existentes. | Must |
| RF-CREATE-007 | El sistema debe validar campos obligatorios antes de permitir guardar el proyecto en estado "Proyecto creado". | Must |
| RF-CREATE-008 | El sistema debe generar un código de proyecto único automáticamente (formato configurable, ej. `TOT-2026-0001`). | Must |
| RF-CREATE-009 | Al guardar, el sistema debe generar automáticamente la carpeta documental del proyecto (ver RF-DOC). | Must |
| RF-CREATE-010 | Al guardar, el sistema debe generar automáticamente el checklist dinámico según las reglas del motor de checklist (ver RF-CHK). | Must |
| RF-CREATE-011 | El sistema debe permitir adjuntar múltiples archivos (GTT, correos, imágenes, planos preliminares) en el momento de creación. | Must |
| RF-CREATE-012 | El sistema debe transicionar automáticamente el proyecto al estado "Pendiente revisión inicial" tras la creación exitosa. | Must |
| RF-CREATE-013 | El sistema debe permitir crear un proyecto a partir de un correo recibido con GTT adjunta (ver RF-MAIL), pre-llenando los campos detectables. | Should (Fase 2) |

### 3.4 Checklist dinámico (RF-CHK)

| ID | Requerimiento | Prioridad |
|---|---|---|
| RF-CHK-001 | El sistema debe generar automáticamente un checklist compuesto por secciones activadas según: tipo de proyecto, tipo de negocio, soluciones involucradas, número de localidades, monto financiero, y complejidad. | Must |
| RF-CHK-002 | El sistema debe activar la sección "CCTV" (cámaras, tipo, grabación, almacenamiento, analítica, red, energía, monitoreo, planos, licencias, vigencia de equipos) cuando la solución CCTV esté marcada. | Must |
| RF-CHK-003 | El sistema debe activar la sección "Control de Acceso" (puertas, lectoras, cerraduras, biométricos, torniquetes, horarios, usuarios, software, integración, energía de respaldo) cuando esa solución esté marcada. | Must |
| RF-CHK-004 | El sistema debe permitir definir secciones equivalentes para Intrusión, Incendio, Redes, Energía, Software y Monitoreo, configurables por el Administrador (ver Documento de checklist base). | Must |
| RF-CHK-005 | El sistema debe replicar las secciones de checklist técnico por cada localidad cuando el proyecto tenga más de una localidad. | Must |
| RF-CHK-006 | El sistema debe activar automáticamente el bloque "Aprobación Financiera" cuando el valor estimado supere el umbral configurado por el Administrador. | Must |
| RF-CHK-007 | El sistema debe activar el bloque "Checklist de Importaciones" cuando se marque que el proyecto requiere importación de equipos. | Must |
| RF-CHK-008 | El sistema debe activar el bloque "Creación de Rubros" cuando se indique que el proyecto requiere rubros nuevos no existentes en el catálogo. | Must |
| RF-CHK-009 | Cada ítem de checklist debe tener estado: pendiente, en progreso, completo, no aplica. | Must |
| RF-CHK-010 | El sistema debe impedir el avance de fase si existen ítems de checklist marcados como obligatorios y no completos. | Must |
| RF-CHK-011 | El sistema debe permitir marcar ítems como "no aplica" únicamente a roles autorizados (Revisor de Proyectos, Proyectos, Ingeniería según el ítem), con comentario obligatorio. | Must |
| RF-CHK-012 | El sistema debe mostrar visualmente el % de avance del checklist por sección y total. | Must |
| RF-CHK-013 | El Administrador debe poder configurar nuevas plantillas de checklist y reglas de activación sin intervención de desarrollo (panel de configuración). | Should |

### 3.5 Flujo de estados (RF-FLOW)

| ID | Requerimiento | Prioridad |
|---|---|---|
| RF-FLOW-001 | El sistema debe implementar los 18 estados del proyecto definidos en el Documento 08, con transición controlada (no toda transición es válida desde cualquier estado). | Must |
| RF-FLOW-002 | Cada cambio de estado debe registrar: usuario, fecha, hora, comentario, estado anterior, estado nuevo. | Must |
| RF-FLOW-003 | El sistema debe exigir comentario obligatorio en toda transición de tipo "devolución". | Must |
| RF-FLOW-004 | El sistema debe exigir que exista un responsable asignado antes de permitir cerrar una fase. | Must |
| RF-FLOW-005 | El sistema debe bloquear el avance a "Reunión interna" si existen preguntas obligatorias abiertas. | Must |
| RF-FLOW-006 | El sistema debe bloquear el avance a "Aprobado para fase Ninja" si el checklist obligatorio no está al 100%. | Must |
| RF-FLOW-007 | El sistema debe permitir solo a Operaciones recibir proyectos en estado "Documento final generado" → "Entregado a Operaciones". | Must |
| RF-FLOW-008 | El sistema debe permitir suspender o cancelar un proyecto desde cualquier estado activo, con justificación obligatoria, conservando el historial completo. | Must |

### 3.6 Preguntas y respuestas (RF-QA)

| ID | Requerimiento | Prioridad |
|---|---|---|
| RF-QA-001 | Los roles Proyectos, Ingeniería, Presupuesto y Operaciones deben poder generar preguntas internas asociadas a un proyecto. | Must |
| RF-QA-002 | Cada pregunta debe registrar: área que pregunta, usuario que pregunta, responsable asignado, fecha de creación, fecha máxima de respuesta (calculada según SLA), estado, comentario, adjuntos, historial de respuestas. | Must |
| RF-QA-003 | El sistema debe gestionar los estados de pregunta: pendiente, respondida, devuelta, cerrada, vencida. | Must |
| RF-QA-004 | El sistema debe marcar automáticamente una pregunta como "vencida" si supera la fecha máxima de respuesta sin estar cerrada. | Must |
| RF-QA-005 | El sistema debe notificar al responsable asignado al crear una pregunta. | Must |
| RF-QA-006 | El sistema debe notificar al área que preguntó cuando la pregunta sea respondida. | Must |
| RF-QA-007 | El sistema debe permitir marcar preguntas como "obligatorias para avanzar" vs. informativas. | Must |
| RF-QA-008 | El sistema debe impedir agendar la reunión interna si existen preguntas obligatorias en estado distinto a "cerrada". | Must |
| RF-QA-009 | El sistema debe permitir filtrar y listar preguntas por proyecto, área, estado y responsable. | Should |

### 3.7 Reunión interna (RF-MEET)

| ID | Requerimiento | Prioridad |
|---|---|---|
| RF-MEET-001 | El sistema debe permitir agendar una reunión interna únicamente cuando todas las preguntas obligatorias estén cerradas. | Must |
| RF-MEET-002 | El sistema debe permitir registrar fecha, hora, participantes (Comercial, Proyectos, Ingeniería, Presupuesto, Operaciones, Logística/Compras opcional, Gerencia opcional). | Must |
| RF-MEET-003 | El sistema debe permitir registrar acuerdos, observaciones y decisión final de la reunión. | Must |
| RF-MEET-004 | El sistema debe soportar los resultados: aprobado, aprobado con observaciones, devuelto a Comercial, requiere ajuste técnico, requiere ajuste financiero, suspendido, cancelado. | Must |
| RF-MEET-005 | El sistema debe poder crear automáticamente el evento en el calendario corporativo (Outlook/Teams) e invitar a los participantes (Fase 2 — integración Graph API). | Should (Fase 2) |
| RF-MEET-006 | El sistema debe guardar el enlace de la reunión virtual si aplica. | Should |

### 3.8 Fase Ninja / Documento final (RF-NINJA)

| ID | Requerimiento | Prioridad |
|---|---|---|
| RF-NINJA-001 | El sistema debe habilitar la fase Ninja únicamente tras una decisión de reunión "aprobado" o "aprobado con observaciones". | Must |
| RF-NINJA-002 | El sistema debe consolidar automáticamente: datos del cliente, datos del proyecto, GTT, alcance validado, localidades, contactos, equipos, cantidades, soluciones, observaciones técnicas/financieras, riesgos, responsables, fechas clave, preguntas y respuestas cerradas, checklist completo y entregables. | Must |
| RF-NINJA-003 | El sistema debe generar el documento final exportable en PDF y Word. | Must |
| RF-NINJA-004 | El sistema debe generar opcionalmente una versión en Excel cuando el proyecto incluya tablas de equipos/cantidades extensas. | Should |
| RF-NINJA-005 | El documento final debe usarse únicamente con información en estado aprobado (no se permite generar con datos pendientes). | Must |
| RF-NINJA-006 | El sistema debe versionar los documentos finales generados (si se regenera, debe quedar historial). | Should |

### 3.9 Gestión documental (RF-DOC)

| ID | Requerimiento | Prioridad |
|---|---|---|
| RF-DOC-001 | El sistema debe crear automáticamente, al crear el proyecto, una carpeta con la estructura estándar de 10 subcarpetas (01_GTT … 10_Anexos). | Must |
| RF-DOC-002 | El sistema debe asociar cada archivo subido a: proyecto, subcarpeta, fase y (si aplica) pregunta específica. | Must |
| RF-DOC-003 | El sistema debe almacenar documentos en almacenamiento propio (Supabase Storage) en el MVP. | Must |
| RF-DOC-004 | El sistema debe permitir migrar/sincronizar la estructura documental hacia SharePoint en una fase posterior, manteniendo la misma jerarquía de carpetas. | Should (Fase 2) |
| RF-DOC-005 | El sistema debe controlar permisos de acceso a documentos según el rol y el proyecto. | Must |
| RF-DOC-006 | El sistema debe registrar quién subió cada archivo, cuándo, y a qué fase/pregunta corresponde. | Must |

### 3.10 Notificaciones (RF-NOTIF)

| ID | Requerimiento | Prioridad |
|---|---|---|
| RF-NOTIF-001 | El sistema debe notificar (correo + notificación interna) en los 12 eventos definidos en el Documento de requerimientos técnicos, sección de notificaciones. | Must |
| RF-NOTIF-002 | El sistema debe permitir a cada usuario ver un centro de notificaciones internas dentro de la plataforma. | Must |
| RF-NOTIF-003 | El sistema debe enviar notificaciones por correo electrónico vía SMTP/Graph API. | Must |
| RF-NOTIF-004 | El sistema debe integrar notificaciones a Teams (Fase 2). | Should (Fase 2) |
| RF-NOTIF-005 | El sistema debe evitar duplicar notificaciones por el mismo evento. | Should |

### 3.11 Control de tiempos y SLA (RF-SLA)

| ID | Requerimiento | Prioridad |
|---|---|---|
| RF-SLA-001 | El sistema debe definir tiempos máximos por fase según tipo de proyecto (tabla configurable por Administrador). | Must |
| RF-SLA-002 | Cada fase debe registrar: fecha/hora de inicio, fecha/hora de fin, tiempo real consumido, tiempo máximo permitido, responsable, estado SLA. | Must |
| RF-SLA-003 | El sistema debe calcular el estado SLA en tiempo real: dentro de tiempo, por vencer (umbral configurable, ej. 80%), vencido. | Must |
| RF-SLA-004 | El sistema debe excluir del cálculo de SLA los periodos en que el proyecto estuvo suspendido. | Must |
| RF-SLA-005 | El sistema debe mostrar el semáforo SLA visualmente en listados, tarjetas y dashboard. | Must |

### 3.12 Acciones ante retrasos (RF-ESC)

| ID | Requerimiento | Prioridad |
|---|---|---|
| RF-ESC-001 | El sistema debe marcar automáticamente una fase como vencida al superar el tiempo máximo. | Must |
| RF-ESC-002 | El sistema debe enviar alerta al responsable de la fase al vencer. | Must |
| RF-ESC-003 | El sistema debe enviar alerta al jefe de área cuando la fase venza (primer umbral de escalamiento). | Must |
| RF-ESC-004 | El sistema debe escalar a un segundo nivel (ej. Gerencia) si el retraso supera un segundo umbral configurable. | Must |
| RF-ESC-005 | El sistema debe registrar el evento de vencimiento en la bitácora del proyecto. | Must |
| RF-ESC-006 | El sistema debe solicitar justificación obligatoria del retraso al responsable. | Must |
| RF-ESC-007 | El sistema debe permitir reasignar el responsable de una fase vencida (solo roles autorizados). | Must |
| RF-ESC-008 | El sistema debe permitir registrar una "reunión de desbloqueo" asociada a una fase vencida. | Should |
| RF-ESC-009 | El sistema debe permitir pausar el proyecto completo con justificación, deteniendo el conteo de SLA. | Must |

### 3.13 Bitácora de trazabilidad (RF-LOG)

| ID | Requerimiento | Prioridad |
|---|---|---|
| RF-LOG-001 | El sistema debe registrar automáticamente en bitácora: creación, cambios de estado, cambios de información relevante, archivos cargados, preguntas, respuestas, aprobaciones, devoluciones, comentarios, reuniones, alertas y retrasos. | Must |
| RF-LOG-002 | Cada entrada de bitácora debe incluir usuario, fecha, hora y descripción del evento. | Must |
| RF-LOG-003 | La bitácora no debe ser editable ni eliminable por usuarios sin privilegio de Administrador a nivel de base de datos (append-only). | Must |
| RF-LOG-004 | El sistema debe presentar la bitácora como una línea de tiempo (timeline) visual en el detalle del proyecto. | Must |

### 3.14 Reportes e indicadores (RF-REP)

| ID | Requerimiento | Prioridad |
|---|---|---|
| RF-REP-001 | El sistema debe generar el listado de proyectos creados por periodo. | Must |
| RF-REP-002 | El sistema debe generar reportes por estado, por ejecutivo, por área. | Must |
| RF-REP-003 | El sistema debe generar el reporte de proyectos vencidos. | Must |
| RF-REP-004 | El sistema debe calcular tiempo promedio por fase. | Must |
| RF-REP-005 | El sistema debe calcular % de cumplimiento SLA (fórmula en Documento 09). | Must |
| RF-REP-006 | El sistema debe calcular preguntas promedio por proyecto. | Must |
| RF-REP-007 | El sistema debe calcular % de proyectos devueltos. | Must |
| RF-REP-008 | El sistema debe calcular % de proyectos aprobados sin reproceso. | Must |
| RF-REP-009 | El sistema debe calcular el tiempo total desde creación hasta entrega a Operaciones. | Must |
| RF-REP-010 | El sistema debe permitir exportar todos los reportes a Excel/PDF. | Should |
| RF-REP-011 | El sistema debe integrar con Power BI mediante exportación de datasets o conexión directa (Fase 3). | Could (Fase 3) |

### 3.15 Integraciones (RF-INT)

| ID | Requerimiento | Prioridad |
|---|---|---|
| RF-INT-001 | El sistema debe integrarse con Microsoft Graph API para envío de correos, lectura de buzón de proyectos (GTT entrante), calendario y notificaciones Teams. | Should (Fase 2) |
| RF-INT-002 | El sistema debe integrarse con SharePoint para sincronizar la estructura documental (Fase 2). | Should (Fase 2) |
| RF-INT-003 | El sistema debe exponer una API REST documentada para integraciones futuras (SAP, Power BI, GitHub). | Should |
| RF-INT-004 | El sistema debe registrar en GitHub el versionado del código fuente, sin que esto sea visible/operable para usuarios finales. | Must (proceso interno de desarrollo) |

## 4. Requerimientos no funcionales (resumen — detalle en Documento 02)

- Disponibilidad objetivo: 99% en horario laboral.
- Tiempo de respuesta: <2s en operaciones CRUD estándar.
- Escalabilidad: soportar crecimiento de 10 a 100+ usuarios sin rediseño de arquitectura.
- Seguridad: cifrado en tránsito y reposo, control de acceso por rol a nivel de base de datos (RLS).
- Auditoría: bitácora inmutable de todas las acciones críticas.

## 5. Supuestos

- TOTEM cuenta o contará con licencias Microsoft 365 para habilitar las integraciones de Fase 2.
- El catálogo de rubros, equipos y centros de costo existe o se construirá en paralelo (fuera del alcance del MVP, pero el modelo de datos lo contempla).
- Los tiempos SLA de la tabla de la Sección 14 del brief original son un punto de partida y serán validados/ajustados por el Administrador antes de salir a producción.

## 6. Glosario

- **GTT**: Documento/formulario base que origina un proyecto comercial (Generación de Trámite/Trabajo, según terminología interna de TOTEM).
- **Fase Ninja**: Fase de consolidación final previa a la entrega a Operaciones.
- **SLA**: Acuerdo de nivel de servicio — tiempo máximo permitido por fase.
- **Checklist dinámico**: Conjunto de ítems de verificación que se activan/desactivan según las características del proyecto.
