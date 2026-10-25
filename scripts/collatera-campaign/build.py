#!/usr/bin/env python3
"""Build the COLLATERA 15-day content plan PDF (HTML → Chromium PDF).

    python3 scripts/collatera-campaign/build.py

Writes deliverables/collatera-content-plan.pdf.
"""
from __future__ import annotations

import datetime as dt
import html
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(Path(__file__).parent))
from content import CALENDAR, DELIVERABLES, PILLARS  # noqa: E402

OUT_HTML = ROOT / "out/collatera-plan/plan.html"
OUT_PDF = ROOT / "deliverables/collatera-content-plan.pdf"
START = dt.date(2026, 10, 27)

MASCOT = [
    "....#.......", "..#..#......", "#..######...", ".#####..##..", ".######.####", ".###########",
    ".####.......", ".###########", ".##########.", "..#######...", "...#####....",
]


def mascot_svg(cell=10, color="#75FF00", shadow="#00261C"):
    w, h = 12 * cell, 11 * cell
    off = max(1, round(cell * 0.28))
    rects = []
    for r, row in enumerate(MASCOT):
        for c, ch in enumerate(row):
            if ch == "#":
                rects.append(f'<rect x="{c*cell+off}" y="{r*cell+off}" width="{cell}" height="{cell}" fill="{shadow}"/>')
    for r, row in enumerate(MASCOT):
        for c, ch in enumerate(row):
            if ch == "#":
                rects.append(f'<rect x="{c*cell}" y="{r*cell}" width="{cell}" height="{cell}" fill="{color}"/>')
    return f'<svg width="{w+off}" height="{h+off}" viewBox="0 0 {w+off} {h+off}" shape-rendering="crispEdges">{"".join(rects)}</svg>'


def e(s):
    return html.escape(s).replace("\n", "<br>")


def day_date(d):
    return (START + dt.timedelta(days=d - 1)).strftime("%a %d %b")


BY_ID = {d["id"]: d for d in DELIVERABLES}
KIND_COLOR = {"VIDEO": "#75FF00", "POST": "#A4FF2B", "ARTICLE": "#D8FFE0"}

