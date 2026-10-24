import { loadFont } from "@remotion/fonts";
import { Easing, interpolate, staticFile } from "remotion";

loadFont({ family: "Anton", url: staticFile("oryn/fonts/anton-latin-400-normal.woff2"), weight: "400" });
loadFont({ family: "Space Grotesk", url: staticFile("oryn/fonts/space-grotesk-latin-500-normal.woff2"), weight: "500" });
loadFont({ family: "Space Grotesk", url: staticFile("oryn/fonts/space-grotesk-latin-700-normal.woff2"), weight: "700" });
loadFont({ family: "Space Mono", url: staticFile("oryn/fonts/space-mono-latin-400-normal.woff2"), weight: "400" });
loadFont({ family: "Space Mono", url: staticFile("oryn/fonts/space-mono-latin-700-normal.woff2"), weight: "700" });

/** Palette sampled from the Oryn logo, banner and the site screen recording. */
export const C = {
  cream: "#e4dfca",
  paper: "#efeadb",
  ink: "#0d0d0f",
  blue: "#2630c8",
  navy: "#1f4fb0",
  yellow: "#f2c200",
  red: "#e5321f",
  orange: "#f26122",
  lav: "#b9b3ee",
  cyan: "#7fd0dc",
  green: "#3f8f4a",
};

export const DISPLAY = "Anton, Impact, sans-serif";
export const SANS = "'Space Grotesk', system-ui, sans-serif";
export const MONO = "'Space Mono', ui-monospace, monospace";

export const OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const IO = Easing.bezier(0.65, 0, 0.35, 1);
export const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Eased 0→1 starting at frame `a`, lasting `d` frames. */
export const ez = (f: number, a: number, d: number, e = OUT) =>
  interpolate(f, [a, a + d], [0, 1], { ...CL, easing: e });

/** Overshooting pop-in (0 → 1.0 with a small overshoot). */
export const pop = (f: number, a: number, d = 24) =>
  interpolate(f, [a, a + d * 0.6, a + d], [0, 1.12, 1], { ...CL, easing: Easing.out(Easing.cubic) });

export type Status = "open" | "closed" | "pending" | "redemption" | "stale" | "divergent";

/** Real verdict data from the Oryn board (simulated issuer data per the site footer). */
export const VERDICTS: Record<Status, { label: string; glyph: string; bg: string; fg: string; chip: string; chipFg: string }> = {
  open: { label: "Open", glyph: "●", bg: "#1d3a24", fg: "#e9f5e2", chip: "#7ad58a", chipFg: "#0d0d0f" },
  closed: { label: "Market closed", glyph: "◐", bg: C.paper, fg: C.ink, chip: C.blue, chipFg: "#fff" },
  pending: { label: "Action pending", glyph: "▲", bg: C.yellow, fg: C.ink, chip: C.ink, chipFg: C.yellow },
  redemption: { label: "Redemption closed", glyph: "■", bg: C.red, fg: "#fff", chip: C.ink, chipFg: "#fff" },
  stale: { label: "Stale", glyph: "◌", bg: C.lav, fg: C.ink, chip: C.ink, chipFg: C.lav },
  divergent: { label: "Divergent", glyph: "✖", bg: C.ink, fg: C.red, chip: C.red, chipFg: "#fff" },
};

export type Deployment = { sym: string; name: string; chain: string; status: Status; reason: string; next: string };

export const DEPLOYMENTS: Deployment[] = [
  { sym: "xTSLA", name: "Tesla xStock", chain: "ETH", status: "closed", reason: "Underlying exchange is closed; oracle price is frozen at the last close, as expected", next: "market opens in 6h" },
  { sym: "xTSLA", name: "Tesla xStock", chain: "SOL", status: "divergent", reason: "Stock split 3:1 not applied on Solana", next: "next change unknown" },
  { sym: "xAAPL", name: "Apple xStock", chain: "ETH", status: "pending", reason: "Dividend $0.27 / share · effective 2026-10-27 22:00 UTC · multiplier not yet applied on Ethereum", next: "event effective in 38h" },
  { sym: "oQQQ", name: "Invesco QQQ Ondo Global Market", chain: "BASE", status: "divergent", reason: "DEX price drifting above reference on Base", next: "next change unknown" },
  { sym: "dMSFT", name: "Microsoft dShare", chain: "ARB", status: "stale", reason: "Arbitrum head is not advancing. Not a market closure; do not treat as a weekend freeze", next: "next change unknown" },
  { sym: "oNFLX", name: "Netflix Ondo Global Market", chain: "ETH", status: "divergent", reason: "Stock split 10:1 not applied on Ethereum", next: "next change unknown" },
  { sym: "BUIDL", name: "BlackRock USD Institutional Digital Liquidity Fund", chain: "ETH", status: "redemption", reason: "Fund redemption window is shut; collateral cannot be redeemed at published NAV", next: "redemption window opens in 6h" },
  { sym: "USTB", name: "Superstate Short Duration US Gov Securities Fund", chain: "ETH", status: "open", reason: "Redemptions open, NAV fresh, onchain state matches issuer", next: "NAV strike in 13h" },
];
