#!/usr/bin/env bash
# Print what a delivered MP4 actually is, to compare against the brief.
#   scripts/tools/verify-render.sh deliverables/x.mp4
set -euo pipefail
ffprobe -v error -show_entries format=duration,size:stream=codec_type,codec_name,width,height,r_frame_rate,nb_frames -of compact "$1"
if ffprobe -v error -select_streams a -show_entries stream=codec_type -of csv=p=0 "$1" | grep -q audio; then
  ffmpeg -i "$1" -af volumedetect -f null - 2>&1 | grep -E "mean_volume|max_volume"
fi
