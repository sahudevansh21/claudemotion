import { AbsoluteFill, useVideoConfig } from "remotion";
import { C, DISPLAY, MONO, SANS, type Status } from "./brand";
import { Badge, Block, Chip, Paper } from "./parts";

/** Day 3 / A1 hero image "Price is not a verdict": 1080x1350 (4:5), one frame. Render with --scale=2. */
const W = 1080;
const H = 1350;

const ROWS: { sym: string; chain: string; status: Status; line: string }[] = [
  { sym: "xTSLA", chain: "SOL", status: "divergent", line: "Stock split 3:1 not applied on Solana." },
  { sym: "BUIDL", chain: "ETH", status: "redemption", line: "Fund redemption window is shut; collateral cannot be redeemed at published NAV." },
  { sym: "dMSFT", chain: "ARB", status: "stale", line: "Arbitrum head is not advancing. Not a market closure." },
];

export const OrynDay3Hero: React.FC = () => {
  const { width } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.cream }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transform: `scale(${width / W})`, transformOrigin: "0 0", overflow: "hidden" }}>
        <Paper bloom={0.7} y={20} />
        <div style={{ position: "absolute", left: 70, top: 70 }}><Badge size={110} /></div>
        <div style={{ position: "absolute", left: 210, top: 104, fontFamily: MONO, fontWeight: 700, fontSize: 21, letterSpacing: 5, color: C.blue, textTransform: "uppercase" }}>State-of-the-asset layer</div>
        <div style={{ position: "absolute", left: 70, top: 240, fontFamily: DISPLAY, fontSize: 178, lineHeight: 0.98, color: C.ink, textTransform: "uppercase" }}>
          Price is not<br />a <span style={{ color: C.blue }}>verdict.</span>
        </div>
        {/* the "looks fine" price line */}
        <Block bg="#fff" border={4} radius={22} shadow={10} style={{ position: "absolute", left: 70, right: 70, top: 660, height: 120, padding: "0 34px", display: "flex", alignItems: "center", gap: 26 }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: 4, textTransform: "uppercase" }}>Price</div>
          <svg width={560} height={40} viewBox="0 0 560 40"><line x1={0} y1={20} x2={560} y2={20} stroke={C.ink} strokeWidth={5} strokeLinecap="round" /></svg>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30 }}>looks fine</div>
        </Block>
        {ROWS.map((r, i) => (
          <div key={r.sym} style={{ position: "absolute", left: 70, right: 70, top: 830 + i * 140, height: 120, background: C.ink, borderRadius: 22, display: "flex", alignItems: "center", gap: 24, padding: "0 30px", boxShadow: "0 12px 26px rgba(13,13,15,0.25)" }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 52, color: "#fff", width: 170 }}>{r.sym}</div>
            <div style={{ fontFamily: MONO, fontSize: 20, color: "rgba(255,255,255,0.6)", width: 64, letterSpacing: 3 }}>{r.chain}</div>
            <Chip status={r.status} size={17} />
            <div style={{ fontFamily: SANS, fontSize: 19, lineHeight: 1.25, color: "rgba(255,255,255,0.85)", flex: 1 }}>{r.line}</div>
          </div>
        ))}
        <div style={{ position: "absolute", left: 70, right: 70, bottom: 52, display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 16, letterSpacing: 3, textTransform: "uppercase", color: "rgba(13,13,15,0.6)" }}>
          <span>Oryn · Simulated issuer data · Not investment advice</span><span>Day 3</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
