# -*- coding: utf-8 -*-
"""Oryn 15-day content plan: 20 deliverables (8 posts, 8 videos, 4 articles).
All product facts are verbatim from the Oryn board (simulated issuer data).
No metrics, users or partnerships are invented."""

FACTS = [
    ("Product line", "ORYN · State-of-the-asset layer · “Is it safe to act on this token right now?”"),
    ("Core promise", "One verdict per token, per chain. A reason. The evidence. Branch on a single value instead of a pile of fields."),
    ("Board totals", "15 deployments. Open 1 · Market closed 5 · Action pending 2 · Redemption closed 2 · Stale 1 · Divergent 4. “1/15 deployments actionable now.” NYSE closed, opens in 6h."),
    ("Six verdicts", "Open: Redemptions open, NAV fresh, onchain state matches issuer. Market closed: Underlying exchange is closed; oracle price is frozen at the last close, as expected. Action pending: event not yet applied onchain. Redemption closed: Fund redemption window is shut; collateral cannot be redeemed at published NAV. Stale: Arbitrum head is not advancing. Not a market closure; do not treat as a weekend freeze. Divergent: issuer event not applied onchain."),
    ("Divergent examples", "xTSLA on Solana: Stock split 3:1 not applied on Solana. oNFLX on Ethereum and Base: Stock split 10:1 not applied. oQQQ on Base: DEX price drifting above reference on Base."),
    ("Action pending", "xAAPL on Ethereum and Solana: Dividend $0.27 / share · effective 2026-10-27 22:00 UTC · multiplier not yet applied. Event effective in 38h."),
    ("Other deployments", "oNVDA (ETH, BASE) market closed, opens in 6h. dMSFT on BASE market closed; on ARB stale. BUIDL (ETH, ARB) redemption closed, window opens in 6h. USTB (ETH) open, NAV strike in 13h."),
    ("Sections", "01 Board · 02 Asset · 03 Lookahead · 04 Divergence · 05 Wallet · 06 Guard · 07 API"),
    ("Time machine", "Replay any moment. Verdicts, calendar and alerts all follow. Stops: -1D, NOW, NEXT OPEN, +1D. Site shows +41.25h and 26/10/26 07:59."),
    ("Principles", "Unknown means not actionable. A bond proves skin in the game, not that an offchain asset exists."),
    ("Footer", "ORYN © 2026 · MVP · Simulated issuer data · Not investment advice"),
    ("Issuer models", "Rebasing (Backed xStocks), Total-return (Ondo Global Markets), Stablecoin (Dinari dShares), NAV (Securitize BUIDL, Superstate USTB)."),
]

STYLE = ("Video style (standing rule): follow ONLY the motion grammar of the five reference films (Krea 3, Notion agents, "
         "Conqueror, “Pages.”, Supabase Middleware): headline words blur in/out and are swapped in place, a cursor or "
         "typing caret drives the story, one idea per beat on one flat colour or one tilted dark plane, UI cards rise in from "
         "below with soft shadows, logos/icons float and cluster, code types on, end on a centred logo plus one line. "
         "No other transitions, wipes, stamps or shakes.")

REMO = ("You are working in the claudemotion repo (Remotion 4, Python audio) and must follow docs/PLAYBOOK.md and the "
        "standing style rule in AGENTS.md. Use real Oryn data only and label anything mocked “Illustrative”. "
        "Fonts Anton / Space Grotesk / Space Mono (self-hosted), palette cream #e4dfca, ink #0d0d0f, blue #2630c8, "
        "yellow #f2c200, red #e5321f, lavender #b9b3ee, green #1d3a24. Build one component per shot, drive everything "
        "from the frame number, write timeline.json, generate the music/SFX from the same timeline, lint, render stills "
        "for a contact sheet, then render and verify with ffprobe and ebur128. ")

POSTFMT = "4:5, 1080x1350 design canvas, rendered at 2x (2160x2700) as JPEG q94"

D = []

def add(**k): D.append(k)

