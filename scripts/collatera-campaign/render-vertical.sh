#!/usr/bin/env bash
# Render vertical cuts in order: scripts/collatera-campaign/render-vertical.sh V7 V6 ...
# Writes out/campaign/vertical/<v>.mp4 and <v>.done (ffprobe line) when each finishes.
set -uo pipefail
cd "$(dirname "$0")/../.."
B=$(ls -d /opt/pw-browsers/chromium_headless_shell-1243/*/chrome-headless-shell 2>/dev/null | head -1)
for v in "$@"; do
  id="Collatera${v}Vertical"
  [ "$v" = "V1" ] && id="CollateraIntroVertical"
  npx remotion render "$id" "out/campaign/vertical/$v.mp4" --crf=16 --concurrency=3 ${B:+--browser-executable=$B} > "out/campaign/vertical/$v.log" 2>&1
  ffprobe -v error -show_entries stream=width,height,r_frame_rate,nb_frames -of compact "out/campaign/vertical/$v.mp4" > "out/campaign/vertical/$v.done" 2>&1
done
