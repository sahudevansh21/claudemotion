#!/usr/bin/env python3
"""
Generate the Allocra voiceover locally with Kokoro (open-source TTS, Apache-2.0).

    pip install -r scripts/allocra/requirements.txt
    # model files (~350 MB) — downloaded once:
    #   https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
    #   https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
    python3 scripts/allocra/generate_vo.py --models <dir with the two files>

Writes public/allocra/vo/<id>.wav (48 kHz mono, trimmed, normalised) and
src/compositions/Allocra/vo.json with each line's duration in seconds.
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
    ap.add_argument("--models", required=True, help="folder with kokoro-v1.0.onnx + voices-v1.0.bin")
    args = ap.parse_args()
    m = Path(args.models)
    script = json.loads((ROOT / "scripts/allocra/vo_script.json").read_text())
    k = Kokoro(str(m / "kokoro-v1.0.onnx"), str(m / "voices-v1.0.bin"))
    out_dir = ROOT / "public/allocra/vo"
    out_dir.mkdir(parents=True, exist_ok=True)
    meta = {}
    for line in script["lines"]:
        audio, sr = k.create(line["text"], voice=script["voice"], speed=line["speed"], lang="en-us")
        audio = np.asarray(audio, dtype=np.float64)
        # Trim leading/trailing silence (−45 dBFS), keep 40 ms pads.
        idx = np.where(np.abs(audio) > 10 ** (-45 / 20))[0]
        pad = int(0.04 * sr)
        audio = audio[max(0, idx[0] - pad): idx[-1] + pad]
        audio = resample_poly(audio, 2, 1)  # 24 kHz -> 48 kHz
        audio *= 10 ** (-3 / 20) / (np.abs(audio).max() + 1e-9)  # peak −3 dBFS
        sf.write(out_dir / f"{line['id']}.wav", audio, 48000, subtype="PCM_16")
        meta[line["id"]] = {"text": line["text"], "seconds": round(len(audio) / 48000, 3)}
        print(f"{line['id']:4s} {meta[line['id']]['seconds']:5.2f}s  {line['text']}")
    (ROOT / "src/compositions/Allocra").mkdir(parents=True, exist_ok=True)
    (ROOT / "src/compositions/Allocra/vo.json").write_text(json.dumps(meta, indent=2) + "\n")


if __name__ == "__main__":
    main()
