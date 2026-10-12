#!/usr/bin/env python3
"""
Generate original music + sound effects for the NIGHTSHIFT teaser.

Everything is synthesised from scratch with numpy/scipy (no samples). Timing is
read from src/compositions/Nightshift/timeline.json, the same file the Remotion
shots read, so every click, pop and impact lands on its frame (30 fps) and
every cut sits on the 120 BPM grid.

    pip install -r scripts/nightshift/requirements.txt
    python3 scripts/nightshift/generate_audio.py

Writes public/nightshift/audio/{music,sfx,mix}.wav (48 kHz, 16-bit stereo).
The video uses mix.wav.
"""
from __future__ import annotations

import json
import wave
from pathlib import Path

import numpy as np
from scipy.signal import lfilter

ROOT = Path(__file__).resolve().parents[2]
TL = json.loads((ROOT / "src/compositions/Nightshift/timeline.json").read_text())
OUT = ROOT / "public/nightshift/audio"

SR = 48_000
FPS = TL["fps"]
DURATION = TL["durationInFrames"] / FPS  # exactly 30.0 s
N = int(round(DURATION * SR))
BEAT = 60 / TL["bpm"]  # 0.5 s
SHOT = {s["id"]: (s["start"] / FPS, s["end"] / FPS) for s in TL["shots"]}
DROP = SHOT["city"][0]   # 23.5 s: beat drop under the city inserts
END = SHOT["end"][0]     # 27.5 s: music resolves into the end card
rng = np.random.default_rng(7)


# --------------------------------------------------------------------------- #
def t_axis(sec: float) -> np.ndarray:
    return np.arange(int(sec * SR)) / SR


def midi(n: float) -> float:
    return 440.0 * 2 ** ((n - 69) / 12)


def db(x: float) -> float:
    return 10 ** (x / 20)


def lowpass(x: np.ndarray, fc: float) -> np.ndarray:
    a = np.exp(-2 * np.pi * fc / SR)
    return lfilter([1 - a], [1, -a], x)


def highpass(x: np.ndarray, fc: float) -> np.ndarray:
    return x - lowpass(x, fc)


def square(f: float, t: np.ndarray, duty=0.5) -> np.ndarray:
    return np.where((f * t) % 1 < duty, 1.0, -1.0)


def pan(sig: np.ndarray, p: float) -> np.ndarray:
    a = (p + 1) * np.pi / 4
    return np.stack([sig * np.cos(a), sig * np.sin(a)], axis=1)


def place(buf, sig, at, gain=1.0):
    if sig.ndim == 1:
        sig = np.stack([sig, sig], axis=1)
    s = int(round(at * SR))
    if s < 0:
        sig, s = sig[-s:], 0
    e = min(s + len(sig), len(buf))
    if e > s:
        buf[s:e] += sig[: e - s] * gain



# --------------------------------------------------------------------------- #
# music — D minor, 120 BPM: Dm | Bb | F | C  (one chord per bar = 2 s)
# --------------------------------------------------------------------------- #
CHORDS = [[62, 65, 69], [58, 62, 65], [53, 57, 60], [55, 60, 64]]
ROOTS = [38, 34, 41, 36]
BAR = 4 * BEAT


