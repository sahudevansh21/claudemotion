#!/usr/bin/env python3
"""Build the QUANTORA LABS 7-day content plan PDF (HTML → Chromium PDF).

    python3 scripts/quantora-campaign/build.py

Writes deliverables/quantora-content-plan.pdf in Quantora's banner system:
warm paper, Newsreader serif with one italic word, spaced Jost wordmark,
spaced mono labels, fine annotated charts, thin rules.
"""
from __future__ import annotations

import datetime as dt
import html
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(Path(__file__).parent))
from content import CALENDAR, DELIVERABLES, PILLARS, START  # noqa: E402

OUT_HTML = ROOT / "out/quantora-plan/plan.html"
OUT_PDF = ROOT / "deliverables/quantora-content-plan.pdf"
S = dt.date(*START)
BY = {d["id"]: d for d in DELIVERABLES}
P = (ROOT / "public").as_uri()
MARK = f"{P}/quantora/img/mark.png"


def e(s):
    return html.escape(s).replace("\n", "<br>").replace("*", "")


def day(d):
    return (S + dt.timedelta(days=d - 1)).strftime("%a %d %b")


def chart(w=520, h=170, labels=("RISK", "CONTEXT", "EVIDENCE")):
    pts = [(0, 120), (40, 112), (80, 118), (120, 96), (160, 60), (190, 82), (230, 104), (270, 130), (300, 138), (330, 122), (370, 100), (410, 92), (450, 58), (480, 70), (520, 30)]
    sx = w / 520
    path = " ".join(f"{x*sx:.1f},{y*h/170:.1f}" for x, y in pts)
    marks = [(160, 60, labels[0]), (300, 138, labels[1]), (450, 58, labels[2])]
    g = "".join(
        f'<line x1="{x*sx:.1f}" y1="10" x2="{x*sx:.1f}" y2="{h-8}" stroke="#161514" stroke-dasharray="1.5 3" stroke-width="0.8" opacity=".45"/>'
        f'<circle cx="{x*sx:.1f}" cy="{y*h/170:.1f}" r="3" fill="#161514"/>'
        f'<text x="{x*sx:.1f}" y="6" text-anchor="middle" font-family="JetBrains Mono" font-size="6.5" letter-spacing="2" fill="#161514">{lab}</text>'
        for x, y, lab in marks
    )
    return f'<svg width="{w}" height="{h}" viewBox="0 0 {w} {h}"><line x1="0" y1="{h-8}" x2="{w}" y2="{h-8}" stroke="#161514" stroke-width=".8"/>{g}<polyline points="{path}" fill="none" stroke="#161514" stroke-width="1.2"/></svg>'


