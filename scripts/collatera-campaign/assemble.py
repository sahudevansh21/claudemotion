#!/usr/bin/env python3
"""Assemble the COLLATERA 15-day pack into day-wise folders + a zip.

    python3 scripts/collatera-campaign/assemble.py

Output: deliverables/Collatera/Day-01_Mon-27-Oct/ … Day-15_…/ and deliverables/Collatera.zip
Each day folder holds that day's videos (1080p60 MP4), post images (JPG),
articles (Markdown) and a CAPTIONS.txt with copy, hashtags and posting times.
"""
from __future__ import annotations

import datetime as dt
import shutil
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(Path(__file__).parent))
from content import CALENDAR, DELIVERABLES  # noqa: E402

D = ROOT / "deliverables"
OUT = D / "Collatera"
START = dt.date(2026, 10, 27)
BY = {d["id"]: d for d in DELIVERABLES}

STILLS = ROOT / "out/campaign/stills"
FILES = {
    "V1": [(D / "collatera-campaign/day01/V1-introducing-collatera-1080p60.mp4", "V1-introducing-collatera-1080p60.mp4"),
           (D / "collatera-campaign/day01/V1-sound-effects-only.mp3", "V1-sound-effects-only.mp3")],
    "V2": [(ROOT / "out/campaign/v2.mp4", "V2-know-what-changed-1080p60.mp4")],
    "V3": [(ROOT / "out/campaign/v3.mp4", "V3-watch-the-oracle-1080p60.mp4")],
    "V4": [(ROOT / "out/campaign/v4.mp4", "V4-your-oracle-is-stale-1080p60.mp4")],
    "V5": [(ROOT / "out/campaign/v5.mp4", "V5-every-risk-in-view-1080p60.mp4")],
    "V6": [(ROOT / "out/campaign/v6.mp4", "V6-lending-stack-1080p60.mp4")],
    "V7": [(ROOT / "out/campaign/v7.mp4", "V7-monitoring-first-1080p60.mp4")],
    "P1": [(D / "collatera-poster-16x9-4k.jpg", "P1-launch-poster-16x9.jpg"), (D / "collatera-poster-4x5.jpg", "P1-launch-poster-4x5.jpg")],
    "P2": [(STILLS / f"p2-{i}.jpg", f"P2-stale-oracle-carousel-slide-{i}-of-5.jpg") for i in range(1, 6)],
    "P3": [(STILLS / "p3.jpg", "P3-position-health-4x5.jpg")],
    "P4": [(D / "collatera-posts/03-backs-your-position.jpg", "P4-know-what-backs-your-position-4x5.jpg")],
    "P5": [(STILLS / "p5.jpg", "P5-markets-close-1x1.jpg")],
    "P6": [(STILLS / "p6.jpg", "P6-ecosystem-map-16x9.jpg")],
    "P7": [(D / "collatera-posts/04-steps.jpg", "P7-four-steps-4x5.jpg")],
    "P8": [(STILLS / "p8.jpg", "P8-token-proposal-not-promise-1x1.jpg")],
    "A1": [(D / "collatera-campaign/articles/A1-oracle-freshness.md", "A1-oracle-freshness-article.md"), (STILLS / "a1.jpg", "A1-header-16x9.jpg")],
    "A2": [(D / "collatera-campaign/articles/A2-overnight-gap.md", "A2-overnight-gap-article.md"), (STILLS / "a2.jpg", "A2-header-16x9.jpg")],
    "A3": [(D / "collatera-campaign/articles/A3-position-health.md", "A3-position-health-article.md"), (STILLS / "a3.jpg", "A3-header-16x9.jpg")],
    "A4": [(D / "collatera-campaign/articles/A4-monitoring-first.md", "A4-monitoring-first-article.md"), (STILLS / "a4.jpg", "A4-header-16x9.jpg")],
    "A5": [(D / "collatera-campaign/articles/A5-lending-stack.md", "A5-lending-stack-article.md"), (STILLS / "a5.jpg", "A5-header-16x9.jpg")],
}

TAGS = {
    "VIDEO": ("#DeFi #RWA #Algorand", "#DeFi #TokenizedAssets #RWA #RiskManagement #Algorand", "#DeFi #RWA #TokenizedStocks #Crypto #Web3 #Algorand #OnChain #CryptoTools #Fintech #Collatera"),
    "POST": ("#DeFi #RWA #Algorand", "#DeFi #TokenizedAssets #RWA #RiskManagement", "#DeFi #RWA #TokenizedStocks #Crypto #Web3 #Algorand #OnChain #Fintech #Collatera"),
    "ARTICLE": ("#DeFi #RWA", "#DeFi #TokenizedAssets #RWA #RiskManagement", "#DeFi #RWA #TokenizedStocks #Web3 #Collatera"),
}
TIMES = {"VIDEO": "14:00 UTC", "POST": "17:00 UTC", "ARTICLE": "15:00 UTC"}


def main():
    if OUT.exists():
        shutil.rmtree(OUT)
    missing = []
    for d, ids, theme in CALENDAR:
        date = START + dt.timedelta(days=d - 1)
        folder = OUT / f"Day-{d:02d}_{date.strftime('%a-%d-%b')}"
        folder.mkdir(parents=True)
        cap = [f"COLLATERA · DAY {d:02d} · {date.strftime('%A %d %B %Y')} · theme: {theme}", "=" * 64, ""]
        for i in ids:
            x = BY[i]
            for src, name in FILES[i]:
                if src.exists():
                    shutil.copy2(src, folder / name)
                else:
                    missing.append(str(src))
            t = TAGS[x["kind"]]
            cap += [
                f"[{i}] {x['kind']} · {x['title']}",
                f"Post at: {TIMES[x['kind']]} · Channels: {x['platform']} · Format: {x['fmt']}",
                "",
                "CAPTION:",
                x["caption"],
                "",
                f"Hashtags · X: {t[0]}",
                f"Hashtags · LinkedIn: {t[1]}",
                f"Hashtags · Instagram: {t[2]}",
                "",
                f"Note: {x['notes']}",
                "",
                "-" * 64,
                "",
            ]
        cap += ["Rules: keep 'SIMULATED DATA' labels visible · never tag Aave/Euler/Morpho/Sentora/Robinhood (coverage targets, not partners) · add 'Not financial advice.' to articles."]
        (folder / "CAPTIONS.txt").write_text("\n".join(cap))
    readme = ["COLLATERA · 15-DAY CONTENT PACK", "", "One folder per day. Each has the videos (1080p 60 fps MP4), post images (JPG),",
              "articles (Markdown) and CAPTIONS.txt (caption, hashtags, posting time).", "", "Full plan: Collatera-content-plan.pdf", ""]
    for d, ids, theme in CALENDAR:
        date = START + dt.timedelta(days=d - 1)
        readme.append(f"Day {d:02d} {date.strftime('%a %d %b')}: " + " · ".join(f"{i} {BY[i]['title']}" for i in ids))
    (OUT / "README.txt").write_text("\n".join(readme))
    shutil.copy2(D / "collatera-content-plan.pdf", OUT / "Collatera-content-plan.pdf")
    zp = D / "Collatera.zip"
    with zipfile.ZipFile(zp, "w", zipfile.ZIP_DEFLATED) as z:
        for f in sorted(OUT.rglob("*")):
            if f.is_file():
                z.write(f, f.relative_to(D))
    print("missing:", missing or "none")
    print("zip:", zp, round(zp.stat().st_size / 1e6, 1), "MB")


if __name__ == "__main__":
    main()
