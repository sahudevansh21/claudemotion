#!/usr/bin/env python3
"""
Sound for the Lampzi 40 s website walkover: an original calm synth bed
(scripts/oryn/generate_audio.py, calm mode, public/lampzi/audio/bed.wav) plus the
user-supplied "SaaS SFX Pack [@MahdiEdits_]" files placed on every click, page change
and typing run from src/compositions/Lampzi/walk/sfx.json. Normalised to about -14 LUFS.

    python3 scripts/lampzi/walk_audio.py <dir with the pack decoded to 48 kHz wavs>
"""
import json, subprocess, sys
from pathlib import Path
import numpy as np, soundfile as sf

ROOT = Path(__file__).resolve().parents[2]
SRC = Path(sys.argv[1]); SR = 48000; FPS = 60; N = 40 * SR
FILES = {"riser": "1", "s2": "2", "s3": "3", "s4": "4", "click": "5", "s6": "6", "bleep": "8"}
bed, sr = sf.read(ROOT / "public/lampzi/audio/bed.wav"); assert sr == SR
mix = np.zeros((N, 2)); mix[: min(N, len(bed))] += bed[:N] * 0.9
cache = {}
def load(n):
    if n not in cache:
        x, s = sf.read(SRC / f"{FILES[n]}.wav"); x = x if x.ndim == 2 else np.stack([x, x], 1)
        cache[n] = x / max(1e-6, np.abs(x).max()) * 0.5
    return cache[n]
for e in json.loads((ROOT / "src/compositions/Lampzi/walk/sfx.json").read_text())["sfx"]:
    x = load(e["file"]); i = int(e["frame"] / FPS * SR); x = x[: max(0, N - i)]; mix[i:i + len(x)] += x * e["gain"]
mix = np.tanh(mix * 1.1 / max(np.abs(mix).max(), 1e-6) * 0.9)
tmp = ROOT / "public/lampzi/audio/_walk_raw.wav"; sf.write(tmp, mix, SR, subtype="PCM_24")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(tmp), "-af", "loudnorm=I=-14:TP=-1.5:LRA=7", "-ar", str(SR), "-ac", "2", "-c:a", "pcm_s16le", str(ROOT / "public/lampzi/audio/walk.wav")], check=True)
tmp.unlink(); print("wrote walk.wav")