CSS = f"""
@font-face {{ font-family: News; src: url('{P}/quantora/fonts/newsreader-latin-400-normal.woff2'); font-weight: 400; }}
@font-face {{ font-family: News; src: url('{P}/quantora/fonts/newsreader-latin-500-normal.woff2'); font-weight: 500; }}
@font-face {{ font-family: News; src: url('{P}/quantora/fonts/newsreader-latin-400-italic.woff2'); font-style: italic; }}
@font-face {{ font-family: Jost; src: url('{P}/quantora/fonts/jost-latin-400-normal.woff2'); font-weight: 400; }}
@font-face {{ font-family: Jost; src: url('{P}/quantora/fonts/jost-latin-300-normal.woff2'); font-weight: 300; }}
@font-face {{ font-family: JBM; src: url('{P}/fonts/JetBrainsMono-Variable-latin.woff2'); font-weight: 100 900; }}
@page {{ size: A4; margin: 0; }}
* {{ box-sizing: border-box; }}
html, body {{ margin: 0; background: #ECE8DF; color: #161514; font-family: News, Georgia, serif; font-size: 10pt; line-height: 1.45; -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
.page {{ width: 210mm; height: 297mm; padding: 16mm 16mm 16mm; position: relative; page-break-after: always; overflow: hidden;
  background: radial-gradient(rgba(22,21,20,0.10) 0.6px, transparent 0.8px) 0 0/5mm 5mm, #ECE8DF; }}
.page:last-child {{ page-break-after: auto; }}
.mono {{ font-family: JBM, monospace; font-size: 6.6pt; letter-spacing: 2.4px; text-transform: uppercase; }}
.word {{ font-family: Jost, sans-serif; letter-spacing: 6px; }}
h1 {{ font-family: News; font-weight: 400; font-size: 38pt; line-height: 1.05; margin: 0; letter-spacing: -0.5px; }}
h2 {{ font-family: News; font-weight: 400; font-size: 21pt; line-height: 1.1; margin: 0 0 4mm; }}
h3 {{ margin: 0 0 1.5mm; }}
i, em {{ font-style: italic; }}
.rule {{ border-top: 0.8px solid #161514; margin: 4mm 0; }}
.soft {{ color: #55524C; }}
.foot {{ position: absolute; left: 16mm; right: 16mm; bottom: 9mm; display: flex; justify-content: space-between; border-top: 0.6px solid rgba(22,21,20,.5); padding-top: 2mm; }}
.crop:before, .crop:after {{ content: ""; position: absolute; width: 10mm; height: 10mm; border-color: rgba(22,21,20,.35); border-style: solid; }}
.crop:before {{ left: 6mm; top: 6mm; border-width: 0.6px 0 0 0.6px; }}
.crop:after {{ right: 6mm; top: 6mm; border-width: 0.6px 0.6px 0 0; }}
table {{ width: 100%; border-collapse: collapse; font-size: 8.6pt; }}
th {{ text-align: left; padding: 1.6mm 1.5mm; border-bottom: 0.8px solid #161514; }}
td {{ padding: 1.6mm 1.5mm; border-bottom: 0.5px solid rgba(22,21,20,.25); vertical-align: top; }}
.box {{ border: 0.8px solid #161514; padding: 3.5mm 4mm; margin-bottom: 4mm; background: rgba(255,253,247,.35); }}
.grid2 {{ display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; }}
.kv {{ display: grid; grid-template-columns: 30mm 1fr; gap: 1.2mm 4mm; font-size: 9pt; }}
.prompt {{ font-family: JBM, monospace; font-size: 7.2pt; line-height: 1.5; border: 0.8px dashed #161514; padding: 3mm; background: rgba(255,253,247,.5); white-space: pre-wrap; }}
.caption {{ background: #161514; color: #ECE8DF; padding: 3mm 4mm; font-size: 9pt; line-height: 1.45; }}
.shots td:first-child {{ width: 16mm; white-space: nowrap; }}
.note {{ font-size: 8pt; color: #55524C; border-left: 1.5px solid #161514; padding-left: 3mm; margin-top: 3mm; font-style: italic; }}
.tag {{ display: inline-block; border: 0.6px solid #161514; padding: .4mm 1.6mm; margin-right: 1.5mm; }}
.cal {{ display: grid; grid-template-columns: repeat(7, 1fr); gap: 2.5mm; }}
.cell {{ border: 0.8px solid #161514; padding: 2.5mm; min-height: 62mm; background: rgba(255,253,247,.35); }}
.big {{ font-family: News; font-size: 26pt; line-height: 1; }}
.article p {{ margin: 0 0 2.2mm; font-size: 9.6pt; line-height: 1.5; }}
"""


def foot(n):
    return f'<div class="foot mono"><span>Quantora Labs · 7-day content plan</span><span>quantora.buzz · @Quantora_Labs</span><span>{n:02d}</span></div>'


def tag(k):
    return f'<span class="tag mono">{k}</span>'