# ---------------------------------------------------------------- DAY 1
add(id="V1", day=1, kind="Video", pillar="Launch", title="Introducing Oryn",
    fmt="30 s, 16:9, 1920x1080 @ 60 fps, music + SFX, no VO", ref="Conqueror (Introducing X for ...) + Krea (cursor, leaderboard)",
    objective="Announce Oryn and explain the product in one sentence.",
    script=[
        "0-4 s  “Introducing Oryn for”; the last word swaps in place: xTSLA / oNVDA / BUIDL / USTB (blur out, blur in). Flat cream, soft halftone bloom.",
        "4-9 s  Cursor draws a rounded card; text swaps: “Is it safe to act on this token right now?”",
        "9-18 s  Board leaderboard of 8 deployments rises in; cursor clicks xTSLA·SOL, row becomes a black pill: Divergent. Stock split 3:1 not applied on Solana.",
        "18-25 s  “One verdict per token, per chain.” then “A reason. The evidence.” swapped in place.",
        "25-30 s  Centred Oryn badge, line: “State of assets activated.” Footer: Simulated issuer data · Not investment advice.",
    ],
    caption="Introducing Oryn. The state-of-the-asset layer. One verdict per token, per chain, with a reason and the evidence. Is it safe to act on this token right now? Now you can branch on one value.",
    tags="#Oryn #RWA #Tokenization #DeFi #OnchainFinance",
    prompt=REMO + "Task: build the 30 s film “Introducing Oryn” at 1920x1080, 60 fps. " + STYLE +
           " Scenes: (1) “Introducing Oryn for [xTSLA|oNVDA|BUIDL|USTB]” with in-place word swap on a cream blurred halftone background; (2) a cursor draws a prompt card with the line “Is it safe to act on this token right now?”; (3) an 8-row leaderboard of Oryn deployments rises in, the cursor selects xTSLA SOL and the row becomes a black pill reading Divergent with the reason text; (4) in-place swaps: “One verdict per token, per chain.” / “A reason. The evidence.”; (5) centred badge from public/oryn/img/logo.png, line “State of assets activated.” Original 96 BPM music, soft UI ticks, no wipes or stamps.")

add(id="P1", day=1, kind="Post", pillar="Launch", title="Hero: Is it safe to act?",
    fmt=POSTFMT, ref="Krea / Conqueror flat-canvas typography",
    objective="Pin post for the profile. States the question Oryn answers.",
    script=["Headline: IS IT SAFE TO ACT? (blue, SAFE outlined)", "Sub: One verdict per token, per chain. A reason. The evidence.", "Badge top-left, footer: Oryn · State of assets activated · 01/06"],
    caption="Price tells you what a token is worth. It doesn’t tell you if it’s safe to act. That’s the question Oryn answers: one verdict per token, per chain, with a reason and the evidence.",
    tags="#Oryn #RWA #Tokenization",
    prompt="Image-generation prompt: Flat editorial poster, 4:5, warm cream paper (#e4dfca) with a faint cyan halftone-dot bloom behind the text, huge condensed grotesque headline “IS IT SAFE TO ACT?” in royal blue (#2630c8) with SAFE as outline lettering, small round badge logo top-left, one line of body copy bottom-left, generous negative space, no gradients, no 3D, no extra text. "
           "Preferred route: render with Remotion (composition OrynPosts, frame 0) so the logo and type are exact; use an image model only for exploring layouts.")

