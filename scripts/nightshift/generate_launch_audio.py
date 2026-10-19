#!/usr/bin/env python3
"""
Music bed + UI sound design for NightshiftLaunch, ducked under the voiceover.

Reads src/compositions/Nightshift/launch/launch.json (scenes, sfx) and
launch/vo.json + public/nightshift/launch-vo/*.wav (to duck the bed under the
voice). Writes public/nightshift/launch-audio/bed.wav (music + SFX, used by the
film; the VO plays from its own files) and mix.wav (bed + VO, for checking).

    python3 scripts/nightshift/generate_launch_audio.py
"""
from __future__ import annotations

import json
import wave
from pathlib import Path

import numpy as np
import soundfile as sf
from scipy.signal import lfilter

ROOT = Path(__file__).resolve().parents[2]
BASE = ROOT / "src/compositions/Nightshift/launch"
TL = json.loads((BASE / "launch.json").read_text())
VO = json.loads((BASE / "vo.json").read_text())
OUT = ROOT / "public/nightshift/launch-audio"
SR = 48_000
N = int(round(TL["durationInFrames"] / TL["fps"] * SR))
DUR = N / SR
SC = {s["id"]: (s["from"], s["to"]) for s in TL["scenes"]}
rng = np.random.default_rng(21)
BPM = 120
BEAT = 60 / BPM


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
    e = min(len(buf), s + len(sig))
    if e > s and s >= 0:
        buf[s:e] += sig[: e - s] * g


def saw(f, t):
    return 2 * ((f * t) % 1) - 1


# A minor-ish modern progression: Fmaj7 | Am7 | G6 | Em7 — 2 s per chord.
PROG = [[53, 57, 60, 64], [57, 60, 64, 67], [55, 59, 62, 64], [52, 55, 59, 62]]
BAR = 4 * BEAT


