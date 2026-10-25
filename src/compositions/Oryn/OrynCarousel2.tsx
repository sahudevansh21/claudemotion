import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C, DISPLAY, MONO, SANS, type Status } from "./brand";
import { Badge, Barcode, Chip, Paper } from "./parts";

/** Day 2 / P2 "The six verdicts": 7-slide carousel, 1080x1350 (4:5), frame N = slide N. Render with --scale=2. */
const W = 1080;
const H = 1350;

type Slide = { bg: string; fg: string; sub: string; accent: string; word: string[]; status: Status; reason: string; example: string; size: number };

const SLIDES: Slide[] = [
  { bg: "#1d3a24", fg: "#e9f5e2", sub: "rgba(233,245,226,0.65)", accent: "#7ad58a", word: ["OPEN"], status: "open", reason: "Redemptions open, NAV fresh, onchain state matches issuer.", example: "USTB · ETH · NAV strike in 13h", size: 440 },
  { bg: C.cream, fg: C.ink, sub: "rgba(13,13,15,0.6)", accent: C.blue, word: ["MARKET", "CLOSED"], status: "closed", reason: "Underlying exchange is closed; oracle price is frozen at the last close, as expected.", example: "xTSLA · ETH · market opens in 6h", size: 250 },
  { bg: C.yellow, fg: C.ink, sub: "rgba(13,13,15,0.65)", accent: C.blue, word: ["ACTION", "PENDING"], status: "pending", reason: "Dividend $0.27 / share · multiplier not yet applied on Ethereum.", example: "xAAPL · ETH · event effective in 38h", size: 250 },
  { bg: C.red, fg: "#ffffff", sub: "rgba(255,255,255,0.75)", accent: C.ink, word: ["REDEMPTION", "CLOSED"], status: "redemption", reason: "Fund redemption window is shut; collateral cannot be redeemed at published NAV.", example: "BUIDL · ETH · window opens in 6h", size: 190 },
  { bg: C.lav, fg: C.ink, sub: "rgba(13,13,15,0.65)", accent: C.blue, word: ["STALE"], status: "stale", reason: "Arbitrum head is not advancing. Not a market closure; do not treat as a weekend freeze.", example: "dMSFT · ARB", size: 400 },
  { bg: C.ink, fg: "#ffffff", sub: "rgba(255,255,255,0.6)", accent: C.red, word: ["DIVERGENT"], status: "divergent", reason: "Stock split 3:1 not applied on Solana.", example: "xTSLA · SOL · next change unknown", size: 205 },
];

const Foot: React.FC<{ n: number; dark?: boolean }> = ({ n, dark }) => (
  <div style={{ position: "absolute", left: 70, right: 70, bottom: 56, display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 17, letterSpacing: 3, textTransform: "uppercase", color: dark ? "rgba(255,255,255,0.6)" : "rgba(13,13,15,0.6)" }}>
    <span>Oryn · Simulated issuer data · Not investment advice</span>
    <span>0{n}/07</span>
  </div>
);

const Cover: React.FC = () => (
  <>
    <Paper x={50} y={35} />
    <div style={{ position: "absolute", left: 70, top: 70 }}><Badge size={130} /></div>
    <div style={{ position: "absolute", left: 230, top: 112, fontFamily: MONO, fontSize: 22, letterSpacing: 5, color: C.blue, fontWeight: 700, textTransform: "uppercase" }}>State-of-the-asset layer</div>
    <div style={{ position: "absolute", left: 70, top: 280, fontFamily: DISPLAY, fontSize: 215, lineHeight: 0.92, color: C.blue, textTransform: "uppercase" }}>
      Six<br />verdicts.<br /><span style={{ WebkitTextStroke: `6px ${C.blue}`, color: "transparent" }}>One value.</span>
    </div>
    <div style={{ position: "absolute", left: 70, bottom: 150, display: "flex", flexWrap: "wrap", gap: 12, maxWidth: 940 }}>
      {(["open", "closed", "pending", "redemption", "stale", "divergent"] as Status[]).map((s) => (<Chip key={s} status={s} size={20} />))}
    </div>
    <div style={{ position: "absolute", right: 70, bottom: 150, fontFamily: MONO, fontSize: 20, letterSpacing: 4, fontWeight: 700, textTransform: "uppercase" }}>Swipe</div>
    <Foot n={1} />
  </>
);

const Card: React.FC<{ s: Slide; n: number }> = ({ s, n }) => {
  const dark = s.bg === C.ink || s.bg === "#1d3a24" || s.bg === C.red;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: s.bg }} />
      <div style={{ position: "absolute", left: 70, top: 70 }}><Chip status={s.status} size={28} style={s.status === "redemption" ? { background: C.ink } : undefined} /></div>
      <div style={{ position: "absolute", right: 70, top: 78, fontFamily: MONO, fontSize: 22, letterSpacing: 4, color: s.sub, fontWeight: 700 }}>VERDICT {n - 1}/6</div>
      <div style={{ position: "absolute", left: 60, top: 200, fontFamily: DISPLAY, fontSize: s.size, lineHeight: 0.95, color: s.accent === C.ink ? "#fff" : s.status === "divergent" ? C.red : s.status === "open" ? "#d8f0d0" : s.accent, textTransform: "uppercase" }}>
        {s.word.map((w) => (<div key={w}>{w}</div>))}
      </div>
      <div style={{ position: "absolute", left: 70, right: 90, bottom: 330, fontFamily: SANS, fontWeight: 500, fontSize: 56, lineHeight: 1.18, letterSpacing: -1, color: s.fg }}>{s.reason}</div>
      <div style={{ position: "absolute", left: 70, bottom: 230, fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 3, color: s.fg, textTransform: "uppercase" }}>{s.example}</div>
      <div style={{ position: "absolute", left: 70, bottom: 150 }}><Barcode w={420} h={44} color={dark ? "rgba(255,255,255,0.85)" : C.ink} seed={`d2${n}`} /></div>
      <Foot n={n} dark={dark} />
    </>
  );
};

/** Frame 0 = cover, frames 1-6 = the six verdict cards. */
export const OrynCarousel2: React.FC = () => {
  const f = useCurrentFrame();
  const { width } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.cream }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transform: `scale(${width / W})`, transformOrigin: "0 0", overflow: "hidden" }}>
        {f === 0 ? <Cover /> : <Card s={SLIDES[Math.min(f, 6) - 1]} n={Math.min(f, 6) + 1} />}
      </div>
    </AbsoluteFill>
  );
};