# ---------------------------------------------------------------- DAY 2
add(id="P2", day=2, kind="Post (carousel, 7 slides)", pillar="Education", title="The six verdicts",
    fmt=POSTFMT + " per slide", ref="Notion (one flat colour per idea)",
    objective="Teach the verdict vocabulary so every later post makes sense.",
    script=["Slide 1 cover: “Six verdicts. One value.”", "Slide 2 Open (green): Redemptions open, NAV fresh, onchain state matches issuer.", "Slide 3 Market closed (cream/blue): Underlying exchange is closed; oracle price is frozen at the last close, as expected.", "Slide 4 Action pending (yellow): event not yet applied onchain, e.g. xAAPL dividend $0.27 / share.", "Slide 5 Redemption closed (red): Fund redemption window is shut; collateral cannot be redeemed at published NAV.", "Slide 6 Stale (lavender): Arbitrum head is not advancing. Not a market closure.", "Slide 7 Divergent (black/red): issuer event not applied onchain, e.g. Stock split 3:1 not applied on Solana."],
    caption="Six verdicts. Open, Market closed, Action pending, Redemption closed, Stale, Divergent. Swipe for what each one means and why “market closed” is not the same as “broken”.",
    tags="#Oryn #RWA #DeFi #RiskManagement",
    prompt="Image-generation prompt (per slide): Flat 4:5 poster on a single solid colour (slide 2 deep green #1d3a24, slide 3 cream, slide 4 yellow #f2c200, slide 5 red #e5321f, slide 6 lavender #b9b3ee, slide 7 near-black), one condensed grotesque word as the headline, a rounded pill chip with the verdict label, two lines of monospace reason text, thick black outline and hard offset shadow on the card, no photos. "
           "Preferred route: extend the OrynPosts composition (one frame per slide) so copy stays verbatim.")

# ---------------------------------------------------------------- DAY 3
add(id="A1", day=3, kind="Article (short)", pillar="Thought leadership", title="Price is not a verdict",
    fmt="~220 words, blog / LinkedIn / X article, 1 hero post image", ref="-",
    objective="Frame the category: state-of-the-asset vs price feeds.",
    script=["Hook: A price feed answers one question. Is it safe to act answers another.",
            "Body: A tokenised stock can show a perfectly normal price while the exchange is closed, a split has not been applied on one chain, or a fund’s redemption window is shut. Each looks like “fine” to a price-only integration.",
            "Examples (from Oryn board): xTSLA on Solana is Divergent because a 3:1 split is not applied. BUIDL is Redemption closed because the window is shut. dMSFT on Arbitrum is Stale because the chain head is not advancing.",
            "Close: Oryn collapses this into one value per token, per chain, plus the reason and evidence. Unknown means not actionable."],
    caption="New post: why a price feed can look healthy while the token isn’t safe to act on. Three real examples from the Oryn board.",
    tags="#Oryn #RWA #Oracles #DeFi",
    prompt="Writing prompt: Write a 220-word article titled “Price is not a verdict” for builders and risk teams working with tokenised real-world assets. Plain, confident, no hype, no financial advice. Use ONLY these facts: xTSLA on Solana is Divergent (Stock split 3:1 not applied on Solana); BUIDL on Ethereum and Arbitrum is Redemption closed (window opens in 6h); dMSFT on Arbitrum is Stale (head not advancing, not a market closure); principle: Unknown means not actionable. Structure: hook, the problem, three examples, one-line close. End with: Simulated issuer data · Not investment advice. Do not invent statistics, customers or partners.")

# ---------------------------------------------------------------- DAY 4
add(id="V2", day=4, kind="Video", pillar="Product", title="Divergent: when a split is not applied",
    fmt="20 s, 16:9, 1920x1080 @ 60 fps", ref="Notion (flat colour per idea) + Krea (cursor)",
    objective="Show the most dramatic verdict with a real example.",
    script=["0-4 s  Flat cream. “A stock split is announced.” swaps to “The issuer applies it.”", "4-9 s  Two chain cards slide up: Ethereum and Solana. Cursor points at Solana.", "9-15 s  Background cross-fades to near-black. Pill: Divergent. “Stock split 3:1 not applied on Solana.”", "15-20 s  “One chain behind. Oryn catches it.” Badge end card."],
    caption="The issuer split the stock 3:1. Solana didn’t get the memo. That’s a Divergent verdict. Oryn flags it before you act.",
    tags="#Oryn #xStocks #RWA #OnchainRisk",
    prompt=REMO + "Task: 20 s film at 1920x1080/60 fps. " + STYLE + " Use the xTSLA example only (Stock split 3:1 not applied on Solana; next change unknown). Colour sequence: cream, then near-black with red type. Include a typing caret on the reason line. No invented numbers beyond 3:1.")

