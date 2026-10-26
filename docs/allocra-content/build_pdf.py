# -*- coding: utf-8 -*-
import sys
from xml.sax.saxutils import escape
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, PageBreak, Table, TableStyle, KeepTogether, NextPageTemplate
from fontTools.ttLib import TTFont as FT
import content as C

FD = "/tmp/claude-0/-home-user/9f593ee4-393e-57ba-a40b-c54d9b9f045b/scratchpad/ttf2"
OUT = sys.argv[1]
for n, f in [("Serif", "InstrumentSerif"), ("Sans", "DMSans-400"), ("SansB", "DMSans-700"), ("Mono", "JBMono-400"), ("MonoB", "JBMono-700")]:
    pdfmetrics.registerFont(TTFont(n, f"{FD}/{f}.ttf"))
cm = {n: set(FT(f"{FD}/{f}.ttf").getBestCmap()) for n, f in [("Sans", "DMSans-400"), ("Mono", "JBMono-400"), ("Serif", "InstrumentSerif")]}
RED, DARK, CREAM, DIM, ACC = (colors.HexColor(x) for x in ["#C12E19", "#20130E", "#F6DAC3", "#C9AE9A", "#CF3321"])
PANEL = colors.HexColor("#261713"); LINE = colors.HexColor("#3A2620")
missing = set()
def e(t):
    for ch in t:
        if ord(ch) > 126 and ord(ch) not in cm["Sans"] and ord(ch) not in cm["Mono"] and ch != "\n": missing.add(ch)
    return escape(t)
def st(name, font="Sans", size=9.5, lead=None, color=CREAM, **kw): return ParagraphStyle(name, fontName=font, fontSize=size, leading=lead or size * 1.38, textColor=color, **kw)
H1 = st("h1", "Serif", 38, 38, CREAM); H2 = st("h2", "Serif", 22, 24, CREAM, spaceBefore=10, spaceAfter=4)
H3 = st("h3", "MonoB", 7.6, 10, colors.HexColor("#E0A45A"), spaceBefore=8, spaceAfter=2)
B = st("b", "Sans", 9.6); BS = st("bs", "Sans", 8.6, color=DIM); BUL = st("bul", "Sans", 9.3, leftIndent=10, bulletIndent=0)
MONO = st("mono", "Mono", 7.4, 10.2, CREAM); CELL = st("cell", "Sans", 8, 10); CELLB = st("cellb", "SansB", 8, 10); CELLH = st("cellh", "MonoB", 7.2, 9, DARK)
W, H = A4; M = 16 * mm

def bg(canv, doc):
    canv.saveState(); canv.setFillColor(DARK); canv.rect(0, 0, W, H, stroke=0, fill=1)
    canv.setStrokeColor(colors.HexColor("#2a1a14")); canv.setLineWidth(0.3)
    for x in range(0, int(W), 14): canv.line(x, 0, x, H)
    for y in range(0, int(H), 14): canv.line(0, y, W, y)
    canv.setFillColor(RED); canv.rect(0, H - 9 * mm, W, 9 * mm, stroke=0, fill=1)
    canv.setFont("MonoB", 7); canv.setFillColor(CREAM)
    canv.drawString(M, H - 6 * mm, "ALLOCRA  /  7-DAY CONTENT CAMPAIGN  /  20 DELIVERABLES")
    canv.drawRightString(W - M, H - 6 * mm, "PLAN CLEARLY. ACT DELIBERATELY.")
    canv.setFont("Mono", 6.8); canv.setFillColor(DIM)
    canv.drawString(M, 8 * mm, "Preview / TestNet demo · Not investment advice · Facts verbatim from allocra.buzz copy")
    canv.drawRightString(W - M, 8 * mm, str(doc.page)); canv.restoreState()
