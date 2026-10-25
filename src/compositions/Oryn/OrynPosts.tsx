import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C, DEPLOYMENTS, DISPLAY, MONO, SANS, VERDICTS, type Status } from "./brand";
import { Badge, Barcode, Block, Chip, Paper, VerdictCard } from "./parts";

/** 1080x1350 (4:5) design canvas scaled to the output size; frame N = poster N. */
const W = 1080;
const H = 1350;

const Label: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.red }) => (
  <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 5, textTransform: "uppercase", color, fontWeight: 700 }}>{children}</div>
);
const Foot: React.FC<{ dark?: boolean; n?: number }> = ({ dark }) => (
  <div style={{ position: "absolute", left: 70, right: 70, bottom: 56, display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: MONO, fontSize: 17, letterSpacing: 3, textTransform: "uppercase", color: dark ? "rgba(255,255,255,0.6)" : "rgba(13,13,15,0.6)" }}>
    <span>Oryn · State of assets activated</span>
    <span />
  </div>
);

/* 01 hero */
const P1: React.FC = () => (
  <>
    <Paper x={50} y={40} />
    <div style={{ position: "absolute", left: 70, top: 70 }}><Badge size={150} /></div>
    <div style={{ position: "absolute", left: 250, top: 100 }}><Label color={C.blue}>State-of-the-asset layer</Label></div>
    <div style={{ position: "absolute", left: 70, top: 300, fontFamily: DISPLAY, fontSize: 300, lineHeight: 0.9, color: C.blue, textTransform: "uppercase" }}>
      Is it<br /><span style={{ WebkitTextStroke: `7px ${C.blue}`, color: "transparent" }}>Safe</span><br />to act?
    </div>
    <div style={{ position: "absolute", left: 70, bottom: 130, fontFamily: SANS, fontWeight: 700, fontSize: 36, maxWidth: 800, lineHeight: 1.25 }}>One verdict per token, per chain. A reason. The evidence.</div>
    <Foot n={1} />
  </>
);

/* 02 board */
const P2: React.FC = () => (
  <>
    <Paper bloom={0.7} y={20} />
    <div style={{ position: "absolute", left: 70, top: 80 }}>
      <Label>01 ✦ Live verdicts</Label>
      <div style={{ fontFamily: DISPLAY, fontSize: 220, lineHeight: 1, color: C.ink, marginTop: 8 }}>THE BOARD</div>
    </div>
    <div style={{ position: "absolute", left: 70, top: 400, display: "grid", gridTemplateColumns: "repeat(2, 460px)", gap: 40 }}>
      {[0, 1, 2, 6].map((i) => (<VerdictCard key={i} d={DEPLOYMENTS[i]} w={460} h={340} />))}
    </div>
    <div style={{ position: "absolute", left: 70, bottom: 130, fontFamily: SANS, fontWeight: 700, fontSize: 34 }}>15 deployments. One verdict each.</div>
    <Foot n={2} />
  </>
);

/* 03 divergent */
const P3: React.FC = () => (
  <>
    <Paper dark />
    <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(115deg, rgba(229,50,31,0.07) 0 4px, transparent 4px 18px)" }} />
    <div style={{ position: "absolute", left: 70, top: 90 }}><Label>Chain SOL · Rebasing · Backed</Label></div>
    <div style={{ position: "absolute", left: 60, top: 150, fontFamily: DISPLAY, fontSize: 430, lineHeight: 1, color: C.red }}>xTSLA</div>
    <div style={{ position: "absolute", left: 70, top: 640, display: "flex", gap: 24, alignItems: "center" }}>
      <Chip status="divergent" size={40} />
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, color: C.red, border: `4px solid ${C.red}`, padding: "6px 16px", letterSpacing: 4, transform: "rotate(-3deg)" }}>1 MISMATCH</div>
    </div>
    <div style={{ position: "absolute", left: 70, top: 780, right: 70, fontFamily: SANS, fontWeight: 700, fontSize: 60, lineHeight: 1.15, color: C.red }}>Stock split 3:1 not applied on Solana.</div>
    <div style={{ position: "absolute", left: 70, top: 1000, display: "flex", gap: 80 }}>
      {[["Next change", "unknown"], ["Verdict", "Event not reflected"]].map(([k, v]) => (
        <div key={k}><div style={{ fontFamily: MONO, fontSize: 18, letterSpacing: 4, color: "rgba(229,50,31,0.6)", textTransform: "uppercase" }}>{k}</div><div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, color: C.red, textTransform: "uppercase", marginTop: 6 }}>{v}</div></div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 70, right: 70, bottom: 140 }}><Barcode w={940} h={44} color={C.red} seed="p3" /></div>
    <Foot dark n={3} />
  </>
);