def chord_idx(t: float) -> int:
    return int(t // BAR) % 4


def saw(f: float, t: np.ndarray) -> np.ndarray:
    return 2 * ((f * t) % 1) - 1


def kick() -> np.ndarray:
    t = t_axis(0.4)
    body = np.sin(2 * np.pi * (48 * t + 110 / 28 * (1 - np.exp(-28 * t)))) * np.exp(-t * 7)
    click = highpass(rng.standard_normal(len(t)), 3000) * np.exp(-t * 400) * 0.3
    return np.tanh(1.6 * body + click)


def clap() -> np.ndarray:
    t = t_axis(0.25)
    n = highpass(lowpass(rng.standard_normal(len(t)), 5000), 900)
    env = np.exp(-t * 22) + 0.6 * np.exp(-((t - 0.012) ** 2) / 1e-5) + 0.5 * np.exp(-((t - 0.024) ** 2) / 1e-5)
    return n * env * 0.8


def hat(open_=False) -> np.ndarray:
    t = t_axis(0.18 if open_ else 0.05)
    return highpass(rng.standard_normal(len(t)), 8000) * np.exp(-t * (18 if open_ else 110))


def stab(freqs, sec) -> np.ndarray:
    t = t_axis(sec)
    sig = sum(saw(f * d, t) for f in freqs for d in (0.996, 1.004))
    return lowpass(sig, 2400) * np.exp(-t * 6) * np.minimum(1, t / 0.004) / (2 * len(freqs))


def pad(freqs, sec) -> np.ndarray:
    t = t_axis(sec)
    sig = sum(saw(f * d, t) for f in freqs for d in (0.994, 1.0, 1.006))
    env = np.minimum(1, t / 0.6) * np.clip((sec - t) / 0.6, 0, 1)
    return lowpass(sig, 1200) * env / (3 * len(freqs))


def make_music() -> np.ndarray:
    buf = np.zeros((N, 2))
    beats = int(END / BEAT)
    k, c = kick(), clap()
    for b in range(beats):
        at = b * BEAT
        intro = at < SHOT["desk"][0]
        if intro and b % 2:
            continue
        # Breakdown: last bar before the drop drops the kick for the riser.
        if DROP - 2 * BEAT <= at < DROP:
            continue
        place(buf, k, at, db(-6 if at >= DROP else -8))
        if not intro and b % 2 == 1 and at >= SHOT["prompt"][0]:
            place(buf, pan(c, 0.05), at, db(-14))
        if at >= SHOT["desk"][0]:
            place(buf, pan(hat(), 0.35), at + BEAT / 2, db(-20))
            if at >= SHOT["build"][0]:
                place(buf, pan(hat(), -0.3), at + BEAT / 4, db(-27))
                place(buf, pan(hat(), -0.3), at + 3 * BEAT / 4, db(-27))
            if b % 4 == 3:
                place(buf, pan(hat(True), 0.4), at + BEAT / 2, db(-24))

    # Pads across the film; brighter chord stabs on the off-beats from the build.
    t0 = 0.0
    while t0 < END:
        freqs = [midi(n) for n in CHORDS[chord_idx(t0)]]
        place(buf, pan(pad(freqs, BAR + 0.6), -0.15), t0, db(-24))
        t0 += BAR
    for b in range(beats):
        at = b * BEAT + BEAT / 2
        if SHOT["build"][0] <= at < END and not (DROP - 2 * BEAT <= at < DROP):
            freqs = [midi(n + 12) for n in CHORDS[chord_idx(at)]]
            place(buf, pan(stab(freqs, 0.22), 0.3 if b % 2 else -0.3), at, db(-21))

    # Sustained, gliding sub-bass from the statement card on (as in the reference).
    t_b = t_axis(BEAT / 2 * 0.92)
    for kq in range(int(END / (BEAT / 2))):
        at = kq * BEAT / 2
        if at < SHOT["card1"][0] or DROP - 2 * BEAT <= at < DROP:
            continue
        f = midi(ROOTS[chord_idx(at)] + (12 if kq % 4 == 3 else 0))
        sig = lowpass(saw(f, t_b) * 0.6 + np.sin(2 * np.pi * f * t_b), 380 if at < DROP else 650)
        sig *= np.minimum(1, t_b / 0.01) * np.exp(-t_b * 3)
        place(buf, sig, at, db(-12 if at >= DROP else -15))

    # Final chord rings out under the end card.
    freqs = [midi(n) for n in (50, 57, 62, 65, 69)]
    place(buf, pan(pad(freqs, 2.6), 0.0), END, db(-20))
    fade = int(1.2 * SR)
    buf[-fade:] *= (0.5 * (1 + np.cos(np.linspace(0, np.pi, fade))))[:, None]
    buf[-int(0.03 * SR):] = 0
    return buf


# --------------------------------------------------------------------------- #
# sound effects
# --------------------------------------------------------------------------- #
def fx_click() -> np.ndarray:
    t = t_axis(0.03)
    f = rng.choice([2400, 2800, 3200])
    return square(f, t, 0.5) * np.exp(-t * 260) * 0.5


def fx_type() -> np.ndarray:
    t = t_axis(0.03)
    return (0.5 * highpass(rng.standard_normal(len(t)), 3000) + 0.4 * np.sin(2 * np.pi * 1700 * t)) * np.exp(-t * 300)


def fx_pop() -> np.ndarray:
    t = t_axis(0.12)
    f = 500 + 900 * np.exp(-t * 40)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 30)


