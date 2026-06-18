# 📍 TOTEM Flow — Guía de publicación (GitHub + Vercel)

## Paso 1: Preparar el código localmente

### Opción A: Si ya tienes Git instalado

```bash
# 1. Navega a la carpeta del proyecto
cd /ruta/a/totem-flow-public

# 2. Inicializa Git
git init
git add .
git commit -m "Initial commit: TOTEM Flow prototype visual"
git branch -M main
```

### Opción B: Si NO tienes Git instalado
- Descarga Git desde https://git-scm.com/
- Instálalo
- Luego sigue la Opción A

---

## Paso 2: Crear repositorio en GitHub

1. Ve a **https://github.com/new**
2. **Nombre del repositorio**: `totem-flow` (o el que prefieras)
3. **Descripción**: "Plataforma de gestión de proyectos con checklist dinámico para TOTEM"
4. **Privado o Público**: Elige Público (para que todos vean)
5. **No marques** "Initialize this repository with:"
6. **Click "Create repository"**

---

## Paso 3: Subir código a GitHub

En la terminal, después de que GitHub te muestre la URL del repo (ej: `https://github.com/[tu-usuario]/totem-flow.git`):

```bash
# Reemplaza [TU_USUARIO] con tu usuario de GitHub y [TU_REPO] con el nombre del repo
git remote add origin https://github.com/[TU_USUARIO]/totem-flow.git
git push -u origin main
```

Si te pide contraseña:
- En lugar de contraseña, **usa un token de acceso personal (PAT)**
- Crea uno aquí: https://github.com/settings/tokens (dale permisos `repo`)
- Cópialo y úsalo como contraseña

---

## Paso 4: Conectar Vercel

1. Ve a **https://vercel.com/sign-up**
2. **Registrate con GitHub** (la opción más rápida)
3. Autoriza que Vercel acceda a tus repos
4. Haz click en **"Import Project"**
5. Selecciona el repo `totem-flow`
6. Vercel auto-detecta que es Next.js — **no necesitas configurar nada**
7. Click **"Deploy"**

**Espera 60-90 segundos**... Tu app estará en línea en una URL como:
```
https://totem-flow.vercel.app
```

---

## Paso 5: Compartir con colaboradores

Comparte este link:
```
https://totem-flow.vercel.app
```

Todos los que lo hagan click pueden:
- Ver el dashboard en tiempo real
- Navegar el Kanban
- Explorar el checklist dinámico
- **Sin necesidad de instalar nada**

---

## Después de publicar

### Hacer cambios y actualizar

Cada vez que hagas cambios locales:

```bash
# Guarda los cambios
git add .
git commit -m "Descripción del cambio"
git push origin main
```

**Vercel automáticamente redeploya** en ~30 segundos. Tu equipo verá los cambios al refrescar.

### Agregar más colaboradores al repo

1. Ve a **github.com/[tu-usuario]/totem-flow**
2. Click **"Settings"** → **"Collaborators"**
3. Invita a tus colegas por email

---

## Troubleshooting

### "Error al hacer push a GitHub"
- ¿Usaste token en lugar de contraseña? 
- ¿Creaste el repo en GitHub antes de hacer push?

### "Vercel no encuentra el repo"
- Verifica que autorizaste a Vercel acceder a GitHub
- Ve a https://github.com/settings/applications y autoriza Vercel

### "El sitio no carga"
- Espera 5 minutos (Vercel tarda un poco en compilar)
- Refresca la página
- Si sigue sin cargar, ve a https://vercel.com/dashboard y checa los logs de build

---

## URLs útiles

| Cosa | URL |
|------|-----|
| Tu repo en GitHub | https://github.com/[tu-usuario]/totem-flow |
| Tu app en Vercel | https://totem-flow.vercel.app |
| Dashboard de Vercel | https://vercel.com/dashboard |
| Configurar dominio custom | https://vercel.com/docs/concepts/projects/domains |

---

## Próxima fase: Conectar Supabase

Una vez que el prototipo esté corriendo en Vercel y veas feedback del equipo, conectaremos Supabase para:
- Autenticación real (login/logout por rol)
- Base de datos PostgreSQL
- Motor de SLA y escalamiento
- Integración con Microsoft 365

Instrucciones para eso vendrán en el siguiente paso.

---

¿Preguntas? Contáctame.
