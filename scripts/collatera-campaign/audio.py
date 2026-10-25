#!/usr/bin/env python3
"""
Original music + UI sound for the COLLATERA campaign films (V2–V7).
One preset per locked whatships reference genre; all synthesised with
numpy/scipy, no samples. Timing comes from the film's JSON timeline.

    python3 scripts/collatera-campaign/audio.py src/compositions/CollateraCampaign/v2.json

Writes public/collatera-campaign/<id>/mix.wav and sfx.wav (SFX-only stem).
JSON: {"id", "fps", "durationInFrames", "music": {"style", "bpm", "drop"?, "silence"?, "end"?}, "sfx": [...]}
Styles: notion (plucks → silent beat → 808 slides → groove), krea (sparse → groove),
conqueror (arps → drop), chill (Rhodes 80 BPM), soft (calm plucks), foley (no music).
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np
from scipy.signal import lfilter

ROOT = Path(__file__).resolve().parents[2]
TL = json.loads(Path(sys.argv[1]).read_text())
OUT = ROOT / "public/collatera-campaign" / TL["id"]
SR = 48_000
N = int(round(TL["durationInFrames"] / TL["fps"] * SR))
DUR = N / SR
MU = TL["music"]
BPM = MU.get("bpm", 100)
BEAT = 60 / BPM
BAR = 4 * BEAT
END = MU.get("end", DUR - 2.0)
rng = np.random.default_rng(11)


def ta(s):
    return np.arange(max(1, int(s * SR))) / SR


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


def rhodes(notes, L):
    t = ta(L)
    s = np.zeros(len(t))
    for n in notes:
        f = midi(n)
        s += np.sin(2 * np.pi * f * t + 0.6 * np.sin(2 * np.pi * f * t) * np.exp(-t * 6))
        s += 0.15 * np.sin(2 * np.pi * f * 4.01 * t) * np.exp(-t * 9)
    return s * (1 + 0.1 * np.sin(2 * np.pi * 4.5 * t)) * np.minimum(1, t / 0.006) * np.exp(-t * 1.4) / len(notes)


def pad(notes, L, fc=1100):
    t = ta(L)
    s = sum(saw(midi(n) * d, t) for n in notes for d in (0.995, 1.005))
    env = np.minimum(1, t / 0.5) * np.clip((L - t) / 0.5, 0, 1)
    return lp(lp(s, fc), fc) * env / (2 * len(notes))


def pluck(f, L=0.35, bright=4500):
    t = ta(L)
    s = saw(f, t) + 0.4 * saw(f * 2, t)
    b = np.exp(-t * 16)
    return (lp(s, bright) * b + lp(s, 900) * (1 - b)) * np.exp(-t * 9) * np.minimum(1, t / 0.002) / 1.6


def kick(L=0.32):
    t = ta(L)
    return np.tanh(1.6 * np.sin(2 * np.pi * (48 * t + 90 / 28 * (1 - np.exp(-28 * t)))) * np.exp(-t * 9))


def k808(n, L=0.9, glide=0.0):
    t = ta(L)
    f = midi(n) * (1 + 1.4 * np.exp(-t * 30)) * (1 + glide * np.minimum(1, t / L))
    s = np.tanh(2.0 * np.sin(2 * np.pi * np.cumsum(f) / SR)) * np.exp(-t * 2.2) * np.minimum(1, t / 0.002)
    return s


def clap():
    t = ta(0.22)
    n = rng.standard_normal(len(t))
    env = sum(np.exp(-np.maximum(t - d, 0) * 60) * (t >= d) for d in (0, 0.009, 0.018)) * 0.5 + np.exp(-t * 18) * 0.6
    return hp(lp(n, 7000), 900) * env


def hat(L=0.04, open_=False):
    t = ta(0.2 if open_ else L)
    return hp(rng.standard_normal(len(t)), 7500) * np.exp(-t * (16 if open_ else 130))


def rim():
    t = ta(0.07)
    return (np.sin(2 * np.pi * 1650 * t) + 0.6 * np.sin(2 * np.pi * 820 * t)) * np.exp(-t * 90) * 0.5


# progressions (one chord per bar)
PROG = {
    "notion": ([[57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 67], [52, 55, 59, 64]], [33, 29, 31, 28]),
    "krea": ([[60, 64, 67, 71], [57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 67]], [36, 33, 29, 31]),
    "conqueror": ([[57, 60, 64, 69], [53, 57, 60, 65], [48, 52, 55, 60], [55, 59, 62, 67]], [33, 29, 36, 31]),
    "chill": ([[56, 60, 63, 67, 70], [53, 56, 60, 63, 67], [49, 53, 56, 60, 63], [51, 56, 58, 63, 65]], [32, 29, 25, 27]),
    "soft": ([[60, 64, 67, 72], [57, 60, 64, 69], [53, 57, 60, 65], [55, 59, 62, 67]], [36, 33, 29, 31]),
}


def music():
    buf = np.zeros((N, 2))
    style = MU["style"]
    if style == "foley":
        place(buf, pad([45, 52, 57, 64], DUR, 600) * 0.6, 0, 0.5)
        fade = int(1.0 * SR)
        buf[-fade:] *= np.linspace(1, 0, fade)[:, None]
        return buf
    prog, roots = PROG[style]
    drop = MU.get("drop", 0.0)
    sil = MU.get("silence")
    chord = lambda t: prog[int(t // BAR) % 4]  # noqa: E731
    root = lambda t: roots[int(t // BAR) % 4]  # noqa: E731
    t0 = 0.0
    while t0 < END:
        place(buf, pad(chord(t0), BAR + 0.6), t0, 0.3)
        if style in ("chill", "soft"):
            place(buf, rhodes(chord(t0), BAR), t0, 0.5, -0.1)
            place(buf, rhodes(chord(t0)[1:], BAR * 0.6), t0 + 1.5 * BEAT, 0.28, 0.15)
        t0 += BAR
    step = BEAT / 2 if style in ("notion", "soft") else BEAT / 4
    i = 0
    t = 0.0
    while t < END - 0.02:
        if not (sil is not None and sil <= t < sil + BEAT):
            ch = chord(t)
            if style in ("notion", "krea", "conqueror", "soft") and (style != "notion" or t < (sil or 1e9) or True):
                n = ch[[0, 2, 1, 3, 2, 1, 3, 2][i % 8]] + 12
                g = 0.12 if style != "conqueror" else 0.16
                if style == "krea" and t < drop:
                    g *= 0.6 if i % 2 == 0 else 0
                place(buf, pluck(midi(n), 0.3, 5500 if style == "conqueror" else 4000), t, g, 0.3 if i % 2 else -0.3)
        t += step
        i += 1
    # drums / bass
    b = 0
    t = drop if style in ("krea", "conqueror") else (0.0 if style != "notion" else (sil + BEAT if sil else 0))
    if style == "notion" and sil is not None:
        # pre-silence: gentle clicks on beats
        tt = 0.0
        while tt < sil:
            place(buf, rim(), tt, 0.18)
            tt += BEAT
    while t < END - 0.02:
        beat_in_bar = b % 4
        if style == "chill":
            if t >= 2.0:
                if beat_in_bar == 0:
                    place(buf, k808(root(t) + 12, 0.4), t, 0.4)
                if beat_in_bar == 2:
                    place(buf, clap(), t, 0.22)
                place(buf, hat(), t + BEAT / 2, 0.05, 0.25)
        elif style == "soft":
            if beat_in_bar in (0, 2):
                place(buf, kick(0.25), t, 0.35)
            place(buf, hat(), t + BEAT / 2, 0.05, 0.25)
        else:
            groove = style != "notion" or t >= (sil + BEAT + 4 * BAR if sil else 0)
            if style == "notion" and not groove:
                # 808 slides section
                if beat_in_bar == 0:
                    place(buf, k808(root(t), BAR * 0.9, glide=-0.25), t, 0.75)
                if beat_in_bar == 2:
                    place(buf, clap(), t, 0.3)
                place(buf, hat(), t, 0.06, -0.2)
                place(buf, hat(), t + BEAT / 2, 0.08, 0.2)
            else:
                place(buf, kick(), t, 0.7)
                if beat_in_bar in (1, 3):
                    place(buf, clap(), t, 0.32)
                place(buf, hat(), t + BEAT / 2, 0.11, 0.25)
                place(buf, hat(), t + BEAT / 4, 0.04, -0.25)
                place(buf, hat(), t + 3 * BEAT / 4, 0.04, -0.25)
                tb = ta(BEAT / 2 * 0.9)
                f = midi(root(t) - 12 + 12)
                for k in (0, 1):
                    sig = lp(np.sin(2 * np.pi * f * tb) + 0.4 * saw(f, tb), 500) * np.exp(-tb * 4)
                    place(buf, sig, t + k * BEAT / 2, 0.4 if k else 0.3)
        t += BEAT
        b += 1
    # resolving chord
    L = DUR - END
    if L > 0.2:
        place(buf, (rhodes(prog[0] + [prog[0][0] - 12], L) * 1.2 + pad(prog[0], L)), END, 0.7)
    fade = int(min(1.0, DUR * 0.1) * SR)
    buf[-fade:] *= (0.5 * (1 + np.cos(np.linspace(0, np.pi, fade))))[:, None]
    return buf


def whoosh(L=0.5):
    t = ta(L)
    sh = np.where(t < L * 0.65, (t / (L * 0.65)) ** 2, ((L - t) / (L * 0.35)) ** 1.5)
    n = rng.standard_normal(len(t))
    s = hp((1 - sh) * lp(n, 700) + sh * lp(n, 6500), 200) * sh
    return s / (np.abs(s).max() + 1e-9) * 0.8


def click():
    t = ta(0.06)
    return np.sign(np.sin(2 * np.pi * 2500 * t)) * np.exp(-t * 220) * 0.3 + np.sin(2 * np.pi * 170 * t) * np.exp(-t * 60) * 0.6


def pop():
    t = ta(0.12)
    return np.sin(2 * np.pi * np.cumsum(500 + 1100 * np.exp(-t * 45)) / SR) * np.exp(-t * 28) * 0.8


def tick():
    t = ta(0.03)
    return (0.6 * hp(rng.standard_normal(len(t)), 3000) + 0.4 * np.sin(2 * np.pi * 2300 * t)) * np.exp(-t * 250)


def chime():
    t = ta(1.4)
    s = sum(a * np.sin(2 * np.pi * midi(n) * t) * np.exp(-t * (2.5 + i)) for i, (n, a) in enumerate(((80, 0.6), (84, 0.45), (87, 0.35))))
    return s * np.minimum(1, t / 0.005) * 0.5


def shimmer():
    t = ta(1.2)
    s = sum(np.sin(2 * np.pi * midi(n) * t) * np.exp(-t * (2 + i)) for i, n in enumerate((84, 88, 91, 96)))
    return s * np.minimum(1, t / 0.08) * 0.25


def notif():
    t = ta(0.5)
    s = np.sin(2 * np.pi * midi(88) * t) * np.exp(-t * 9) * (t < 0.12) + np.sin(2 * np.pi * midi(93) * t) * np.exp(-np.maximum(t - 0.1, 0) * 8) * (t >= 0.1)
    return s * 0.5


def scribble():
    t = ta(0.5)
    n = hp(rng.standard_normal(len(t)), 2500)
    am = 0.5 + 0.5 * np.sin(2 * np.pi * 14 * t)
    return n * am * np.sin(np.pi * t / 0.5) * 0.35


def dissolve():
    t = ta(0.6)
    s = np.zeros(len(t))
    for k in range(18):
        at = int(rng.uniform(0, 0.5) * SR)
        b = np.sign(np.sin(2 * np.pi * rng.uniform(600, 3000) * ta(0.03))) * np.exp(-ta(0.03) * 120)
        s[at:at + len(b)] += b[: len(s) - at] * 0.25
    return s


def riser(L):
    t = ta(L)
    sh = (t / L) ** 2
    n = rng.standard_normal(len(t))
    s = hp((1 - sh) * lp(n, 800) + sh * lp(n, 7000), 300)
    return s / (np.abs(s).max() + 1e-9) * sh * 0.6


LIB = {"whoosh": whoosh, "click": click, "pop": pop, "tick": tick, "chime": chime, "shimmer": shimmer, "notif": notif, "scribble": scribble, "dissolve": dissolve}


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
            place(buf, LIB[k](), at, g, rng.uniform(-0.2, 0.2) if k in ("click", "pop", "tick") else 0)
    return buf


def duck(m, key, amount=0.3):
    env = np.abs(key).max(1)
    a = np.exp(-1 / (0.18 * SR))
    e = lfilter([1 - a], [1, -a], env)
    e = e / (e.max() + 1e-9)
    return m * (1 - amount * e)[:, None]


def write(p, x):
    pcm = (np.clip(x, -1, 1) * 32767).astype("<i2")
    with wave.open(str(p), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def limit(x, drive):
    x = x * db(drive)
    c, knee = db(-1.0), db(-7)
    a = np.abs(x)
    o = a > knee
    x[o] = np.sign(x[o]) * (knee + (c - knee) * np.tanh((a[o] - knee) / (c - knee)))
    return x


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    m, x = music(), sfx()
    m *= db(-5) / (np.abs(m).max() + 1e-9)
    x *= db(-7) / (np.abs(x).max() + 1e-9)
    stem = x * (db(-1.0) / (np.abs(x).max() + 1e-9))
    stem[-int(0.02 * SR):] = 0
    write(OUT / "sfx.wav", stem)
    mix = duck(m, x) + x
    mix *= db(-1.0) / (np.abs(mix).max() + 1e-9)
    target = MU.get("lufs", -14.0)
    base = mix.copy()
    drive = 1.5 if MU["style"] != "foley" else 0.0
    for _ in range(4):
        mix = limit(base.copy(), drive)
        mix[-int(0.02 * SR):] = 0
        write(OUT / "mix.wav", mix)
        r = subprocess.run(["ffmpeg", "-i", str(OUT / "mix.wav"), "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True)
        lufs = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", r.stderr)[-1])
        if abs(lufs - target) < 0.4:
            break
        drive += target - lufs
    print(TL["id"], "peak", round(20 * np.log10(np.abs(mix).max() + 1e-12), 2), "len", round(len(mix) / SR, 3), "LUFS", lufs, "target", target)


if __name__ == "__main__":
    main()
