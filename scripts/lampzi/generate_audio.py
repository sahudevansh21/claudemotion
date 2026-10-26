#!/usr/bin/env python3
"""
Sound design for the Lampzi film (15 s, 60 fps). Uses ONLY the user-supplied
"SaaS SFX Pack [@MahdiEdits_]" files, placed from src/compositions/Lampzi/timeline.json
so picture and sound can't drift.

    python3 scripts/lampzi/generate_audio.py <dir with the pack's files decoded as 48 kHz wavs: 1.wav 2.wav 3.wav 4.wav 5.wav 6.wav 8.wav gears12.wav>

Writes public/lampzi/audio/mix.wav (48 kHz stereo, normalised to about -14 LUFS).
"""
import json, subprocess, sys, wave
from pathlib import Path
import numpy as np, soundfile as sf

ROOT = Path(__file__).resolve().parents[2]
TL = json.loads((ROOT / "src/compositions/Lampzi/timeline.json").read_text())
SRC = Path(sys.argv[1])
SR = 48000
N = int(TL["durationInFrames"] / TL["fps"] * SR)
FILES = {"riser": "1", "s2": "2", "s3": "3", "s4": "4", "click": "5", "s6": "6", "bleep": "8"}
cache = {}
def load(name):
    if name not in cache:
        x, sr = sf.read(SRC / f"{FILES[name]}.wav"); assert sr == SR
        if x.ndim == 1: x = np.stack([x, x], 1)
        cache[name] = x / max(1e-6, np.abs(x).max()) * 0.5      # every pack sound normalised to -6 dBFS peak
    return cache[name]

mix = np.zeros((N, 2))
def put(x, t, g):
    i = int(t * SR); x = x[: max(0, N - i)]
    mix[i:i + len(x)] += x * g
for e in TL["sfx"]:
    put(load(e["file"]), e["frame"] / TL["fps"], e["gain"])
# gears texture under the wall-of-work and zoom (frames 474-600), from the pack's long Gears file
g, sr = sf.read(SRC / "gears12.wav"); g = g / max(1e-6, np.abs(g).max()) * 0.5
seg = g[: int(2.1 * SR)].copy(); fade = int(0.35 * SR)
seg[:fade] *= np.linspace(0, 1, fade)[:, None]; seg[-fade:] *= np.linspace(1, 0, fade)[:, None]
put(seg, 474 / TL["fps"], 0.55)

peak = np.abs(mix).max(); mix = np.tanh(mix * 1.1 / max(peak, 1e-6) * 0.9)
tmp = ROOT / "public/lampzi/audio/_raw.wav"; tmp.parent.mkdir(parents=True, exist_ok=True)
sf.write(tmp, mix, SR, subtype="PCM_24")
out = ROOT / "public/lampzi/audio/mix.wav"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(tmp), "-af", "loudnorm=I=-14:TP=-1.5:LRA=7", "-ar", str(SR), "-ac", "2", "-c:a", "pcm_s16le", str(out)], check=True)
tmp.unlink()
print("wrote", out)
