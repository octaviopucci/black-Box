#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

export NEXT_PUBLIC_WHATSAPP_NUMBER="${NEXT_PUBLIC_WHATSAPP_NUMBER:-5515997499178}"

echo "▸ Build..."
npm run build

echo "▸ Preparar out/ para Netlify..."
cd out
rm -rf _not-found.html _not-found _not-found.txt __next.*.txt 2>/dev/null || true

SLUG="${NETLIFY_SITE_SLUG:-octavio-pucci-tattoo}"
NETLIFY_VERSION="${NETLIFY_CLI_VERSION:-27.1.2}"

if [[ -n "${NETLIFY_AUTH_TOKEN:-}" ]]; then
  echo "▸ Deploy autenticado → ${SLUG}.netlify.app"
  npx --yes "netlify-cli@${NETLIFY_VERSION}" deploy \
    --dir=. \
    --prod \
    --auth "$NETLIFY_AUTH_TOKEN" \
    --site-name "$SLUG" \
    --message "Octávio Pucci Tattoo"
else
  echo "▸ Deploy anônimo (sem NETLIFY_AUTH_TOKEN)"
  npx --yes "netlify-cli@${NETLIFY_VERSION}" deploy \
    --dir=. \
    --prod \
    --allow-anonymous \
    --message "Octávio Pucci Tattoo"
fi
