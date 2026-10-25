"""QUANTORA LABS 7-day campaign: copy and prompts.

Facts used, and only these (supplied X profile + banner, 2026-10-25):
- "Quantitative research for onchain finance."
- "Tokenized stocks • ETFs • Market simulations"
- Tagline "The market, read clearly." · banner chart annotations RISK / CONTEXT / EVIDENCE
- quantora.buzz · @Quantora_Labs
quantora.buzz itself was not reachable, so nothing else is claimed. Charts and
numbers are illustrative; simulations are never presented as forecasts.
"""

START = (2026, 10, 27)

PILLARS = [
    ("RISK", "What can go wrong, and how much it would cost: drawdowns, gaps, liquidity."),
    ("CONTEXT", "Why a move is happening: market hours, flows, events, the asset behind the token."),
    ("EVIDENCE", "What the data actually supports, tested before it becomes a view."),
    ("SIMULATION", "Market simulations as a way to stress an idea, never as a forecast."),
]

DELIVERABLES = [
    dict(
        id="QV1", kind="VIDEO", day=1, title="Introducing Quantora Labs",
        platform="X (pinned) · LinkedIn", fmt="20 s · 1080p60 (1920×1080) + 9:16 1080×1920 @ 60 fps",
        ref="SUPABASE MIDDLEWARE (locked ref #5)",
        objective="Introduce the lab in one line: quantitative research for onchain finance.",
        shots=[
            ("0–1 s", "Warm paper canvas. 'Introducing' resolves letter by letter in Newsreader serif."),
            ("1–2.5 s", "'Introducing' shrinks up; the Quantora mark + spaced QUANTORA wordmark resolve below."),
            ("2.5–5 s", "Wordmark slides left; a fine annotated line chart (the banner chart) draws in on the right."),
            ("5–9 s", "'Quantitative research for [tokenized stocks → ETFs → market simulations]': only the last phrase swaps, with a mono label reel on the right."),
            ("9–12 s", "'…for onchain finance': three labels burst out around the chart: RISK, CONTEXT, EVIDENCE."),
            ("12–15 s", "The chart in a gentle 3D tilt; dotted guide lines drop to the axis with mono annotation pills (illustrative)."),
            ("15–18 s", "'The market, *read clearly*.' with the italic accent word."),
            ("18–20 s", "Mark + wordmark, quantora.buzz typed in mono, then paper fades to white."),
        ],
        audio="Original soft electronic at ≈80 BPM: felt piano, warm sub, ticks on each swap, resolving chord. −16 LUFS.",
        caption="The market, read clearly.\n\nQuantora Labs: quantitative research for onchain finance.\nTokenized stocks · ETFs · Market simulations\n\n→ quantora.buzz",
        prompt="In claudemotion, build 'QuantoraIntro' (20 s, 1920×1080, 60 fps) recreating the locked Supabase Middleware reference shot for shot (docs/reference/whatships/ANALYSIS.md §5) in Quantora's brand system from src/compositions/Quantora/Posts.tsx: paper #ECE8DF with fibre texture, ink #161514, Newsreader serif with one italic word, spaced Jost wordmark, spaced mono labels, fine annotated charts. Use only STYLE.md vocabulary: letter blur-in, title morph, phrase swap + label reel, burst-out, tilted chart with annotation pills, end type-on. Copy: [shot list]. Mark the chart ILLUSTRATIVE. Original ≈80 BPM score.",
        notes="Uses only bio and banner copy. Chart is illustrative, with no numbers.",
    ),
    dict(
        id="QV2", kind="VIDEO", day=4, title="Risk. Context. Evidence.",
        platform="X · LinkedIn", fmt="20 s · 1080p60 (1920×1080)",
        ref="KREA 3 (locked ref #1)",
        objective="Show the lab's reading method: the three annotations from the banner.",
        shots=[
            ("0–2 s", "'Read' assembled from mismatched editorial letters (serif, mono, outline, italic), with floating chart fragments. The letters snap into clean Newsreader."),
            ("2–5 s", "'Every move has a story.' reflows up; 'Read it clearly.' types below. A fine line chart draws across a dotted grid."),
            ("5–8 s", "A cursor drops a guide line on the first peak: the pill 'RISK' grows big, then shrinks to an annotation."),
            ("8–11 s", "A dashed line runs to the trough: 'CONTEXT'. A small mono note reads 'market closed · gap' (illustrative)."),
            ("11–14 s", "The chart climbs; 'EVIDENCE' pins to the high point, and a shaded region fills under the line."),
            ("14–17 s", "A clean card in the leaderboard style: Risk / Context / Evidence rows, each highlighted in turn with the cursor."),
            ("17–20 s", "'The market, read clearly.' then the mark + wordmark."),
        ],
        audio="Original light electronic at ≈118 BPM: sparse intro, groove from 2 s. −15 LUFS.",
        caption="Risk. Context. Evidence.\n\nThree questions we ask of every move before calling it a signal.\n\nThe market, read clearly. · quantora.buzz",
        prompt="In claudemotion, build 'QuantoraMethod' (20 s, 1920×1080, 60 fps) recreating the locked Krea 3 reference (ANALYSIS.md §1) in Quantora's editorial paper style: a ransom-note title that snaps clean, a reflowing headline over a drawing chart, a cursor dropping guide lines, pill → annotation morphs (RISK, CONTEXT, EVIDENCE), a region fill, a leaderboard-style card. Illustrative chart, no values.",
        notes="The annotations mirror the banner. No numbers.",
    ),
    dict(
        id="QV3", kind="VIDEO", day=6, title="Your thesis is… tested",
        platform="X · Instagram Reels · TikTok", fmt="20 s · 1080p60 (1920×1080) + 9:16 1080×1920 @ 60 fps",
        ref="CONQUEROR (locked ref #3)",
        objective="Make 'market simulations' tangible: stress an idea before trusting it.",
        shots=[
            ("0–3 s", "'Introducing Quantora for [tokenized stocks → ETFs → onchain markets]': small serif text in crop marks over a soft paper-grey ink blob."),
            ("3–4 s", "Pixel-dissolve transition into a paper halftone with a huge spaced QUANTORA wordmark."),
            ("4–7 s", "'Start with a question' + a frosted input: 'What if the market gaps 10% overnight?' types, then an extreme zoom into the caret and pull back."),
            ("7–13 s", "White canvas. 'Your thesis is… a hunch / a chart / simulated / evidence.' A vignette above each: a question mark, a line chart, a fan of simulated paths, an annotated chart."),
            ("13–17 s", "A monitor mockup showing a fan chart of simulated paths (illustrative) with percentile bands."),
            ("17–19 s", "'Simulations stress ideas. They don't predict prices.'"),
            ("19–20 s", "Black: mark + quantora.buzz typed with a caret."),
        ],
        audio="Original electronic at ≈124 BPM with a drop at 7 s. −16 LUFS.",
        caption="Your thesis is… a hunch, until it's tested.\n\nWe run market simulations to stress an idea before it becomes a view.\nSimulations stress ideas. They don't predict prices.\n\nquantora.buzz",
        prompt="In claudemotion, build 'QuantoraThesis' (20 s, 1920×1080 + 1080×1920, 60 fps) recreating the locked Conqueror reference (ANALYSIS.md §3) in Quantora style: NameCycler in crop marks, PixelDissolve into a paper halftone, ExtremeZoomInput, PhraseSwap 'Your thesis is…', a monitor mockup with an illustrative fan chart. Original 124 BPM score.",
        notes="Never imply forecasts or returns. Fan charts are labelled ILLUSTRATIVE SIMULATION.",
    ),
    dict(
        id="QP1", kind="POST", day=1, title="Launch poster",
        platform="X · LinkedIn · Instagram", fmt="16:9 3840×2160 + 4:5 2160×2700",
        ref="Static · banner system",
        objective="Hero image for day 1, paired with QV1.",
        copy="QUANTORA · The market, *read clearly*. · Quantitative research for onchain finance · Tokenized stocks · ETFs · Market simulations",
        caption="The market, read clearly.\n\nQuantitative research for onchain finance.\nTokenized stocks · ETFs · Market simulations\n\nquantora.buzz",
        prompt="Editorial research-brand poster on warm off-white textured paper (#ECE8DF). Left: a black four-pointed organic star mark with a thin white inner line, a widely spaced geometric wordmark 'QUANTORA' and a tiny spaced tagline 'THE MARKET, READ CLEARLY'. Right: a fine black hand-drawn-looking line chart with three dotted vertical guides labelled RISK, CONTEXT and EVIDENCE in tiny spaced mono caps. Large serif headline 'The market, read clearly.' with 'read clearly' in italic. Minimal, lots of negative space, print-like.",
        notes="Build in repo (src/compositions/Quantora/Posts.tsx system) for exact type.",
    ),
    dict(
        id="QP2", kind="POST", day=2, title="How we read a chart (carousel)",
        platform="X thread · LinkedIn/Instagram carousel", fmt="5 slides · 4:5 2160×2700",
        ref="Static · carousel",
        objective="Educate: the risk / context / evidence method on one chart.",
        copy="1 'A chart is a claim.' · 2 'RISK: what could this cost?' · 3 'CONTEXT: why is it moving?' · 4 'EVIDENCE: what does the data support?' · 5 'The market, read clearly.'",
        caption="A chart is a claim. Here's how we read one 🧵\n\nRisk → Context → Evidence.",
        prompt="Five-slide 4:5 carousel on warm textured paper. Each slide: a large serif headline with one italic word, a fine black line chart on a dotted grid with one dotted guide highlighted and labelled in tiny spaced mono caps, a slide counter '0X / 05' top right, thin footer rule with 'QUANTORA' wordmark. Monochrome black ink, editorial.",
        notes="All charts illustrative, with no tickers or values.",
    ),
    dict(
        id="QP3", kind="POST", day=5, title="Tokenized stocks vs ETFs: what to watch",
        platform="X · LinkedIn", fmt="4:5 2160×2700",
        ref="Static · comparison",
        objective="Educational comparison tied to the lab's coverage areas.",
        copy="TOKENIZED STOCKS · ETFs · Two instruments, one question: what moves the price you see onchain? · Watch: underlying market hours · liquidity · how the price reaches the chain",
        caption="Tokenized stocks and ETFs both bring traditional markets onchain.\n\nBefore reading either, check three things: underlying market hours, liquidity, and how the price reaches the chain.",
        prompt="4:5 editorial comparison card on warm paper: two columns 'Tokenized stocks' and 'ETFs' in serif, thin vertical rule between, three shared checklist rows in spaced mono caps beneath (MARKET HOURS · LIQUIDITY · PRICE SOURCE), small annotated chart glyphs, Quantora wordmark footer.",
        notes="Keep it generic and factual. No claims about specific products or issuers.",
    ),
    dict(
        id="QP4", kind="POST", day=7, title="What a market simulation is (and isn't)",
        platform="X · LinkedIn · Instagram", fmt="1:1 2160×2160",
        ref="Static · statement",
        objective="Set expectations: simulations are for stress-testing, not prediction.",
        copy="A SIMULATION IS: a stress test · a range of outcomes · a way to ask 'what if?' / A SIMULATION ISN'T: a forecast · a price target · advice",
        caption="Market simulations, explained in one image.\n\nThey stress an idea across many paths. They don't tell you where price goes.",
        prompt="Square editorial card on warm paper: a fan of thin black simulated price paths spreading from one point, with a shaded percentile band. Two short lists in serif: 'is' (stress test, range of outcomes, what-if) and 'isn't' (forecast, price target, advice). Tiny 'ILLUSTRATIVE SIMULATION' label in spaced mono.",
        notes="Must keep the 'isn't advice / forecast' framing.",
    ),
    dict(
        id="QA1", kind="ARTICLE", day=3, title="Reading the market clearly: risk, context, evidence",
        platform="X Article · Medium · LinkedIn", fmt="≈300 words · header 16:9",
        ref="Article",
        objective="Anchor post explaining the lab's reading method.",
        body=[
            "Every chart is a claim about the world. A line goes up and someone calls it momentum; it goes down and someone calls it a breakdown. Before treating any move as a signal, we ask three questions.",
            "Risk: what could this cost? Not just how far price could fall, but how fast, and whether you could act in time. Drawdowns, overnight gaps and thin liquidity all belong here.",
            "Context: why is it moving? Onchain markets now include tokenized stocks and ETFs, whose prices depend on an underlying market with its own hours, events and flows. A move during a closed session means something different from the same move at the open.",
            "Evidence: what does the data actually support? A pattern you can see once is a story. A pattern that survives testing across many periods and conditions starts to become evidence.",
            "We use market simulations to bridge the last two: run an idea across many plausible paths and see where it breaks. Simulations don't predict prices; they show how fragile a view is.",
            "That's the whole method. Risk, context, evidence. The market, read clearly.",
        ],
        caption="New: how we read a chart before calling it a signal.\n\nRisk → Context → Evidence ↓",
        prompt="Write a ~300-word article 'Reading the market clearly: risk, context, evidence' in a calm, precise research voice. Explain each lens with onchain-finance examples (tokenized stocks, ETFs), and the role of market simulations as stress tests, not forecasts. End with 'The market, read clearly.' No performance claims.",
        notes="Add 'Not investment advice.'",
    ),
    dict(
        id="QA2", kind="ARTICLE", day=5, title="Tokenized stocks and ETFs onchain: what to measure",
        platform="Blog · X Article", fmt="≈300 words · header 16:9",
        ref="Article",
        objective="Coverage-area explainer (SEO: tokenized stocks, ETFs).",
        body=[
            "Tokenized stocks and ETFs bring familiar instruments onto public blockchains. They look like any other token in a wallet, but the price you see onchain is tied to something that lives elsewhere.",
            "That makes measurement different. Three things matter before any analysis.",
            "Underlying market hours. The token may trade around the clock while the reference market sleeps. Moves during closed hours can rest on thin information and be repriced at the next open.",
            "Liquidity. Onchain depth for a tokenized instrument can differ a lot from the depth of the underlying. Spreads and slippage change what a price actually means for someone trying to act on it.",
            "How the price reaches the chain. Whether through issuers, market makers or oracles, every route adds timing and structure that a careful reader should know.",
            "Our research focuses on these instruments and uses market simulations to stress assumptions about each of them. The goal isn't a price call; it's a clearer picture of what the numbers can and can't tell you.",
        ],
        caption="Tokenized stocks and ETFs onchain look like any token. They don't behave like one.\n\nThree things to measure first ↓",
        prompt="Write a ~300-word explainer 'Tokenized stocks and ETFs onchain: what to measure' covering market hours, liquidity and price routes (issuers, market makers, oracles) in general terms. No specific products, issuers or numbers. Calm research voice; close on simulations as stress tests.",
        notes="Keep it product-agnostic. Add 'Not investment advice.'",
    ),
    dict(
        id="QA3", kind="ARTICLE", day=7, title="Why we simulate markets before forming a view",
        platform="Blog · LinkedIn · X Article", fmt="≈280 words · founder/research voice",
        ref="Article",
        objective="Close the week on the lab's core practice.",
        body=[
            "A single price history is one path out of many that could have happened. Treat it as the only one, and every pattern looks more reliable than it is.",
            "Market simulation starts from that humility. Instead of asking 'what happened?', it asks 'what could have happened, and how would this idea have done across all of it?'",
            "For tokenized stocks and ETFs onchain, that means building paths that respect how these instruments actually behave: sessions that open and close, gaps between them, liquidity that thins, prices that arrive on-chain with a delay.",
            "Run an idea through thousands of those paths and you learn its shape: where it holds up, where it breaks, how wide the range of outcomes is. That range is the honest answer, not a single number.",
            "What simulations are not: forecasts, price targets or advice. They stress ideas; they don't predict markets.",
            "That's why we simulate first. The market, read clearly.",
        ],
        caption="One price history is one path out of many.\n\nWhy we simulate markets before forming a view ↓",
        prompt="Write a ~280-word piece 'Why we simulate markets before forming a view': one path vs many, building realistic paths for tokenized stocks/ETFs (sessions, gaps, liquidity, price delays), learning an idea's shape, and an explicit 'what simulations are not' paragraph. Calm, honest research voice.",
        notes="Add 'Not investment advice.'",
    ),
]

CALENDAR = [
    (1, ["QV1", "QP1"], "Launch"),
    (2, ["QP2"], "Method"),
    (3, ["QA1"], "Method"),
    (4, ["QV2"], "Method"),
    (5, ["QP3", "QA2"], "Coverage"),
    (6, ["QV3"], "Simulation"),
    (7, ["QP4", "QA3"], "Simulation"),
]