/* 04 six verdicts */
const LEGEND: { s: Status; line: string }[] = [
  { s: "open", line: "Redemptions open, NAV fresh, onchain state matches issuer" },
  { s: "closed", line: "Underlying exchange is closed; oracle price is frozen at the last close, as expected" },
  { s: "pending", line: "Dividend $0.27 / share · multiplier not yet applied on Ethereum" },
  { s: "redemption", line: "Fund redemption window is shut; collateral cannot be redeemed at published NAV" },
  { s: "stale", line: "Arbitrum head is not advancing. Not a market closure" },
  { s: "divergent", line: "Stock split 10:1 not applied on Ethereum" },
];
const P4: React.FC = () => (
  <>
    <Paper bloom={0.5} y={15} />
    <div style={{ position: "absolute", left: 70, top: 80 }}>
      <Label>Six verdicts</Label>
      <div style={{ fontFamily: DISPLAY, fontSize: 190, lineHeight: 1, color: C.blue, marginTop: 8 }}>ONE VALUE.</div>
    </div>
    <div style={{ position: "absolute", left: 70, right: 70, top: 360, display: "flex", flexDirection: "column", gap: 22 }}>
      {LEGEND.map(({ s, line }) => (
        <Block key={s} bg={VERDICTS[s].bg} border={4} radius={18} shadow={8} style={{ display: "flex", alignItems: "center", gap: 28, padding: "16px 26px" }}>
          <div style={{ width: 330, flexShrink: 0 }}><Chip status={s} size={22} /></div>
          <div style={{ fontFamily: MONO, fontSize: 17, lineHeight: 1.4, color: VERDICTS[s].fg }}>{line}</div>
        </Block>
      ))}
    </div>
    <Foot n={4} />
  </>
);

/* 05 time machine */
const P5: React.FC = () => (
  <>
    <Paper bloom={0.8} y={30} />
    <div style={{ position: "absolute", left: 70, top: 90 }}>
      <Label>Time machine</Label>
      <div style={{ fontFamily: DISPLAY, fontSize: 250, lineHeight: 0.95, color: C.ink, marginTop: 10 }}>REPLAY<br />ANY<br />MOMENT.</div>
    </div>
    <div style={{ position: "absolute", left: 70, top: 880, fontFamily: SANS, fontWeight: 500, fontSize: 38, maxWidth: 840 }}>Verdicts, calendar and alerts all follow.</div>
    <Block bg={C.yellow} shadow={14} style={{ position: "absolute", left: 70, right: 70, top: 990, height: 200, padding: "30px 40px", boxSizing: "border-box" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontWeight: 700, fontSize: 21, letterSpacing: 2 }}><span>26/10/26 07:59</span><span style={{ background: C.ink, color: C.yellow, padding: "2px 14px", borderRadius: 99 }}>+41.25h</span></div>
      <div style={{ position: "relative", marginTop: 42, height: 12, background: C.ink, borderRadius: 99 }}>
        <div style={{ width: "62%", height: "100%", background: C.red, borderRadius: 99 }} />
        <div style={{ position: "absolute", left: "62%", top: -17, width: 44, height: 44, marginLeft: -22, borderRadius: 99, background: C.red, border: `6px solid ${C.ink}` }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontWeight: 700, fontSize: 18, marginTop: 26 }}><span>−1D</span><span>NOW</span><span>NEXT OPEN</span><span>+1D</span></div>
    </Block>
    <Foot n={5} />
  </>
);

/* 06 end card */
const P6: React.FC = () => (
  <>
    <Paper bloom={1.2} y={38} />
    <div style={{ position: "absolute", left: W / 2 - 260, top: 120 }}><Badge size={520} /></div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center", fontFamily: DISPLAY, fontSize: 150, lineHeight: 1, color: C.blue }}>UNKNOWN<br />MEANS NOT<br />ACTIONABLE.</div>
    <div style={{ position: "absolute", left: 90, right: 90, top: 1170, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 28, lineHeight: 1.35 }}>A bond proves skin in the game, not that an offchain asset exists.</div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 56, textAlign: "center", fontFamily: MONO, fontSize: 15, letterSpacing: 3, color: "rgba(13,13,15,0.55)", textTransform: "uppercase" }}>Oryn © 2026 · MVP · Simulated issuer data · Not investment advice</div>
  </>
);

const POSTS = [P1, P2, P3, P4, P5, P6];

/** ORYN social posts: 6 stills, 4:5, frame N (fps 1) = post N. Render with --scale=2 for 2160x2700. */
export const OrynPosts: React.FC = () => {
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
