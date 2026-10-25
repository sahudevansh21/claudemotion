# -*- coding: utf-8 -*-
"""Builds oryn-content-planner.pdf from content.py (reportlab)."""
import os, sys
from xml.sax.saxutils import escape
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, PageBreak,
                                Table, TableStyle, KeepTogether, NextPageTemplate)
from fontTools.ttLib import TTFont as FT
import content as C

FD = "/tmp/claude-0/-home-user/9f593ee4-393e-57ba-a40b-c54d9b9f045b/scratchpad/ttf"
OUT = sys.argv[1] if len(sys.argv) > 1 else "oryn-content-planner.pdf"
for name, f in [("Anton", "anton-latin-400-normal"), ("SG", "space-grotesk-latin-500-normal"), ("SGB", "space-grotesk-latin-700-normal"),
                ("SM", "space-mono-latin-400-normal"), ("SMB", "space-mono-latin-700-normal")]:
    pdfmetrics.registerFont(TTFont(name, f"{FD}/{f}.ttf"))
cmaps = {n: set(FT(f"{FD}/{f}.ttf").getBestCmap()) for n, f in
         [("SG", "space-grotesk-latin-500-normal"), ("SM", "space-mono-latin-400-normal"), ("Anton", "anton-latin-400-normal")]}

CREAM, PAPER, INK = colors.HexColor("#e4dfca"), colors.HexColor("#efeadb"), colors.HexColor("#0d0d0f")
BLUE, YEL, RED = colors.HexColor("#2630c8"), colors.HexColor("#f2c200"), colors.HexColor("#e5321f")
LAV, GRN = colors.HexColor("#b9b3ee"), colors.HexColor("#1d3a24")
KIND = {"Video": BLUE, "Post": RED, "Article": GRN}

missing = set()
def e(t):
    for ch in t:
        if ord(ch) > 126 and ord(ch) not in cmaps["SG"] and ch not in "\n":
            missing.add(ch)
    return escape(t)

def st(name, font="SG", size=9.5, lead=None, color=INK, **kw):
    return ParagraphStyle(name, fontName=font, fontSize=size, leading=lead or size * 1.38, textColor=color, **kw)

H1 = st("h1", "Anton", 30, 32, INK)
H2 = st("h2", "Anton", 18, 20, BLUE, spaceBefore=10, spaceAfter=4)
H3 = st("h3", "SMB", 8, 10, RED, spaceBefore=8, spaceAfter=2)
B = st("b", "SG", 9.5)
BS = st("bs", "SG", 8.5, color=colors.HexColor("#333333"))
MONO = st("mono", "SM", 7.6, 10.2, INK)
BUL = st("bul", "SG", 9.2, leftIndent=10, bulletIndent=0)
CELL = st("cell", "SG", 8, 10)
CELLB = st("cellb", "SGB", 8, 10)
CELLH = st("cellh", "SMB", 7.5, 9, colors.white)

W, H = A4
M = 16 * mm

def footer(canv, doc):
    canv.saveState()
    canv.setFillColor(CREAM); canv.rect(0, 0, W, H, stroke=0, fill=1)
    canv.setFillColor(INK); canv.rect(0, H - 9 * mm, W, 9 * mm, stroke=0, fill=1)
    canv.setFont("SMB", 7); canv.setFillColor(CREAM)
    canv.drawString(M, H - 6 * mm, "ORYN  /  15-DAY CONTENT CAMPAIGN  /  20 DELIVERABLES")
    canv.setFillColor(YEL); canv.drawRightString(W - M, H - 6 * mm, "STATE OF ASSETS ACTIVATED")
    canv.setFont("SM", 6.8); canv.setFillColor(colors.HexColor("#555555"))
    canv.drawString(M, 8 * mm, "Simulated issuer data · Not investment advice · All facts verbatim from the Oryn board")
    canv.drawRightString(W - M, 8 * mm, f"{doc.page}")
    canv.restoreState()