add(id="P3", day=4, kind="Post", pillar="Product", title="xTSLA Divergent",
    fmt=POSTFMT, ref="Conqueror (flat, high contrast)",
    objective="Single strong example of Divergent.",
    script=["Huge red xTSLA on near-black", "Pill: Divergent · 1 mismatch", "Stock split 3:1 not applied on Solana.", "Next change: unknown"],
    caption="xTSLA on Solana. Divergent. Stock split 3:1 not applied on Solana. Next change unknown. Unknown means not actionable.",
    tags="#Oryn #xTSLA #RWA",
    prompt="Image-generation prompt: Near-black 4:5 poster with faint diagonal red hatching, gigantic condensed grotesque word “xTSLA” in signal red (#e5321f), a red pill reading DIVERGENT, one bold sentence “Stock split 3:1 not applied on Solana.”, a thin red barcode along the bottom, no photos. Preferred: OrynPosts frame 2 (already built).")

# ---------------------------------------------------------------- DAY 5
add(id="V3", day=5, kind="Video", pillar="Product", title="Replay any moment",
    fmt="15 s, 16:9, 1920x1080 @ 60 fps", ref="Pages. (tilted plane, depth blur)",
    objective="Show the Time Machine.",
    script=["0-3 s  Dark plane tilts into view with the board cards. Title swaps: “Replay” / “any moment.”", "3-11 s  Cursor drags the slider across -1D, NOW, NEXT OPEN, +1D; cards re-colour as it moves (Illustrative state changes).", "11-15 s  Plane levels out. “Verdicts, calendar and alerts all follow.” Badge end."],
    caption="Time Machine. Replay any moment and the verdicts, calendar and alerts all follow.",
    tags="#Oryn #TimeMachine #RWA",
    prompt=REMO + "Task: 15 s film at 1920x1080/60 fps. " + STYLE + " Dark mode plane with perspective tilt (rotateX 8 deg, rotateY -10 deg) and depth-of-field blur on far cards. The slider labels are -1D, NOW, NEXT OPEN, +1D and the +41.25h readout from the site. Card state changes while scrubbing are Illustrative and must carry a small Illustrative tag.")

# ---------------------------------------------------------------- DAY 6
add(id="P4", day=6, kind="Post", pillar="Education", title="Market closed is not broken",
    fmt=POSTFMT, ref="Notion (flat colour, one message)",
    objective="Prevent false alarms; builds trust.",
    script=["Headline: MARKET CLOSED. NOT BROKEN.", "Body: Underlying exchange is closed; oracle price is frozen at the last close, as expected.", "Chip: Market closed · market opens in 6h"],
    caption="A frozen oracle price on a closed market is expected. Oryn labels it Market closed so you don’t treat a quiet price as a problem.",
    tags="#Oryn #RWA #Oracles",
    prompt="Image-generation prompt: 4:5 poster, solid royal blue background, cream condensed headline “MARKET CLOSED. NOT BROKEN.”, a cream rounded card with a blue Market closed pill and two lines of monospace text, hard black offset shadow, no photos. Preferred: extend OrynPosts.")

add(id="A2", day=6, kind="Article (short)", pillar="Education", title="How to read a frozen price",
    fmt="~200 words", ref="-",
    objective="Explain Market closed vs Stale, a common mistake.",
    script=["Hook: Two things look identical on a chart: a flat line because the market is closed, and a flat line because the chain stopped.", "Market closed: Underlying exchange is closed; oracle price is frozen at the last close, as expected. oNVDA and oQQQ on Ethereum opens in 6h.", "Stale: Arbitrum head is not advancing. Not a market closure; do not treat as a weekend freeze. (dMSFT on Arbitrum.)", "Close: One verdict, two very different next steps."],
    caption="Flat price? Check why. Market closed and Stale look the same on a chart and mean opposite things.",
    tags="#Oryn #RWA #OnchainRisk",
    prompt="Writing prompt: Write a 200-word explainer “How to read a frozen price”. Contrast Market closed (Underlying exchange is closed; oracle price is frozen at the last close, as expected; market opens in 6h) with Stale (Arbitrum head is not advancing; not a market closure; do not treat as a weekend freeze). Use dMSFT on Base (Market closed) vs dMSFT on Arbitrum (Stale) as the paired example. No advice, no invented data. End with the footer line.")

