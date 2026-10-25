#!/usr/bin/env python3
"""
Original music + SFX for the ORYN film (30 s, 96 BPM, F minor, no samples, no
vocals). Synthesised with numpy/scipy and timed from
src/compositions/Oryn/timeline.json so sound can't drift from picture.

    python3 scripts/oryn/generate_audio.py [timeline-name] [output-name]   # defaults: timeline mix

Writes public/oryn/audio/mix.wav (48 kHz, 16-bit stereo).
"""
from __future__ import annotations

import json
import sys
import wave
from pathlib import Path

import numpy as np
from scipy.signal import butter, lfilter

ROOT = Path(__file__).resolve().parents[2]
TL_NAME = sys.argv[1] if len(sys.argv) > 1 else "timeline"
OUT_NAME = sys.argv[2] if len(sys.argv) > 2 else "mix"
TL = json.loads((ROOT / f"src/compositions/Oryn/{TL_NAME}.json").read_text())
OUT = ROOT / "public/oryn/audio"
OUT.mkdir(parents=True, exist_ok=True)
SR = 48_000
FPS = TL["fps"]
DUR = TL["durationInFrames"] / FPS
N = int(DUR * SR)
BPM = TL["bpm"]
BEAT = 60 / BPM
STEP = BEAT / 4
rng = np.random.default_rng(96)


def midi(n):
    return 440 * 2 ** ((n - 69) / 12)


def lp(x, fc, order=2):
    b, a = butter(order, min(fc, SR / 2 - 100) / (SR / 2), "low")
    return lfilter(b, a, x)


def hp(x, fc, order=2):
    b, a = butter(order, fc / (SR / 2), "high")
    return lfilter(b, a, x)


def env(n, a, d, curve=3.0):
    t = np.arange(n) / SR
    e = np.minimum(t / max(a, 1e-4), 1) * np.exp(-t * curve / max(d, 1e-3))
    return e


def put(buf, x, t, g=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N or i < 0:
        return
    x = x[: N - i]
    l = g * (1 - max(pan, 0)) ; r = g * (1 + min(pan, 0))
    buf[0, i:i + len(x)] += x * l
    buf[1, i:i + len(x)] += x * r


def saw(f, n, det=(0,)):
    t = np.arange(n) / SR
    y = np.zeros(n)
    for d in det:
        y += 2 * ((t * f * 2 ** (d / 1200)) % 1) - 1
    return y / len(det)


# ------------------------------- instruments -------------------------------
def kick():
    n = int(0.45 * SR); t = np.arange(n) / SR
    f = 42 + 110 * np.exp(-t * 28)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7)
    y += 0.4 * lp(rng.standard_normal(n), 3000) * np.exp(-t * 90)
    return np.tanh(y * 1.8)


def clap():
    n = int(0.3 * SR); y = np.zeros(n)
    for off in (0, 0.011, 0.022):
        i = int(off * SR); m = n - i
        y[i:] += hp(rng.standard_normal(m), 900) * np.exp(-np.arange(m) / SR * 40)
    return lp(y, 7000) * 0.7


def hat(open_=False):
    n = int((0.25 if open_ else 0.05) * SR)
    return hp(rng.standard_normal(n), 7500) * np.exp(-np.arange(n) / SR * (14 if open_ else 90)) * 0.35


