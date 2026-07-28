#!/usr/bin/env bash
# Rode isto na SUA máquina (com login GitHub), a partir de qualquer pasta.
set -euo pipefail

REPO_SRC="${REPO_SRC:-https://github.com/octaviopucci/cb-aqui.git}"
BRANCH="${BRANCH:-cursor/maciel-motors-gestor-a08c}"
DEST="${DEST:-https://github.com/octaviopucci/black-Box.git}"
TMP="$(mktemp -d)"

echo "→ Clonando black-box a partir de $REPO_SRC ($BRANCH)"
git clone --depth 1 --branch "$BRANCH" --filter=blob:none --sparse "$REPO_SRC" "$TMP/cb"
cd "$TMP/cb"
git sparse-checkout set black-box
cd black-box

echo "→ Inicializando repo e enviando para $DEST"
rm -rf .git
git init -b main
git add .
git commit -m "feat: Black Box — portal + Maciel Motors Gestor"
git remote add origin "$DEST"
git push -u origin main

echo ""
echo "OK. Agora na Vercel:"
echo "  1. https://vercel.com/new → Import black-Box"
echo "  2. Project Name: Black Box"
echo "  3. Build: npm run build · Output: dist"
echo "  4. Portal / · Maciel /maciel-motors/ · login admin / MacielMotors123"
