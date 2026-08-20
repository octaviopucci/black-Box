#!/usr/bin/env bash
# Netlify preview deploy for apps/* — see SKILL.md
set -euo pipefail

SKILL_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPO_ROOT="$(cd "$SKILL_ROOT/../../../.." && pwd)"

APP_DIR=""
SLUG=""
MESSAGE="Preview deploy"
NO_BUILD=0
PUBLIC=0

usage() {
  cat <<'EOF'
Usage: deploy.sh <apps/project> [--slug name] [--message text] [--no-build] [--public]

Modes:
  default   Basic-Auth site:Site (interno)
  --public  Sem senha HTTP — exige NETLIFY_AUTH_TOKEN para URL fixa permanente
              Sem token: deploy anônimo + link de claim (única senha: My-Drop-Site)

Examples:
  deploy.sh apps/marcenaria-noe --public
  deploy.sh apps/dr-marcelo-prado --slug dr-marcelo-prado
EOF
}

slugify() {
  echo "$1" \
    | tr '[:upper:]' '[:lower:]' \
    | sed -E 's/[àáâãäå]/a/g; s/[èéêë]/e/g; s/[ìíîï]/i/g; s/[òóôõö]/o/g; s/[ùúûü]/u/g; s/[ç]/c/g; s/[ñ]/n/g' \
    | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g' \
    | cut -c1-37
}

resolve_slug_from_site_ts() {
  local site_ts="$1/src/data/site.ts"
  [[ -f "$site_ts" ]] || return 1

  local name handle
  name=$(grep -E "^\s*name:\s*['\"]" "$site_ts" | head -1 | sed -E "s/.*['\"]([^'\"]+)['\"].*/\1/" || true)
  handle=$(grep -E "^\s*handle:\s*['\"]" "$site_ts" | head -1 | sed -E "s/.*['\"]([^'\"]+)['\"].*/\1/" || true)

  if [[ -n "$handle" ]]; then
    slugify "$handle"
    return 0
  fi
  if [[ -n "$name" ]]; then
    slugify "$name"
    return 0
  fi
  return 1
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --slug) SLUG="$2"; shift 2 ;;
    --message) MESSAGE="$2"; shift 2 ;;
    --no-build) NO_BUILD=1; shift ;;
    --public) PUBLIC=1; shift ;;
    -h|--help) usage; exit 0 ;;
    *)
      if [[ -z "$APP_DIR" ]]; then
        APP_DIR="$1"
      else
        echo "Unknown argument: $1" >&2
        usage
        exit 1
      fi
      shift
      ;;
  esac
done

if [[ -z "$APP_DIR" ]]; then
  if [[ -f "package.json" && -d "src" ]]; then
    APP_DIR="."
  else
    echo "Error: informe o diretório do app (ex: apps/marcenaria-noe)" >&2
    usage
    exit 1
  fi
fi

