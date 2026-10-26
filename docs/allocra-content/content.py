# -*- coding: utf-8 -*-
"""Allocra Labs: 7-day content plan, 20 deliverables (10 photos + 10 videos).
Every fact is verbatim from the supplied allocra.buzz copy (Preview / TestNet demo). Nothing invented."""

FACTS = [
    ("Product line", "Allocra · Private allocation desk / 01 · MMXXVI · “Your assets. Your allocation.”"),
    ("Hero copy", "Plan a tokenized ETF basket around the positions you actually want to own. See concentration, overlap, quotes, and trading costs before you confirm."),
    ("Safety line", "Plan first. Assets remain individually held until you approve a trade."),
    ("Allocation slate (Preview)", "Allocation slate / draft · Core allocation · 3 ETFs · US equity 55% · International equity 25% · US bonds 20% · Monthly purchase $1,200 · Issuer tilt High · Overlap 0% · Est. cost / yr $0.50 · tabs Income, Core, Growth."),
    ("Principle", "Allocation is a decision, not a default."),
    ("Collection / 02", "Old masters. New allocation. Every great portfolio, like every great painting, is a series of deliberate choices. Allocra borrows the patience of the old masters for the way you invest."),
    ("Six paintings", "Human judgment, machine precision (Plan with data. Decide yourself.) · Look beneath the percentages (Overlap, concentration, cost) · Know the risk (Looking back is not looking ahead) · Every move is a decision (Strategy over reaction) · Read before you act (Quotes and costs, checked first) · Hold steady (Volatility is part of the story)."),
    ("Universe / 03", "Built around the tokenization ecosystem. Allocra tracks the protocols that bring real-world assets onchain. Every figure below comes from the protocol's own X profile, with a link to check it yourself."),
    ("Ondo Finance @Ondo", "Tokenized treasuries & stocks. 383.9K followers on X, joined March 2021. In a basket: Low-volatility treasury and equity exposure."),
    ("xStocks @xStocksFi", "Tokenized equities & ETFs. 87.3K followers, joined April 2025. In a basket: Equity and ETF sleeves."),
    ("Centrifuge @centrifuge", "Tokenized funds & credit. 94.2K followers, joined April 2018. In a basket: Credit and fixed-income sleeves."),
    ("Maple @maplefinance", "Onchain credit. 62.4K followers, joined August 2019. In a basket: Yield from onchain lending."),
    ("Chainlink @chainlink", "Oracles & data. 1.3M followers, joined June 2013. In a basket: Price feeds behind tokenized assets."),
    ("Sourcing", "Source: official X profile, checked 24 Oct 2026."),
    ("Disclaimer (verbatim)", "Logos and names belong to their owners and are shown for identification only. Allocra is not affiliated with, sponsored or endorsed by these protocols, and none of their assets can be bought in the TestNet demo."),
    ("Footer / tagline", "Allocra · Plan clearly. Act deliberately. Assets remain individually held. allocra.buzz"),
]

STYLE = ("Video style (standing rule): follow ONLY the motion grammar of the five reference films (Krea 3, Notion agents, Conqueror, “Pages.”, Supabase Middleware): "
         "headline words blur in/out and are swapped in place, a cursor or typing caret drives the story, one idea per beat on one flat colour, UI cards rise in from below with soft shadows, "
         "end on a centred logo plus one line or URL. No wipes, stamps or shakes.")
REMO = ("You are working in the claudemotion repo (Remotion 4, Python audio); follow docs/PLAYBOOK.md and the standing rules in AGENTS.md. Allocra brand: vermilion #C12E19, dark brown #20130E, cream #F6DAC3, accent #CF3321; "
        "Instrument Serif headlines (tight tracking), DM Sans body, JetBrains Mono labels (self-hosted); logo public/allocra/content/logo.png. Use only facts from the Fact Bank and label the allocation slate as Preview (TestNet demo). "
        "Landscape 16:9, 1920x1080 at 60 fps. One component per scene, drive everything from the frame, timing in a JSON timeline that also drives the calm original score (scripts/oryn/generate_audio.py). Lint, render stills for a contact sheet, then render and verify with ffprobe and ebur128. ")
