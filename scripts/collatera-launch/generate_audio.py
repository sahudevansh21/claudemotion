#!/usr/bin/env python3
"""
Original music + SFX for CollateraLaunch (20 s). A moody F-minor pop/dancehall
groove in the style of current Drake-era pop (Rhodes keys, 808 sub, rim
3-3-2, half-time claps, hat rolls) — written and synthesised here with
numpy/scipy; no samples, no existing songs. Timed from launch.json.

    python3 scripts/collatera-launch/generate_audio.py

Writes public/collatera-launch/audio/mix.wav (48 kHz, 16-bit stereo).
"""
from __future__ import annotations

import json
import wave
from pathlib import Path

import numpy as np
from scipy.signal import lfilter

ROOT = Path(__file__).resolve().parents[2]
TL = json.loads((ROOT / "src/compositions/CollateraLaunch/launch.json").read_text())
OUT = ROOT / "public/collatera-launch/audio"
SR = 48_000
N = int(round(TL["durationInFrames"] / TL["fps"] * SR))
DUR = N / SR
BEAT = 60 / TL["bpm"]
BAR = 4 * BEAT
S16 = BEAT / 4
DROP = TL["drop"]
BREAK = 16.5
END = 18.5
rng = np.random.default_rng(7)


def ta(s):
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


# Fm9 | Dbmaj7 | Abmaj7 | Eb6  (one bar each)
PROG = [[53, 56, 60, 63, 67], [49, 53, 56, 60, 65], [56, 60, 63, 67, 72], [51, 55, 58, 60, 63]]
ROOTS = [29, 25, 32, 27]  # 808 roots (F1, Db1, Ab1, Eb1)


