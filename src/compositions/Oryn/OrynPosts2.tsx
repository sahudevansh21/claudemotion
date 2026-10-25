import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C, DISPLAY, MONO, SANS, type Status } from "./brand";
import { Badge, Barcode, Chip, Paper } from "./parts";

/** Days 7-14 posts: P4 Market closed, P5 BLOCKED, P6 Stale, P7 Action pending, P8 Three clocks (5 slides). 1080x1350; frame index below. */
const W = 1080;
const H = 1350;

const Foot: React.FC<{ n?: string; dark?: boolean }> = ({ n, dark }) => (
  <div style={{ position: "absolute", left: 70, right: 70, bottom: 56, display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 17, letterSpacing: 3, textTransform: "uppercase", color: dark ? "rgba(255,255,255,0.65)" : "rgba(13,13,15,0.6)" }}>
    <span>Oryn · Simulated issuer data · Not investment advice</span>
    <span>{n}</span>
  </div>
);
const Bg: React.FC<{ color: string }> = ({ color }) => <div style={{ position: "absolute", inset: 0, background: color }} />;
const Top: React.FC<{ status?: Status; label?: string; dark?: boolean }> = ({ status, label, dark }) => (
  <div style={{ position: "absolute", left: 70, top: 70, right: 70, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    {status ? <Chip status={status} size={28} style={status === "redemption" ? { background: C.ink } : undefined} /> : <div />}
    <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: 4, color: dark ? "rgba(255,255,255,0.75)" : "rgba(13,13,15,0.6)", textTransform: "uppercase" }}>{label}</div>
  </div>
);

const P4: React.FC = () => (
  <>
    <Bg color={C.blue} />
    <Top status="closed" label="Education" dark />
    <div style={{ position: "absolute", left: 70, top: 190, fontFamily: DISPLAY, fontSize: 185, lineHeight: 0.98, color: C.cream, textTransform: "uppercase", whiteSpace: "nowrap" }}>Market<br />closed.<br /><span style={{ color: C.yellow }}>Not broken.</span></div>
    <div style={{ position: "absolute", left: 70, right: 70, top: 820, background: "#fff", borderRadius: 34, padding: "40px 52px", boxShadow: "14px 14px 0 rgba(13,13,15,0.9)", border: `5px solid ${C.ink}`, boxSizing: "border-box" }}>
      <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 46, lineHeight: 1.2, color: C.ink, letterSpacing: -0.5 }}>Underlying exchange is closed; oracle price is frozen at the last close, as expected.</div>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 3, marginTop: 28, textTransform: "uppercase", color: C.blue }}>xTSLA · ETH · market opens in 6h</div>
    </div>
    <Foot dark />
  </>
);
const P5: React.FC = () => (
  <>
    <Bg color={C.red} />
    <Top status="divergent" label="Product · The Guard" dark />
    <div style={{ position: "absolute", left: 50, top: 260, fontFamily: DISPLAY, fontSize: 262, lineHeight: 0.95, color: C.cream }}>BLOCKED.</div>
    <div style={{ position: "absolute", left: 70, top: 700, background: C.ink, color: "#fff", borderRadius: 99, padding: "14px 34px", fontFamily: MONO, fontWeight: 700, fontSize: 30, letterSpacing: 4, textTransform: "uppercase" }}>xTSLA · SOL · Divergent</div>
    <div style={{ position: "absolute", left: 70, right: 90, top: 830, fontFamily: SANS, fontWeight: 700, fontSize: 70, lineHeight: 1.12, color: "#fff", letterSpacing: -1.5 }}>Stock split 3:1 not applied on Solana.</div>
    <div style={{ position: "absolute", left: 70, bottom: 150 }}><Barcode w={460} h={46} color="rgba(255,255,255,0.9)" seed="p5" /></div>
    <Foot dark />
  </>
);
const P6: React.FC = () => (
  <>
    <Bg color={C.lav} />
    <Top status="stale" label="Education" />
    <div style={{ position: "absolute", left: 70, top: 190, fontFamily: DISPLAY, fontSize: 200, lineHeight: 0.98, color: C.ink, textTransform: "uppercase", whiteSpace: "nowrap" }}>Stale is<br />not a<br /><span style={{ color: C.blue }}>weekend.</span></div>
    <div style={{ position: "absolute", left: 70, right: 70, top: 860, background: "#fff", borderRadius: 34, padding: "34px 52px", border: `5px solid ${C.ink}`, boxShadow: `14px 14px 0 ${C.ink}`, boxSizing: "border-box" }}>
      <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 42, lineHeight: 1.22, color: C.ink, letterSpacing: -0.5 }}>Arbitrum head is not advancing. Not a market closure; do not treat as a weekend freeze.</div>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 3, marginTop: 24, textTransform: "uppercase", color: C.blue }}>dMSFT · ARB · Stale</div>
    </div>
    <Foot />
  </>
);
const P7: React.FC = () => (
  <>
    <Bg color={C.yellow} />
    <Top status="pending" label="Product · Lookahead" />
    <div style={{ position: "absolute", left: 60, top: 180, fontFamily: DISPLAY, fontSize: 350, lineHeight: 1, color: C.blue }}>xAAPL.</div>
    <div style={{ position: "absolute", left: 70, top: 630, fontFamily: DISPLAY, fontSize: 128, lineHeight: 1, color: C.ink, whiteSpace: "nowrap" }}>ACTION PENDING.</div>
    <div style={{ position: "absolute", left: 70, right: 70, top: 800, fontFamily: SANS, fontWeight: 700, fontSize: 48, lineHeight: 1.2, color: C.ink, letterSpacing: -0.8 }}>Dividend $0.27 / share · effective 2026-10-27 22:00 UTC</div>
    <div style={{ position: "absolute", left: 70, right: 70, top: 970, fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 2, textTransform: "uppercase", color: "rgba(13,13,15,0.75)" }}>Multiplier not yet applied · event effective in 38h</div>
    <div style={{ position: "absolute", left: 70, bottom: 150 }}><Barcode w={460} h={46} color={C.ink} seed="p7" /></div>
    <Foot />
  </>
);

