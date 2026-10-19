#!/usr/bin/env bash
# Tile chosen frames of a rendered MP4 into one image for visual QA.
#
#   scripts/tools/contact-sheet.sh out/draft.mp4 out/sheet.jpg 30 90 150 210 270
#
# Frame numbers are 0-based frames of the video. Pick one or two per scene,
# plus frames mid-transition. Look for: clipped text, overflow, missing
# fonts/images, wrong z-order, invisible elements, empty frames.
set -euo pipefail
V="$1"; OUT="$2"; shift 2
SEL=$(printf "+eq(n\\\\,%s)" "$@"); SEL="${SEL:1}"
N=$#; COLS=4; [ "$N" -le 4 ] && COLS=$N; ROWS=$(( (N + COLS - 1) / COLS ))
ffmpeg -v error -y -i "$V" -vf "select='$SEL',scale=480:-1,tile=${COLS}x${ROWS}" -frames:v 1 "$OUT"
echo "wrote $OUT ($N frames)"