if [[ "$APP_DIR" != /* ]]; then
  if [[ -d "$REPO_ROOT/$APP_DIR" ]]; then
    APP_DIR="$REPO_ROOT/$APP_DIR"
  elif [[ -d "$APP_DIR" ]]; then
    APP_DIR="$(cd "$APP_DIR" && pwd)"
  else
    echo "Error: diretório não encontrado: $APP_DIR" >&2
    exit 1
  fi
fi

APP_DIR="$(cd "$APP_DIR" && pwd)"
APP_BASENAME="$(basename "$APP_DIR")"

if [[ -z "$SLUG" ]]; then
  SLUG="$(resolve_slug_from_site_ts "$APP_DIR" 2>/dev/null || true)"
fi
if [[ -z "$SLUG" ]]; then
  SLUG="$(slugify "$APP_BASENAME")"
fi

echo "▸ App:    $APP_DIR"
echo "▸ Slug:   $SLUG"
if [[ "$PUBLIC" -eq 1 ]]; then
  echo "▸ Modo:   público (sem Basic-Auth)"
else
  echo "▸ Modo:   protegido (Basic-Auth site:Site)"
fi

# Ensure Netlify config files
if [[ ! -f "$APP_DIR/netlify.toml" ]]; then
  cp "$SKILL_ROOT/references/netlify.toml" "$APP_DIR/netlify.toml"
  echo "▸ Criado netlify.toml"
fi

mkdir -p "$APP_DIR/public"
if [[ ! -f "$APP_DIR/public/_redirects" ]]; then
  echo '/* /index.html 200' > "$APP_DIR/public/_redirects"
  echo "▸ Criado public/_redirects"
fi

if [[ "$PUBLIC" -eq 0 ]]; then
  cp "$SKILL_ROOT/references/_headers" "$APP_DIR/public/_headers"
  echo "▸ Atualizado public/_headers (Basic-Auth site:Site)"
else
  rm -f "$APP_DIR/public/_headers"
  echo "▸ Sem _headers (preview público)"
fi

# Build
cd "$APP_DIR"
if [[ "$NO_BUILD" -eq 0 ]]; then
  echo "▸ Build..."
  if [[ -f package-lock.json ]]; then
    npm ci
  else
    npm install
  fi
  VITE_BASE=/ npm run build
fi

if [[ ! -d dist ]]; then
  echo "Error: pasta dist/ não encontrada. Rode o build primeiro." >&2
  exit 1
fi

if [[ "$PUBLIC" -eq 1 ]]; then
  rm -f dist/_headers
fi

# Deploy
NETLIFY_VERSION="${NETLIFY_CLI_VERSION:-27.1.2}"
DEPLOY_ARGS=(deploy --dir=dist --message "$MESSAGE" --json)

if [[ -n "${NETLIFY_AUTH_TOKEN:-}" ]]; then
  echo "▸ Deploy autenticado → ${SLUG}.netlify.app (público, permanente)"
  DEPLOY_ARGS+=(--auth "$NETLIFY_AUTH_TOKEN" --site-name "$SLUG" --prod)
elif [[ "$PUBLIC" -eq 1 ]]; then
  echo "▸ Deploy anônimo público (sem Basic-Auth)"
  echo "  ⚠ Senha Netlify Drop: My-Drop-Site — claim em ~60 min remove a senha"
  DEPLOY_ARGS+=(--allow-anonymous)
else
  echo "▸ Deploy anônimo (sem NETLIFY_AUTH_TOKEN)"
  echo "  ⚠ Subdomínio aleatório; senha Netlify Drop: My-Drop-Site"
  echo "  ⚠ Após Drop, login HTTP Basic — usuário: site / senha: Site"
  DEPLOY_ARGS+=(--allow-anonymous)
fi

OUTPUT="$(npx --yes "netlify-cli@${NETLIFY_VERSION}" "${DEPLOY_ARGS[@]}" 2>&1)" || {
  echo "$OUTPUT" >&2
  exit 1
}

# Parse URL from JSON or human output
URL="$(echo "$OUTPUT" | grep -oE 'https://[a-z0-9-]+\.netlify\.app' | head -1 || true)"
if [[ -z "$URL" ]]; then
  URL="$(echo "$OUTPUT" | grep -oE 'http://[a-z0-9-]+\.netlify\.app' | head -1 || true)"
fi

CLAIM="$(echo "$OUTPUT" | grep -oE 'https://app\.netlify\.com/drop/[a-z0-9-]+[^[:space:]]*' | head -1 || true)"

echo ""
echo "════════════════════════════════════════"
echo "  Preview Netlify"
echo "════════════════════════════════════════"
if [[ -n "$URL" ]]; then
  echo "  URL:      $URL"
else
  echo "  URL:      (ver log acima)"
fi
if [[ -n "${NETLIFY_AUTH_TOKEN:-}" ]]; then
  echo "  Senha:    nenhuma (público)"
  echo "  URL fixa: https://${SLUG}.netlify.app"
elif [[ "$PUBLIC" -eq 1 ]]; then
  echo "  Senha:    My-Drop-Site (só até fazer claim)"
  echo "  Claim:    abra o link abaixo na Netlify → site fica público e permanente"
  [[ -n "$CLAIM" ]] && echo "            $CLAIM"
else
  echo "  Senha 1:  My-Drop-Site  (Netlify Drop — se pedir)"
  echo "  Senha 2:  Site          (HTTP Basic — usuário: site)"
  echo "  Expira:   ~60 min — claim em:"
  [[ -n "$CLAIM" ]] && echo "            $CLAIM"
fi
echo "════════════════════════════════════════"