# ---------------------------------------------------------------- DAY 7
add(id="V4", day=7, kind="Video", pillar="Product", title="The Guard",
    fmt="20 s, 16:9, 1920x1080 @ 60 fps", ref="Notion agents (prompt box, flat colour) + Supabase (typing)",
    objective="Show the decision-point product: check before you act.",
    script=["0-4 s  Flat yellow. “Before you swap,” swaps to “ask the Guard.”", "4-10 s  Form card rises in; caret types Token: xTSLA, Chain: SOL, Action: Swap.", "10-15 s  Background cuts via colour change to red; result card: BLOCKED. Stock split 3:1 not applied on Solana.", "15-20 s  “Unknown means not actionable.” Badge end."],
    caption="The Guard. Type the token and chain, get a verdict before you act. xTSLA on Solana: BLOCKED.",
    tags="#Oryn #Guard #RWA",
    prompt=REMO + "Task: 20 s film at 1920x1080/60 fps. " + STYLE + " The form values (xTSLA, SOL, Swap) are Illustrative. The result text is taken from the Oryn board. Typing caret, send button pulse, one flat-colour change per idea.")

add(id="P5", day=7, kind="Post", pillar="Product", title="BLOCKED",
    fmt=POSTFMT, ref="Conqueror (bold single message)",
    objective="Memorable one-word post for the Guard.",
    script=["Headline: BLOCKED.", "Sub: xTSLA · SOL · Divergent", "Line: Stock split 3:1 not applied on Solana."],
    caption="xTSLA on Solana. Result from the Guard: BLOCKED.",
    tags="#Oryn #Guard",
    prompt="Image-generation prompt: 4:5 poster, red background (#e5321f), giant cream condensed word “BLOCKED.”, small black pill with white text “xTSLA · SOL · DIVERGENT”, one sentence in monospace, hard shadow, no photos.")

# ---------------------------------------------------------------- DAY 8
add(id="V5", day=8, kind="Video", pillar="Product", title="Same token, different chain",
    fmt="25 s, 16:9, 1920x1080 @ 60 fps", ref="Krea 3 (leaderboard rows, black pill)",
    objective="Show per-chain verdicts: xTSLA ETH vs SOL.",
    script=["0-5 s  “Same token.” / “Different chain.” swapped in place.", "5-14 s  Two rows rise: xTSLA·ETH Market closed, xTSLA·SOL Divergent; black pill highlight moves between them with the cursor.", "14-22 s  Reason lines type on for each.", "22-25 s  “One verdict per token, per chain.” Badge."],
    caption="Same token. Different chain. Different answer. xTSLA is Market closed on Ethereum and Divergent on Solana.",
    tags="#Oryn #xStocks #MultiChain",
    prompt=REMO + "Task: 25 s film at 1920x1080/60 fps. " + STYLE + " Leaderboard table styled like the Krea reference: white-card rows, black pill on the highlighted row, cursor moves between rows. Data: xTSLA ETH Market closed (market opens in 6h), xTSLA SOL Divergent (Stock split 3:1 not applied on Solana).")

add(id="P6", day=8, kind="Post", pillar="Education", title="Stale is not a weekend",
    fmt=POSTFMT, ref="Notion",
    objective="Highlight the Stale verdict.",
    script=["Headline: STALE IS NOT A WEEKEND", "Body: Arbitrum head is not advancing. Not a market closure; do not treat as a weekend freeze.", "Chip: dMSFT · ARB · Stale"],
    caption="A chain that stops advancing isn’t a market holiday. dMSFT on Arbitrum is Stale.",
    tags="#Oryn #Arbitrum #RWA",
    prompt="Image-generation prompt: 4:5 poster, lavender background (#b9b3ee), black condensed headline, one rounded card with black pill “STALE” and two lines of monospace text.")