/* P8: three clocks, 5 slides */
const Clock: React.FC<{ bg: string; fg: string; sub: string; accent: string; label: string; big: string; line: string; example: string; n: number; dark?: boolean }> = ({ bg, fg, sub, accent, label, big, line, example, n, dark }) => (
  <>
    <Bg color={bg} />
    <div style={{ position: "absolute", left: 70, top: 78, fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: 6, color: sub, textTransform: "uppercase" }}>{label}</div>
    <div style={{ position: "absolute", right: 70, top: 78, fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: 4, color: sub }}>CLOCK {n}/3</div>
    <div style={{ position: "absolute", left: 40, top: 200, fontFamily: DISPLAY, fontSize: 560, lineHeight: 1, color: accent }}>{big}</div>
    <div style={{ position: "absolute", left: 70, right: 80, top: 860, fontFamily: SANS, fontWeight: 500, fontSize: 62, lineHeight: 1.12, letterSpacing: -1.2, color: fg }}>{line}</div>
    <div style={{ position: "absolute", left: 70, top: 1100, fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: fg, textTransform: "uppercase" }}>{example}</div>
    <Foot n={`0${n + 1}/05`} dark={dark} />
  </>
);
const P8a: React.FC = () => (
  <>
    <Paper x={50} y={35} />
    <div style={{ position: "absolute", left: 70, top: 70 }}><Badge size={130} /></div>
    <div style={{ position: "absolute", left: 230, top: 112, fontFamily: MONO, fontSize: 22, letterSpacing: 5, color: C.blue, fontWeight: 700, textTransform: "uppercase" }}>State-of-the-asset layer</div>
    <div style={{ position: "absolute", left: 70, top: 300, fontFamily: DISPLAY, fontSize: 190, lineHeight: 1, color: C.blue, textTransform: "uppercase", whiteSpace: "nowrap" }}>Three<br />clocks.<br /><span style={{ WebkitTextStroke: `5px ${C.blue}`, color: "transparent" }}>One verdict.</span></div>
    <div style={{ position: "absolute", right: 70, bottom: 150, fontFamily: MONO, fontSize: 20, letterSpacing: 4, fontWeight: 700, textTransform: "uppercase" }}>Swipe</div>
    <Foot n="01/05" />
  </>
);
const P8e: React.FC = () => (
  <>
    <Paper bloom={1.1} y={40} />
    <div style={{ position: "absolute", left: W / 2 - 200, top: 110 }}><Badge size={400} /></div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 600, textAlign: "center", fontFamily: DISPLAY, fontSize: 170, lineHeight: 1, color: C.blue, textTransform: "uppercase" }}>Merged into<br />one value.</div>
    <div style={{ position: "absolute", left: 70, right: 70, top: 1000, display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
      {(["open", "closed", "pending", "redemption", "stale", "divergent"] as Status[]).map((s) => (<Chip key={s} status={s} size={20} />))}
    </div>
    <Foot n="05/05" />
  </>
);

const POSTS: Record<number, React.FC> = {
  0: P4, 1: P5, 2: P6, 3: P7, 4: P8a,
  5: () => <Clock bg={C.blue} fg="#fff" sub="rgba(255,255,255,0.8)" accent={C.cream} label="Market clock" big="6H" line="Market opens in 6h. Until then the oracle price is frozen at the last close." example="xTSLA · ETH · Market closed" n={1} dark />,
  6: () => <Clock bg={C.yellow} fg={C.ink} sub="rgba(13,13,15,0.7)" accent={C.blue} label="Event clock" big="38H" line="Event effective in 38h. Dividend $0.27 / share, multiplier not yet applied." example="xAAPL · ETH · Action pending" n={2} />,
  7: () => <Clock bg={C.red} fg="#fff" sub="rgba(255,255,255,0.8)" accent={C.cream} label="Fund clock" big="13H" line="Redemption window opens in 6h. NAV strike in 13h." example="BUIDL · ETH · USTB · ETH" n={3} dark />,
  8: P8e,
};

export const OrynPosts2: React.FC = () => {
  const f = useCurrentFrame();
  const { width } = useVideoConfig();
  const Post = POSTS[f];
  return (
    <AbsoluteFill style={{ background: C.cream }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transform: `scale(${width / W})`, transformOrigin: "0 0", overflow: "hidden" }}>
        <Post />
      </div>
    </AbsoluteFill>
  );
};
export { H };