pages = []
pages.append(f"""
<div class="page crop" style="display:flex;flex-direction:column;justify-content:space-between">
  <div style="display:flex;align-items:center;gap:7mm;margin-top:14mm">
    <img src="{MARK}" style="width:24mm;height:24mm"/>
    <div><div class="word" style="font-size:26pt;letter-spacing:9px">QUANTORA</div><div class="mono" style="margin-top:2mm">The market, read clearly.</div></div>
  </div>
  <div>
    <div class="mono" style="margin-bottom:6mm">Content plan · 7 days · 10 deliverables</div>
    <h1>A week of research,<br><i>read clearly.</i></h1>
    <p style="font-size:12pt;max-width:140mm;margin-top:8mm">A 7-day campaign for Quantora Labs: 3 SaaS motion videos, 4 posts and 3 short articles, each with copy, caption and generation prompt.</p>
  </div>
  <div style="margin-bottom:10mm">{chart(560, 150)}</div>
  <div class="mono soft">Window: {day(1)} – {day(7)} 2026 · Sources: @Quantora_Labs bio + banner supplied by the client</div>
</div>""")

pill = "".join(f'<div class="box"><div class="mono">{t}</div><div style="margin-top:1.5mm">{e(d)}</div></div>' for t, d in PILLARS)
pages.append(f"""
<div class="page crop">
  <div class="mono">01 / Campaign overview</div>
  <h2 style="margin-top:4mm">One idea: <i>read the market clearly.</i></h2>
  <div class="box" style="border-width:1.2px"><div class="mono">Core message</div><div style="margin-top:2mm;font-size:12pt">Quantora Labs does quantitative research for onchain finance, covering tokenized stocks, ETFs and market simulations. Every piece shows the method: <i>risk, context, evidence</i>.</div></div>
  <div class="grid2">{pill}</div>
  <div class="mono" style="margin:4mm 0 2mm">Goals</div>
  <table><tr><th class="mono">Goal</th><th class="mono">How</th><th class="mono">Track</th></tr>
  <tr><td>Awareness</td><td>Intro video + poster, daily X posts</td><td>Impressions, follower growth on @Quantora_Labs</td></tr>
  <tr><td>Credibility</td><td>Method carousel, three articles</td><td>Saves, bookmarks, read-through, replies</td></tr>
  <tr><td>Site visits</td><td>CTA to quantora.buzz in every piece</td><td>Link clicks</td></tr></table>
  <div class="mono" style="margin:6mm 0 2mm">Content mix: 10 deliverables</div>
  <table><tr><th class="mono">Type</th><th class="mono">Count</th><th class="mono">Format</th><th class="mono">Style</th></tr>
  <tr><td>{tag('VIDEO')}</td><td>3</td><td>20 s SaaS motion films, 1080p 60 fps + 9:16 cuts</td><td>Locked whatships references: Supabase, Krea 3, Conqueror</td></tr>
  <tr><td>{tag('POST')}</td><td>4</td><td>16:9, 4:5, 1:1 and a 5-slide carousel</td><td>Quantora banner system (paper, serif, mono, annotated charts)</td></tr>
  <tr><td>{tag('ARTICLE')}</td><td>3</td><td>≈300 words</td><td>Calm, precise research voice</td></tr></table>
  {foot(2)}
</div>""")