def cover(canv, doc):
    canv.saveState()
    canv.setFillColor(CREAM); canv.rect(0, 0, W, H, stroke=0, fill=1)
    canv.setFillColor(colors.HexColor("#7fd0dc"))
    for i in range(0, 70):
        for j in range(0, 40):
            x, y = 6 * mm + i * 3 * mm, H - 8 * mm - j * 3 * mm
            r = 0.9 * max(0, 1 - ((x - W / 2) ** 2 / (W * 0.45) ** 2 + (y - H * 0.62) ** 2 / (H * 0.38) ** 2))
            if r > 0.05: canv.circle(x, y, r, stroke=0, fill=1)
    canv.setFillColor(BLUE); canv.setFont("Anton", 120); canv.drawString(M, H - 118 * mm, "ORYN")
    canv.setFillColor(INK); canv.setFont("Anton", 40)
    canv.drawString(M, H - 140 * mm, "15-DAY CONTENT CAMPAIGN")
    canv.setFont("SGB", 13); canv.drawString(M, H - 152 * mm, "Posts + motion-graphics videos + short articles, with generation prompts")
    for k, (n, lbl, col) in enumerate([("8", "POSTS", RED), ("8", "VIDEOS", BLUE), ("4", "ARTICLES", GRN)]):
        x = M + k * 58 * mm
        canv.setFillColor(col); canv.roundRect(x, 40 * mm, 52 * mm, 36 * mm, 4 * mm, stroke=0, fill=1)
        canv.setFillColor(colors.white); canv.setFont("Anton", 40); canv.drawString(x + 6 * mm, 58 * mm, n)
        canv.setFont("SMB", 10); canv.drawString(x + 6 * mm, 47 * mm, lbl)
    canv.setFillColor(INK); canv.setFont("SM", 8)
    canv.drawString(M, 22 * mm, "Prepared with Claude Code · Oryn © 2026 · MVP · Simulated issuer data · Not investment advice")
    canv.restoreState()

doc = BaseDocTemplate(OUT, pagesize=A4, leftMargin=M, rightMargin=M, topMargin=16 * mm, bottomMargin=16 * mm,
                      title="Oryn 15-Day Content Campaign", author="Oryn content team (drafted with Claude Code)",
                      subject="Content planner: posts, videos, articles and generation prompts")
fr = Frame(M, 16 * mm, W - 2 * M, H - 32 * mm, id="f", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
doc.addPageTemplates([PageTemplate(id="cover", frames=[fr], onPage=cover), PageTemplate(id="body", frames=[fr], onPage=footer)])

S = [NextPageTemplate("body"), PageBreak()]

def box(items, bg=PAPER, border=INK, pad=8):
    t = Table([[items]], colWidths=[W - 2 * M])
    t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), bg), ("BOX", (0, 0), (-1, -1), 1.2, border),
                           ("LEFTPADDING", (0, 0), (-1, -1), pad), ("RIGHTPADDING", (0, 0), (-1, -1), pad),
                           ("TOPPADDING", (0, 0), (-1, -1), pad - 2), ("BOTTOMPADDING", (0, 0), (-1, -1), pad - 2)]))
    return t

def P(t, s=B): return Paragraph(e(t), s)
def bullets(lst, s=BUL): return [Paragraph(e(x), s, bulletText="•") for x in lst]

# ------------------------------------------------------------------ brief
S += [Paragraph("CAMPAIGN BRIEF", H1), Spacer(1, 4)]
S += [P("Goal. Introduce Oryn, the state-of-the-asset layer, and teach one idea over 15 days: before you act on a tokenised asset, ask whether it is safe to act, and get one verdict per token, per chain, with a reason and the evidence.")]
S += [Paragraph("Audience (assumption, please confirm)", H2)] + bullets([
    "Builders and integrators who consume tokenised real-world-asset data (lending, DEX, wallet and vault teams).",
    "Risk and ops teams holding tokenised stocks, funds and treasuries as collateral or inventory.",
    "RWA-curious DeFi users who need a plain-English reason, not a pile of fields."])