F = (ROOT / "public").as_uri()
CSS = f"""
@font-face {{ font-family: Silk; src: url('{F}/collatera/fonts/Silkscreen-Regular.ttf'); font-weight: 400; }}
@font-face {{ font-family: Silk; src: url('{F}/collatera/fonts/Silkscreen-Bold.ttf'); font-weight: 700; }}
@font-face {{ font-family: JBM; src: url('{F}/fonts/JetBrainsMono-Variable-latin.woff2'); font-weight: 100 900; }}
@font-face {{ font-family: Inter; src: url('{F}/fonts/Inter-Variable-latin.woff2'); font-weight: 100 900; }}
@page {{ size: A4; margin: 0; }}
* {{ box-sizing: border-box; }}
html, body {{ margin: 0; background: #002A1F; color: #D8FFE0; font-family: JBM, monospace; font-size: 8.6pt; line-height: 1.42;
  -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
.page {{ width: 210mm; height: 297mm; padding: 13mm 14mm 14mm; position: relative; page-break-after: always; overflow: hidden;
  background: radial-gradient(rgba(134,185,154,0.16) 1px, transparent 1.2px) 0 0/6mm 6mm, #002A1F; }}
.page:last-child {{ page-break-after: auto; }}
h1, h2, h3, .pix {{ font-family: Silk, monospace; font-weight: 700; letter-spacing: .5px; margin: 0; }}
h1 {{ font-size: 30pt; line-height: 1.15; color: #D8FFE0; }}
h2 {{ font-size: 15pt; color: #D8FFE0; margin-bottom: 3mm; }}
h3 {{ font-size: 11pt; color: #75FF00; }}
.lime {{ color: #75FF00; }} .sage {{ color: #86B99A; }}
.eyebrow {{ font-family: Silk; font-size: 8pt; color: #75FF00; display: flex; gap: 2mm; align-items: center; margin-bottom: 4mm; }}
.eyebrow:before {{ content: ""; width: 2mm; height: 2mm; background: #75FF00; display: inline-block; }}
.foot {{ position: absolute; left: 15mm; right: 15mm; bottom: 8mm; display: flex; justify-content: space-between; font-family: Silk; font-size: 7pt; color: #86B99A; }}
.panel {{ background: #003D2D; border: 1.2px solid #2E7A5A; box-shadow: 2.2mm 2.2mm 0 #00261C; padding: 3mm 4mm; margin-bottom: 3.5mm; }}
.panel.hi {{ border-color: #75FF00; }}
table {{ width: 100%; border-collapse: collapse; font-size: 7.8pt; }}
th {{ font-family: Silk; font-size: 7.5pt; color: #75FF00; text-align: left; padding: 2mm 2mm; border-bottom: 1.2px solid #75FF00; }}
td {{ padding: 1.2mm 2mm; border-bottom: 1px solid #2E7A5A; vertical-align: top; }}
.tag {{ font-family: Silk; font-size: 7pt; padding: .6mm 1.6mm; border: 1px solid currentColor; display: inline-block; margin: 0 1mm .8mm 0; }}
.chip {{ font-family: Silk; font-size: 7.5pt; padding: 1mm 2.4mm; background: #75FF00; color: #00301F; display: inline-block; }}
.grid2 {{ display: grid; grid-template-columns: 1fr 1fr; gap: 5mm; }}
.grid4 {{ display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; }}
.kv {{ display: grid; grid-template-columns: 30mm 1fr; gap: 1mm 4mm; font-size: 8.6pt; }}
.kv b {{ font-family: Silk; font-size: 7.5pt; color: #86B99A; font-weight: 400; padding-top: .6mm; }}
.prompt {{ background: #00140E; border: 1px dashed #75FF00; padding: 2.5mm 3mm; font-size: 7.4pt; color: #D8FFE0; white-space: pre-wrap; }}
.caption {{ background: #EDF7EA; color: #00301F; padding: 3mm 4mm; font-family: Inter, sans-serif; font-size: 8pt; line-height: 1.4; }}
.shots td:first-child {{ width: 17mm; color: #75FF00; font-family: Silk; font-size: 7.5pt; }}
.note {{ font-size: 7.8pt; color: #86B99A; border-left: 2px solid #75FF00; padding-left: 3mm; margin-top: 3mm; }}
.swatch {{ display: flex; gap: 3mm; align-items: center; margin-bottom: 2mm; font-size: 8pt; }}
.swatch i {{ width: 9mm; height: 9mm; display: inline-block; border: 1px solid #2E7A5A; }}
.article p {{ margin: 0 0 2mm; font-family: Inter, sans-serif; font-size: 8.4pt; line-height: 1.48; }}
.bigday {{ font-family: Silk; font-size: 20pt; color: #75FF00; line-height: 1; }}
.cal {{ display: grid; grid-template-columns: repeat(5, 1fr); gap: 3mm; }}
.cal .cell {{ background: #003D2D; border: 1.2px solid #2E7A5A; padding: 3mm; min-height: 30mm; box-shadow: 1.5mm 1.5mm 0 #00261C; }}
.cal .cell .t {{ font-size: 7.6pt; margin-top: 1.6mm; line-height: 1.35; }}
"""


def foot(n):
    return f'<div class="foot"><span>COLLATERA · 15-DAY CONTENT PLAN</span><span>collatera.buzz · @collatera_io</span><span>{n:02d}</span></div>'


def kind_tag(k):
    return f'<span class="tag" style="color:{KIND_COLOR[k]}">{k}</span>'


pages = []