pages.append(f"""
<div class="page crop">
  <div class="mono">02 / Brand system &amp; guardrails</div>
  <h2 style="margin-top:4mm">Look, voice, <i>rules.</i></h2>
  <div class="grid2">
    <div class="box"><div class="mono">Palette</div>
      {''.join(f'<div style="display:flex;align-items:center;gap:3mm;margin-top:2mm"><span style="width:9mm;height:9mm;background:{c};border:.6px solid #161514;display:inline-block"></span><span class="mono">{n} {c}</span></div>' for n, c in [("Paper", "#ECE8DF"), ("Paper deep", "#E2DDD2"), ("Ink", "#161514"), ("Soft", "#55524C"), ("Faint", "#8F8A80")])}
    </div>
    <div class="box"><div class="mono">Type &amp; marks</div>
      <div style="font-size:16pt;margin-top:2mm">Newsreader, <i>one italic word</i></div><div class="soft">Headlines</div>
      <div class="word" style="font-size:13pt;margin-top:3mm">QUANTORA</div><div class="soft">Wordmark (Jost, wide tracking, lookalike)</div>
      <div class="mono" style="margin-top:3mm">Spaced mono labels</div><div class="soft">Annotations, counters</div>
      <div style="margin-top:3mm"><img src="{MARK}" style="width:14mm"/></div></div>
  </div>
  <div class="grid2">
    <div class="box"><div class="mono">Voice</div><div style="margin-top:2mm">Calm, precise, unhurried. Short sentences. One italic word per headline. Phrases to reuse: "The market, read clearly." · "Risk. Context. Evidence." · "Simulations stress ideas. They don't predict prices."</div></div>
    <div class="box"><div class="mono">Motion rule</div><div style="margin-top:2mm">Videos follow the locked whatships references only (docs/reference/whatships/STYLE.md), re-skinned in the paper and serif system, at 1080p 60 fps.</div></div>
  </div>
  <div class="box" style="border-width:1.2px"><div class="mono">Accuracy &amp; compliance</div>
  <ul style="margin:2mm 0 0 4mm;padding:0">
    <li>Only claims from the bio and banner: quantitative research for onchain finance; tokenized stocks, ETFs, market simulations; "The market, read clearly."</li>
    <li>No performance figures, track records, returns, clients, partners or product features until the client confirms them.</li>
    <li>Every chart is <b>illustrative</b>, with no tickers or values. Simulations are <b>never forecasts</b>.</li>
    <li>Add "Not investment advice." to articles and to any post discussing markets.</li>
    <li>quantora.buzz could not be reviewed (unreachable from the build environment). Share the site copy to sharpen the plan.</li>
  </ul></div>
  {foot(3)}
</div>""")

cells = "".join(
    f'<div class="cell"><div class="big">D{d}</div><div class="mono soft" style="margin:1.5mm 0 3mm">{day(d)}<br>{th}</div>'
    + "".join(f'<div style="margin-bottom:2.5mm;font-size:8.6pt"><span class="mono">{i}</span><br>{e(BY[i]["title"])}</div>' for i in ids)
    + "</div>"
    for d, ids, th in CALENDAR
)
rows = "".join(f'<tr><td class="mono">D{d}</td><td>{day(d)}</td><td>{tag(BY[i]["kind"])}</td><td><b>{i}</b> · {e(BY[i]["title"])}</td><td>{e(BY[i]["platform"])}</td></tr>' for d, ids, _ in CALENDAR for i in ids)
pages.append(f"""
<div class="page crop">
  <div class="mono">03 / 7-day calendar</div>
  <h2 style="margin-top:4mm">What goes out, <i>when.</i></h2>
  <div class="cal">{cells}</div>
  <div class="rule"></div>
  <table><tr><th class="mono">Day</th><th class="mono">Date</th><th class="mono">Type</th><th class="mono">Deliverable</th><th class="mono">Channels</th></tr>{rows}</table>
  <div class="note">Suggested windows: X 14:00–16:00 UTC; LinkedIn 13:00 UTC Tue–Thu. Pin QV1 all week. On two-piece days, post the visual first and the article 3–4 h later.</div>
  {foot(4)}
</div>""")