POSTFMT = "4:5, 1080x1350 design canvas, delivered at 2160x2700 JPEG"
VFMT = "1920x1080 (16:9), 60 fps, original calm score + soft UI sounds, no voiceover"

D = []
def add(**k): D.append(k)

add(id="V1", day=1, kind="Video", pillar="Launch", title="Your assets. Your allocation.", fmt="18 s, " + VFMT, ref="Conqueror (word swap) + Krea (cursor, card)",
    objective="Introduce Allocra and its promise in one film.",
    script=["0-4 s  Vermilion. “Your assets.” swaps in place to “Your allocation.”; mono line: MMXXVI + Private allocation desk / 01.",
            "4-9 s  The allocation slate (Preview) rises in; donut draws 55 / 25 / 20; cursor clicks Core.",
            "9-14 s  Dark. “Plan a tokenized ETF basket around the positions you actually want to own.” swaps to “See concentration, overlap, quotes, and trading costs before you confirm.”",
            "14-18 s  Logo, Allocra, “Plan clearly. Act deliberately.”, typed allocra.buzz."],
    caption="Your assets. Your allocation. Plan a tokenized ETF basket around the positions you actually want to own, and see concentration, overlap, quotes, and trading costs before you confirm. Plan first. Assets remain individually held until you approve a trade. (Preview / TestNet demo)",
    tags="#Allocra #TokenizedETFs #Tokenization #RWA #Investing",
    prompt=REMO + "Task: 18 s film “Your assets. Your allocation.” " + STYLE + " Scenes: (1) in-place swap “Your assets.” / “Your allocation.” on vermilion; (2) allocation slate card rises in, donut animates 55/25/20, cursor clicks the Core tab; (3) dark background, two sentences swapped in place; (4) logo end card with typed allocra.buzz.")
add(id="P1", day=1, kind="Photo", pillar="Launch", title="Hero: Your assets. Your allocation.", fmt=POSTFMT, ref="Allocra site hero",
    objective="Pinned post stating the promise.",
    script=["Label: Private allocation desk / 01", "Headline: Your assets. Your allocation.", "Body: Plan a tokenized ETF basket around the positions you actually want to own.", "Logo top-right; MMXXVI +"],
    caption="Allocation is a decision, not a default. Plan a tokenized ETF basket around the positions you actually want to own.",
    tags="#Allocra #TokenizedETFs #Investing",
    prompt="Image prompt: Editorial poster, 4:5, flat vermilion (#C12E19) with a very fine cream grid, huge tight-tracked high-contrast condensed serif headline “Your assets. Your allocation.” in cream, small mono label top-left, small painted-asterisk app icon top-right, one line of sans body text bottom-left, generous negative space, no photos, no gradients. Preferred: AllocraPosts frame 0 in Remotion so type and logo are exact.")

add(id="V2", day=2, kind="Video", pillar="Product", title="Plan first: the allocation slate", fmt="16 s, " + VFMT, ref="Notion (prompt card) + Krea (cursor)",
    objective="Show the slate: split, monthly purchase, issuer tilt, overlap, cost.",
    script=["0-3 s  “Plan first.” swaps to “Before you confirm.”", "3-12 s  Slate rises in (Preview). Cursor drags the Monthly purchase slider up to $1,200; Issuer tilt High, Overlap 0%, Est. cost / yr $0.50 appear; cursor clicks Core.", "12-16 s  Logo end card: “Assets remain individually held until you approve a trade.”"],
    caption="Plan first. The allocation slate shows your split, your monthly purchase, issuer tilt, overlap and estimated yearly cost before you confirm. (Preview / TestNet demo)",
    tags="#Allocra #Allocation #ETF #Planning",
    prompt=REMO + "Task: 16 s film “Plan first.” " + STYLE + " Use the slate figures exactly (55/25/20, $1,200, High, 0%, $0.50) and keep the Preview tag visible. The slider drag from a lower value to $1,200 is an animation of the control, not data.")