def cover(canv, doc):
    canv.saveState(); canv.setFillColor(RED); canv.rect(0, 0, W, H, stroke=0, fill=1)
    canv.setStrokeColor(colors.HexColor("#d4503a")); canv.setLineWidth(0.3)
    for x in range(0, int(W), 14): canv.line(x, 0, x, H)
    for y in range(0, int(H), 14): canv.line(0, y, W, y)
    canv.setFillColor(CREAM); canv.setFont("Mono", 9); canv.drawString(M, H - 24 * mm, "PRIVATE ALLOCATION DESK / 01   MMXXVI +")
    canv.setFont("Serif", 78); canv.drawString(M, H - 80 * mm, "Allocra")
    canv.setFont("Serif", 46); canv.drawString(M, H - 112 * mm, "7-day content campaign")
    canv.setFont("Sans", 13); canv.drawString(M, H - 126 * mm, "10 photos + 10 videos (16:9, 1920x1080, 60 fps), with generation prompts")
    for k, (n, l) in enumerate([("10", "PHOTOS"), ("10", "VIDEOS"), ("7", "DAYS")]):
        x = M + k * 58 * mm
        canv.setFillColor(DARK); canv.rect(x, 40 * mm, 52 * mm, 36 * mm, stroke=0, fill=1)
        canv.setFillColor(CREAM); canv.setFont("Serif", 44); canv.drawString(x + 6 * mm, 58 * mm, n); canv.setFont("MonoB", 9); canv.drawString(x + 6 * mm, 47 * mm, l)
    canv.setFont("Mono", 8); canv.drawString(M, 22 * mm, "Allocra · Preview / TestNet demo · Not investment advice"); canv.restoreState()

doc = BaseDocTemplate(OUT, pagesize=A4, leftMargin=M, rightMargin=M, topMargin=16 * mm, bottomMargin=16 * mm, title="Allocra 7-Day Content Campaign", author="Allocra Labs content (drafted with Claude Code)")
fr = Frame(M, 16 * mm, W - 2 * M, H - 32 * mm, leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
doc.addPageTemplates([PageTemplate(id="cover", frames=[fr], onPage=cover), PageTemplate(id="body", frames=[fr], onPage=bg)])
def P(t, s=B): return Paragraph(e(t), s)
def bullets(l, s=BUL): return [Paragraph(e(x), s, bulletText="•") for x in l]
def box(items, border=LINE, bgc=PANEL):
    t = Table([[items]], colWidths=[W - 2 * M]); t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), bgc), ("BOX", (0, 0), (-1, -1), 1, border), ("LEFTPADDING", (0, 0), (-1, -1), 8), ("RIGHTPADDING", (0, 0), (-1, -1), 8), ("TOPPADDING", (0, 0), (-1, -1), 6), ("BOTTOMPADDING", (0, 0), (-1, -1), 6)])); return t
def table(rows, widths):
    t = Table(rows, colWidths=widths, repeatRows=1)
    t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, 0), CREAM), ("ROWBACKGROUNDS", (0, 1), (-1, -1), [PANEL, colors.HexColor("#2d1b16")]), ("GRID", (0, 0), (-1, -1), 0.4, LINE), ("VALIGN", (0, 0), (-1, -1), "TOP"), ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4)])); return t

S = [NextPageTemplate("body"), PageBreak()]
S += [Paragraph("Campaign brief", H1), Spacer(1, 4),
      P("Goal. Introduce Allocra and one idea over seven days: plan a tokenized ETF basket around what you actually want to own, see concentration, overlap, quotes and costs before you confirm, and decide for yourself. The tone borrows the patience of the old masters: calm, deliberate, no hype.")]