# ── cover ──
pages.append(f"""
<div class="page" style="display:flex;flex-direction:column;justify-content:space-between;
 background: radial-gradient(ellipse at 75% 35%, rgba(117,255,0,0.18), transparent 45%), radial-gradient(rgba(134,185,154,0.16) 1px, transparent 1.2px) 0 0/6mm 6mm, #002A1F;">
  <div>
    <div class="eyebrow">COLLATERAL RISK MONITORING / CONTENT PLAN 001</div>
    <div style="margin:22mm 0 14mm 0;filter:drop-shadow(0 0 12mm rgba(117,255,0,.35))">{mascot_svg(22)}</div>
    <h1>CATCH STALE<br>ORACLES<br>BEFORE<br><span class="lime">THEY CATCH YOU.</span></h1>
    <p style="font-size:12pt;margin-top:10mm;max-width:150mm">A 15-day campaign for <b class="lime">Collatera</b>: 20 deliverables across posts, SaaS motion videos and short articles, with copy, captions and generation prompts for each.</p>
  </div>
  <div>
    <div style="display:flex;gap:3mm;margin-bottom:8mm">
      <span class="chip">7 VIDEOS</span><span class="chip">8 POSTS</span><span class="chip">5 ARTICLES</span><span class="chip">15 DAYS</span>
    </div>
    <div class="sage" style="font-size:8.5pt">Campaign window: {day_date(1)} – {day_date(15)} 2026 · Prepared {dt.date(2026,10,25).strftime('%d %b %Y')} · Sources: collatera.buzz, @collatera_io bio, brand assets supplied by the client.</div>
  </div>
</div>""")

# ── overview ──
pill = "".join(f'<div class="panel"><h3>{t}</h3><div style="margin-top:2mm">{e(d)}</div></div>' for t, d in PILLARS)
pages.append(f"""
<div class="page">
  <div class="eyebrow">01 / CAMPAIGN OVERVIEW</div>
  <h2>ONE MESSAGE, FOUR PILLARS.</h2>
  <div class="panel hi"><h3>CORE MESSAGE</h3><div style="margin-top:2mm;font-size:11pt">Catch stale oracles before they catch you. Collatera shows tokenized-asset price, oracle freshness and your liquidation line side by side, <span class="lime">read-only</span>, with no keys and no signatures.</div></div>
  <div class="grid4">{pill}</div>
  <h3 style="margin:4mm 0 3mm">GOALS</h3>
  <table><tr><th>GOAL</th><th>HOW</th><th>KPI TO TRACK</th></tr>
   <tr><td>Awareness</td><td>Launch video + poster, daily posting on X</td><td>Impressions, follower growth on @collatera_io</td></tr>
   <tr><td>Understanding</td><td>Explainer carousel, articles, product videos</td><td>Saves, bookmarks, article read-through</td></tr>
   <tr><td>Demo visits</td><td>CTA to collatera.buzz/app in videos and articles</td><td>Link clicks, demo sessions, addresses watched</td></tr>
   <tr><td>Trust</td><td>Read-only and roadmap honesty content</td><td>Replies and quote-posts, sentiment</td></tr></table>
  <h3 style="margin:6mm 0 3mm">CONTENT MIX: 20 DELIVERABLES</h3>
  <table><tr><th>TYPE</th><th>COUNT</th><th>FORMAT</th><th>STYLE</th></tr>
   <tr><td>{kind_tag('VIDEO')}</td><td>7</td><td>20–30 s SaaS motion films, 1080p 60 fps + 9:16 cuts</td><td>Locked whatships references only: Supabase, Notion AI, Krea 3, Conqueror, Acceternity</td></tr>
   <tr><td>{kind_tag('POST')}</td><td>8</td><td>4:5, 1:1, 16:9 stills and one carousel</td><td>Pixel-terminal brand system (as on the site)</td></tr>
   <tr><td>{kind_tag('ARTICLE')}</td><td>5</td><td>≈300-word posts for X Articles, Medium, LinkedIn and the blog</td><td>Plain, calm, factual founder voice</td></tr></table>
  {foot(2)}
</div>""")

