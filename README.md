# TOTEM Flow — Prototipo Visual

Plataforma de gestión automatizada de proyectos con checklist dinámico para TOTEM (seguridad electrónica, CCTV, control de acceso, Ecuador).

## Stack

- **Frontend**: Next.js 15 + React 19 + TypeScript + Tailwind CSS
- **Diseño**: Identidad TOTEM (Archivo font, Jordy Blue #88AFF9, Marian Blue #2B3D8D)
- **Hosting**: Vercel (gratuito, auto-deploy desde GitHub)
- **Base de datos**: Supabase (próxima fase)

## Instalación local

```bash
# Clonar repo
git clone https://github.com/[tu-usuario]/totem-flow.git
cd totem-flow

# Instalar dependencias
npm install

# Correr en desarrollo (http://localhost:3000)
npm run dev

# Build para producción
npm run build
npm start
```

## Funcionalidades del prototipo

### ✅ Implementado
- **Dashboard**: KPIs, distribución por fase, proyectos próximos a vencer, tabla resumen
- **Kanban**: 5 columnas de estado (Revisión → Checklist → Reunión → Fase Ninja → Entregado)
- **Detalle de proyecto**: Información general, SLA, soluciones, localidades
- **Checklist dinámico**: Secciones por solución (CCTV, Control de Acceso, etc.) con ítems Completado/Pendiente/No aplica
- **Identidad visual**: Aplicada completamente con paleta y tipografía TOTEM

### ⏳ Próxima fase (MVP real con backend)
- Autenticación y gestión de roles (8 roles definidos)
- Base de datos PostgreSQL vía Supabase
- Motor de SLA con escalamiento automático
- Integración con Microsoft 365 (Outlook, Teams, SharePoint)
- Preguntas/respuestas persistentes
- Generación de documentos Word/PDF
- Bitácora inmutable
- Reportes y analítica

## Publicar en Vercel

1. **Subir a GitHub** (si aún no está)
   ```bash
   git init
   git add .
   git commit -m "Initial commit: TOTEM Flow prototype"
   git branch -M main
   git remote add origin https://github.com/[tu-usuario]/totem-flow.git
   git push -u origin main
   ```

2. **Ir a [vercel.com](https://vercel.com)** e importar el repositorio
3. **Vercel auto-detecta** Next.js y despliega automáticamente
4. **Tu prototipo estará en línea** en ~60 segundos en una URL como `totem-flow.vercel.app`

## Compartir con colaboradores

Una vez publicado en Vercel, todos tus colaboradores pueden acceder con solo el link — sin necesidad de clonar, instalar o configurar nada.

## Estructura de archivos

```
totem-flow/
├── app/
│   ├── page.tsx           # Componente principal
│   ├── layout.tsx         # Layout raíz
│   └── globals.css        # Estilos globales
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

## Datos de ejemplo

El prototipo incluye 6 proyectos reales de TOTEM:
- Country Club Quito (CCTV + Monitoreo)
- CNT EP Matriz (VideoWall + Redes)
- Grupo Almar (Control de Acceso + Combustible)
- Promarisco (Detección de Incendio)
- SENAE Guayaquil (CCTV)

Todos con clientes, ejecutivos, SLA, soluciones y estados dinámicos.

## Próximos pasos

1. Publicar en Vercel
2. Recopilar feedback del equipo sobre diseño/UX
3. Definir punto de conexión a Supabase
4. Implementar autenticación con Supabase Auth
5. Conectar motor de checklist dinámico (reglas de negocio)
6. Integrar Microsoft 365 (Outlook, Teams, SharePoint)

## Documentación completa

Consulta los 20 documentos de especificación en `/docs/` del repo principal para:
- Requerimientos funcionales y técnicos
- Arquitectura y modelo de base de datos
- Flujo de procesos, reglas de negocio
- Plan de implementación y roadmap
- Matriz de roles y permisos

---

**Equipo**: Jonathan (jsaltos@totem.com.ec)  
**Última actualización**: Junio 2026