def b808(f, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    fr = f * (1 + 1.2 * np.exp(-t * 40))
    y = np.sin(2 * np.pi * np.cumsum(fr) / SR)
    y = np.tanh(y * 2.2) * np.minimum(t / 0.004, 1) * np.exp(-t * 1.6) * np.minimum((dur - t) / 0.06, 1)
    return y


def bell(f, dur=1.4):
    n = int(dur * SR); t = np.arange(n) / SR
    y = sum(a * np.sin(2 * np.pi * f * m * t) * np.exp(-t * d) for m, a, d in [(1, 1, 2.2), (2.01, 0.5, 3.5), (3.99, 0.3, 6), (5.4, 0.15, 9)])
    return y * np.minimum(t / 0.002, 1) * 0.5


def pad(freqs, dur):
    n = int(dur * SR); y = np.zeros(n)
    for f in freqs:
        y += saw(f, n, (-9, 0, 8))
    y = lp(y, 1500)
    t = np.arange(n) / SR
    return y * np.minimum(t / 0.5, 1) * np.minimum((dur - t) / 0.6, 1) * 0.12


# ---------------------------------- SFX ------------------------------------
def sfx(kind):
    if kind == "impact":
        n = int(1.4 * SR); t = np.arange(n) / SR
        y = np.sin(2 * np.pi * np.cumsum(32 + 90 * np.exp(-t * 12)) / SR) * np.exp(-t * 3.2)
        y += lp(rng.standard_normal(n), 1800) * np.exp(-t * 14) * 0.6
        return np.tanh(y * 1.6)
    if kind == "thud":
        n = int(0.5 * SR); t = np.arange(n) / SR
        return np.sin(2 * np.pi * np.cumsum(55 + 60 * np.exp(-t * 30)) / SR) * np.exp(-t * 8)
    if kind == "whoosh":
        n = int(0.9 * SR); t = np.arange(n) / SR
        x = rng.standard_normal(n)
        y = lp(x, 500) * (1 - t / 0.9) + hp(lp(x, 6000), 1200) * np.sin(np.pi * t / 0.9) ** 2
        return y * np.sin(np.pi * np.clip(t / 0.9, 0, 1)) ** 1.5 * 0.9
    if kind == "pop":
        n = int(0.18 * SR); t = np.arange(n) / SR
        return np.sin(2 * np.pi * np.cumsum(900 * np.exp(-t * 14) + 180) / SR) * np.exp(-t * 26)
    if kind == "tick":
        n = int(0.06 * SR); t = np.arange(n) / SR
        return (np.sin(2 * np.pi * 2400 * t) + 0.5 * hp(rng.standard_normal(n), 3000)) * np.exp(-t * 90) * 0.5
    if kind == "riser":
        n = int(2.0 * SR); t = np.arange(n) / SR
        x = hp(rng.standard_normal(n), 400)
        sweep = np.sin(2 * np.pi * np.cumsum(200 + 1800 * (t / 2) ** 2) / SR)
        return (0.5 * x + 0.5 * sweep) * (t / 2) ** 2 * 0.7
    if kind == "chime":
        return bell(midi(84), 1.6) + 0.6 * bell(midi(91), 1.6)
    raise ValueError(kind)


# ----------------------------------- music ----------------------------------
music = np.zeros((2, N))
CH = [(53, [53, 56, 60]), (49, [49, 53, 56]), (44, [44, 48, 51]), (51, [51, 55, 58])]  # Fm, Db, Ab, Eb  (root, triad)
BAR = BEAT * 4
n_bars = int(DUR / BAR)
K, C_, H, O = kick(), clap(), hat(), hat(True)
KICK_STEPS = [0, 6, 10]
for bar in range(n_bars):
    t0 = bar * BAR
    root, tri = CH[bar % 4]
    full = t0 >= 5.0
    mid = t0 >= 2.5
    last = bar == n_bars - 1
    # pad + arp keys
    pn = [midi(n + 12) for n in tri] + [midi(tri[0] + 24)]
    put(music, pad(pn, BAR + 0.3), t0, 1.0, 0.0)
    for s in range(8):
        if not mid and s % 2: continue
        note = tri[(s * 2 + (bar % 3)) % 3] + 24 + (12 if s % 4 == 3 else 0)
        put(music, bell(midi(note), 1.0), t0 + s * BEAT / 2, 0.55, -0.3 if s % 2 else 0.3)
    if mid:
        for s in range(16):
            g = 0.55 + 0.25 * (s % 4 == 0)
            if bar % 4 == 3 and s >= 12: g = 0.5            # roll into next phrase
            put(music, H, t0 + s * STEP, g * (0.7 if not full else 1), 0.15)
            if bar % 4 == 3 and s in (13, 15): put(music, H, t0 + s * STEP + STEP / 2, 0.45, -0.15)
        put(music, O, t0 + 14 * STEP, 0.6)
    if full or (mid and bar % 2 == 0):
        for s in KICK_STEPS:
            put(music, K, t0 + s * STEP, 1.0 if full else 0.7)
    if full and not last:
        put(music, C_, t0 + 4 * STEP, 0.8); put(music, C_, t0 + 12 * STEP, 0.8)
        put(music, b808(midi(root - 12), BEAT * 1.4), t0, 0.95)
        put(music, b808(midi(root - 12), BEAT * 0.9), t0 + 6 * STEP, 0.8)
        put(music, b808(midi(root - 12 + (7 if bar % 2 else 3)), BEAT * 0.7), t0 + 10 * STEP, 0.7)
# resolving final hit
put(music, b808(midi(29), 2.2), (n_bars - 1) * BAR, 1.0)
put(music, pad([midi(65), midi(68), midi(72), midi(77)], 2.4), (n_bars - 1) * BAR, 1.4)

# ------------------------------------ sfx ------------------------------------
fx = np.zeros((2, N))
duck = np.ones(N)
for sc in TL["scenes"]:
    for e in sc["sfx"]:
        t = (sc["start"] + e["cue"]) / FPS
        put(fx, sfx(e["type"]), t, e["gain"], 0.0)
        if e["type"] in ("impact", "thud"):                     # duck music under big hits
            i = int(t * SR); L = int(0.55 * SR)
            c = 1 - 0.55 * np.exp(-np.arange(min(L, N - i)) / SR * 5)
            duck[i:i + len(c)] = np.minimum(duck[i:i + len(c)], c)

mix = music * duck * 0.75 + fx * 0.85
# glue + limiter
mix = np.tanh(mix * 1.15) / np.tanh(1.15)
pk = np.max(np.abs(mix)); mix *= 0.58 / pk   # ~ -13 LUFS social-film target
# fade to exact zero
fade = int(1.2 * SR); mix[:, -fade:] *= np.linspace(1, 0, fade); mix[:, :96] *= np.linspace(0, 1, 96)

pcm = (np.clip(mix, -1, 1).T * 32767).astype("<i2")
with wave.open(str(OUT / f"{OUT_NAME}.wav"), "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print("wrote", OUT / f"{OUT_NAME}.wav", f"{DUR:.2f}s")