# ── brand & guardrails ──
sw = "".join(f'<div class="swatch"><i style="background:{c}"></i><span><b class="pix" style="font-size:7.5pt">{n}</b> {c}</span></div>' for n, c in [
    ("NIGHT", "#002A1F"), ("EVERGREEN", "#003D2D"), ("FOREST", "#004B35"), ("LIME", "#75FF00"), ("CHARTREUSE", "#A4FF2B"), ("MINT", "#D8FFE0"), ("SAGE", "#86B99A"), ("PAPER", "#EDF7EA")])
pages.append(f"""
<div class="page">
  <div class="eyebrow">02 / BRAND SYSTEM &amp; GUARDRAILS</div>
  <h2>LOOK, VOICE, RULES.</h2>
  <div class="grid2">
    <div class="panel"><h3>PALETTE</h3><div style="margin-top:3mm">{sw}</div></div>
    <div class="panel"><h3>TYPE &amp; SHAPES</h3>
      <div style="margin-top:3mm"><span class="pix" style="font-size:14pt">SILKSCREEN</span><br><span class="sage">Display and headlines, uppercase pixel type (lookalike of the site's font)</span></div>
      <div style="margin-top:3mm;font-size:11pt">JetBrains Mono</div><div class="sage">Body, data, labels</div>
      <div style="margin-top:3mm;font-family:Inter;font-size:11pt">Inter</div><div class="sage">Video captions in the reference styles</div>
      <div style="margin-top:4mm">Bordered panels · offset dark pixel shadow · dotted grid · lime CTA buttons · the 12×11 pixel mascot</div>
      <div style="margin-top:4mm">{mascot_svg(6)}</div></div>
  </div>
  <div class="grid2">
    <div class="panel"><h3>VOICE</h3><div style="margin-top:2mm">Short, calm, precise. Lead with the risk, then the view. Use the site's own phrases:<br>"Catch stale oracles before they catch you." · "Watch the price. Watch the oracle." · "Know what changed before you act." · "Markets close. Loans don't." · "Monitoring first. Automation later."</div></div>
    <div class="panel"><h3>MOTION RULE</h3><div style="margin-top:2mm">All videos use the <span class="lime">locked whatships house style</span> (docs/reference/whatships/STYLE.md): blur-in type, word swaps, rebuilt clean UI, cursors, tinted plates, smooth camera, logo end. No glitch, neon, ray-burst or pixel-noise effects.</div></div>
  </div>
  <div class="panel hi"><h3>ACCURACY &amp; COMPLIANCE (NON-NEGOTIABLE)</h3>
  <ul style="margin:2mm 0 0 4mm;padding:0">
    <li>Only claim what the site says. V1 = read-only monitoring of <b>one demo vault</b> modeled on Algorand lending markets. No keys, no funds moved, no automatic execution.</li>
    <li>Never say Collatera prevents or guarantees protection from liquidation. "Improves risk awareness."</li>
    <li>Terminal numbers are <b>simulated</b>. Keep the "SIMULATED DATA" label on every UI shot.</li>
    <li>Aave, Euler, Morpho, Sentora and Robinhood Chain are <b>coverage targets, not partners</b>. No @-tags, no logos implying endorsement.</li>
    <li>Token: "a proposal, not a promise". No price, yield, airdrop or launch-date talk. Keep "Tokens do not guarantee returns or value."</li>
    <li>Alerts, stress tests and repayment previews are shown on the site as the product flow. <b>Confirm which are live</b> before presenting them as available.</li>
    <li>Add "Not financial advice." to articles and any post that discusses positions.</li>
  </ul></div>
  {foot(3)}
</div>""")

# ── calendar ──
cells = ""
for d, ids, theme in CALENDAR:
    items = "".join(f'<div class="t">{kind_tag(BY_ID[i]["kind"])}<b class="lime">{i}</b> {e(BY_ID[i]["title"])}</div>' for i in ids)
    cells += f'<div class="cell"><div class="bigday">D{d:02d}</div><div class="sage" style="font-size:7pt">{day_date(d)} · {theme.upper()}</div>{items}</div>'
