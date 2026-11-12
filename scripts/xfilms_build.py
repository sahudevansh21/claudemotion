#!/usr/bin/env python3
"""Builds src/compositions/XFilms/data/<id>.json (storyboard + sfx timeline) for every film, then run generate_audio.py on each.
All copy is taken from each account's own profile/banner/site copy already used in the posts; mock UI is labelled illustrative."""
import json, math
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src/compositions/XFilms/data"; OUT.mkdir(parents=True, exist_ok=True)

def dur(b):
    k = b["k"]
    if k == "swap": return 80 + 72 * len(b["swap"]) + (70 if b.get("sub") else 0)
    if k == "type": return 78 + math.ceil(len(b["text"]) * 60 / 22) + (150 if b.get("reply") else 60)
    if k == "cards": return 330
    if k == "rows": return 340
    if k == "cluster": return 280
    if k == "chart": return 300
    return 290

def sfx(b):
    k = b["k"]; L = []
    if k == "swap":
        L.append((10, "pop", .5)); L += [(40 + 72 * i, "tick", .4) for i in range(len(b["swap"]))]
    elif k == "type":
        L += [(56, "tick", .5), (78, "tick", .3), (110, "tick", .3), (150, "tick", .3), (78 + math.ceil(len(b["text"]) * 60 / 22) + 14, "chime", .5)]
    elif k == "cards":
        L += [(24, "whoosh", .4)] + [(24 + 14 * i, "pop", .3) for i in range(len(b["cards"]))] + [(190, "tick", .6), (200, "chime", .45)]
    elif k == "rows":
        L += [(24, "whoosh", .4)] + [(24 + 12 * i, "tick", .3) for i in range(len(b["rows"]))] + [(200, "tick", .6), (206, "chime", .5)]
    elif k == "cluster":
        L += [(16 + 10 * i, "pop", .3) for i in range(min(len(b["chips"]), 8))] + [(120, "whoosh", .3)]
    elif k == "chart":
        L += [(30, "riser", .3), (170, "pop", .4), (200, "tick", .4)]
    else:
        L += [(14, "pop", .7), (110, "chime", .7)]
    return L

def build(fid, bpm, transpose, calm, gain, beats):
    t = 0; scenes = []; out = []
    for i, b in enumerate(beats):
        b = dict(b); b["id"] = f"b{i+1}"; d = dur(b); b["start"] = t; b["end"] = t + d; t += d
        out.append(b); scenes.append({"id": b["id"], "start": b["start"], "end": b["end"], "cues": {}, "sfx": [{"cue": c, "type": ty, "gain": g} for c, ty, g in sfx(b)]})
    film = {"fps": 60, "durationInFrames": t, "bpm": bpm, "transpose": transpose, "calm": calm, "musicGain": gain, "scenes": scenes, "beats": out}
    (OUT / f"{fid}.json").write_text(json.dumps(film, indent=1, ensure_ascii=False))
    print(fid, t, f"{t/60:.1f}s")

S = lambda **k: {"k": "swap", **k}
T = lambda **k: {"k": "type", **k}
C = lambda **k: {"k": "cards", **k}
R = lambda **k: {"k": "rows", **k}
K = lambda **k: {"k": "cluster", **k}
G = lambda **k: {"k": "chart", **k}
E = lambda **k: {"k": "end", **k}