# ---------------------------------------------------------------- DAY 9
add(id="V6", day=9, kind="Video", pillar="Product", title="Action pending: the dividend",
    fmt="20 s, 16:9, 1920x1080 @ 60 fps", ref="Conqueror (cycling lines, mini cards)",
    objective="Teach Lookahead: events before they land.",
    script=["0-5 s  “A dividend is coming.” swaps to “Is your multiplier ready?”", "5-12 s  Mini calendar card: effective 2026-10-27 22:00 UTC. Row xAAPL·ETH Action pending.", "12-17 s  Countdown chip “event effective in 38h”.", "17-20 s  “Dividend $0.27 / share. Multiplier not yet applied.” Badge."],
    caption="Dividend $0.27 per share, effective 2026-10-27 22:00 UTC, multiplier not yet applied on Ethereum or Solana. That’s Action pending.",
    tags="#Oryn #xAAPL #Lookahead",
    prompt=REMO + "Task: 20 s film at 1920x1080/60 fps on a flat yellow background. " + STYLE + " Use only the xAAPL dividend facts: $0.27 / share, effective 2026-10-27 22:00 UTC, multiplier not yet applied on Ethereum and Solana, event effective in 38h. The calendar card is a simplified Illustrative UI.")

add(id="P7", day=9, kind="Post", pillar="Product", title="Action pending",
    fmt=POSTFMT, ref="Conqueror",
    objective="Static version of the Lookahead story.",
    script=["Headline: XAAPL. ACTION PENDING.", "Dividend $0.27 / share · effective 2026-10-27 22:00 UTC", "Multiplier not yet applied · event effective in 38h"],
    caption="Know what’s coming before it lands. xAAPL: Action pending. Dividend $0.27 per share, effective 2026-10-27 22:00 UTC.",
    tags="#Oryn #xAAPL",
    prompt="Image-generation prompt: 4:5 poster on yellow (#f2c200), huge blue condensed “xAAPL”, a black pill “ACTION PENDING” in yellow text, three monospace lines, barcode, hard shadow.")

# ---------------------------------------------------------------- DAY 10
add(id="A3", day=10, kind="Article (short)", pillar="Education", title="When the redemption window is shut",
    fmt="~200 words", ref="-",
    objective="Explain Redemption closed with BUIDL.",
    script=["Hook: A NAV is only useful if you can redeem at it.", "Fund redemption window is shut; collateral cannot be redeemed at published NAV. BUIDL on Ethereum and Arbitrum: window opens in 6h.", "Contrast: USTB on Ethereum is Open. Redemptions open, NAV fresh, onchain state matches issuer. NAV strike in 13h.", "Close: For anyone using these as collateral, the question isn’t the NAV, it’s whether you can redeem at it."],
    caption="Published NAV is not the same as redeemable NAV. BUIDL: Redemption closed. USTB: Open.",
    tags="#Oryn #BUIDL #USTB #RWA",
    prompt="Writing prompt: Write a 200-word article “When the redemption window is shut” for collateral and risk teams. Facts allowed: BUIDL (BlackRock USD Institutional Digital Liquidity Fund) on Ethereum and Arbitrum is Redemption closed, window opens in 6h; USTB (Superstate Short Duration US Gov Securities Fund) on Ethereum is Open, NAV strike in 13h. Explain why NAV is not the same as redeemable NAV. No advice, no invented figures. End with the footer line.")

add(id="V7", day=10, kind="Video", pillar="Product", title="Four chains, one verdict",
    fmt="20 s, 16:9, 1920x1080 @ 60 fps", ref="Supabase Middleware (icon carousel, in-place swaps)",
    objective="Multi-chain coverage story.",
    script=["0-4 s  “Introducing per-chain verdicts”.", "4-13 s  Right-hand icon carousel cycles ETH, SOL, BASE, ARB; text swaps: “Check it on Ethereum / Solana / Base / Arbitrum.”", "13-17 s  Icons cluster, “All of them.”", "17-20 s  Badge + “One verdict per token, per chain.”"],
    caption="Ethereum, Solana, Base, Arbitrum. One verdict per token, per chain.",
    tags="#Oryn #Ethereum #Solana #Base #Arbitrum",
    prompt=REMO + "Task: 20 s dark-mode film at 1920x1080/60 fps in the Supabase style: near-black background, vertical icon carousel on the right, headline words swapped in place (Ethereum, Solana, Base, Arbitrum, all of them). Chain icons are simple Illustrative glyphs; do not use official chain logos unless supplied.")

