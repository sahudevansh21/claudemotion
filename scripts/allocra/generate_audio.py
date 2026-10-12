#!/usr/bin/env python3
"""
Score, sound design and final mix for the Allocra film.

Reads src/compositions/Allocra/timeline.json (shots, sfx cues, VO placement)
and the voiceover WAVs from scripts/allocra/generate_vo.py. Everything else is
synthesised with numpy/scipy (no samples).

    python3 scripts/allocra/generate_audio.py

Writes public/allocra/audio/{music,sfx,vo,mix}.wav (48 kHz stereo). The video
uses mix.wav.

Dramaturgy
  Act 1 (0–10 s)  tension: sub drone + ticking pulse that accelerates, glassy
                  notification pings, hits on every cut, rising tone into…
  Black (10–10.8) hard cut to near-silence (a faint high ring)
  Act 2 (10.8–25) calm: warm felt-piano chords, soft pad, slow heartbeat sub
  End (25–30)     low boom, resolving chord, clean fade to digital silence
"""
from __future__ import annotations

import json
import wave
from pathlib import Path

import numpy as np
import soundfile as sf
from scipy.signal import lfilter

ROOT = Path(__file__).resolve().parents[2]
TL = json.loads((ROOT / "src/compositions/Allocra/timeline.json").read_text())
OUT = ROOT / "public/allocra/audio"
SR = 48_000
FPS = TL["fps"]
DUR = TL["durationInFrames"] / FPS
N = int(round(DUR * SR))
SHOT = {s["id"]: (s["start"] / FPS, s["end"] / FPS) for s in TL["shots"]}
ACT2 = SHOT["dawn"][0]
BLACK = SHOT["black"]
END = SHOT["endcard"][0]
rng = np.random.default_rng(31)


def t_axis(s: float) -> np.ndarray:
    return np.arange(int(s * SR)) / SR


def midi(n: float) -> float:
    return 440 * 2 ** ((n - 69) / 12)


def db(x: float) -> float:
    return 10 ** (x / 20)


def lp(x, fc):
    a = np.exp(-2 * np.pi * fc / SR)
    return lfilter([1 - a], [1, -a], x)


def hp(x, fc):
    return x - lp(x, fc)


def pan(sig, p):
    a = (p + 1) * np.pi / 4
    return np.stack([sig * np.cos(a), sig * np.sin(a)], axis=1)


def place(buf, sig, at, g=1.0):
    if sig.ndim == 1:
        sig = np.stack([sig, sig], axis=1)
    s = int(round(at * SR))
    if s < 0:
        sig, s = sig[-s:], 0
    e = min(s + len(sig), len(buf))
    if e > s:
        buf[s:e] += sig[: e - s] * g


# --------------------------------------------------------------------------- #
# music
# --------------------------------------------------------------------------- #
def piano(f, L=3.5):
    """Felt-piano-ish tone: a few decaying partials with soft attack."""
    t = t_axis(L)
    sig = np.zeros_like(t)
    for h, a, d in ((1, 1.0, 1.6), (2, 0.45, 2.6), (3, 0.2, 3.8), (4, 0.1, 5.0)):
        sig += a * np.sin(2 * np.pi * f * h * t * (1 + 0.0004 * h)) * np.exp(-t * d)
    hammer = lp(rng.standard_normal(len(t)), 1200) * np.exp(-t * 60) * 0.05
    return lp(sig + hammer, 2500) * np.minimum(1, t / 0.008)


def pad(freqs, L):
    t = t_axis(L)
    sig = sum(np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) + 0.3 * np.sin(2 * np.pi * 2.003 * f * t) for f in freqs)
    env = np.minimum(1, t / 1.2) * np.clip((L - t) / 1.0, 0, 1)
    return lp(sig, 1100) * env / len(freqs)


