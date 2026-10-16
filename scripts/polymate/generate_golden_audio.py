#!/usr/bin/env python3
"""
Score + sound design for PolymateGoldenHour (one continuous 30 s take).

Synthesised from scratch with numpy/scipy (no samples). Energetic SaaS-promo
grammar: a 120 BPM groove (punchy kick, offbeat hats, claps, plucky bass and
arps) under crisp UI sounds — pops, clicks, whooshes, risers, a success chime —
framed by deep atmospheric tones, metallic bells and an orchestral swell that
crests when the temple doors open.

Reads src/compositions/Polymate/golden/golden.json, the same file the film
reads: every `sfx` lands on its absolute frame (60 fps), `music` marks where the
groove starts, fills out, breaks down, drops and ends.

    python3 scripts/polymate/generate_golden_audio.py

Writes public/polymate/golden/audio/{music,sfx,mix}.wav (48 kHz, 16-bit stereo).
"""
from __future__ import annotations

import json
import wave
from functools import lru_cache
from pathlib import Path

import numpy as np
from scipy.signal import lfilter

ROOT = Path(__file__).resolve().parents[2]
TL = json.loads((ROOT / "src/compositions/Polymate/golden/golden.json").read_text())
OUT = ROOT / "public/polymate/golden/audio"
SR = 48_000
FPS = TL["fps"]
N = int(round(TL["durationInFrames"] / FPS * SR))
DUR = N / SR
BEAT = 60 / TL["bpm"]
M = {k: v / FPS for k, v in TL["music"].items()}
rng = np.random.default_rng(17)


def t_axis(sec):
    return np.arange(int(sec * SR)) / SR


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def db(x):
    return 10 ** (x / 20)


def lowpass(x, fc):
    a = np.exp(-2 * np.pi * fc / SR)
    return lfilter([1 - a], [1, -a], x)


def highpass(x, fc):
    return x - lowpass(x, fc)


def lowpass_tv(x, fc, blk=128):
    """One-pole low-pass with a time-varying cutoff (array), filtered in blocks."""
    y = np.empty_like(x)
    zi = np.zeros(1)
    for s in range(0, len(x), blk):
        a = np.exp(-2 * np.pi * float(fc[s]) / SR)
        y[s : s + blk], zi = lfilter([1 - a], [1, -a], x[s : s + blk], zi=zi)
    return y


def noise(sec):
    return rng.standard_normal(int(sec * SR))


def place(buf, sig, at, gain=1.0, pan=0.0):
    if sig.ndim == 1:
        a = (pan + 1) * np.pi / 4
        sig = np.stack([sig * np.cos(a), sig * np.sin(a)], axis=1)
    s = int(round(at * SR))
    if s < 0:
        sig, s = sig[-s:], 0
    e = min(s + len(sig), len(buf))
    if e > s:
        buf[s:e] += sig[: e - s] * gain


def fit(x, n):
    """Trim or zero-pad a mono signal to n samples."""
    return x[:n] if len(x) >= n else np.pad(x, (0, n - len(x)))


def saw(f, t):
    return 2 * ((f * t) % 1) - 1


# D major, two bars per chord would be slow; one chord per bar (2 s): D | Bm | G | A
PROG = [[50, 57, 62, 66, 69], [47, 54, 59, 62, 66], [43, 50, 55, 59, 62], [45, 52, 57, 61, 64]]
ROOTS = [38, 35, 43, 45]


def chord_at(sec):
    return int(sec // (4 * BEAT)) % 4


# ----------------------------------------------------------------- instruments
def kick():
    t = t_axis(0.42)
    f = 48 + 110 * np.exp(-t * 30)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7)
    click = highpass(noise(0.42), 2000) * np.exp(-t * 300) * 0.3
    return np.tanh(2.2 * (body + click)) * 0.8


def hat(open_=False):
    L = 0.25 if open_ else 0.06
    t = t_axis(L)
    return highpass(noise(L), 7000) * np.exp(-t * (18 if open_ else 70)) * 0.35


def clap():
    t = t_axis(0.3)
    n = highpass(lowpass(noise(0.3), 5000), 900)
    env = sum(np.exp(-np.clip(t - d, 0, None) * 80) * (t >= d) for d in (0, 0.011, 0.023)) + np.exp(-t * 14) * 0.5
    return n * env * 0.35


def snap():
    t = t_axis(0.08)
    return highpass(noise(0.08), 2500) * np.exp(-t * 90) * 0.4


@lru_cache(maxsize=None)
def bass(n, L):
    t = t_axis(L)
    f = midi(n)
    s = saw(f, t) + 0.6 * np.sin(2 * np.pi * f * t)
    env = np.minimum(1, t / 0.004) * np.exp(-t * 6)
    return lowpass(lowpass_tv(s, 380 + 1400 * np.exp(-t * 18)), 900) * env * 0.55


