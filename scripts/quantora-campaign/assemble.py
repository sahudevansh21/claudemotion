#!/usr/bin/env python3
"""Assemble the QUANTORA 7-day pack: deliverables/Quantora/Day-0N_.../ + Quantora.zip.

Everything visual is 1080×1920 (videos 60 fps). Articles are written from
content.py into Markdown. Each day has CAPTIONS.txt.
"""
from __future__ import annotations

import datetime as dt
import shutil
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(Path(__file__).parent))
from content import CALENDAR, DELIVERABLES, START  # noqa: E402

D = ROOT / "deliverables"
OUT = D / "Quantora"
S = dt.date(*START)
BY = {d["id"]: d for d in DELIVERABLES}
ST = ROOT / "out/quantora/stills"
V = ROOT / "out/quantora"

FILES = {
    "QV1": [(V / "qv1-16x9.mp4", "QV1-introducing-quantora-16x9-1920x1080-60fps.mp4"), (ROOT / "public/collatera-campaign/qv1/sfx.wav", "QV1-sound-effects-only.wav")],
    "QV2": [(V / "qv2-16x9.mp4", "QV2-risk-context-evidence-16x9-1920x1080-60fps.mp4"), (ROOT / "public/collatera-campaign/qv2/sfx.wav", "QV2-sound-effects-only.wav")],
    "QV3": [(V / "qv3-16x9.mp4", "QV3-your-thesis-is-tested-16x9-1920x1080-60fps.mp4"), (ROOT / "public/collatera-campaign/qv3/sfx.wav", "QV3-sound-effects-only.wav")],
    "QP1": [(ST / "QP1-launch-poster.jpg", "QP1-launch-poster-1080x1920.jpg")],
    "QP2": [(ST / f"QP2-slide-{i}-of-5.jpg", f"QP2-how-we-read-a-chart-slide-{i}-of-5-1080x1920.jpg") for i in range(1, 6)],
    "QP3": [(ST / "QP3-tokenized-stocks-vs-etfs.jpg", "QP3-tokenized-stocks-vs-etfs-1080x1920.jpg")],
    "QP4": [(ST / "QP4-what-a-simulation-is.jpg", "QP4-what-a-simulation-is-1080x1920.jpg")],
    "QA1": [(ST / "QA1-cover.jpg", "QA1-cover-1080x1920.jpg")],
    "QA2": [(ST / "QA2-cover.jpg", "QA2-cover-1080x1920.jpg")],
    "QA3": [(ST / "QA3-cover.jpg", "QA3-cover-1080x1920.jpg")],
}
TAGS = ("#TokenizedStocks #OnchainFinance #QuantResearch", "#TokenizedStocks #ETFs #OnchainFinance #QuantResearch #MarketStructure", "#TokenizedStocks #ETFs #OnchainFinance #QuantResearch #Crypto #Web3 #MarketSimulation #Quantora")
TIMES = {"VIDEO": "14:00 UTC", "POST": "16:00 UTC", "ARTICLE": "18:00 UTC"}


def article_md(x):
    return "\n\n".join([f"# {x['title']}", f"*Quantora Labs · {x['id']} · Day {x['day']}*", *x["body"], "→ quantora.buzz", "*Not investment advice.*"]) + "\n"


def main():
    if OUT.exists():
        shutil.rmtree(OUT)
    missing = []
    for d, ids, theme in CALENDAR:
        date = S + dt.timedelta(days=d - 1)
        folder = OUT / f"Day-{d:02d}_{date.strftime('%a-%d-%b')}"
        folder.mkdir(parents=True)
        cap = [f"QUANTORA LABS · DAY {d:02d} · {date.strftime('%A %d %B %Y')} · theme: {theme}", "Videos 1920×1080 (16:9) 60 fps · posts 1080×1920 (9:16).", "=" * 64, ""]
        for i in ids:
            x = BY[i]
            for src, name in FILES[i]:
                if src.exists():
                    shutil.copy2(src, folder / name)
                else:
                    missing.append(str(src))
            if x["kind"] == "ARTICLE":
                (folder / f"{i}-{x['title'].split(':')[0].lower().replace(' ', '-').replace(',', '')}-article.md").write_text(article_md(x))
            cap += [f"[{i}] {x['kind']} · {x['title']}", f"Post at: {TIMES[x['kind']]} · Channels: {x['platform']}", "", "CAPTION:", x["caption"].replace("*", ""), "",
                    f"Hashtags · X: {TAGS[0]}", f"Hashtags · LinkedIn: {TAGS[1]}", f"Hashtags · Instagram/TikTok: {TAGS[2]}", "", f"Note: {x['notes']}", "", "-" * 64, ""]
        cap += ["Rules: no performance or return claims · charts are illustrative · simulations are not forecasts · add 'Not investment advice.' to articles."]
        (folder / "CAPTIONS.txt").write_text("\n".join(cap))
    readme = ["QUANTORA LABS · 7-DAY CONTENT PACK", "", "One folder per day: videos (1920×1080 16:9, 60 fps MP4 + SFX-only WAV), posts (1080×1920 JPG),", "articles (Markdown + 1080×1920 cover) and CAPTIONS.txt.", "", "Plan: Quantora-content-plan.pdf", ""]
    for d, ids, _ in CALENDAR:
        date = S + dt.timedelta(days=d - 1)
        readme.append(f"Day {d:02d} {date.strftime('%a %d %b')}: " + " · ".join(f"{i} {BY[i]['title']}" for i in ids))
    (OUT / "README.txt").write_text("\n".join(readme))
    shutil.copy2(D / "quantora-content-plan.pdf", OUT / "Quantora-content-plan.pdf")
    zp = D / "Quantora.zip"
    with zipfile.ZipFile(zp, "w", zipfile.ZIP_DEFLATED) as z:
        for f in sorted(OUT.rglob("*")):
            if f.is_file():
                z.write(f, f.relative_to(D))
    print("missing:", missing or "none")
    print("zip:", zp, round(zp.stat().st_size / 1e6, 1), "MB")


if __name__ == "__main__":
    main()