S += [Paragraph("Audience (assumption, please confirm)", H2)] + bullets(["Self-directed investors curious about tokenized ETFs and real-world assets onchain.", "Crypto-native users who want planning and cost visibility rather than a feed of tips.", "People following the tokenization ecosystem (Ondo, xStocks, Centrifuge, Maple, Chainlink)."])
S += [Paragraph("Pillars", H2)]
cnt = lambda p: str(sum(1 for d in C.D if d["pillar"] == p))
S += [table([[Paragraph(x, CELLH) for x in ["Pillar", "Pieces", "What it does"]],
             [P("Launch / Brand", CELLB), P(str(sum(1 for d in C.D if d["pillar"] in ("Launch", "Brand"))), CELL), P("State the promise and sign off with the tagline.", CELL)],
             [P("Product / Safety", CELLB), P(str(sum(1 for d in C.D if d["pillar"] in ("Product", "Safety"))), CELL), P("Show the allocation slate and the plan-first, approve-later principle.", CELL)],
             [P("Philosophy / Principles / Education", CELLB), P(str(sum(1 for d in C.D if d["pillar"] in ("Philosophy", "Principles", "Education"))), CELL), P("The old-masters collection: judgment, overlap, risk, decisions, volatility.", CELL)],
             [P("Ecosystem", CELLB), P(cnt("Ecosystem"), CELL), P("Sourced facts about the five tracked protocols, always with the non-affiliation line.", CELL)]], [52 * mm, 18 * mm, W - 2 * M - 70 * mm])]
S += [Paragraph("Voice", H2)] + bullets(["Calm, precise, plain English. Short sentences. Never urgent.", "Never promise returns, never give investment advice, never imply a protocol endorses Allocra.", "Every figure is traceable: the allocation slate is labelled Preview; protocol figures say “Source: official X profile, checked 24 Oct 2026”."])
S += [Paragraph("Visual system", H2)] + bullets(["Colour: vermilion #C12E19 (hero, end cards), dark brown #20130E (collection, UI), cream #F6DAC3 (type and cards), accent #CF3321.", "Type: Instrument Serif headlines with tight tracking; DM Sans body; JetBrains Mono labels. Fine grid overlay; thin cream borders.", "Photos: 4:5 at 2160x2700 JPEG. Videos: 16:9 (1920x1080) at 60 fps, calm original score, no voiceover.", "Videos use ONLY the reference-film grammar (in-place word swaps, cursor-led, one idea per beat on one flat colour, cards rise in, end on centred logo + line or URL)."])
S += [PageBreak(), Paragraph("Fact bank (use only these)", H1), Spacer(1, 3), P("Every number and sentence in the plan comes from the supplied allocra.buzz copy. Add a fact here before using it anywhere else.", BS), Spacer(1, 5)]
S += [table([[Paragraph("Topic", CELLH), Paragraph("Verbatim fact", CELLH)]] + [[P(a, CELLB), P(b, CELL)] for a, b in C.FACTS], [36 * mm, W - 2 * M - 36 * mm]), PageBreak()]
S += [Paragraph("7-day calendar", H1), Spacer(1, 4)]
rows = [[Paragraph(x, CELLH) for x in ["DAY", "ID", "TYPE", "TITLE", "PILLAR", "FORMAT"]]]
for d in C.D: rows.append([P(str(d["day"]), CELLB), P(d["id"], CELLB), P(d["kind"], CELL), P(d["title"], CELLB), P(d["pillar"], CELL), P(d["fmt"].split(",")[0], CELL)])
t = table(rows, [11 * mm, 11 * mm, 16 * mm, 70 * mm, 28 * mm, W - 2 * M - 136 * mm])
S += [t, Spacer(1, 6), P("Cadence: post the video first, then the photo 3-4 hours later. Day 4 and Day 5 carry three pieces, Days 6 and 7 carry four. Every post carries the line “Preview / TestNet demo · Not investment advice” where product visuals appear.", BS), PageBreak()]
S += [Paragraph("How to use the prompts", H1), Spacer(1, 3)] + bullets(["Videos: paste the prompt into Claude Code inside the claudemotion repo. It already carries the rules, palette, spec and allowed facts.", "Photos: the preferred route is the AllocraPosts composition (exact logo, type and paintings). The image prompts are for exploring layouts only.", "Check every output against the Fact Bank before publishing."])
S += [Paragraph("Master prompts", H2)]
for k, v in [("VIDEO", C.REMO + "Task: build a [N]-second 16:9 film titled [TITLE] in the style of reference film [Krea | Notion | Conqueror | Pages | Supabase]. " + C.STYLE + " Facts allowed: [PASTE FROM FACT BANK]. Scenes: [LIST WITH TIMES]."), ("PHOTO", "Design one Allocra post (4:5, 1080x1350, delivered 2160x2700). Vermilion #C12E19 / dark #20130E / cream #F6DAC3, tight-tracked high-contrast serif headline, mono labels, fine grid, thin cream borders, one idea, generous negative space, no gradients, no invented data. Copy: [PASTE VERBATIM].")]:
    S += [KeepTogether([Paragraph(k, H3), box([Paragraph(e(v), MONO)])]), Spacer(1, 4)]