@lru_cache(maxsize=None)
def pluck(n, L=0.35):
    t = t_axis(L)
    f = midi(n)
    s = saw(f, t) * 0.5 + saw(f * 1.003, t) * 0.5
    return lowpass_tv(s, 1800 + 4500 * np.exp(-t * 25)) * np.exp(-t * 11) * np.minimum(1, t / 0.002) * 0.3


def pad(notes, sec, bright=1.0):
    t = t_axis(sec)
    sig = np.zeros_like(t)
    for n in notes:
        f = midi(n)
        vib = 1 + 0.002 * np.sin(2 * np.pi * 5 * t + rng.uniform(0, 6))
        for d in (0.996, 1.0, 1.004):
            sig += saw(f * d * vib, t)
    env = np.minimum(1, t / 0.9) * np.clip((sec - t) / 0.8, 0, 1)
    return lowpass(lowpass(sig, 1200 * bright), 2200 * bright) * env / (3 * len(notes))


def drone(sec):
    t = t_axis(sec)
    s = np.sin(2 * np.pi * midi(26) * t) + 0.5 * np.sin(2 * np.pi * midi(33) * t) + 0.25 * lowpass(saw(midi(38), t), 300)
    wob = 0.75 + 0.25 * np.sin(2 * np.pi * 0.15 * t)
    return s * wob * np.minimum(1, t / 2.0) * np.clip((sec - t) / 1.0, 0, 1) * 0.35


# ----------------------------------------------------------------------- music
def music():
    buf = np.zeros((N, 2))
    g0, full, brk, drop, out = M["grooveFrom"], M["fullFrom"], M["breakFrom"], M["dropAt"], M["outroTo"]
    # atmosphere under everything until the doors open
    place(buf, drone(drop + 1.0), 0, 1.0)
    # intro pad (dark, filtered) before the groove
    place(buf, pad([50, 57, 62, 64], g0 + 0.6, 0.55), 0.0, 0.7)

    beat = 0
    at = g0
    while at < out - 1e-6:
        in_break = brk <= at < drop
        bar_pos = beat % 4
        # drums
        if not in_break:
            place(buf, kick(), at, 1.0)
            if at >= full:
                place(buf, hat(beat % 8 == 7), at + BEAT / 2, 0.8, 0.25)
                place(buf, hat(), at + BEAT * 0.75, 0.35, -0.25)
                if bar_pos in (1, 3):
                    place(buf, clap(), at, 0.9, 0.05)
            elif bar_pos in (1, 3):
                place(buf, snap(), at, 0.8, 0.1)
        # bass: eighth-note pulse on the chord root
        c = chord_at(at)
        if not in_break:
            for k in range(2):
                n = ROOTS[c] + (12 if (k == 1 and bar_pos == 3) else 0)
                place(buf, bass(n, BEAT / 2), at + k * BEAT / 2, 0.9)
        # arp: sixteenths once the groove fills out (and through the break, filtered)
        if at >= full:
            notes = PROG[c][1:] + [PROG[c][2] + 12]
            for k in range(4):
                n = notes[(beat * 4 + k) % len(notes)] + 12
                place(buf, pluck(n), at + k * BEAT / 4, 0.55 if not in_break else 0.3, 0.35 if k % 2 else -0.35)
        at += BEAT
        beat += 1

    # chord pads per bar across the groove
    at = g0
    while at < brk - 1e-6:
        place(buf, pad(PROG[chord_at(at)], 4 * BEAT + 0.3, 0.9 if at >= full else 0.7), at, 0.55)
        at += 4 * BEAT
    # break: suspended pad, rising
    place(buf, pad([45, 52, 57, 59, 64], drop - brk + 0.2, 1.1), brk, 0.8)

    # orchestral swell from the drop: strings + brass-ish saws + timpani
    sw = DUR - drop
    t = t_axis(sw)
    cres = np.minimum(1, t / 1.8) ** 1.5 * np.clip((sw - t) / 1.2, 0, 1)
    strings = pad([38, 50, 57, 62, 66, 69, 74], sw, 1.4)
    brass = sum(lowpass_tv(saw(midi(n), t), 900 + 1500 * np.minimum(1, t / 2), 1024) for n in (50, 57, 62)) / 6
    place(buf, (strings * 1.6 + brass * 0.8) * cres, drop, 1.0)
    for k in range(8):  # timpani hits on the lockup beats
        tt = t_axis(0.9)
        timp = np.sin(2 * np.pi * (midi(38) * tt + 6 * (1 - np.exp(-tt * 20)))) * np.exp(-tt * 4)
        place(buf, timp, drop + k * BEAT * 2, 0.5 if k else 0.9)
    # air
    air = lowpass(highpass(rng.standard_normal(N), 500), 4000) * 0.004
    buf += np.stack([air, np.roll(air, 900)], axis=1)
    fade = int(1.2 * SR)
    buf[-fade:] *= (0.5 * (1 + np.cos(np.linspace(0, np.pi, fade))))[:, None]
    return buf