S += [Paragraph("Content pillars", H2)]
pill = [[Paragraph("Pillar", CELLH), Paragraph("Pieces", CELLH), Paragraph("What it does", CELLH)],
        [P("Launch", CELLB), P(str(sum(d["pillar"]=="Launch" for d in C.D)), CELL), P("Name the product and the question it answers.", CELL)],
        [P("Product", CELLB), P(str(sum(d["pillar"]=="Product" for d in C.D)), CELL), P("Show verdicts, Guard, Time Machine, Lookahead, multi-chain, tour.", CELL)],
        [P("Education", CELLB), P(str(sum(d["pillar"]=="Education" for d in C.D)), CELL), P("Teach the six verdicts and the common mistakes (market closed vs stale).", CELL)],
        [P("Thought leadership", CELLB), P(str(sum(d["pillar"]=="Thought leadership" for d in C.D)), CELL), P("Price is not a verdict; a bond is not an asset; unknown means not actionable.", CELL)]]
t = Table(pill, colWidths=[38 * mm, 16 * mm, W - 2 * M - 54 * mm])
t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, 0), INK), ("ROWBACKGROUNDS", (0, 1), (-1, -1), [PAPER, CREAM]),
                       ("GRID", (0, 0), (-1, -1), 0.5, INK), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                       ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4)]))
S += [t, Paragraph("Voice", H2)] + bullets([
    "Plain, confident, precise. Short sentences. Say the reason, not the hype.",
    "Never give investment advice. Never claim audits, TVL, users, partners or live data we cannot show.",
    "Every post that shows a verdict carries a verbatim reason from the board."])
S += [Paragraph("Visual system", H2)] + bullets([
    "Posts: cream paper #e4dfca, ink #0d0d0f, blue #2630c8, yellow #f2c200, red #e5321f, lavender #b9b3ee, deep green #1d3a24. Fonts Anton (display), Space Grotesk (text), Space Mono (labels).",
    "Videos: ONLY the motion grammar of the five reference films: words blur in/out and swap in place; cursor or caret drives the story; one idea per beat on one flat colour or one tilted dark plane; UI cards rise in from below; logos float and cluster; code types on; end on a centred logo plus one line. No wipes, stamps or shakes.",
    "Specs: videos 1920x1080 (16:9) at 60 fps; posts 1080x1350 designed, delivered 2160x2700 JPEG; articles ~200-220 words."])
S += [PageBreak()]

# ------------------------------------------------------------------ facts
S += [Paragraph("FACT BANK (USE ONLY THESE)", H1), Spacer(1, 3),
      P("Every number and sentence in this plan comes from the Oryn board. If a post needs a fact that is not here, add it to this list first, then use it.", BS), Spacer(1, 5)]
rows = [[Paragraph("Topic", CELLH), Paragraph("Verbatim fact", CELLH)]] + [[P(a, CELLB), P(b, CELL)] for a, b in C.FACTS]
t = Table(rows, colWidths=[32 * mm, W - 2 * M - 32 * mm], repeatRows=1)
t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, 0), INK), ("ROWBACKGROUNDS", (0, 1), (-1, -1), [PAPER, CREAM]),
                       ("GRID", (0, 0), (-1, -1), 0.5, INK), ("VALIGN", (0, 0), (-1, -1), "TOP"),
                       ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4)]))
S += [t, PageBreak()]

# ------------------------------------------------------------------ calendar
S += [Paragraph("15-DAY CALENDAR", H1), Spacer(1, 4)]
rows = [[Paragraph(x, CELLH) for x in ["DAY", "ID", "TYPE", "TITLE", "PILLAR", "FORMAT"]]]
for d in C.D:
    k = d["kind"].split()[0]
    rows.append([P(str(d["day"]), CELLB), P(d["id"], CELLB), P(d["kind"], CELL), P(d["title"], CELLB), P(d["pillar"], CELL), P(d["fmt"].split(",")[0], CELL)])
t = Table(rows, colWidths=[11 * mm, 11 * mm, 30 * mm, 60 * mm, 28 * mm, W - 2 * M - 140 * mm], repeatRows=1)
sty = [("BACKGROUND", (0, 0), (-1, 0), INK), ("GRID", (0, 0), (-1, -1), 0.5, INK), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
       ("TOPPADDING", (0, 0), (-1, -1), 3), ("BOTTOMPADDING", (0, 0), (-1, -1), 3)]
