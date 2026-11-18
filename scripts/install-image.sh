#!/usr/bin/env bash
set -euo pipefail
SRC="$1"
SLUG="$2"
TMP="/tmp/ula-img-$SLUG"
mkdir -p "$TMP"
ffmpeg -y -i "$SRC" -vf "scale=800:-2" -q:v 2 "$TMP/small.png" >/dev/null 2>&1
ffmpeg -y -i "$SRC" -vf "scale=1600:-2" -q:v 2 "$TMP/med.png" >/dev/null 2>&1
ffmpeg -y -i "$SRC" -vf "scale=2400:-2" -q:v 2 "$TMP/large.png" >/dev/null 2>&1
cwebp -q 82 "$TMP/small.png" -o "public/images/${SLUG}-small.webp" >/dev/null 2>&1
cwebp -q 82 "$TMP/med.png" -o "public/images/${SLUG}.webp" >/dev/null 2>&1
cwebp -q 82 "$TMP/large.png" -o "public/images/${SLUG}-large.webp" >/dev/null 2>&1
avifenc --min 20 --max 32 -s 6 "$TMP/small.png" "public/images/${SLUG}-small.avif" >/dev/null 2>&1
avifenc --min 20 --max 32 -s 6 "$TMP/med.png" "public/images/${SLUG}.avif" >/dev/null 2>&1
avifenc --min 20 --max 32 -s 6 "$TMP/large.png" "public/images/${SLUG}-large.avif" >/dev/null 2>&1
rm -rf "$TMP"
echo "Installed $SLUG (WebP + AVIF 800/1600/2400w)"
