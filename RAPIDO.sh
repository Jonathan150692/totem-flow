#!/bin/bash
# Script rápido para publicar en GitHub + Vercel
# Uso: bash RAPIDO.sh

echo "🚀 TOTEM Flow — Publicación rápida"
echo "─────────────────────────────────────────────────────────────────"
echo ""
echo "Este script sube tu código a GitHub."
echo "Necesitas: Usuario GitHub (Jonathan150692) y tu token de acceso"
echo ""
echo "Paso 1: Crea el repo en GitHub"
echo "  → Ve a https://github.com/new"
echo "  → Nombre: totem-flow"
echo "  → Click Create"
echo ""
read -p "¿Ya creaste el repo en GitHub? (s/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
  echo "Primero crea el repo en GitHub, luego ejecuta este script."
  exit 1
fi

echo ""
echo "Paso 2: Conecta y sube a GitHub"
echo "─────────────────────────────────────────────────────────────────"
echo ""

read -p "Ingresa tu token de GitHub (https://github.com/settings/tokens): " TOKEN

if [ -z "$TOKEN" ]; then
  echo "❌ Token vacío. Abortado."
  exit 1
fi

git remote add origin https://Jonathan150692:${TOKEN}@github.com/Jonathan150692/totem-flow.git
git push -u origin main

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Código subido a GitHub exitosamente!"
  echo ""
  echo "Paso 3: Publicar en Vercel"
  echo "─────────────────────────────────────────────────────────────────"
  echo "1. Ve a https://vercel.com/sign-up"
  echo "2. Conecta con GitHub"
  echo "3. Importa 'totem-flow'"
  echo "4. Click Deploy"
  echo ""
  echo "En ~60 segundos estará en línea en:"
  echo "  https://totem-flow.vercel.app"
  echo ""
else
  echo "❌ Error al subir a GitHub. Verifica el token."
  exit 1
fi