add(id="P2", day=2, kind="Photo", pillar="Product", title="See it before you confirm", fmt=POSTFMT, ref="Allocra site slate",
    objective="Static slate for saves and shares.",
    script=["Headline: See it before you confirm.", "Card: Allocation slate / draft, Core allocation, 3 ETFs, US equity 55%, International equity 25%, US bonds 20%, Monthly purchase $1,200, Issuer tilt High, Overlap 0%, Est. cost / yr $0.50, tabs Income / Core / Growth, Preview tag."],
    caption="Split, monthly purchase, issuer tilt, overlap and cost, all visible before you confirm anything. (Preview / TestNet demo)",
    tags="#Allocra #Allocation #ETF",
    prompt="Image prompt: dark brown 4:5 poster with fine grid, serif headline “See it before you confirm.”, one dark-red bordered card with a cream donut chart (55/25/20), mono labels and a three-tab selector, hard clean UI, no photos. Preferred: AllocraPosts frame 1.")

add(id="V3", day=3, kind="Video", pillar="Philosophy", title="Human judgment, machine precision", fmt="14 s, " + VFMT, ref="Pages. (slow push-in) + Conqueror (swap)",
    objective="Set the brand tone with the Creation of Adam painting.",
    script=["0-10 s  The Creation of Adam robot painting rises in with a slow push; text swaps in place: “Human judgment,” to “machine precision.”; mono: Plan with data. Decide yourself.", "10-14 s  Logo end card: “Plan with data. Decide yourself.”"],
    caption="Human judgment, machine precision. Plan with data. Decide yourself.", tags="#Allocra #Investing #Tokenization",
    prompt=REMO + "Task: 14 s film. " + STYLE + " Use the supplied painting crop public/allocra/content/adam.jpg in the site's thin-bordered frame with a slow zoom.")
add(id="P3", day=3, kind="Photo", pillar="Philosophy", title="Old masters. New allocation.", fmt=POSTFMT, ref="Allocra collection",
    objective="Brand-world post.",
    script=["Label: Old masters. New allocation.", "Painting: robot and figure reaching toward each other", "Headline: Human judgment, machine precision.", "Mono: Plan with data. Decide yourself."],
    caption="Old masters. New allocation. Every great portfolio, like every great painting, is a series of deliberate choices.", tags="#Allocra #OldMasters #Investing",
    prompt="Image prompt: dark brown poster, thin cream-bordered painting frame containing a Renaissance fresco-style painting of a robot and a human hand almost touching, serif headline beneath, mono caption, fine grid. Preferred: AllocraPosts frame 2 with the supplied painting.")

add(id="V4", day=4, kind="Video", pillar="Education", title="Look beneath the percentages", fmt="16 s, " + VFMT, ref="Krea (highlight row) + Notion",
    objective="Explain overlap, concentration, cost.",
    script=["0-3 s  “Look beneath the percentages.”", "3-13 s  Scholars painting; three rows rise in (Overlap 0%, Issuer tilt High, Est. cost / yr $0.50, Preview). Cursor highlights each row in turn.", "13-16 s  Logo end card: “Overlap, concentration, cost.”"],
    caption="Look beneath the percentages. Overlap, concentration, cost. (Preview / TestNet demo)", tags="#Allocra #Overlap #ETF #Risk",
    prompt=REMO + "Task: 16 s film. " + STYLE + " Rows use the slate's preview figures and carry the Preview tag; the highlight sweep is the cursor demo.")
add(id="P4", day=4, kind="Photo", pillar="Education", title="Look beneath the percentages", fmt=POSTFMT, ref="Allocra collection",
    objective="Education post on overlap and concentration.",
    script=["Painting: three scholars studying data on a laptop", "Headline: Look beneath the percentages.", "Mono: Overlap, concentration, cost"],
    caption="Look beneath the percentages. Overlap, concentration, cost.", tags="#Allocra #ETF #Overlap",
    prompt="Image prompt: dark brown poster, framed painting of three scholars around a laptop beside an armillary sphere, serif headline, mono caption. Preferred: AllocraPosts frame 3.")
add(id="P5", day=4, kind="Photo", pillar="Education", title="Read before you act", fmt=POSTFMT, ref="Allocra collection",
    objective="Reinforce checking quotes and costs.",
    script=["Painting: a man reading a newspaper at a window with a tall ship", "Headline: Read before you act.", "Mono: Quotes and costs, checked first"],
    caption="Read before you act. Quotes and costs, checked first.", tags="#Allocra #Investing #Costs",
    prompt="Image prompt: dark brown poster, tall framed painting of a man reading at a harbour window, serif headline, mono caption. Preferred: AllocraPosts frame 4.")