n = 5
for d, ids, _ in CALENDAR:
    for i in ids:
        x = BY[i]
        head = f"""<div class="mono">Day {x['day']} · {day(x['day'])} · {x['kind']}</div>
        <h2 style="margin-top:3mm">{x['id']} · <i>{e(x['title'])}</i></h2>
        <div class="box"><div class="kv"><span class="mono">Channels</span><span>{e(x['platform'])}</span><span class="mono">Format</span><span>{e(x['fmt'])}</span><span class="mono">Style / ref</span><span>{e(x['ref'])}</span><span class="mono">Objective</span><span>{e(x['objective'])}</span></div></div>"""
        if x["kind"] == "VIDEO":
            body = '<div class="mono" style="margin-bottom:1.5mm">Shot list</div><table class="shots">' + "".join(f"<tr><td class='mono'>{e(a)}</td><td>{e(b)}</td></tr>" for a, b in x["shots"]) + f"</table><div class='kv' style='margin-top:3mm'><span class='mono'>Audio</span><span>{e(x['audio'])}</span></div>"
        elif x["kind"] == "POST":
            body = f'<div class="mono" style="margin-bottom:1.5mm">On-image copy</div><div class="box" style="font-size:11pt">{e(x["copy"])}</div><div style="margin:2mm 0">{chart(430, 120)}</div>'
        else:
            body = '<div class="mono" style="margin-bottom:1.5mm">Draft</div><div class="box article"><div style="font-size:13pt;margin-bottom:2.5mm"><i>' + e(x["title"]) + "</i></div>" + "".join(f"<p>{e(p)}</p>" for p in x["body"]) + '<p class="mono soft">Not investment advice.</p></div>'
        lab = {"VIDEO": "Build prompt (Claude + claudemotion repo)", "POST": "Image generation prompt", "ARTICLE": "Writing prompt"}[x["kind"]]
        tail = f"""<div class="grid2" style="margin-top:3mm"><div><div class="mono" style="margin-bottom:1.5mm">Caption</div><div class="caption">{e(x['caption'])}</div></div>
        <div><div class="mono" style="margin-bottom:1.5mm">{lab}</div><div class="prompt">{e(x['prompt'])}</div></div></div><div class="note">{e(x['notes'])}</div>"""
        pages.append(f'<div class="page crop">{head}{body}{tail}{foot(n)}</div>')
        n += 1

pages.append(f"""
<div class="page crop">
  <div class="mono">05 / Production notes</div>
  <h2 style="margin-top:4mm">How to <i>make it.</i></h2>
  <div class="box"><div class="mono">Videos</div><div style="margin-top:1.5mm">Built in the claudemotion repo with Remotion, recreating the locked whatships references shot for shot, at 1080p 60 fps plus 9:16 cuts. Original music. Charts labelled ILLUSTRATIVE; simulations labelled ILLUSTRATIVE SIMULATION.</div></div>
  <div class="box"><div class="mono">Posts</div><div style="margin-top:1.5mm">Build in src/compositions/Quantora/Posts.tsx (paper texture, Newsreader, Jost, mono) for exact typography. Image prompts are for concepting only, so re-set the type afterwards.</div></div>
  <div class="box"><div class="mono">Articles</div><div style="margin-top:1.5mm">Drafts are ready at about 300 words. Review before posting. Use the paired post as the header image.</div></div>
  <div class="box"><div class="mono">Hashtags</div><div style="margin-top:1.5mm">2–3 on X: #TokenizedStocks #OnchainFinance #QuantResearch (#ETFs, #DeFi where relevant).</div></div>
  <div class="box" style="border-width:1.2px"><div class="mono">Before anything goes live</div><div style="margin-top:1.5mm">☐ Site copy reviewed (quantora.buzz) · ☐ No performance or return claims · ☐ ILLUSTRATIVE labels visible · ☐ "Not investment advice." on articles</div></div>
  <div style="margin-top:14mm;display:flex;align-items:center;gap:6mm"><img src="{MARK}" style="width:18mm"/><div><div class="word" style="font-size:18pt;letter-spacing:8px">QUANTORA</div><div class="mono">The market, read clearly.</div></div></div>
  {foot(n)}
</div>""")

doc = f"<!doctype html><html><head><meta charset='utf-8'><title>Quantora 7-Day Content Plan</title><style>{CSS}</style></head><body>{''.join(pages)}</body></html>"
OUT_HTML.parent.mkdir(parents=True, exist_ok=True)
OUT_HTML.write_text(doc)
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