build("oryn", 96, 0, False, .7, [
 S(bg="cream", label="ORYN", h="Is it safe to act on", swap=["xTSLA?", "oNVDA?", "BUIDL?", "USTB?"], sub="One verdict per token, per chain."),
 T(bg="yellow", label="Ask the board", text="Is it safe to act on this token right now?", reply="A verdict. A reason. The evidence."),
 R(bg="navy", label="Board sample · simulated issuer data", h="One verdict per deployment.", rows=[
   {"a": "xTSLA · ETH", "b": "Market closed", "c": "market opens in 6h"}, {"a": "xTSLA · SOL", "b": "Divergent", "c": "next change unknown"},
   {"a": "xAAPL · ETH", "b": "Action pending", "c": "event effective in 38h"}, {"a": "dMSFT · ARB", "b": "Stale", "c": "next change unknown"}, {"a": "USTB · ETH", "b": "Open", "c": "NAV strike in 13h"}],
   pick=1, sub="Stock split 3:1 not applied on Solana."),
 K(bg="red", label="ORYN", h="One live status for every asset.", chips=["Corporate actions", "Market sessions", "Redemption windows", "Data freshness", "ETH", "SOL", "BASE", "ARB"]),
 E(bg="cream", name="ORYN", line="State of assets activated.", url="oryn.solrun.fun · @oryn_io", foot="ORYN · MVP · Simulated issuer data · Not investment advice")])
build("allocra", 78, 2, True, 1.0, [
 S(bg="red", label="Allocra · Private allocation desk / 01", h="Before you confirm, see", swap=["concentration.", "overlap.", "quotes.", "trading costs."], sub="Plan first. Assets remain individually held until you approve a trade."),
 T(bg="dark", label="Allocation slate / draft · Preview", text="Plan a tokenized ETF basket around the positions you actually want to own.", reply="Your assets. Your allocation."),
 R(bg="cream", label="Preview / TestNet demo", h="Core allocation · 3 ETFs", rows=[{"a": "US equity", "b": "55%", "c": "sample"}, {"a": "International equity", "b": "25%", "c": "sample"}, {"a": "US bonds", "b": "20%", "c": "sample"}], pick=0, sub="Monthly purchase $1,200 · Est. cost / yr $0.50 (Preview values)."),
 C(bg="red", label="Collection / 02", h="Old masters. New allocation.", cards=[{"t": "Look beneath the percentages", "d": "Overlap, concentration, cost"}, {"t": "Read before you act", "d": "Quotes and costs, checked first"}, {"t": "Hold steady", "d": "Volatility is part of the story"}], pick=1),
 E(bg="dark", name="Allocra", line="Plan clearly. Act deliberately.", url="allocra.buzz · @allocraa", foot="Allocra · Preview / TestNet demo · Not investment advice")])
build("collatera", 120, 0, True, 1.0, [
 S(bg="night", label="Collateral risk monitoring / 001", h="Watch the", swap=["buffer.", "price freshness.", "closed-market risk."], sub="Catch stale oracles before they catch you."),
 T(bg="green", label="Stress test · illustrative", text="What if the price drops 20%?", reply="A user-chosen scenario, not a forecast."),
 C(bg="night", label="Workflow", h="How it works.", cards=[{"t": "01 Monitor", "d": "Watch the position"}, {"t": "02 Stress test", "d": "Drag the price"}, {"t": "03 Get alerts", "d": "Know early"}, {"t": "04 Preview repayment", "d": "Before you decide"}], pick=1),
 K(bg="lime", label="Read-only", h="See it. Understand it. Decide.", chips=["Buffer", "Price freshness", "Closed-market liquidity risk", "Read-only", "No transaction is sent", "Starting on Algorand · Demo v1"]),
 E(bg="night", name="Collatera", line="Monitoring first. Automation later.", url="collatera.buzz · @collatera_io", foot="Collatera · Illustrative demo data · Not financial advice")])
build("quantora", 72, 5, True, 1.0, [
 S(bg="paper", label="Quantora Labs", h="Read the", swap=["drawdown.", "path.", "assumptions."], sub="Quantitative research for onchain finance."),
 T(bg="paper2", label="The question", text="How bad can it get?", reply="Drawdown, path and the assumptions behind both."),
 G(bg="paper", label="Fig. 01 · synthetic demo data", h="From the peak to the trough.", chart="dd", note="Illustrative path · synthetic demo data · no real values"),
 C(bg="ink", label="Three lenses", h="What we study.", cards=[{"t": "Tokenized stocks", "d": "Onchain tokens designed to track a listed share"}, {"t": "ETFs", "d": "A basket, read clearly"}, {"t": "Market simulations", "d": "Many paths, one picture"}], pick=2),
 E(bg="paper", name="QUANTORA", line="The market, read clearly.", url="quantora.buzz · @Quantora_Labs", foot="Quantora research preview · Synthetic demo data")])