# ---------------------------------------------------------------- DAY 11
add(id="P8", day=11, kind="Post (carousel, 5 slides)", pillar="Product", title="Three clocks",
    fmt=POSTFMT + " per slide", ref="Notion",
    objective="Teach that an asset has several clocks to watch.",
    script=["Slide 1: Three clocks. One verdict.", "Slide 2: Market clock: market opens in 6h.", "Slide 3: Event clock: event effective in 38h (xAAPL dividend).", "Slide 4: Fund clock: redemption window opens in 6h / NAV strike in 13h.", "Slide 5: Oryn merges them into one value."],
    caption="Every tokenised asset runs on more than one clock: the market, the corporate event, the fund window. Oryn reads them all and returns one verdict.",
    tags="#Oryn #RWA #Lookahead",
    prompt="Image-generation prompt (per slide): flat 4:5 slides, one solid colour per slide (cream, blue, yellow, red, cream), huge condensed clock-time number as the hero (6h, 38h, 6h/13h), a small caption in monospace, thick black outline cards with hard shadow, no clock illustrations.")

add(id="V8", day=11, kind="Video", pillar="Product", title="Oryn tour (one-take)",
    fmt="45 s, 16:9, 1920x1080 @ 60 fps, near-silent music bed", ref="Pages. (one-take tilted 3D plane)",
    objective="Flagship product tour: all seven sections.",
    script=["0-6 s  Dark plane: Board cards. 6-12 s Asset detail xTSLA. 12-18 s Lookahead calendar. 18-24 s Divergence list (4 divergent). 24-30 s Wallet. 30-36 s Guard BLOCKED. 36-42 s API panel (Illustrative). 42-45 s Spotlight on badge: “State of assets activated.”"],
    caption="Seven sections, one verdict: Board, Asset, Lookahead, Divergence, Wallet, Guard, API.",
    tags="#Oryn #ProductTour",
    prompt=REMO + "Task: 45 s one-take film at 1920x1080/60 fps. " + STYLE + " One continuous camera across a tilted dark 3D plane of Oryn UI cards (perspective 2400px, rotateX 10, rotateY -12), spotlight reveal on each section, depth blur on far cards, no hard cuts. Use the real recording at public/oryn/clips/site.mp4 inside one card for authenticity. API panel is Illustrative: show only a verdict value, not an invented schema.")

# ---------------------------------------------------------------- DAY 12
add(id="A4", day=12, kind="Article (short)", pillar="Thought leadership", title="A bond is not an asset",
    fmt="~220 words", ref="-",
    objective="Share Oryn’s view on trust: proofs vs existence.",
    script=["Hook: A bond proves skin in the game, not that an offchain asset exists.", "Body: Tokenised assets promise exposure to something offchain. Collateral posted by an issuer shows commitment; it does not show the underlying exists or that onchain state matches it.", "What Oryn does: compare onchain state to issuer state and say so: Open (matches), Divergent (does not), or Unknown (not actionable).", "Close: Unknown means not actionable."],
    caption="A bond proves skin in the game, not that an offchain asset exists. Here’s how we think about verifying tokenised assets.",
    tags="#Oryn #RWA #Trust",
    prompt="Writing prompt: Write a 220-word opinion piece “A bond is not an asset” from Oryn’s perspective. Use these two principles verbatim: “A bond proves skin in the game, not that an offchain asset exists.” and “Unknown means not actionable.” Tone: calm, precise, no hype. No claims about audits, customers, TVL or partnerships. End with the footer line.")

DAYS = {"V1":1,"P1":1,"P2":2,"A1":3,"V2":4,"P3":5,"V3":6,"P4":7,"A2":8,"V4":9,"P5":9,"V5":10,"P6":11,"V6":12,"P7":12,"A3":13,"V7":14,"P8":14,"V8":15,"A4":15}
for d in D: d["day"] = DAYS[d["id"]]
D.sort(key=lambda d: (d["day"], d["id"]))
assert len(D) == 20, len(D)