def fx_whoosh() -> tuple[np.ndarray, float]:
    L = 0.45
    t = t_axis(L)
    peak = 0.6
    shape = np.where(t < L * peak, (t / (L * peak)) ** 2, ((L - t) / (L * (1 - peak))) ** 1.5)
    n = rng.standard_normal(len(t))
    low, high = lowpass(n, 600), lowpass(n, 4000)
    sig = highpass((1 - shape) * low + shape * high, 200) * shape
    return sig / (np.abs(sig).max() + 1e-9), L * peak


def fx_impact() -> np.ndarray:
    t = t_axis(1.0)
    body = np.sin(2 * np.pi * (36 * t + 120 / 18 * (1 - np.exp(-18 * t)))) * np.exp(-t * 4)
    hit = lowpass(rng.standard_normal(len(t)), 3000) * np.exp(-t * 30)
    return np.tanh(1.5 * body + 0.5 * hit)


def fx_hit() -> np.ndarray:
    t = t_axis(0.35)
    body = np.sin(2 * np.pi * (70 * t + 80 / 30 * (1 - np.exp(-30 * t)))) * np.exp(-t * 12)
    snap = np.pad(clap(), (0, len(t)))[: len(t)]
    return np.tanh(1.4 * body + 0.4 * snap)


def fx_panel() -> np.ndarray:
    t = t_axis(0.25)
    thump = np.sin(2 * np.pi * (90 * t + 60 / 30 * (1 - np.exp(-30 * t)))) * np.exp(-t * 18)
    return 0.8 * thump + 0.5 * np.pad(fx_click(), (0, len(t) - len(fx_click())))


def fx_zip() -> np.ndarray:
    L = 0.4
    t = t_axis(L)
    f = 800 + 2400 * (t / L) ** 2
    sig = lowpass(square(1, np.cumsum(f) / SR, 0.3), 5000)
    return sig * np.sin(np.pi * t / L) * 0.35


def fx_chime() -> np.ndarray:
    t = t_axis(1.0)
    sig = sum(a * np.sin(2 * np.pi * midi(n) * t) for n, a in ((86, 1.0), (93, 0.6), (98, 0.35)))
    return sig * np.exp(-t * 4) * np.minimum(1, t / 0.003) / 2


def fx_power() -> np.ndarray:
    L = 0.6
    t = t_axis(L)
    f = 120 + 900 * (1 - np.exp(-t * 8))
    sig = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.3 * square(1, np.cumsum(f * 2) / SR, 0.5)
    return lowpass(sig, 3000) * np.exp(-t * 3) * np.minimum(1, t / 0.01) * 0.6


def fx_cut() -> np.ndarray:
    t = t_axis(0.2)
    return lowpass(rng.standard_normal(len(t)), 6000) * np.exp(-t * 35) * 0.7


def fx_rise(L: float) -> np.ndarray:
    t = t_axis(L)
    n = rng.standard_normal(len(t))
    shape = (t / L) ** 2
    sig = highpass((1 - shape) * lowpass(n, 800) + shape * lowpass(n, 7000), 300)
    tone = np.sin(2 * np.pi * np.cumsum(200 + 1200 * shape) / SR) * 0.3
    return (sig / (np.abs(sig).max() + 1e-9) + tone) * shape * 0.6


def fx_final() -> np.ndarray:
    L = 2.4
    t = t_axis(L)
    sig = sum(a * np.sin(2 * np.pi * midi(n) * t) for n, a in ((38, 1.0), (50, 0.7), (57, 0.5), (62, 0.4), (69, 0.25), (74, 0.15)))
    return sig * np.minimum(1, t / 0.01) * np.exp(-t * 1.3) / 2.4