add(id="V5", day=5, kind="Video", pillar="Principles", title="Know the risk", fmt="14 s, " + VFMT, ref="Pages. + Conqueror",
    objective="Principle: looking back is not looking ahead.",
    script=["0-10 s  Painter-and-skeleton painting; text swaps in place: “Know the risk.” to “Looking back is not looking ahead.”", "10-14 s  Logo end card."],
    caption="Know the risk. Looking back is not looking ahead.", tags="#Allocra #Risk #Investing",
    prompt=REMO + "Task: 14 s film. " + STYLE + " Painting crop public/allocra/content/painter.jpg.")
add(id="V6", day=5, kind="Video", pillar="Principles", title="Every move is a decision", fmt="14 s, " + VFMT, ref="Pages. + Conqueror",
    objective="Principle: strategy over reaction.",
    script=["0-10 s  Chess painting; text swaps in place: “Every move is a decision.” to “Strategy over reaction.”", "10-14 s  Logo end card."],
    caption="Every move is a decision. Strategy over reaction.", tags="#Allocra #Strategy #Investing",
    prompt=REMO + "Task: 14 s film. " + STYLE + " Painting crop public/allocra/content/chess.jpg.")
add(id="P6", day=5, kind="Photo", pillar="Principles", title="Hold steady", fmt=POSTFMT, ref="Allocra collection",
    objective="Calm-under-volatility post.",
    script=["Painting: a lone figure facing a pride of lions", "Headline: Hold steady.", "Mono: Volatility is part of the story"],
    caption="Hold steady. Volatility is part of the story.", tags="#Allocra #Volatility #Investing",
    prompt="Image prompt: dark brown poster, framed painting of a lone figure facing lions in a stone chamber, short serif headline, mono caption. Preferred: AllocraPosts frame 5.")

add(id="V7", day=6, kind="Video", pillar="Ecosystem", title="Built around the tokenization ecosystem", fmt="22 s, " + VFMT, ref="Supabase (cards in sequence) + Krea",
    objective="Show the five tracked protocols with sourced figures.",
    script=["0-3 s  “Built around the tokenization ecosystem.”", "3-18 s  One card at a time (3 s each): Ondo Finance, xStocks, Centrifuge, Maple, Chainlink with handle, category, description, followers on X, joined, In a basket line, Verify on X, Source: official X profile, checked 24 Oct 2026. Disclaimer line stays on screen.", "18-22 s  Logo end card."],
    caption="Built around the tokenization ecosystem. Allocra tracks the protocols that bring real-world assets onchain. Every figure comes from the protocol's own X profile (checked 24 Oct 2026). Allocra is not affiliated with, sponsored or endorsed by these protocols, and none of their assets can be bought in the TestNet demo.",
    tags="#Allocra #Tokenization #RWA #Onchain",
    prompt=REMO + "Task: 22 s film. " + STYLE + " Text only for the protocols (no logos). Copy every figure exactly from the Fact Bank and keep the non-affiliation disclaimer visible throughout.")
add(id="V8", day=6, kind="Video", pillar="Ecosystem", title="Verify it yourself", fmt="14 s, " + VFMT, ref="Krea (cursor click) + Notion",
    objective="Trust: every figure is checkable.",
    script=["0-10 s  Ondo Finance card rises in; text swaps in place: “Every figure comes from the protocol's own X profile.” to “With a link to check it yourself.” Cursor clicks Verify on X.", "10-14 s  Logo end card: “Check it yourself.”"],
    caption="Every figure comes from the protocol's own X profile, with a link to check it yourself. Source: official X profile, checked 24 Oct 2026.",
    tags="#Allocra #Transparency #Tokenization",
    prompt=REMO + "Task: 14 s film. " + STYLE + " Use the Ondo Finance card exactly as in the Fact Bank.")