for i, d in enumerate(C.D, start=1):
    col = KIND[d["kind"].split()[0]]
    sty += [("BACKGROUND", (1, i), (1, i), col), ("TEXTCOLOR", (1, i), (1, i), colors.white),
            ("BACKGROUND", (0, i), (0, i), YEL if d["day"] % 2 else PAPER), ("BACKGROUND", (2, i), (-1, i), PAPER if d["day"] % 2 else CREAM)]
t.setStyle(TableStyle(sty))
for r in range(1, len(rows)):  # white id text
    rows[r][1] = Paragraph(e(C.D[r - 1]["id"]), ParagraphStyle("idw", parent=CELLB, textColor=colors.white))
t = Table(rows, colWidths=[11 * mm, 11 * mm, 30 * mm, 60 * mm, 28 * mm, W - 2 * M - 140 * mm], repeatRows=1)
t.setStyle(TableStyle(sty))
S += [t, Spacer(1, 6),
      P("Cadence: post the video first on its day, then the matching post 3-4 hours later. Articles go out in the morning with a carousel or post as the cover image. Day 15 closes with the full product tour and the principle article.", BS)]
S += [PageBreak()]

# ------------------------------------------------------------------ how to use
S += [Paragraph("HOW TO USE THE PROMPTS", H1), Spacer(1, 3)]
S += bullets([
    "Videos: paste the prompt into Claude Code inside the claudemotion repo. It already contains the playbook rules, palette, spec and the allowed facts. Review stills first, then render.",
    "Posts: the preferred route is the OrynPosts composition (exact logo and type). The image-generation prompts are for exploring layouts or when a design tool is needed.",
    "Articles: paste the writing prompt into Claude. It lists the only facts allowed.",
    "After generating anything, check it against the Fact Bank before publishing."])
S += [Paragraph("Master prompts (reusable)", H2)]
masters = [
    ("VIDEO", C.REMO + "Task: build a [N]-second film at 1920x1080/60 fps titled [TITLE] in the style of reference film [Krea | Notion | Conqueror | Pages | Supabase]. " + C.STYLE + " Facts allowed: [PASTE FROM FACT BANK]. Shots: [LIST WITH TIMES]. Deliver: contact sheet of stills, then the MP4, with ffprobe and loudness check."),
    ("POST", "Design one Oryn social post (4:5, 1080x1350, delivered 2160x2700). Palette cream #e4dfca, ink #0d0d0f, blue #2630c8, yellow #f2c200, red #e5321f, lavender #b9b3ee. Anton headline, Space Grotesk body, Space Mono labels, thick black outline cards with hard offset shadow, one idea, generous negative space, no photos, no gradients, no invented data. Copy: [PASTE VERBATIM]."),
    ("ARTICLE", "Write a [200-220]-word article titled [TITLE] for Oryn. Audience: builders and risk teams working with tokenised real-world assets. Tone: calm, precise, no hype, no advice. Use ONLY these facts: [PASTE FROM FACT BANK]. Structure: hook, problem, two or three real examples, one-line close. End with: Simulated issuer data · Not investment advice."),
]
for k, v in masters:
    S += [KeepTogether([Paragraph(k, H3), box([Paragraph(e(v), MONO)])]), Spacer(1, 4)]
S += [PageBreak()]

# ------------------------------------------------------------------ deliverables
def tag(d):
    col = KIND[d["kind"].split()[0]]
    t = Table([[Paragraph(f"DAY {d['day']}", ParagraphStyle("t1", fontName="SMB", fontSize=8, textColor=INK)),
                Paragraph(f"{d['id']}  ·  {d['kind'].upper()}", ParagraphStyle("t2", fontName="SMB", fontSize=8, textColor=colors.white)),
                Paragraph(d["pillar"].upper(), ParagraphStyle("t3", fontName="SMB", fontSize=8, textColor=INK))]],
              colWidths=[22 * mm, 66 * mm, W - 2 * M - 88 * mm])
    t.setStyle(TableStyle([("BACKGROUND", (0, 0), (0, 0), YEL), ("BACKGROUND", (1, 0), (1, 0), col), ("BACKGROUND", (2, 0), (2, 0), PAPER),
                           ("BOX", (0, 0), (-1, -1), 1, INK), ("INNERGRID", (0, 0), (-1, -1), 1, INK),
                           ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4)]))
    return t

