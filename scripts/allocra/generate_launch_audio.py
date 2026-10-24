#!/usr/bin/env python3
"""
Original dark hip-hop instrumental + sound design for AllocraLaunch (30 s).

Synthesised with numpy/scipy (no samples, no licensed tracks): 90 BPM, C minor,
808 sub bass, boom-bap kick/snare, swung hats, dark choir-like pad, vinyl
texture; impacts, sweeps, risers, UI clicks and typing placed from
src/compositions/Allocra/launch/launch.json.

    python3 scripts/allocra/generate_launch_audio.py

Writes public/allocra/launch/audio/mix.wav (48 kHz, 16-bit stereo).
"""
from __future__ import annotations

import json
import wave
from pathlib import Path

import numpy as np
from scipy.signal import lfilter

ROOT = Path(__file__).resolve().parents[2]
TL = json.loads((ROOT / "src/compositions/Allocra/launch/launch.json").read_text())
OUT = ROOT / "public/allocra/launch/audio"
SR = 48_000
N = int(round(TL["durationInFrames"] / TL["fps"] * SR))
DUR = N / SR
M = TL["music"]
BEAT = 60 / TL["bpm"]
BAR = 4 * BEAT
SWING = 0.12 * BEAT / 2
rng = np.random.default_rng(42)


def t_axis(s):
    return np.arange(int(s * SR)) / SR


def midi(n):
    return 440 * 2 ** ((n - 69) / 12)


def db(x):
    return 10 ** (x / 20)


def lp(x, fc):
    a = np.exp(-2 * np.pi * fc / SR)
    return lfilter([1 - a], [1, -a], x)


def hp(x, fc):
    return x - lp(x, fc)


def place(buf, sig, at, g=1.0, pan=0.0):
    if sig.ndim == 1:
        a = (pan + 1) * np.pi / 4
        sig = np.stack([sig * np.cos(a), sig * np.sin(a)], 1)
    s = int(round(at * SR))
    if s < 0:
        sig, s = sig[-s:], 0
    e = min(len(buf), s + len(sig))
    if e > s:
        buf[s:e] += sig[: e - s] * g


def saw(f, t):
    return 2 * ((f * t) % 1) - 1


# C minor: Cm9 | Abmaj7 | Fm9 | G7(b9)
PROG = [[48, 55, 58, 62, 63], [44, 51, 55, 58, 60], [41, 48, 51, 55, 56], [43, 50, 53, 56, 59]]
ROOTS = [36, 32, 29, 31]


def ci(t):
    return int(t // BAR) % 4


def choir(notes, sec):
    t = t_axis(sec)
    s = np.zeros_like(t)
    for n in notes:
        f = midi(n)
        for d in (0.993, 1.0, 1.007):
            vib = 1 + 0.003 * np.sin(2 * np.pi * 4.7 * t + rng.uniform(0, 6))
            s += saw(f * d * vib, t)
    env = np.minimum(1, t / 0.9) * np.clip((sec - t) / 0.9, 0, 1)
    return lp(lp(s, 900), 1400) * env / (3 * len(notes))


def kick():
    t = t_axis(0.45)
    body = np.sin(2 * np.pi * (45 * t + 110 / 24 * (1 - np.exp(-24 * t)))) * np.exp(-t * 6.5)
    click = hp(rng.standard_normal(len(t)), 3500) * np.exp(-t * 600) * 0.4
    return np.tanh(2.0 * body + click)


def snare():
    t = t_axis(0.35)
    noise = hp(lp(rng.standard_normal(len(t)), 7000), 1200) * np.exp(-t * 16)
    tone = np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30) * 0.5
    room = lp(rng.standard_normal(len(t)), 3000) * np.exp(-t * 6) * 0.15
    return (noise + tone + room) * 0.9


def hat(open_=False):
    t = t_axis(0.2 if open_ else 0.05)
    return hp(rng.standard_normal(len(t)), 8500) * np.exp(-t * (14 if open_ else 110))


def sub808(f, sec):
    t = t_axis(sec)
    glide = f * (1 + 0.5 * np.exp(-t * 30))
    s = np.sin(2 * np.pi * np.cumsum(glide) / SR)
    return np.tanh(1.6 * s) * np.exp(-t * 1.4) * np.minimum(1, t / 0.004)


def vinyl(sec):
    t = t_axis(sec)
    crackle = (rng.random(len(t)) > 0.9993) * rng.uniform(-1, 1, len(t))
    hiss = hp(lp(rng.standard_normal(len(t)), 6000), 2000) * 0.02
    return lp(crackle, 5000) * 0.5 + hiss