def make_sfx() -> np.ndarray:
    buf = np.zeros((N, 2))
    for sh in TL["shots"]:
        for fx in sh["sfx"]:
            at = (sh["start"] + fx["cue"]) / FPS
            g, kind = fx["gain"], fx["type"]
            if kind == "click":
                place(buf, fx_click(), at, g)
            elif kind == "typing":
                for k in range(fx["count"]):
                    place(buf, pan(fx_type() * rng.uniform(0.7, 1), rng.uniform(-0.3, 0.3)), at + k * fx["step"] / FPS, g)
            elif kind == "ticks":
                for k in range(fx["count"]):
                    place(buf, pan(fx_click() * 0.6, rng.uniform(-0.5, 0.5)), at + k * fx["step"] / FPS, g)
            elif kind == "pop":
                place(buf, pan(fx_pop(), rng.uniform(-0.3, 0.3)), at, g)
            elif kind == "whoosh":
                s, pk = fx_whoosh()
                place(buf, pan(s, -0.2), at - pk, g)
            elif kind == "impact":
                place(buf, fx_impact(), at, g)
            elif kind == "hit":
                place(buf, fx_hit(), at, g)
            elif kind == "panel":
                place(buf, fx_panel(), at, g)
            elif kind == "zip":
                place(buf, pan(fx_zip(), 0.2), at, g)
            elif kind == "chime":
                place(buf, pan(fx_chime(), 0.15), at, g)
            elif kind == "power":
                place(buf, fx_power(), at, g)
            elif kind == "cut":
                place(buf, fx_cut(), at, g)
            elif kind == "rise":
                L = fx["length"]
                place(buf, fx_rise(L), at, g)
            elif kind == "final":
                place(buf, fx_final(), at, g)
            else:
                raise ValueError(kind)
    # Riser into the drop (the breakdown bar before the city inserts).
    place(buf, fx_rise(2 * BEAT), DROP - 2 * BEAT, 0.5)
    return buf


# --------------------------------------------------------------------------- #
def envelope(x: np.ndarray, release=0.15) -> np.ndarray:
    mono = np.abs(x).max(axis=1)
    blk = 240
    peaks = np.maximum.reduceat(mono, np.arange(0, len(mono), blk))
    a = np.exp(-blk / (release * SR))
    env = np.empty_like(peaks)
    acc = 0.0
    for i, v in enumerate(peaks):
        acc = max(v, a * acc)
        env[i] = acc
    return np.repeat(env, blk)[: len(mono)]


def limit(x: np.ndarray, ceiling_db=-1.0) -> np.ndarray:
    c, knee = db(ceiling_db), db(-6)
    m = np.abs(x)
    o = m > knee
    y = x.copy()
    y[o] = np.sign(x[o]) * (knee + (c - knee) * np.tanh((m[o] - knee) / (c - knee)))
    return y


def write_wav(path: Path, x: np.ndarray) -> None:
    pcm = (np.clip(x, -1, 1) * 32767).astype("<i2")
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def stats(name: str, x: np.ndarray) -> None:
    p, r = np.abs(x).max(), np.sqrt(np.mean(x ** 2))
    print(f"{name:6s} peak {20*np.log10(p+1e-12):6.1f} dBFS  rms {20*np.log10(r+1e-12):6.1f} dBFS  "
          f"last-30ms {np.abs(x[-int(0.03*SR):]).max():.5f}  length {len(x)/SR:.3f}s")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    music, sfx = make_music(), make_sfx()
    music *= db(-7) / (np.abs(music).max() + 1e-9)
    sfx *= db(-6) / (np.abs(sfx).max() + 1e-9)
    duck = 1 - (1 - db(-3)) * np.clip(envelope(sfx) / db(-12), 0, 1)
    mix = music * duck[:, None] + sfx
    mix *= db(-1.5) / (np.abs(mix).max() + 1e-9)
    mix *= db(4.5)  # drive into the soft limiter: a loud, punchy teaser master
    mix = limit(mix, -1.0)
    fade = int(0.5 * SR)
    mix[-fade:] *= (np.linspace(1, 0, fade) ** 2)[:, None]
    mix[-int(0.03 * SR):] = 0
    for name, x in (("music", music), ("sfx", sfx), ("mix", mix)):
        write_wav(OUT / f"{name}.wav", x)
        stats(name, x)
    assert np.abs(mix).max() <= db(-1.0) + 1e-6
    assert len(mix) == N
    print(f"wrote {OUT.relative_to(ROOT)}/{{music,sfx,mix}}.wav")


if __name__ == "__main__":
    main()
