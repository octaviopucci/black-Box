#!/usr/bin/env bash
# Instala o plugin Vercel no Cursor (escopo projeto) e verifica o CLI.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "→ Instalando vercel-plugin (Cursor, escopo projeto)..."
npx plugins add vercel/vercel-plugin --target cursor --scope project -y

echo ""
echo "→ Verificando Vercel CLI..."
npx vercel --version

if npx vercel whoami >/dev/null 2>&1; then
  echo "✓ Vercel CLI autenticado: $(npx vercel whoami 2>/dev/null || true)"
else
  echo ""
  echo "⚠ Login pendente. No seu Mac, rode:"
  echo "   npx vercel login"
  echo "   cd projects/iphone-imports && npx vercel link"
  echo ""
  echo "Ou no chat do Cursor: /add-plugin vercel"
fi

echo ""
echo "✓ Plugin instalado. Reinicie o Cursor para carregar as skills do Vercel."