def chord(t):
    return PROG[int(t // BAR) % 4]


def pad(notes, sec):
    t = t_axis(sec)
    s = sum(saw(midi(n) * d, t) for n in notes for d in (0.996, 1.004))
    env = np.minimum(1, t / 0.8) * np.clip((sec - t) / 0.8, 0, 1)
    return lp(s, 1500) * env / (2 * len(notes))


def pluck(f, sec=0.4):
    t = t_axis(sec)
    s = saw(f, t) + 0.5 * saw(f * 2.0, t)
    bright = np.exp(-t * 14)
    s = lp(s, 4500) * bright + lp(s, 1100) * (1 - bright)
    return s * np.exp(-t * 8) * np.minimum(1, t / 0.002) / 1.5


def kick():
    t = t_axis(0.3)
    return np.tanh(1.6 * np.sin(2 * np.pi * (48 * t + 90 / 28 * (1 - np.exp(-28 * t)))) * np.exp(-t * 9))


def hat():
    t = t_axis(0.04)
    return hp(rng.standard_normal(len(t)), 8000) * np.exp(-t * 120)


def music():
    buf = np.zeros((N, 2))
    light0 = SC["cards"][0]
    meet0, end0 = SC["meet"][0], SC["end"][0]
    t0 = 0.0
    while t0 < DUR:
        place(buf, pad(chord(t0), BAR + 0.8), t0, 0.5 if t0 < light0 else 0.8, -0.1)
        t0 += BAR
    step = BEAT / 2
    for i in range(int(DUR / step)):
        at = i * step
        if at < light0 - 0.2 or at > DUR - 1.2:
            continue
        n = chord(at)[[0, 2, 1, 3, 2, 1, 3, 2][i % 8]] + 12
        place(buf, pluck(midi(n)), at, 0.18 if at < meet0 else 0.22, 0.3 if i % 2 else -0.3)
    for b in range(int(DUR / BEAT)):
        at = b * BEAT
        groove = (light0 <= at < SC["layer"][1]) or (SC["screens"][0] <= at < end0)
        if groove:
            if b % 2 == 0:
                place(buf, kick(), at, 0.45)
            place(buf, hat(), at + BEAT / 2, 0.09, 0.3)
    fade = int(1.5 * SR)
    buf[-fade:] *= (0.5 * (1 + np.cos(np.linspace(0, np.pi, fade))))[:, None]
    return buf


def whoosh(L=0.55):
    t = t_axis(L)
    sh = np.where(t < L * 0.6, (t / (L * 0.6)) ** 2, ((L - t) / (L * 0.4)) ** 1.5)
    n = rng.standard_normal(len(t))
    s = hp((1 - sh) * lp(n, 700) + sh * lp(n, 6000), 200) * sh
    return s / (np.abs(s).max() + 1e-9) * 0.8


def swoosh():
    t = t_axis(0.35)
    f = 1800 * np.exp(-t * 6) + 300
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7) * 0.3 + whoosh(0.35)[: len(t)] * 0.5


def click():
    t = t_axis(0.06)
    return np.sign(np.sin(2 * np.pi * 2500 * t)) * np.exp(-t * 220) * 0.35 + np.sin(2 * np.pi * 170 * t) * np.exp(-t * 60) * 0.6


def pop():
    t = t_axis(0.12)
    return np.sin(2 * np.pi * np.cumsum(500 + 1000 * np.exp(-t * 45)) / SR) * np.exp(-t * 28) * 0.8


def tick():
    t = t_axis(0.025)
    return (0.6 * hp(rng.standard_normal(len(t)), 3000) + 0.4 * np.sin(2 * np.pi * 2100 * t)) * np.exp(-t * 280)


def success():
    out = np.zeros(int(1.3 * SR))
    for i, n in enumerate((81, 86, 93)):
        t = t_axis(1.1)
        s = np.sin(2 * np.pi * midi(n) * t) * np.exp(-t * 4)
        o = int(i * 0.07 * SR)
        out[o:o + len(s)] += s[: len(out) - o]
    return out / 2.2


def riser(L):
    t = t_axis(L)
    sh = (t / L) ** 2
    n = rng.standard_normal(len(t))
    s = hp((1 - sh) * lp(n, 800) + sh * lp(n, 7000), 300)
    return s / (np.abs(s).max() + 1e-9) * sh * 0.7


def impact():
    t = t_axis(1.2)
    b = np.sin(2 * np.pi * (36 * t + 100 / 15 * (1 - np.exp(-15 * t)))) * np.exp(-t * 3.5)
    return np.tanh(1.5 * b + 0.4 * lp(rng.standard_normal(len(t)), 3000) * np.exp(-t * 25))


def drone(L):
    t = t_axis(L)
    s = np.sin(2 * np.pi * midi(41) * t) + 0.5 * np.sin(2 * np.pi * midi(53) * t)
    return s * np.sin(np.pi * np.minimum(t / L, 1)) ** 1.2 * 0.6


def final():
    t = t_axis(2.6)
    s = sum(a * np.sin(2 * np.pi * midi(n) * t) for n, a in ((45, 1), (57, 0.6), (64, 0.45), (69, 0.3), (76, 0.15)))
    return s * np.minimum(1, t / 0.02) * np.exp(-t * 1.2) / 2.5


def sfx():
    buf = np.zeros((N, 2))
    for fx in TL["sfx"]:
        at, g, k = fx["at"], fx["gain"], fx["type"]
        if k in ("ticks", "typing"):
            for i in range(fx["count"]):
                place(buf, tick(), at + i * fx["step"], g, rng.uniform(-0.3, 0.3))
        elif k in ("riser", "drone"):
            place(buf, {"riser": riser, "drone": drone}[k](fx["length"]), at, g)
        else:
            place(buf, {"whoosh": whoosh, "swoosh": swoosh, "click": click, "pop": pop, "success": success,
                        "impact": impact, "final": final}[k](), at, g, 0.1 if k in ("click", "pop") else 0)
    return buf


def vo_track():
    buf = np.zeros(N)
    for lid, v in VO.items():
        x, sr = sf.read(ROOT / f"public/nightshift/launch-vo/{lid}.wav")
        s = int(round(v["at"] * SR))
        e = min(N, s + len(x))
        buf[s:e] += x[: e - s]
    return buf


def env(x, rel=0.25):
    blk = 240
    pk = np.maximum.reduceat(np.abs(x), np.arange(0, len(x), blk))
    a = np.exp(-blk / (rel * SR))
    o = np.empty_like(pk)
    acc = 0.0
    for i, v in enumerate(pk):
        acc = max(v, a * acc)
        o[i] = acc
    return np.repeat(o, blk)[: len(x)]


def write(p, x):
    pcm = (np.clip(x, -1, 1) * 32767).astype("<i2")
    with wave.open(str(p), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    m, s, v = music(), sfx(), vo_track()
    m *= db(-15) / (np.abs(m).max() + 1e-9)
    s *= db(-9) / (np.abs(s).max() + 1e-9)
    duck = 1 - (1 - db(-7)) * np.clip(env(v) / db(-18), 0, 1)
    bed = m * duck[:, None] + s * (0.6 + 0.4 * duck[:, None])
    bed[-int(0.03 * SR):] = 0
    write(OUT / "bed.wav", bed)
    mix = bed + np.stack([v, v], 1) * db(-1.5)
    mix *= db(-1.0) / max(db(-1.0), np.abs(mix).max())
    write(OUT / "mix.wav", mix)
    print("bed peak", 20 * np.log10(np.abs(bed).max()), "mix peak", 20 * np.log10(np.abs(mix).max()))


if __name__ == "__main__":
    main()