def make_music() -> np.ndarray:
    buf = np.zeros((N, 2))
    a1_end = BLACK[0]

    # --- Act 1: sub drone + accelerating tick + rising tone ---------------
    t = t_axis(a1_end)
    drone = (np.sin(2 * np.pi * 41.2 * t) + 0.5 * np.sin(2 * np.pi * 61.7 * t)) * np.minimum(1, t / 0.6)
    drone *= 0.6 + 0.4 * (t / a1_end)
    place(buf, pan(drone, 0) * 0.9, 0, db(-12))
    rise_f = 220 * 2 ** (t / a1_end * 1.2)
    rise = np.sin(2 * np.pi * np.cumsum(rise_f) / SR) * (t / a1_end) ** 2.5
    place(buf, pan(lp(rise, 2500), 0.15), 0, db(-24))
    # Tick: interval shrinks from 0.5 s to 0.18 s (clock / heartbeat tension)
    tt, k = 0.3, 0
    while tt < a1_end - 0.05:
        tk = t_axis(0.03)
        tick = hp(rng.standard_normal(len(tk)), 3500) * np.exp(-tk * 220)
        place(buf, pan(tick, 0.4 if k % 2 else -0.4), tt, db(-24))
        sub_t = t_axis(0.25)
        sub = np.sin(2 * np.pi * (48 * sub_t + 40 / 25 * (1 - np.exp(-25 * sub_t)))) * np.exp(-sub_t * 14)
        if k % 2 == 0:
            place(buf, sub, tt, db(-15))
        frac = tt / a1_end
        tt += 0.5 - 0.32 * frac
        k += 1

    # --- Black: faint high ring (tinnitus) -------------------------------
    tb = t_axis(BLACK[1] - BLACK[0] + 0.4)
    ring = np.sin(2 * np.pi * 3520 * tb) * np.exp(-tb * 2.2) * 0.25
    place(buf, ring, BLACK[0], db(-26))

    # --- Act 2: warm piano chords + pad + slow heartbeat ------------------
    # D major colour: Dmaj9 | Bm11 | Gmaj7 | Aadd9
    prog = [[50, 57, 61, 64, 66], [47, 54, 57, 62, 64], [43, 50, 54, 59, 62], [45, 52, 57, 59, 64]]
    bar = 2.4
    t0 = ACT2 + 0.2
    i = 0
    while t0 < END:
        chord = prog[i % 4]
        # rolled chord (strummed by a pianist's hand)
        for j, n in enumerate(chord):
            place(buf, pan(piano(midi(n + 12)), -0.3 + 0.15 * j), t0 + j * 0.035, db(-23))
        # sparse melody note on the off-beat
        place(buf, pan(piano(midi(chord[-1] + 12 + (2 if i % 2 else 0)), 2.5), 0.25), t0 + bar / 2, db(-27))
        L = min(bar + 0.8, END - t0 + 1.0)
        place(buf, pan(pad([midi(n) for n in chord[:3]], L), 0), t0, db(-27))
        t0 += bar
        i += 1
    hb = ACT2 + 0.6
    while hb < END:
        st = t_axis(0.3)
        thump = np.sin(2 * np.pi * (44 * st + 30 / 20 * (1 - np.exp(-20 * st)))) * np.exp(-st * 12)
        place(buf, thump, hb, db(-22))
        place(buf, thump * 0.6, hb + 0.28, db(-22))
        hb += 1.2

    # --- End: resolving chord, long tail ----------------------------------
    for j, n in enumerate([38, 50, 57, 62, 66, 69, 74]):
        place(buf, pan(piano(midi(n + 12), DUR - END), -0.3 + 0.1 * j), END + 0.1 + j * 0.04, db(-20))
    place(buf, pad([midi(50), midi(57), midi(62)], DUR - END), END, db(-22))

    fade = int(2.0 * SR)
    buf[-fade:] *= (0.5 * (1 + np.cos(np.linspace(0, np.pi, fade))))[:, None]
    buf[-int(0.03 * SR):] = 0
    return buf


# --------------------------------------------------------------------------- #
# sfx
# --------------------------------------------------------------------------- #
def fx_ping():
    t = t_axis(0.35)
    f = rng.choice([1568, 1760, 2093, 1975])
    sig = np.sin(2 * np.pi * f * t) * np.exp(-t * 14) + 0.3 * np.sin(2 * np.pi * f * 1.5 * t) * np.exp(-t * 22)
    return sig * 0.6