S += [PageBreak()]
KC = {"Video": RED, "Photo": colors.HexColor("#E0A45A")}
for d in C.D:
    tag = Table([[Paragraph(f"DAY {d['day']}", st("a", "MonoB", 8, color=DARK)), Paragraph(f"{d['id']}  ·  {d['kind'].upper()}", st("b2", "MonoB", 8, color=CREAM)), Paragraph(d["pillar"].upper(), st("c", "MonoB", 8, color=DARK))]], colWidths=[22 * mm, 66 * mm, W - 2 * M - 88 * mm])
    tag.setStyle(TableStyle([("BACKGROUND", (0, 0), (0, 0), CREAM), ("BACKGROUND", (1, 0), (1, 0), KC[d["kind"]]), ("BACKGROUND", (2, 0), (2, 0), colors.HexColor("#E0A45A")), ("BOX", (0, 0), (-1, -1), 1, CREAM), ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4)]))
    lab = "SHOT LIST" if d["kind"] == "Video" else "ON-IMAGE COPY"
    S += [tag, Spacer(1, 4), Paragraph(e(d["title"]), st("dt", "Serif", 26, 28, CREAM, spaceBefore=6, spaceAfter=4)),
          table([[P("Format", CELLB), P(d["fmt"], CELL)], [P("Reference", CELLB), P(d["ref"], CELL)], [P("Objective", CELLB), P(d["objective"], CELL)]], [22 * mm, W - 2 * M - 22 * mm]) if False else Table([[P("Format", CELLB), P(d["fmt"], CELL)], [P("Reference", CELLB), P(d["ref"], CELL)], [P("Objective", CELLB), P(d["objective"], CELL)]], colWidths=[22 * mm, W - 2 * M - 22 * mm], style=TableStyle([("GRID", (0, 0), (-1, -1), 0.4, LINE), ("BACKGROUND", (0, 0), (0, -1), PANEL), ("TOPPADDING", (0, 0), (-1, -1), 3), ("BOTTOMPADDING", (0, 0), (-1, -1), 3)])),
          Paragraph(lab, H3)] + bullets(d["script"]) + [Paragraph("CAPTION / POST COPY", H3), box([Paragraph(e(d["caption"]), B), Spacer(1, 3), Paragraph(e(d["tags"]), st("tg", "Mono", 8, color=colors.HexColor("#E0A45A")))]),
          Paragraph("GENERATION PROMPT" + (" (CLAUDE CODE / REMOTION)" if d["kind"] == "Video" else " (IMAGE TOOL, OR AllocraPosts IN REMOTION)"), H3), box([Paragraph(e(d["prompt"]), MONO)], border=KC[d["kind"]]), PageBreak()]
S += [Paragraph("Before you publish", H1), Spacer(1, 3), Paragraph("Things to verify", H2)] + bullets([
    "The product is a Preview / TestNet demo. Nothing in this plan claims it is live; keep the Preview tag on every slate visual.",
    "Protocol figures (followers, joined dates) are snapshots from official X profiles checked 24 Oct 2026. Refresh them before posting on later dates.",
    "Protocol names are used as text only, with the supplied non-affiliation disclaimer. No protocol logos are used. Confirm you are happy to name them.",
    "The paintings were cropped from the supplied website screenshots (low resolution, upscaled). Send the original image files for sharper posts.",
    "Painting provenance and image rights: confirm you hold the rights to the artworks shown on the site.",
    "Handle, hashtags and the allocra.buzz link are not confirmed by the supplied material; check before scheduling.",
    "The monthly-purchase slider moving up to $1,200 in V2 is an animation of the control; the figures shown are the site's preview figures."])
doc.build(S)
print("built", OUT, "missing:", sorted(missing))
