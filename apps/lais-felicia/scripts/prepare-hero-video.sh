#!/usr/bin/env bash
# Converte MP4 com áudio em hero-scrub.mp4 mudo para scroll scrub.
# Uso: ./scripts/prepare-hero-video.sh caminho/do/video.mp4

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PUBLIC="$ROOT/public"
INPUT="${1:?Informe o caminho do MP4 de origem}"

ffmpeg -y -i "$INPUT" \
  -an \
  -c:v libx264 \
  -preset medium \
  -crf 22 \
  -movflags +faststart \
  -pix_fmt yuv420p \
  "$PUBLIC/hero-scrub.mp4"

ffmpeg -y -i "$PUBLIC/hero-scrub.mp4" \
  -frames:v 1 \
  -update 1 \
  "$PUBLIC/hero-scrub-poster.jpg"

echo "OK: $PUBLIC/hero-scrub.mp4 (sem áudio) + hero-scrub-poster.jpg"