rows = ""
for d, ids, theme in CALENDAR:
    for i in ids:
        x = BY_ID[i]
        rows += f'<tr><td class="pix lime" style="font-size:7.5pt">D{d:02d}</td><td>{day_date(d)}</td><td>{kind_tag(x["kind"])}</td><td><b>{i}</b> · {e(x["title"])}</td><td>{e(x["platform"])}</td></tr>'
pages.append(f"""
<div class="page">
  <div class="eyebrow">03 / 15-DAY CALENDAR</div>
  <h2>WHAT GOES OUT, WHEN.</h2>
  <div class="cal">{cells}</div>
  <div class="note" style="margin-top:6mm">Suggested posting windows: X 14:00–16:00 UTC (US morning) and 20:00 UTC; LinkedIn 13:00 UTC Tue–Thu; Instagram 17:00 UTC. Pin V1 for the full campaign. Two-deliverable days: post the video first, then the companion piece 3–4 h later.</div>
  {foot(4)}
</div>""")
pages.append(f"""
<div class="page">
  <div class="eyebrow">03 / CALENDAR: FULL LIST</div>
  <h2>20 DELIVERABLES.</h2>
  <table><tr><th>DAY</th><th>DATE</th><th>TYPE</th><th>DELIVERABLE</th><th>CHANNELS</th></tr>{rows}</table>
  {foot(5)}
</div>""")

# ── deliverable pages ──
n = 6
order = [i for _, ids, _ in CALENDAR for i in ids]
for i in order:
    x = BY_ID[i]
    head = f"""
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4mm">
      <div><div class="eyebrow">DAY {x['day']:02d} · {day_date(x['day']).upper()} · {x['kind']}</div>
      <h2 style="margin-bottom:1mm"><span class="lime">{x['id']}</span> {e(x['title']).upper()}</h2></div>
      <div>{kind_tag(x['kind'])}</div>
    </div>
    <div class="panel"><div class="kv">
      <b>CHANNELS</b><span>{e(x['platform'])}</span>
      <b>FORMAT</b><span>{e(x['fmt'])}</span>
      <b>STYLE / REF</b><span>{e(x['ref'])}</span>
      <b>OBJECTIVE</b><span>{e(x['objective'])}</span>
    </div></div>"""
    if x["kind"] == "VIDEO":
        shots = "".join(f"<tr><td>{e(t)}</td><td>{e(s)}</td></tr>" for t, s in x["shots"])
        body = f"""
    <h3 style="margin-bottom:2mm">SHOT LIST</h3>
    <table class="shots">{shots}</table>
    <div class="kv" style="margin-top:3mm"><b>AUDIO</b><span>{e(x['audio'])}</span></div>"""
    elif x["kind"] == "POST":
        body = f"""<h3 style="margin-bottom:2mm">ON-IMAGE COPY</h3><div class="panel hi" style="font-family:Silk;font-size:9pt;line-height:1.6">{e(x['copy'])}</div>"""
    else:
        paras = "".join(f"<p>{e(p)}</p>" for p in x["body"])
        body = f"""<h3 style="margin-bottom:2mm">DRAFT</h3><div class="panel article" style="background:#EDF7EA;color:#00301F;border-color:#EDF7EA"><div class="pix" style="font-size:11pt;margin-bottom:3mm;color:#00301F">{e(x['title'])}</div>{paras}<p style="font-size:7.8pt;color:#3B6B55">Not financial advice.</p></div>"""
    gen_label = {"VIDEO": "BUILD PROMPT (CLAUDE + CLAUDEMOTION REPO)", "POST": "IMAGE GENERATION PROMPT", "ARTICLE": "WRITING PROMPT"}[x["kind"]]
    tail = f"""
    <div class="grid2" style="margin-top:4mm">
      <div><h3 style="margin-bottom:2mm">CAPTION</h3><div class="caption">{e(x['caption'])}</div></div>
      <div><h3 style="margin-bottom:2mm">{gen_label}</h3><div class="prompt">{e(x['prompt'])}</div></div>
    </div>
    <div class="note">{e(x['notes'])}</div>"""
    pages.append(f'<div class="page">{head}{body}{tail}{foot(n)}</div>')
    n += 1