for n, d in enumerate(C.D):
    kind = d["kind"].split()[0]
    shot_label = {"Video": "SHOT LIST", "Post": "ON-IMAGE COPY", "Article": "OUTLINE / KEY POINTS"}[kind]
    prompt_label = {"Video": "GENERATION PROMPT (CLAUDE CODE / REMOTION)", "Post": "GENERATION PROMPT (IMAGE TOOL, OR OrynPosts IN REMOTION)", "Article": "GENERATION PROMPT (CLAUDE)"}[kind]
    S += [tag(d), Spacer(1, 4), Paragraph(e(d["title"]), H1.clone("dt", fontSize=24, leading=28, spaceBefore=6, spaceAfter=4)),
          Table([[P("Format", CELLB), P(d["fmt"], CELL)], [P("Reference", CELLB), P(d["ref"], CELL)], [P("Objective", CELLB), P(d["objective"], CELL)]],
                colWidths=[22 * mm, W - 2 * M - 22 * mm], style=TableStyle([("GRID", (0, 0), (-1, -1), 0.4, INK), ("BACKGROUND", (0, 0), (0, -1), PAPER),
                                                                           ("TOPPADDING", (0, 0), (-1, -1), 3), ("BOTTOMPADDING", (0, 0), (-1, -1), 3)])),
          Paragraph(shot_label, H3)]
    S += bullets(d["script"], BUL)
    S += [Paragraph("CAPTION / POST COPY", H3), box([Paragraph(e(d["caption"]), B), Spacer(1, 3), Paragraph(e(d["tags"]), st("tg", "SM", 8, color=BLUE))], bg=PAPER),
          Paragraph(prompt_label, H3), box([Paragraph(e(d["prompt"]), MONO)], bg=colors.HexColor("#f6f3e8"), border=KIND[kind]), PageBreak()]

# ------------------------------------------------------------------ checklist
S += [Paragraph("BEFORE YOU PUBLISH", H1), Spacer(1, 3)]
S += [Paragraph("Things to verify", H2)] + bullets([
    "The board says “Live verdicts”, while the footer says “MVP · Simulated issuer data”. Pick one honest framing for public copy. This plan uses “verdicts” and carries the footer disclaimer.",
    "Times such as “opens in 6h”, “event effective in 38h” and the Time Machine date are snapshots from the board; refresh them or drop the countdowns if posting on a different day.",
    "Issuer and chain names (Backed xStocks, Ondo Global Markets, Dinari dShares, Securitize, Superstate; Ethereum, Solana, Base, Arbitrum): confirm you may name them, and do not use their official logos unless supplied.",
    "X handle, website URL and hashtags: confirm before scheduling (not supplied).",
    "Time Machine state changes, form values in the Guard and the API panel in V8 are Illustrative and must say so on screen.",
    "Fonts are lookalikes (Anton, Space Grotesk, Space Mono). Send the brand fonts if you want an exact match."])
S += [Paragraph("Production order (suggested)", H2)] + bullets([
    "Week 1 builds: V1, P1, P2, V2, P3, V3 (days 1-6).", "Week 2 builds: P4, A2, V4, P5, V5, P6, V6, P7.",
    "Week 3 builds: A3, V7, P8, V8, A4. Videos render in about 5-15 minutes each at 1080p60 on 4 cores; start renders in the background."])
S += [Paragraph("Metrics to track (no targets assumed)", H2)] + bullets([
    "Per piece: views, saves, shares, profile visits, link clicks. Per week: follower change, replies asking about a specific verdict.",
    "Set targets after week 1 using your own baseline; this plan does not assume any."])

doc.build(S)
print("built", OUT, "missing glyphs:", sorted(missing))