add(id="P7", day=6, kind="Photo", pillar="Ecosystem", title="Built around the tokenization ecosystem", fmt=POSTFMT, ref="Allocra universe",
    objective="Static ecosystem list with sourced numbers.",
    script=["Headline: Built around the tokenization ecosystem.", "Rows: Ondo Finance 383.9K, xStocks 87.3K, Centrifuge 94.2K, Maple 62.4K, Chainlink 1.3M (followers on X, join dates)", "Footer: Source: official X profiles, checked 24 Oct 2026; non-affiliation disclaimer"],
    caption="Built around the tokenization ecosystem. Figures from each protocol's own X profile, checked 24 Oct 2026. Not affiliated with, sponsored or endorsed by these protocols.",
    tags="#Allocra #Tokenization #RWA",
    prompt="Image prompt: dark brown poster with fine grid, serif headline, five thin-ruled rows each with a serif protocol name, mono handle and a large mono follower count, small disclaimer at the bottom, no logos. Preferred: AllocraPosts frame 6.")
add(id="P8", day=6, kind="Photo", pillar="Ecosystem", title="Verify it yourself", fmt=POSTFMT, ref="Allocra universe",
    objective="Trust post.",
    script=["Headline: Every figure comes from the protocol's own X profile.", "Button: Verify on X", "Line: With a link to check it yourself.", "Source: official X profile, checked 24 Oct 2026."],
    caption="Every figure comes from the protocol's own X profile, with a link to check it yourself.", tags="#Allocra #Transparency",
    prompt="Image prompt: flat vermilion poster, huge cream serif headline, small cream button reading “Verify on X”, mono source line. Preferred: AllocraPosts frame 7.")

add(id="V9", day=7, kind="Video", pillar="Safety", title="Plan first. Assets remain individually held.", fmt="14 s, " + VFMT, ref="Notion (one idea, flat colour)",
    objective="Reassure: nothing happens until you approve.",
    script=["0-9 s  Vermilion. “Plan first.” swaps to “Assets remain individually held until you approve a trade.”; Open workspace button rises in; cursor hovers it; footnote appears.", "9-14 s  Logo end card: “Allocation is a decision, not a default.”"],
    caption="Plan first. Assets remain individually held until you approve a trade.", tags="#Allocra #Investing #Planning",
    prompt=REMO + "Task: 14 s film. " + STYLE + " The button is a static cue, no click result is shown.")
add(id="V10", day=7, kind="Video", pillar="Brand", title="Plan clearly. Act deliberately.", fmt="18 s, " + VFMT, ref="Conqueror (swap) + Krea (end card)",
    objective="Recap and sign-off.",
    script=["0-12 s  “Your assets.”, “Your allocation.”, “A decision, not a default.” swapped in place.", "12-18 s  Logo end card: “Plan clearly. Act deliberately.” with typed allocra.buzz."],
    caption="Your assets. Your allocation. A decision, not a default. Plan clearly. Act deliberately.", tags="#Allocra #Investing",
    prompt=REMO + "Task: 18 s film. " + STYLE)
add(id="P9", day=7, kind="Photo", pillar="Brand", title="Allocation is a decision, not a default", fmt=POSTFMT, ref="Allocra site footer",
    objective="Principle post.",
    script=["Headline: Allocation is a decision, not a default.", "Cream background, dark-red serif type, logo top-right"],
    caption="Allocation is a decision, not a default.", tags="#Allocra #Investing",
    prompt="Image prompt: flat cream poster, huge dark-red tight-tracked serif headline in three lines, small painted-asterisk app icon top-right, mono footer. Preferred: AllocraPosts frame 8.")
add(id="P10", day=7, kind="Photo", pillar="Brand", title="Plan clearly. Act deliberately.", fmt=POSTFMT, ref="Allocra end card",
    objective="Sign-off post.",
    script=["Logo, Allocra, Plan clearly. Act deliberately., Assets remain individually held., allocra.buzz"],
    caption="Plan clearly. Act deliberately. Assets remain individually held. allocra.buzz", tags="#Allocra #Investing",
    prompt="Image prompt: flat vermilion poster, large painted-asterisk app icon, the word Allocra, two-line cream serif sign-off, one line of sans text, mono URL. Preferred: AllocraPosts frame 9.")

assert len(D) == 20
D.sort(key=lambda d: (d["day"], 0 if d["kind"] == "Video" else 1, d["id"]))