# ── production notes ──
pages.append(f"""
<div class="page">
  <div class="eyebrow">05 / PRODUCTION NOTES</div>
  <h2>HOW TO MAKE IT.</h2>
  <div class="panel"><h3>VIDEOS</h3><div style="margin-top:2mm">Built in the claudemotion repo with Remotion. Each video recreates one locked whatships reference shot for shot (docs/reference/whatships/ANALYSIS.md). Deliver every video at 1080p 60 fps (1920×1080), plus a 9:16 cut at 1080×1920 60 fps. Original music per reference genre (80–130 BPM), at −14 to −18 LUFS. Every UI shot labelled SIMULATED DATA.</div></div>
  <div class="panel"><h3>POSTS</h3><div style="margin-top:2mm">Preferred: build in the repo (src/compositions/CollateraLaunch/Posts.tsx) so type and UI are pixel-exact. The image prompts are for quick concepting in an AI image tool. Always re-set the text in Silkscreen afterwards, because AI tools misspell words. Already produced: P1 (poster), P4 and P7 (in deliverables/collatera-posts/).</div></div>
  <div class="panel"><h3>ARTICLES</h3><div style="margin-top:2mm">Drafts are publish-ready at about 300 words. Founder review before posting. Header image = the paired post. Publish on X Articles and cross-post to Medium and LinkedIn 24 h later.</div></div>
  <div class="panel"><h3>HASHTAGS &amp; TAGS</h3><div style="margin-top:2mm">Use 2–3 max on X: #DeFi #RWA #Algorand (#TokenizedStocks where relevant). Do not tag lending venues or chains.</div></div>
  <div class="panel hi"><h3>BEFORE ANYTHING GOES LIVE</h3><div style="margin-top:2mm">☐ Alerts / stress test / repayment preview status confirmed · ☐ Algorand testnet vs mainnet wording confirmed · ☐ SIMULATED labels visible · ☐ No partnership implications · ☐ Token copy reviewed · ☐ "Not financial advice." on articles</div></div>
  <div style="margin-top:12mm;display:flex;align-items:center;gap:6mm">{mascot_svg(9)}<div><div class="pix" style="font-size:16pt">COLLATERA</div><div class="sage">collatera.buzz · @collatera_io</div></div></div>
  {foot(n)}
</div>""")

doc = f"<!doctype html><html><head><meta charset='utf-8'><title>Collatera 15-Day Content Plan</title><style>{CSS}</style></head><body>{''.join(pages)}</body></html>"
OUT_HTML.parent.mkdir(parents=True, exist_ok=True)
OUT_HTML.write_text(doc)
OUT_PDF.parent.mkdir(parents=True, exist_ok=True)
js = f"""
const {{ chromium }} = require('playwright');
(async () => {{
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto('{OUT_HTML.as_uri()}', {{ waitUntil: 'networkidle' }});
  await p.evaluate(() => document.fonts.ready);
  const over = await p.evaluate(() => [...document.querySelectorAll('.page')].map((el,i)=>[i+1, el.scrollHeight - el.clientHeight]).filter(([,d])=>d>1));
  console.log('overflow', JSON.stringify(over));
  await p.pdf({{ path: '{OUT_PDF}', format: 'A4', printBackground: true, preferCSSPageSize: true }});
  await b.close();
}})();
"""
subprocess.run(["node", "-e", js], check=True)
print("wrote", OUT_PDF, "pages:", len(pages))