def bar_of(t):
    return int(t // BAR) % 4


def rhodes(notes, L):
    t = ta(L)
    s = np.zeros(len(t))
    for n in notes:
        f = midi(n)
        s += np.sin(2 * np.pi * f * t + 0.6 * np.sin(2 * np.pi * f * t) * np.exp(-t * 6))
        s += 0.18 * np.sin(2 * np.pi * f * 4.01 * t) * np.exp(-t * 9)
    trem = 1 + 0.12 * np.sin(2 * np.pi * 4.5 * t)
    env = np.minimum(1, t / 0.006) * np.exp(-t * 1.6)
    return s * trem * env / len(notes)


def pad(notes, L):
    t = ta(L)
    s = sum(2 * ((midi(n) * d * t) % 1) - 1 for n in notes for d in (0.995, 1.005))
    env = np.minimum(1, t / 0.6) * np.clip((L - t) / 0.6, 0, 1)
    return lp(lp(s, 1100), 1100) * env / (2 * len(notes))


def k808(n, L=0.9):
    t = ta(L)
    f = midi(n) * (1 + 1.6 * np.exp(-t * 30))
    s = np.sin(2 * np.pi * np.cumsum(f) / SR)
    s = np.tanh(2.2 * s) * np.exp(-t * 2.4) * np.minimum(1, t / 0.002)
    click = np.sin(2 * np.pi * 1200 * t) * np.exp(-t * 300) * 0.3
    return s + click


def clap():
    t = ta(0.25)
    n = rng.standard_normal(len(t))
    env = sum(np.exp(-np.maximum(t - d, 0) * 60) * (t >= d) for d in (0, 0.009, 0.018)) * 0.5 + np.exp(-t * 18) * 0.6
    return hp(lp(n, 7000), 900) * env


def rim():
    t = ta(0.07)
    return (np.sin(2 * np.pi * 1650 * t) + 0.6 * np.sin(2 * np.pi * 820 * t)) * np.exp(-t * 90) * 0.5 + hp(rng.standard_normal(len(t)), 3000) * np.exp(-t * 200) * 0.3


def hat(L=0.04, open_=False):
    t = ta(0.22 if open_ else L)
    return hp(rng.standard_normal(len(t)), 7500) * np.exp(-t * (16 if open_ else 130))


def snap():
    t = ta(0.12)
    return hp(rng.standard_normal(len(t)), 1800) * np.exp(-t * 45) * 0.8


def chop(n, L=0.22):
    """Soft vocal-ish chop: band-limited saw with a vowel-like formant."""
    t = ta(L)
    f = midi(n)
    s = 2 * ((f * t) % 1) - 1
    s = lp(hp(s, 500), 1800) + 0.6 * lp(hp(s, 1000), 2600)
    return s * np.sin(np.pi * np.minimum(t / L, 1)) ** 0.7 * 0.6


def music():
    buf = np.zeros((N, 2))
    # keys + pad all the way to the end card; filtered before the drop / in break
    t0 = 0.0
    while t0 < END:
        b = bar_of(t0)
        place(buf, pad(PROG[b], BAR + 0.6), t0, 0.35)
        for off in (0, 1.5 * BEAT, 2.5 * BEAT):
            place(buf, rhodes(PROG[b], 1.4), t0 + off, 0.5 if off == 0 else 0.32, 0.15 if off else -0.1)
        t0 += BAR
    pre = np.arange(N) / SR
    muffle = ((pre < DROP) | ((pre >= BREAK) & (pre < END)))
    soft = np.stack([lp(lp(buf[:, c], 700), 700) for c in range(2)], 1) * 1.4
    buf = np.where(muffle[:, None], soft, buf)

    # vinyl crackle in the intro
    cr = np.zeros(N)
    idx = rng.integers(0, int(DROP * SR), 260)
    cr[idx] = rng.uniform(-1, 1, len(idx))
    buf += np.stack([lp(cr, 5000)] * 2, 1) * 0.25

    # finger snaps on 2 & 4 in the second half of the intro
    t = 2.5
    while t < DROP - 0.01:
        if int(round(t / BEAT)) % 2 == 1:
            place(buf, snap(), t, 0.4, 0.2)
        t += BEAT

    # groove
    nb = int(round((BREAK - DROP) / S16))
    for i in range(nb):
        at = DROP + i * S16
        st = i % 16
        b = bar_of(at)
        if st in (0, 7, 10):
            place(buf, k808(ROOTS[b] + (12 if st == 10 and b % 2 else 0), 0.8 if st else 1.1), at, 0.8)
        if st in (4, 12):
            place(buf, clap(), at, 0.5)
        if st in (3, 6, 11, 14):
            place(buf, rim(), at, 0.32, 0.35)
        if st % 2 == 0:
            place(buf, hat(), at, 0.16 if st % 4 == 2 else 0.1, -0.25)
        if (i // 16) % 2 == 1 and st >= 12:
            place(buf, hat(0.025), at + S16 / 2, 0.08, 0.25)  # 32nd roll
        if st == 14 and (i // 16) % 2 == 0:
            place(buf, hat(open_=True), at, 0.08, 0.3)
        motif = {2: 2, 5: 3, 8: 4, 13: 1}
        if st in motif:
            place(buf, chop(PROG[b][motif[st]] + 12), at, 0.13, 0.4 if st % 2 else -0.4)

    # break: 808 on downbeats only
    t = BREAK
    while t < END - 0.01:
        place(buf, k808(ROOTS[bar_of(t)], 1.0), t, 0.55)
        t += BAR / 2

    # final: long 808 + ringing Fm9
    place(buf, k808(29, 1.6), END, 0.9)
    tf = ta(DUR - END)
    ring = rhodes([41, 53, 56, 60, 63, 67, 72], DUR - END) * 1.2 + pad([53, 60, 63, 67], DUR - END) * 0.8
    place(buf, ring * np.minimum(1, tf / 0.01), END, 0.8)
    fade = int(0.9 * SR)
    buf[-fade:] *= (0.5 * (1 + np.cos(np.linspace(0, np.pi, fade))))[:, None]
    return buf


# ── SFX ──
def whoosh(L=0.5):
    t = ta(L)
    sh = np.where(t < L * 0.65, (t / (L * 0.65)) ** 2, ((L - t) / (L * 0.35)) ** 1.5)
    n = rng.standard_normal(len(t))
    s = hp((1 - sh) * lp(n, 700) + sh * lp(n, 6500), 200) * sh
    return s / (np.abs(s).max() + 1e-9) * 0.8


def swoosh():
    t = ta(0.35)
    f = 1900 * np.exp(-t * 6) + 300
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7) * 0.3 + whoosh(0.35) * 0.5


def click():
    t = ta(0.06)
    return np.sign(np.sin(2 * np.pi * 2500 * t)) * np.exp(-t * 220) * 0.3 + np.sin(2 * np.pi * 170 * t) * np.exp(-t * 60) * 0.6


def pop():
    t = ta(0.12)
    return np.sin(2 * np.pi * np.cumsum(500 + 1100 * np.exp(-t * 45)) / SR) * np.exp(-t * 28) * 0.8


def tick():
    t = ta(0.03)
    return (0.6 * hp(rng.standard_normal(len(t)), 3000) + 0.4 * np.sin(2 * np.pi * 2300 * t)) * np.exp(-t * 250)


def glitch():
    L = 0.22
    t = ta(L)
    sq = np.sign(np.sin(2 * np.pi * (300 + 2400 * rng.random()) * t))
    gate = (np.floor(t * 90) % 3 != 0).astype(float)
    bits = np.round(rng.standard_normal(len(t)) * 3) / 3
    s = (0.5 * sq + 0.5 * bits) * gate * np.exp(-t * 14)
    return hp(s, 400) * 0.5


def riser(L):
    t = ta(L)
    sh = (t / L) ** 2
    n = rng.standard_normal(len(t))
    s = hp((1 - sh) * lp(n, 800) + sh * lp(n, 8000), 300)
    tone = np.sin(2 * np.pi * np.cumsum(200 + 900 * sh) / SR) * 0.3
    return (s / (np.abs(s).max() + 1e-9) + tone) * sh * 0.7


def impact():
    t = ta(1.4)
    b = np.sin(2 * np.pi * (34 * t + 110 / 14 * (1 - np.exp(-14 * t)))) * np.exp(-t * 3)
    return np.tanh(1.6 * b + 0.5 * lp(rng.standard_normal(len(t)), 3500) * np.exp(-t * 22))


def shimmer():
    t = ta(1.2)
    s = sum(np.sin(2 * np.pi * midi(n) * t) * np.exp(-t * (2 + i)) for i, n in enumerate((84, 88, 91, 96)))
    return s * np.minimum(1, t / 0.08) * 0.25


def final():
    t = ta(1.5)
    s = sum(a * np.sin(2 * np.pi * midi(n) * t) for n, a in ((77, 0.5), (84, 0.35), (89, 0.25)))
    return s * np.minimum(1, t / 0.01) * np.exp(-t * 2.2) * 0.5


def sfx():
    buf = np.zeros((N, 2))
    lib = {"whoosh": whoosh, "swoosh": swoosh, "click": click, "pop": pop, "tick": tick, "glitch": glitch,
           "impact": impact, "shimmer": shimmer, "final": final}
    for fx in TL["sfx"]:
        at, g, k = fx["at"], fx["gain"], fx["type"]
        if k == "ticks":
            for i in range(fx["count"]):
                place(buf, tick(), at + i * fx["step"], g, rng.uniform(-0.4, 0.4))
        elif k == "riser":
            place(buf, riser(fx["length"]), at, g)
        else:
            place(buf, lib[k](), at, g, rng.uniform(-0.2, 0.2) if k in ("click", "pop", "tick") else 0)
    return buf


def duck(music_buf, key, amount=0.45):
    env = np.abs(key).max(1)
    a_att, a_rel = np.exp(-1 / (0.005 * SR)), np.exp(-1 / (0.18 * SR))
    e = lfilter([1 - a_rel], [1, -a_rel], env)
    e = np.maximum(e, lfilter([1 - a_att], [1, -a_att], env))
    e = e / (e.max() + 1e-9)
    return music_buf * (1 - amount * e)[:, None]


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
    m = duck(m, x, 0.35)
    mix = m + x
    mix *= db(-1.0) / (np.abs(mix).max() + 1e-9)
    mix *= db(5)  # drive into limiter for a loud, pop-mastered feel
    c, knee = db(-1.0), db(-7)
    a = np.abs(mix)
    o = a > knee
    mix[o] = np.sign(mix[o]) * (knee + (c - knee) * np.tanh((a[o] - knee) / (c - knee)))
    mix[-int(0.02 * SR):] = 0
    write(OUT / "mix.wav", mix)
    print("mix peak dBFS", round(20 * np.log10(np.abs(mix).max()), 2), "len", round(len(mix) / SR, 3))


if __name__ == "__main__":
    main()
