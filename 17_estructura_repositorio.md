# 17 — Estructura Inicial del Repositorio GitHub

**Proyecto:** TOTEM Flow
**Versión:** 1.0

Nota: el brief original sugiere una estructura `/frontend`, `/backend`, `/database`, `/docs`, `/scripts`, `/config`, `/tests`, pensada para un backend separado. Dado que el stack final (Documento 11) es Next.js full-stack monolítico, la estructura se adapta al patrón estándar de un proyecto Next.js moderno, conservando la misma intención organizativa.

---

## 1. Estructura de carpetas

```
totem-flow/
├── .github/
│   └── workflows/
│       ├── ci.yml                # Lint + type-check + pruebas en cada PR
│       └── deploy.yml             # Despliegue a Vercel (gestionado también por integración nativa Vercel↔GitHub)
├── app/                            # Next.js App Router
│   ├── (auth)/
│   │   └── login/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── proyectos/
│   │   │   ├── [id]/
│   │   │   │   ├── checklist/
│   │   │   │   ├── preguntas/
│   │   │   │   ├── reunion/
│   │   │   │   ├── documentos/
│   │   │   │   └── bitacora/
│   │   │   └── crear/
│   │   ├── reportes/
│   │   └── configuracion/
│   ├── api/                        # Route Handlers (si se requieren endpoints REST además de Server Actions)
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                         # Componentes shadcn/ui
│   ├── checklist/
│   ├── dashboard/
│   ├── proyectos/
│   └── shared/
├── lib/
│   ├── db/
│   │   ├── schema.ts                # Esquema Drizzle (ver Documento 04)
│   │   ├── client.ts
│   │   └── queries/                 # Consultas reutilizables por dominio
│   ├── engines/
│   │   ├── checklist-engine.ts       # Motor de checklist dinámico
│   │   ├── sla-engine.ts             # Motor de SLA y escalamiento
│   │   └── status-engine.ts          # Motor de transición de estados
│   ├── integrations/
│   │   ├── graph-api.ts              # Microsoft Graph API (Fase 2)
│   │   └── email.ts
│   ├── documents/
│   │   ├── generate-word.ts
│   │   ├── generate-pdf.ts
│   │   └── generate-excel.ts
│   ├── validations/                  # Esquemas Zod compartidos
│   └── auth/
├── drizzle/
│   ├── migrations/
│   └── seed/                         # Datos semilla (Documento 13, sección 4)
├── docs/                              # Este conjunto de 20 documentos
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/                           # Playwright
├── public/
├── .env.example
├── drizzle.config.ts
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## 2. Convenciones de branching

| Rama | Propósito |
|---|---|
| `main` | Producción. Solo recibe merges vía Pull Request aprobado, despliega automáticamente a Vercel producción. |
| `develop` | Integración continua de features completas, despliega al ambiente de staging. |
| `feature/<nombre-corto>` | Una rama por funcionalidad o tarea (ej. `feature/motor-checklist`, `feature/dashboard-indicadores`). Se crea desde `develop` y se fusiona de vuelta a `develop` vía PR. |
| `fix/<nombre-corto>` | Correcciones puntuales. |
| `hotfix/<nombre-corto>` | Correcciones urgentes directamente sobre `main`, luego replicadas a `develop`. |

## 3. Convención de commits

Se recomienda Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`) para mantener un historial legible y facilitar la generación automática de changelogs si se desea en el futuro.

## 4. GitHub Actions — `ci.yml` (descripción funcional)

Se ejecuta en cada Pull Request hacia `develop` o `main`:
1. Instalación de dependencias (`npm ci`).
2. Linter (`eslint`).
3. Verificación de tipos (`tsc --noEmit`).
4. Pruebas unitarias e integración (`vitest run`).
5. Build de producción (`next build`) para detectar errores de compilación antes de fusionar.

## 5. GitHub Actions — `deploy.yml` (descripción funcional)

En la práctica, Vercel ofrece integración nativa con GitHub que despliega automáticamente cada push (Preview Deployments para PRs, producción para `main`) sin necesidad de un workflow manual adicional. Este archivo queda como referencia opcional únicamente si se requiere un paso adicional no soportado nativamente (ej. ejecutar migraciones de base de datos antes del despliegue).

## 6. Protección de ramas recomendada

- `main`: requiere Pull Request con al menos 1 aprobación, requiere que `ci.yml` pase, prohíbe push directo.
- `develop`: requiere que `ci.yml` pase, push directo permitido solo para mantenimiento menor (ajustable según el tamaño del equipo).

## 7. README.md — contenido mínimo esperado

- Descripción breve del proyecto y su propósito.
- Instrucciones de instalación local (`npm install`, variables de entorno necesarias según `.env.example`).
- Comandos disponibles (`dev`, `build`, `test`, `db:migrate`, `db:seed`).
- Enlace a la carpeta `/docs` como fuente de verdad funcional y técnica.