# ------------------------------------------------------------------------- sfx
def scribble(L):
    t = t_axis(L)
    n = highpass(lowpass(noise(L), 6000), 1800)
    strokes = 0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 3.3 * t + 2 * np.sin(2 * np.pi * 0.7 * t)))
    return n * lowpass(strokes, 30) * 0.4


def brushes(L):
    buf = np.zeros((int(L * SR), 2))
    for i in range(46):
        at = (i / 46) * (L - 0.3) + rng.uniform(0, 0.05)
        l = rng.uniform(0.07, 0.16)
        t = t_axis(l)
        s = highpass(lowpass(noise(l), rng.uniform(2500, 5000)), 700) * np.sin(np.pi * t / l) ** 2
        place(buf, s * rng.uniform(0.25, 0.5), at, 1.0, rng.uniform(-0.7, 0.7))
    return buf


def riser(L):
    t = t_axis(L)
    n = noise(L)
    sweep = np.zeros_like(n)
    # crude sweeping band-pass: chain of one-pole filters in blocks
    blk = 1024
    for s in range(0, len(n), blk):
        fc = 400 + 7000 * (s / len(n)) ** 2
        sweep[s : s + blk] = highpass(lowpass(n[s : s + blk], fc * 1.6), fc * 0.6)
    tone = np.sin(2 * np.pi * np.cumsum(220 * 2 ** (2 * t / L)) / SR) * 0.25
    return (sweep * 0.5 + tone) * (t / L) ** 2


def impact():
    t = t_axis(2.2)
    sub = np.sin(2 * np.pi * (34 * t + 70 / 8 * (1 - np.exp(-8 * t)))) * np.exp(-t * 1.6)
    crash = highpass(noise(2.2), 3500) * np.exp(-t * 2.2) * 0.25
    return np.tanh(1.6 * sub) + crash


def whoosh(L=0.55):
    t = t_axis(L)
    n = noise(L)
    lo = lowpass_tv(n, 1500 + 3000 * np.sin(np.pi * t / L))
    return highpass(lo, 300) * np.sin(np.pi * t / L) ** 2 * 0.6


def swoosh():
    a = whoosh(0.7)
    t = t_axis(0.7)
    tone = np.sin(2 * np.pi * np.cumsum(300 + 900 * t / 0.7) / SR) * np.sin(np.pi * t / 0.7) ** 2 * 0.15
    return a + tone


def pop():
    t = t_axis(0.16)
    f = 520 + 900 * np.exp(-t * 60)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 30) * 0.8


def ping():
    t = t_axis(0.9)
    s = np.sin(2 * np.pi * midi(86) * t) + 0.4 * np.sin(2 * np.pi * midi(93) * t)
    return s * np.exp(-t * 6) * np.minimum(1, t / 0.002) * 0.45


def click():
    t = t_axis(0.03)
    return np.sin(2 * np.pi * 2600 * t) * np.exp(-t * 260) * 0.6 + highpass(noise(0.03), 4000) * np.exp(-t * 400) * 0.3


def tick():
    t = t_axis(0.05)
    return np.sin(2 * np.pi * 1800 * t) * np.exp(-t * 150) * 0.6


def press():
    t = t_axis(0.14)
    return (np.sin(2 * np.pi * 1000 * t) * np.exp(-t * 60) + 0.6 * np.sin(2 * np.pi * 150 * t) * np.exp(-t * 35)) * 0.7


def trace(L):
    t = t_axis(L)
    f = 600 + 900 * (t / L)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.15
    grains = highpass(noise(L), 5000) * (np.sin(2 * np.pi * 30 * t) > 0.6) * 0.2
    return (s + grains) * np.minimum(1, t / 0.05) * np.minimum(1, (L - t) / 0.08)


def success():
    out = np.zeros(int(1.4 * SR))
    for k, n in enumerate((74, 78, 81, 86)):
        t = t_axis(1.4 - k * 0.07)
        s = (np.sin(2 * np.pi * midi(n) * t) + 0.3 * np.sin(4 * np.pi * midi(n) * t)) * np.exp(-t * 4) * np.minimum(1, t / 0.003)
        st = int(k * 0.07 * SR)
        out[st : st + len(s)] += s * 0.4
    return out


