#!/usr/bin/env bash
# Vercel ignoreCommand: exit 0 = skip build, exit 1 = proceed
# https://vercel.com/docs/project-configuration/vercel-json#ignorecommand
set -euo pipefail

if git rev-parse HEAD^ >/dev/null 2>&1; then
  CHANGED="$(git diff --name-only HEAD^ HEAD)"
else
  # First commit or shallow clone — build to be safe
  exit 1
fi

if [ -z "$CHANGED" ]; then
  exit 1
fi

# These paths affect the unified Vercel deploy (public/ + serverless api)
BUILD_PATTERNS=(
  '^apps/'
  '^portal/'
  '^api/'
  '^public/'
  '^scripts/assemble-dist\.mjs$'
  '^scripts/bundle-pix-api\.mjs$'
  '^package\.json$'
  '^package-lock\.json$'
  '^projects/'
  '^scripts/assemble-estudio-clow-only\.mjs$'
)

needs_build=0
while IFS= read -r file; do
  [ -z "$file" ] && continue
  for pattern in "${BUILD_PATTERNS[@]}"; do
    if [[ "$file" =~ $pattern ]]; then
      needs_build=1
      echo "Vercel build required: $file"
      break
    fi
  done
done <<< "$CHANGED"

if [ "$needs_build" -eq 1 ]; then
  exit 1
fi

echo "Skipping Vercel build — no deploy-affecting files changed:"
echo "$CHANGED"
exit 0