build("aegis", 100, 7, False, .6, [
 S(bg="black", label="Agentic DeFi infrastructure", h="Every trade,", swap=["small ones run.", "big ones wait.", "rogue ones stop."], sub="Let AI agents trade onchain, with a human on the big calls."),
 T(bg="black2", label="Agent identity · ENS", text="agent1.aegisnet.eth", reply="Every agent gets a name."),
 R(bg="black", label="Autonomy for agents. Control for owners.", h="Three outcomes.", rows=[{"a": "Small trade", "b": "Runs", "c": "automatic"}, {"a": "Big trade · ≥ $1,000", "b": "Waits", "c": "World ID proof of human"}, {"a": "Rogue trade", "b": "Stops", "c": "blocked"}], pick=1, sub="Midnight ZK gate · cleared by a human."),
 K(bg="black2", label="Building on Sepolia testnet", h="The stack.", chips=["ENS identity", "1inch SwapVM", "Uniswap v4", "World ID", "Midnight ZK gate", "Sepolia testnet"]),
 E(bg="black", name="AegisNet", line="Let AI agents trade onchain, with a human on the big calls.", url="aegisnet.solrun.fun · @AegisNets", foot="AegisNet · Building on Sepolia testnet · Not financial advice")])
build("safefi", 88, 3, True, 1.0, [
 S(bg="white", label="SafeFi", h="Decentralized insurance for", swap=["your digital assets.", "the Web3 era."], sub="Built for the Web3 era."),
 T(bg="gray", label="The question", text="What if this breaks?", reply="Hoping nothing breaks isn't a security strategy."),
 C(bg="white", label="Three lines, one idea", h="What SafeFi is about.", cards=[{"t": "On-chain security"}, {"t": "Web3 insurance"}, {"t": "A safer decentralized future"}], pick=1),
 K(bg="ink", label="What we talk about", h="Risk, plainly.", chips=["Smart contract risk", "DeFi", "Crypto insurance", "On-chain security", "Web3 insurance"]),
 E(bg="white", line="Decentralized protection for your digital assets.", url="safefisolana.vercel.app · @safefi_io", foot="SafeFi · Illustrative graphics · Not financial advice")])
build("argus", 104, 2, False, .6, [
 S(bg="black", label="Argus", h="Detecting contamination", swap=["invisible to the eye.", "in 15 ms.", "at 99.4% precision."], sub="15 ms inference and 99.4% precision, as stated on the Argus profile."),
 T(bg="black2", label="Look closer", text="It looks clean. Is it?", reply="UV fluorescence · optical CV · biomedical AI"),
 C(bg="black", label="Three layers, one pipeline", h="How Argus sees.", cards=[{"t": "UV fluorescence", "d": "Reveals what white light misses"}, {"t": "Optical CV", "d": "Reads what the light shows"}, {"t": "Biomedical AI", "d": "Built on Virtu"}], pick=0),
 K(bg="black2", label="As stated on the profile", h="Fast. Precise. Visible.", chips=["15 ms inference", "99.4% precision", "Built on Virtu", "UV fluorescence", "Optical CV", "Biomedical AI"]),
 E(bg="black", line="Making the Invisible Visible.", url="argus-iota.vercel.app · @argus_io", foot="Argus · Figures as stated on the Argus profile · Illustrative visuals")])