def fx_hit():
    t = t_axis(0.6)
    body = np.sin(2 * np.pi * (38 * t + 70 / 18 * (1 - np.exp(-18 * t)))) * np.exp(-t * 7)
    snap = hp(rng.standard_normal(len(t)), 1500) * np.exp(-t * 60) * 0.35
    return np.tanh(1.2 * body + snap)


def fx_whoosh():
    L = 0.6
    t = t_axis(L)
    pk = 0.65
    sh = np.where(t < L * pk, (t / (L * pk)) ** 2, ((L - t) / (L * (1 - pk))) ** 1.5)
    n = rng.standard_normal(len(t))
    sig = hp((1 - sh) * lp(n, 500) + sh * lp(n, 3500), 150) * sh
    return sig / (np.abs(sig).max() + 1e-9), L * pk


def fx_riser(L):
    t = t_axis(L)
    n = lp(rng.standard_normal(len(t)), 1500)
    return n / (np.abs(n).max() + 1e-9) * (t / L) ** 2


def fx_lock():  # phone screen lock "clack"
    t = t_axis(0.12)
    return (hp(rng.standard_normal(len(t)), 2000) * np.exp(-t * 90) + 0.6 * np.sin(2 * np.pi * 900 * t) * np.exp(-t * 70))


def fx_cut():  # the hard cut to black: a deep, short downer
    t = t_axis(1.2)
    return np.sin(2 * np.pi * (30 * t + 60 / 6 * (1 - np.exp(-6 * t)))) * np.exp(-t * 3) * 0.9


def fx_swell(L):
    t = t_axis(L)
    env = np.sin(np.pi * np.minimum(t / L, 1)) ** 2
    air = lp(rng.standard_normal(len(t)), 900)
    return air / (np.abs(air).max() + 1e-9) * env * 0.6


def fx_tick():
    t = t_axis(0.05)
    return np.sin(2 * np.pi * 2200 * t) * np.exp(-t * 160) * 0.6 + hp(rng.standard_normal(len(t)), 4000) * np.exp(-t * 400) * 0.3


def fx_chime():
    out = np.zeros(int(1.6 * SR))
    for i, n in enumerate((81, 86, 90)):
        p = piano(midi(n), 1.4)
        o = int(i * 0.07 * SR)
        out[o:o + len(p)] += p[: len(out) - o]
    return out * 0.5


def fx_breath():  # a held moment — soft air swell
    t = t_axis(0.9)
    n = lp(hp(rng.standard_normal(len(t)), 300), 2500)
    return n / (np.abs(n).max() + 1e-9) * np.sin(np.pi * t / 0.9) ** 2 * 0.4


def fx_boom():
    t = t_axis(2.5)
    body = np.sin(2 * np.pi * (32 * t + 50 / 8 * (1 - np.exp(-8 * t)))) * np.exp(-t * 2)
    air = lp(rng.standard_normal(len(t)), 600) * np.exp(-t * 4) * 0.3
    return np.tanh(1.1 * body + air)


def make_sfx():
    buf = np.zeros((N, 2))
    for s in TL["shots"]:
        for fx in s["sfx"]:
            c = fx["cue"]
            at = (s["start"] + (s["cues"][c] if isinstance(c, str) else c)) / FPS
            g, k = fx["gain"], fx["type"]
            if k == "ping":
                place(buf, pan(fx_ping(), rng.uniform(-0.6, 0.6)), at, g)
            elif k == "pings":
                for i in range(fx["count"]):
                    place(buf, pan(fx_ping(), rng.uniform(-0.6, 0.6)), at + i * fx["step"] / FPS, g * (0.8 + 0.2 * rng.random()))
            elif k == "hit":
                place(buf, fx_hit(), at, g)
            elif k == "whoosh":
                sig, pk = fx_whoosh()
                place(buf, pan(sig, -0.2), at - pk, g)
            elif k == "riser":
                place(buf, pan(fx_riser(fx["length"]), 0.1), at, g)
            elif k == "lock":
                place(buf, fx_lock(), at, g)
            elif k == "cut":
                place(buf, fx_cut(), at, g)
            elif k == "swell":
                place(buf, pan(fx_swell(fx["length"]), 0.1), at, g)
            elif k == "tick":
                place(buf, pan(fx_tick(), rng.uniform(-0.2, 0.2)), at, g)
            elif k == "chime":
                place(buf, fx_chime(), at, g)
            elif k == "breath":
                place(buf, fx_breath(), at, g)
            elif k == "boom":
                place(buf, fx_boom(), at, g)
            else:
                raise ValueError(k)
    return buf