def bell():
    """Metallic chime: inharmonic partials, long shimmer."""
    t = t_axis(3.0)
    base = midi(81)
    parts = ((1.0, 1.0, 1.4), (2.76, 0.5, 2.2), (5.4, 0.25, 3.5), (8.93, 0.12, 5.0), (0.5, 0.3, 1.0))
    s = sum(a * np.sin(2 * np.pi * base * r * t) * np.exp(-t * d) for r, a, d in parts)
    return s * np.minimum(1, t / 0.002) * 0.35


def chime():
    return bell() * 0.6


def bloom():
    t = t_axis(2.6)
    s = sum(a * np.sin(2 * np.pi * midi(n) * t) for n, a in ((62, 1), (69, 0.7), (74, 0.55), (78, 0.4), (81, 0.3)))
    return s * np.minimum(1, t / 0.15) * np.exp(-t * 1.3) / 2.5 + fit(impact(), len(t)) * 0.25


def sparkle():
    out = np.zeros(int(1.2 * SR))
    for k in range(10):
        t = t_axis(0.5)
        n = 90 + (k * 5) % 12
        s = np.sin(2 * np.pi * midi(n) * t) * np.exp(-t * 12)
        st = int(k * 0.06 * SR)
        out[st : st + len(s)] += s * 0.2
    return out


def beam():
    t = t_axis(2.4)
    s = sum(np.sin(2 * np.pi * midi(n) * t * (1 + 0.002 * np.sin(2 * np.pi * 4 * t))) for n in (74, 81, 86))
    return s * np.minimum(1, t / 0.4) * np.exp(-t * 1.2) * 0.25


def doors():
    t = t_axis(2.6)
    rumble = lowpass(noise(2.6), 120) * 3
    creak = np.sin(2 * np.pi * np.cumsum(90 + 30 * np.sin(2 * np.pi * 1.3 * t)) / SR) * 0.15
    return (rumble + creak) * np.minimum(1, t / 0.2) * np.exp(-t * 0.9) * 0.6


def logo():
    t = t_axis(3.0)
    s = sum(a * np.sin(2 * np.pi * midi(n) * t) for n, a in ((38, 1.0), (50, 0.7), (57, 0.5), (62, 0.5), (66, 0.35), (74, 0.25), (81, 0.15)))
    return s * np.minimum(1, t / 0.01) * np.exp(-t * 1.0) / 3 + fit(impact(), len(t)) * 0.5


def sfx():
    buf = np.zeros((N, 2))
    table = {"impact": impact, "whoosh": whoosh, "swoosh": swoosh, "pop": pop, "ping": ping, "click": click,
             "tick": tick, "press": press, "success": success, "bell": bell, "chime": chime, "bloom": bloom,
             "sparkle": sparkle, "beam": beam, "doors": doors, "logo": logo}
    pans = {"pop": 0.3, "ping": -0.2, "click": 0.25, "tick": 0.25, "press": 0.15}
    pop_i = 0
    for fx in TL["sfx"]:
        at, g, k = fx["at"] / FPS, fx["gain"], fx["type"]
        if k == "scribble":
            sig = scribble(fx["length"])
        elif k == "brushes":
            sig = brushes(fx["length"])
        elif k == "riser":
            sig = riser(fx["length"])
        elif k == "trace":
            sig = trace(fx["length"])
        else:
            sig = table[k]()
        pan = pans.get(k, 0.0)
        if k == "pop":  # alternate the four card pops left / right
            pan = (-0.45, 0.45, -0.35, 0.35)[pop_i % 4]
            pop_i += 1
        place(buf, sig, at, g, pan)
    return buf


def write(path, x):
    pcm = (np.clip(x, -1, 1) * 32767).astype("<i2")
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    m, s = music(), sfx()
    m *= db(-6) / (np.abs(m).max() + 1e-9)
    s *= db(-5) / (np.abs(s).max() + 1e-9)
    mix = m + s
    mix = np.tanh(1.3 * mix) / np.tanh(1.3)  # gentle glue / soft limit
    mix *= db(-1.2) / (np.abs(mix).max() + 1e-9)
    fade = int(0.4 * SR)
    mix[-fade:] *= (np.linspace(1, 0, fade) ** 2)[:, None]
    mix[-int(0.03 * SR):] = 0
    for name, x in (("music", m), ("sfx", s), ("mix", mix)):
        write(OUT / f"{name}.wav", x)
    assert len(mix) == N and np.abs(mix).max() <= db(-1.1)
    print(f"wrote {OUT.relative_to(ROOT)}/{{music,sfx,mix}}.wav")


if __name__ == "__main__":
    main()
