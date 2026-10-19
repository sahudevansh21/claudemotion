#!/usr/bin/env bash
# Break a reference video down into what an agent needs to copy its rhythm:
# format, timestamped frame sheets (4 per second), hard-cut times and an
# audio tempo/onset estimate.
#
#   scripts/tools/analyze-reference.sh path/to/reference.mp4 [out_dir]
#
# Then open out_dir/sheet-*.jpg (5x6 tiles, each stamped with its time) and
# write down every cut time and what moves in each shot.
set -euo pipefail
V="$1"
OUT="${2:-out/reference}"
mkdir -p "$OUT"
FONT=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf

echo "== format"
ffprobe -v error -show_entries format=duration:stream=codec_type,width,height,r_frame_rate,nb_frames -of compact "$V"

echo "== frame sheets (4 fps, timestamped) -> $OUT/sheet-NN.jpg"
ffmpeg -v error -y -i "$V" -vf "fps=4,scale=416:-1,drawtext=fontfile=$FONT:text='%{pts\:hms}':x=6:y=6:fontsize=20:fontcolor=yellow:box=1:boxcolor=black,tile=5x6" "$OUT/sheet-%02d.jpg"

echo "== hard cuts (scene change > 0.3)"
ffmpeg -v error -i "$V" -vf "select='gt(scene,0.3)',showinfo" -f null - 2>&1 | grep -o "pts_time:[0-9.]*" | sed 's/pts_time://' | tr '\n' ' '; echo

echo "== audio onsets + tempo"
if ffprobe -v error -select_streams a -show_entries stream=codec_type -of csv=p=0 "$V" | grep -q audio; then
  ffmpeg -v error -y -i "$V" -ac 1 -ar 22050 -f f32le "$OUT/audio.raw"
  python3 - "$OUT/audio.raw" <<'PY'
import sys, numpy as np
x = np.fromfile(sys.argv[1], dtype=np.float32); sr = 22050; hop = 441
S = np.array([np.abs(np.fft.rfft(x[i*hop:i*hop+1024] * np.hanning(1024))) for i in range(len(x)//hop - 3)])
flux = np.maximum(0, np.diff(S, axis=0)).sum(1); flux /= flux.max() + 1e-9
peaks = [i for i in range(1, len(flux)-1) if flux[i] > 0.25 and flux[i] >= flux[i-1] and flux[i] >= flux[i+1]]
print("onsets (s):", [round((p+1)*hop/sr, 2) for p in peaks][:120])
ac = np.correlate(flux - flux.mean(), flux - flux.mean(), "full")[len(flux)-1:]
lags = np.arange(len(ac)) * hop / sr; r = (lags > 0.25) & (lags < 1.2)
best = lags[r][np.argmax(ac[r])]
print(f"strongest period: {best:.3f}s  (~{60/best:.0f} BPM, or {120/best:.0f} if that is a half-beat)")
PY
else
  echo "no audio stream"
fi
