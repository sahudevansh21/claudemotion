#!/usr/bin/env python3
"""
Generate the NightshiftLaunch voiceover locally with Kokoro (open-source TTS).

    python3 scripts/nightshift/generate_launch_vo.py --models <dir with kokoro-v1.0.onnx + voices-v1.0.bin>

Reads scripts/nightshift/launch_vo_script.json (text, start time, speed), writes
public/nightshift/launch-vo/<id>.wav (48 kHz mono) and
src/compositions/Nightshift/launch/vo.json (start + duration per line), which the
film reads for captions/cues and the audio script reads for the mix.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro
from scipy.signal import resample_poly

ROOT = Path(__file__).resolve().parents[2]


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--models", required=True)
    m = Path(ap.parse_args().models)
    script = json.loads((ROOT / "scripts/nightshift/launch_vo_script.json").read_text())
    k = Kokoro(str(m / "kokoro-v1.0.onnx"), str(m / "voices-v1.0.bin"))
    out = ROOT / "public/nightshift/launch-vo"
    out.mkdir(parents=True, exist_ok=True)
    meta = {}
    for line in script["lines"]:
        audio, sr = k.create(line["text"], voice=script["voice"], speed=line["speed"], lang="en-us")
        audio = np.asarray(audio, dtype=np.float64)
        idx = np.where(np.abs(audio) > 10 ** (-45 / 20))[0]
        pad = int(0.03 * sr)
        audio = audio[max(0, idx[0] - pad): idx[-1] + pad]
        audio = resample_poly(audio, 2, 1)
        audio *= 10 ** (-3 / 20) / (np.abs(audio).max() + 1e-9)
        sf.write(out / f"{line['id']}.wav", audio, 48000, subtype="PCM_16")
        meta[line["id"]] = {"text": line["text"], "at": line["at"], "seconds": round(len(audio) / 48000, 3)}
        print(f"{line['id']:4s} at {line['at']:5.2f}  {meta[line['id']]['seconds']:5.2f}s  ends {line['at'] + meta[line['id']]['seconds']:5.2f}  {line['text']}")
    (ROOT / "src/compositions/Nightshift/launch/vo.json").write_text(json.dumps(meta, indent=2) + "\n")


if __name__ == "__main__":
    main()