# --------------------------------------------------------------------------- #
def make_vo():
    buf = np.zeros((N, 2))
    for v in TL["vo"]:
        audio, sr = sf.read(ROOT / f"public/allocra/vo/{v['id']}.wav")
        assert sr == SR
        # Gentle "intimate" EQ: low-cut + slight presence lift; act 1 a touch drier.
        audio = hp(audio, 90)
        audio = audio + 0.25 * hp(audio, 3000)
        # Short room tail for space
        tail = np.zeros(len(audio) + int(0.25 * SR))
        tail[: len(audio)] += audio
        for d, gn in ((0.031, 0.12), (0.057, 0.08), (0.089, 0.05)):
            o = int(d * SR)
            tail[o:o + len(audio)] += audio * gn
        place(buf, tail, v["at"] / FPS, 1.0)
    return buf


def envelope(x, release=0.25):
    mono = np.abs(x).max(axis=1)
    blk = 240
    pk = np.maximum.reduceat(mono, np.arange(0, len(mono), blk))
    a = np.exp(-blk / (release * SR))
    env = np.empty_like(pk)
    acc = 0.0
    for i, v in enumerate(pk):
        acc = max(v, a * acc)
        env[i] = acc
    return np.repeat(env, blk)[: len(mono)]


def limit(x, ceil_db=-1.0):
    c, knee = db(ceil_db), db(-6)
    m = np.abs(x)
    o = m > knee
    y = x.copy()
    y[o] = np.sign(x[o]) * (knee + (c - knee) * np.tanh((m[o] - knee) / (c - knee)))
    return y


def write(path, x):
    pcm = (np.clip(x, -1, 1) * 32767).astype("<i2")
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    music, sfx, vo = make_music(), make_sfx(), make_vo()
    music *= db(-12) / (np.abs(music).max() + 1e-9)
    sfx *= db(-8) / (np.abs(sfx).max() + 1e-9)
    vo *= db(-3) / (np.abs(vo).max() + 1e-9)
    # Voice is king: duck music by 7 dB and sfx by 4 dB under the VO.
    v_env = np.clip(envelope(vo) / db(-14), 0, 1)
    mix = music * (1 - (1 - db(-7)) * v_env)[:, None] + sfx * (1 - (1 - db(-4)) * v_env)[:, None] + vo
    mix *= db(-1.5) / (np.abs(mix).max() + 1e-9)
    mix = limit(mix, -1.0)
    f = int(0.5 * SR)
    mix[-f:] *= (np.linspace(1, 0, f) ** 2)[:, None]
    mix[-int(0.03 * SR):] = 0
    for name, x in (("music", music), ("sfx", sfx), ("vo", vo), ("mix", mix)):
        write(OUT / f"{name}.wav", x)
        p, r = np.abs(x).max(), np.sqrt(np.mean(x ** 2))
        print(f"{name:6s} peak {20*np.log10(p+1e-12):6.1f} dBFS  rms {20*np.log10(r+1e-12):6.1f}  end {np.abs(x[-1440:]).max():.5f}")
    assert np.abs(mix).max() <= db(-1.0) + 1e-6 and len(mix) == N
    print("wrote public/allocra/audio/{music,sfx,vo,mix}.wav")


if __name__ == "__main__":
    main()
