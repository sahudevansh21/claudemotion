#!/usr/bin/env bash
# Render one campaign film at 1080p60: scripts/collatera-campaign/render.sh CollateraV2 v2
set -euo pipefail
cd "$(dirname "$0")/../.."
B=$(ls -d /opt/pw-browsers/chromium_headless_shell-1243/*/chrome-headless-shell 2>/dev/null | head -1)
npx remotion render "$1" "out/campaign/$2.mp4" --crf=16 --concurrency=3 ${B:+--browser-executable=$B} > "out/campaign/$2.log" 2>&1
ffprobe -v error -show_entries stream=width,height,r_frame_rate,nb_frames,duration -of compact "out/campaign/$2.mp4"