def music():
    buf = np.zeros((N, 2))
    drums, drop, brk, fin = M["drums"], M["drop"], M["break"], M["final"]
    t0 = 0.0
    while t0 < DUR:
        place(buf, choir(PROG[ci(t0)], BAR + 1.0), t0, 0.9 if t0 < drop else 0.7, -0.1)
        t0 += BAR
    place(buf, vinyl(DUR), 0, 0.6)
    k, sn = kick(), snare()
    for b in range(int(DUR / BEAT) + 1):
        at = b * BEAT
        if at >= fin or (brk <= at < fin):
            continue
        if at >= drums:
            if b % 4 in (0,) or (at >= drop and b % 8 == 6):
                place(buf, k, at, 0.85)
            if at >= drop and b % 4 == 2:
                place(buf, k, at + BEAT / 2, 0.55)
            if b % 4 in (1, 3):
                place(buf, sn, at, 0.6 if at >= drop else 0.45)
            for h in range(2):
                hat_at = at + h * BEAT / 2 + (SWING if h else 0)
                place(buf, hat(b % 8 == 7 and h == 1), hat_at, 0.13 if h else 0.09, 0.3)
        # 808 on the bar + syncopation after the drop
        if at >= drop and b % 4 == 0:
            place(buf, sub808(midi(ROOTS[ci(at)]), BAR * 0.95), at, 0.9)
        elif drums <= at < drop and b % 4 == 0:
            place(buf, sub808(midi(ROOTS[ci(at)]), BAR * 0.95), at, 0.55)
        if at >= drop and b % 4 == 2 and at + BEAT * 1.5 < brk:
            place(buf, sub808(midi(ROOTS[ci(at)] + 7), BEAT * 0.9), at + BEAT * 0.5, 0.6)
    # Intro sub swell under the signature reveal
    t = t_axis(3.3)
    place(buf, np.sin(2 * np.pi * midi(24) * t) * np.minimum(1, t / 1.0) * np.clip((3.3 - t) / 0.5, 0, 1), 0, 0.5)
    # Final chord rings out
    place(buf, choir([36, 48, 55, 58, 62, 67], DUR - fin), fin, 1.3)
    place(buf, sub808(midi(24), 3.5), fin, 0.9)
    fade = int(0.8 * SR)
    buf[-fade:] *= (0.5 * (1 + np.cos(np.linspace(0, np.pi, fade))))[:, None]
    return buf


def impact():
    t = t_axis(1.6)
    b = np.sin(2 * np.pi * (32 * t + 120 / 12 * (1 - np.exp(-12 * t)))) * np.exp(-t * 2.6)
    hit = lp(rng.standard_normal(len(t)), 2500) * np.exp(-t * 18)
    return np.tanh(1.8 * b + 0.5 * hit)


def sweep():
    L = 0.7
    t = t_axis(L)
    sh = np.where(t < L * 0.55, (t / (L * 0.55)) ** 2, ((L - t) / (L * 0.45)) ** 1.6)
    n = rng.standard_normal(len(t))
    s = hp((1 - sh) * lp(n, 600) + sh * lp(n, 7000), 250) * sh
    return s / (np.abs(s).max() + 1e-9) * 0.7


def riser(L):
    t = t_axis(L)
    sh = (t / L) ** 2.2
    n = rng.standard_normal(len(t))
    s = hp((1 - sh) * lp(n, 700) + sh * lp(n, 8000), 300)
    tone = np.sin(2 * np.pi * np.cumsum(120 + 900 * sh) / SR) * 0.25
    return (s / (np.abs(s).max() + 1e-9) + tone) * sh * 0.7


def click():
    t = t_axis(0.06)
    return np.sign(np.sin(2 * np.pi * 2300 * t)) * np.exp(-t * 230) * 0.3 + np.sin(2 * np.pi * 160 * t) * np.exp(-t * 60) * 0.6


def scratch():
    L = 0.35
    t = t_axis(L)
    f = 400 + 900 * np.abs(np.sin(2 * np.pi * 4 * t))
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.4 + hp(rng.standard_normal(len(t)), 1500) * 0.2
    return s * np.sin(np.pi * t / L)


def tick():
    t = t_axis(0.025)
    return (0.6 * hp(rng.standard_normal(len(t)), 3000) + 0.4 * np.sin(2 * np.pi * 2000 * t)) * np.exp(-t * 280)


def accent():
    t = t_axis(1.2)
    s = sum(a * np.sin(2 * np.pi * midi(n) * t) for n, a in ((72, 1.0), (79, 0.6), (84, 0.4)))
    return s * np.exp(-t * 3.5) * np.minimum(1, t / 0.003) / 2


def sfx():
    buf = np.zeros((N, 2))
    for fx in TL["sfx"]:
        at, g, k = fx["at"], fx["gain"], fx["type"]
        if k in ("ticks", "typing"):
            for i in range(fx["count"]):
                place(buf, tick(), at + i * fx["step"], g, rng.uniform(-0.3, 0.3))
        elif k == "riser":
            place(buf, riser(fx["length"]), at, g)
        else:
            place(buf, {"impact": impact, "sweep": sweep, "click": click, "scratch": scratch, "accent": accent}[k](), at, g)
    return buf


def write(p, x):
    pcm = (np.clip(x, -1, 1) * 32767).astype("<i2")
    with wave.open(str(p), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    m, x = music(), sfx()
    m *= db(-5) / (np.abs(m).max() + 1e-9)
    x *= db(-7) / (np.abs(x).max() + 1e-9)
    mix = m + x
    mix *= db(-1.5) / (np.abs(mix).max() + 1e-9)
    mix *= db(5)
    c, knee = db(-1.0), db(-6)
    a = np.abs(mix)
    o = a > knee
    mix[o] = np.sign(mix[o]) * (knee + (c - knee) * np.tanh((a[o] - knee) / (c - knee)))
    mix[-int(0.03 * SR):] = 0
    write(OUT / "mix.wav", mix)
    print("peak", round(20 * np.log10(np.abs(mix).max()), 2), "dBFS")


if __name__ == "__main__":
    main()