build("terranode", 100, 0, True, 1.0, [
 S(bg="cream", label="TerraNode · provisional theme", h="Offline edge-AI for", swap=["smarter farms.", "disease detection.", "smart irrigation."], sub="AI-powered farming, without the internet."),
 T(bg="gold", label="Illustrative prompt", text="Zone 2 soil moisture is low. Irrigate for 15 min?", reply="Farmer-approved actions."),
 R(bg="cream", label="Example dashboard · illustrative values", h="Field readings.", rows=[{"a": "Soil Moisture", "b": "68%"}, {"a": "Temperature", "b": "24°C"}, {"a": "Humidity", "b": "56%"}, {"a": "Light", "b": "820 lux"}, {"a": "Air Quality", "b": "Good"}], pick=0, sub="Illustrative values, not live data."),
 K(bg="violet", label="One field unit", h="Works where the signal ends.", chips=["Edge AI", "LoRa", "Solar", "Crop disease & pest detection", "Smart irrigation", "Farmer-approved actions"]),
 E(bg="cream", line="Offline Edge-AI for Smarter Farms.", url="@terranode_ai", foot="TerraNode · Illustrative UI · Not agronomic advice")])
build("desci", 76, 4, True, 1.0, [
 S(bg="black", label="desciBnb", h="Decentralizing", swap=["research.", "funding.", "collaboration.", "scientific discovery."], sub="Research × AI × Blockchain. Built on BNB Chain."),
 T(bg="black2", label="The thread", text="We can trade billions of dollars in assets with a few clicks.", reply="But funding scientific research is still painfully complicated."),
 K(bg="black", label="Maybe that's where DeSci comes in", h="Four ingredients.", chips=["Research", "Funding", "Collaboration", "AI", "Blockchain", "BNB Chain"]),
 C(bg="black2", label="DeSci", h="What each one does.", cards=[{"t": "Research", "d": "Asking and testing"}, {"t": "Funding", "d": "Paying for the work"}, {"t": "Collaboration", "d": "Working across labs"}], pick=1),
 E(bg="black", name="desciBnb", line="The future of science is decentralized.", url="desciai.vercel.app · @desci_bnb", foot="desciBnb · Illustrative graphics · Not financial advice")])
build("polymate", 112, 2, False, .65, [
 S(bg="cream", label="PolyMate", h="Trade the", swap=["future.", "future, fast."], sub="The trading layer for prediction markets."),
 T(bg="lapis", label="Start trading", text="t.me/Tryoddsbot", reply="Building tools to trade the future, fast."),
 R(bg="cream", label="Live Markets · illustrative, from the banner", h="Pick a market.", rows=[{"a": "US Election 2024 · Trump to win?", "b": "62% Yes"}, {"a": "Fed Rate Cut in Nov?", "b": "Yes / No"}], pick=0, sub="Illustrative example, not live data."),
 C(bg="red", label="Inside PolyMate", h="Five tools, one layer.", cards=[{"t": "Trade"}, {"t": "Markets"}, {"t": "Positions"}, {"t": "Strategy"}, {"t": "Balance"}], pick=2),
 E(bg="cream", name="PolyMate", line="The trading layer for prediction markets.", url="t.me/Tryoddsbot · @Polymatedotfun", foot="PolyMate · Illustrative UI · Not financial advice")])
build("vybe", 118, 0, False, .7, [
 S(bg="cyan", label="Example", h="A theme is a recipe:", swap=["40% NVDA", "30% AMD", "30% TSM"], sub="VYBE opens every leg on Hyperliquid at once."),
 T(bg="yellow", label="VYBE", text="Turn a market opinion into a trade anyone can copy, and earn every time they do.", reply="You keep custody."),
 C(bg="pink", label="Three steps", h="How it works.", cards=[{"t": "Pick markets", "d": "Stock, gold or crypto"}, {"t": "One click", "d": "Every leg opens on Hyperliquid at once"}, {"t": "Earn on every trade", "d": "Creators earn a share of the fees"}], pick=1),
 K(bg="lime", label="Launch a theme in 30 seconds", h="Stock, gold or crypto.", chips=["Stock themes", "Gold themes", "Crypto themes", "You keep custody", "TESTNET", "Built on Hyperliquid"]),
 E(bg="cyan", line="Turn a market opinion into a trade anyone can copy.", url="@vybe_fi", foot="VYBE routes orders to Hyperliquid. VYBE never holds funds or keys. Perps are risky. TESTNET")])
