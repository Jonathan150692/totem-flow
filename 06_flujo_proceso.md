# 06 — Flujo de Proceso

**Proyecto:** TOTEM Flow
**Versión:** 1.0

---

## 1. Diagrama de flujo end-to-end

```
[Comercial crea proyecto: GTT / correo / formulario]
              │
              ▼
   ESTADO: Proyecto creado
   → Se genera carpeta documental
   → Se genera checklist dinámico inicial
   → Inicia SLA fase "Revisión inicial"
              │
              ▼
   ESTADO: Pendiente revisión inicial
              │
              ▼
   [Revisor de Proyectos / Diego revisa información]
              │
       ┌──────┴──────┐
       ▼             ▼
  Info incompleta   Info completa
       │             │
       ▼             ▼
ESTADO: Devuelto    ESTADO: Revisión inicial aprobada
a Comercial          → Activa checks según necesidad
       │             → Inicia SLA "Checklist en desarrollo"
       │                    │
       └──── vuelve a ──────┘ (tras corrección)
       "Pendiente revisión inicial"
                             │
                             ▼
                  ESTADO: Checklist en desarrollo
                  [Comercial/Proyectos completan campos]
                             │
                             ▼
                  ¿Checklist obligatorio 100%?
                       │           │
                      No          Sí
                       │           │
                  (permanece)      ▼
                          [Proyectos/Ingeniería/Presupuesto/
                           Operaciones generan preguntas]
                                    │
                                    ▼
                   ESTADO: Preguntas internas generadas
                   → Inicia SLA "Preguntas internas" por pregunta
                                    │
                                    ▼
                   ESTADO: Pendiente respuesta Comercial
                   → Inicia SLA "Respuesta Comercial"
                                    │
                         ┌──────────┴──────────┐
                         ▼                      ▼
              Respuesta devuelta         Respuesta aceptada
                         │                      │
                         └── reabre pregunta     ▼
                                          ESTADO: Preguntas respondidas
                                                  │
                                                  ▼
                                   ¿Todas las preguntas obligatorias
                                          en estado CERRADA?
                                       │              │
                                      No             Sí
                                       │              │
                                (permanece en      ▼
                              "Pendiente respuesta  ESTADO: Preguntas cerradas
                               Comercial" o vuelve
                               a generar preguntas)        │
                                                            ▼
                                          ESTADO: Reunión interna pendiente
                                                            │
                                                            ▼
                                       [Proyectos coordina y agenda reunión]
                                                            │
                                                            ▼
                                          ESTADO: Reunión interna agendada
                                                            │
                                                            ▼
                                              [Se realiza la reunión]
                                                            │
                                                            ▼
                                          ESTADO: En revisión de equipo
                                                            │
                              ┌─────────────┬──────────────┼───────────────┬─────────────┐
                              ▼             ▼              ▼               ▼             ▼
                        Aprobado /    Devuelto a    Requiere ajuste  Requiere ajuste  Suspendido /
                        Aprobado c.   Comercial      técnico          financiero       Cancelado
                        observ.            │              │               │             │
                              │             ▼              ▼               ▼             ▼
                              │     "Devuelto a      Vuelve a área    Vuelve a área   ESTADO:
                              │      Comercial"       Ingeniería       Presupuesto    Suspendido/
                              │                       (genera nuevas   (genera nuevas  Cancelado
                              │                        preguntas)       preguntas)
                              ▼
                   ESTADO: Aprobado para fase Ninja
                   → Inicia SLA "Fase Ninja"
                              │
                              ▼
                   ESTADO: En fase Ninja
                   [Sistema consolida datos aprobados]
                              │
                              ▼
                   ESTADO: Documento final generado
                   [Exportable PDF / Word / Excel]
                              │
                              ▼
                   ESTADO: Entregado a Operaciones
                   → Cierra SLA total del proyecto
                   → Notifica a Operaciones
```

## 2. Puntos de control obligatorios (gates)

| Gate | Condición para pasar | Bloqueo si no se cumple |
|---|---|---|
| Revisión inicial → Revisión aprobada | Información general, cliente, localidades, datos financieros y técnicos iniciales completos según campos obligatorios | El Revisor de Proyectos devuelve a Comercial con comentario obligatorio |
| Checklist en desarrollo → Preguntas generadas | % de checklist obligatorio = 100% (o ítems marcados NO_APLICA con justificación) | No se pueden generar preguntas formales de cierre de fase hasta este punto (las áreas sí pueden generar preguntas exploratorias antes, pero el estado del proyecto no avanza) |
| Preguntas cerradas → Reunión pendiente | Todas las preguntas con `is_mandatory = true` están en estado `CERRADA` | El sistema bloquea el botón "Agendar reunión" |
| En revisión de equipo → Aprobado fase Ninja | Decisión de reunión = `APROBADO` o `APROBADO_CON_OBSERVACIONES` | Cualquier otra decisión devuelve el proyecto al área correspondiente |
| En fase Ninja → Documento final generado | Todos los datos consolidados provienen de registros en estado aprobado (sin pendientes) | El generador de documento rechaza la generación si detecta datos no validados |
| Documento final generado → Entregado a Operaciones | Solo accionable por rol Operaciones o Administrador | Cualquier otro rol no ve habilitada esta transición |

## 3. Manejo de bucles de retrabajo

El proceso no es estrictamente lineal: las devoluciones desde la reunión interna ("requiere ajuste técnico", "requiere ajuste financiero", "devuelto a Comercial") regresan el proyecto a un estado anterior, pero **conservan** el checklist ya completado y las preguntas ya cerradas — solo reabren lo específico que generó la devolución (ver RF-FLOW-008 y la tabla `project_status_history`, que permite reconstruir cuántas veces un proyecto pasó por cada estado, insumo directo para el indicador "% aprobados sin reproceso").

## 4. Actores por etapa (referencia cruzada con Documento 07)

| Etapa del flujo | Actor principal | Actores secundarios |
|---|---|---|
| Creación | Comercial | — |
| Revisión inicial | Revisor de Proyectos | Comercial (corrige si se devuelve) |
| Checklist en desarrollo | Comercial, Proyectos | Ingeniería (si aplica desde el inicio) |
| Preguntas internas | Proyectos, Ingeniería, Presupuesto, Operaciones | Comercial (responde) |
| Reunión interna | Proyectos (coordina) | Todas las áreas (participan) |
| Fase Ninja | Sistema (automatizado) | Proyectos (supervisa) |
| Entrega a Operaciones | Operaciones | — |
