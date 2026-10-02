#!/usr/bin/env bash
# Scaffold Premium landing from agency-site kit
# Usage: bash .cursor/skills/frontend/agency-site/scripts/scaffold-premium.sh <slug>

set -euo pipefail

SLUG="${1:?Usage: scaffold-premium.sh <slug>}"
REPO_ROOT="$(cd "$(dirname "$0")/../../../../.." && pwd)"
KIT="$REPO_ROOT/.cursor/skills/frontend/agency-site/references/premium-kit"
TARGET="$REPO_ROOT/projects/$SLUG"

if [[ ! -d "$KIT" ]]; then
  echo "Kit not found: $KIT"
  exit 1
fi

if [[ -d "$TARGET" ]]; then
  echo "Project exists: $TARGET — syncing kit files only"
else
  echo "Creating Next.js app at $TARGET ..."
  npx create-next-app@latest "$TARGET" \
    --typescript \
    --tailwind \
    --eslint \
    --app \
    --src-dir \
    --import-alias "@/*" \
    --turbopack \
    --yes \
    --no-git
fi

cd "$TARGET"

echo "Installing dependencies ..."
npm install framer-motion gsap lenis

echo "Copying premium kit ..."
mkdir -p src/lib src/components/providers src/components/sections

cp "$KIT/site.config.ts" src/site.config.ts
cp "$KIT/src/lib/prefers-reduced-motion.ts" src/lib/prefers-reduced-motion.ts
cp "$KIT/src/components/providers/smooth-scroll.tsx" src/components/providers/smooth-scroll.tsx
cp "$KIT/src/components/sections/"*.tsx src/components/sections/
cp "$KIT/src/app/layout.tsx" src/app/layout.tsx
cp "$KIT/src/app/page.tsx" src/app/page.tsx
cp "$KIT/README.md" README.md

# Replace globals.css with tailwind v4 compatible premium styles
if grep -q '@import "tailwindcss"' src/app/globals.css 2>/dev/null; then
  # Next 15+ tailwind v4 — append premium block after tailwind import
  {
    head -n 1 src/app/globals.css
    echo ""
    tail -n +2 "$KIT/globals.premium.css"
  } > src/app/globals.css.tmp && mv src/app/globals.css.tmp src/app/globals.css
else
  cp "$KIT/globals.premium.css" src/app/globals.css
fi

echo "Building ..."
npm run build

echo ""
echo "✓ Premium landing ready: projects/$SLUG"
echo "  Edit src/site.config.ts then: cd projects/$SLUG && npm run dev"
