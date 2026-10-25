import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { CL } from "../Collatera/brand";
import { Mascot } from "../Collatera/components/Mascot";
import { INK, MONO, PAPER, PIX } from "../CollateraLaunch/Kit";
import { Chip, Footer, Grid } from "../CollateraLaunch/Poster";
import { Terminal } from "../CollateraLaunch/Shots";

/**
 * COLLATERA campaign stills in the site's pixel-terminal style (fps = 1,
 * one frame per still). CampaignPosts45 2160×2700: P2 slides 1–5, P3.
 * CampaignPostsSquare 2160×2160: P5, P8. CampaignPostsWide 3840×2160: P6,
 * article headers A1–A5. Copy from collatera.buzz; values SIMULATED.
 */
const Tag: React.FC<{ text: string; dark?: boolean }> = ({ text, dark }) => (
  <div style={{ fontFamily: PIX, fontSize: 20, color: dark ? INK : CL.lime, display: "flex", alignItems: "center", gap: 12 }}>
    <div style={{ width: 10, height: 10, background: dark ? INK : CL.lime }} />
    {text}
  </div>
);
const H: React.FC<{ lines: [string, boolean][]; size: number; dark?: boolean }> = ({ lines, size, dark }) => (
  <div style={{ fontFamily: PIX, fontWeight: 700, fontSize: size, lineHeight: 1.14, color: dark ? INK : CL.mint, textShadow: dark ? "none" : `${size * 0.06}px ${size * 0.06}px 0 ${CL.shadow}` }}>
    {lines.map(([l, hi]) => (
      <div key={l} style={{ color: hi ? (dark ? INK : CL.lime) : undefined }}>{l}</div>
    ))}
  </div>
);
const Body: React.FC<{ children: React.ReactNode; dark?: boolean; w?: number; size?: number }> = ({ children, dark, w = 900, size = 30 }) => (
  <div style={{ fontFamily: MONO, fontSize: size, lineHeight: 1.5, color: dark ? "#2E5A45" : CL.mint, width: w, opacity: 0.94 }}>{children}</div>
);
const Num: React.FC<{ n: string; dark?: boolean }> = ({ n, dark }) => <div style={{ position: "absolute", right: 80, top: 96, fontFamily: PIX, fontSize: 20, color: dark ? INK : CL.sage }}>{n}</div>;
const PaperBg: React.FC = () => (
  <AbsoluteFill style={{ background: PAPER }}>
    <AbsoluteFill style={{ backgroundImage: `radial-gradient(${INK}1f 1.3px, transparent 1.4px)`, backgroundSize: "26px 26px" }} />
  </AbsoluteFill>
);
const Foot: React.FC<{ dark?: boolean }> = ({ dark }) =>
  dark ? (
    <div style={{ position: "absolute", left: 80, bottom: 80, fontFamily: PIX, fontSize: 22, color: INK }}>collatera.buzz · @collatera_io</div>
  ) : (
    <div style={{ position: "absolute", left: 80, bottom: 80 }}>
      <Footer />
    </div>
  );

/* ── P2 carousel: what is a stale oracle? ── */
const P2s1: React.FC = () => (
  <AbsoluteFill>
    <PaperBg />
    <div style={{ position: "absolute", left: 80, top: 96 }}><Tag text="EXPLAINER / STALE ORACLES" dark /></div>
    <Num n="01 / 05" dark />
    <div style={{ position: "absolute", left: 80, top: 380 }}>
      <H size={92} dark lines={[["YOUR ORACLE", false], ["SAYS FINE.", false]]} />
      <div style={{ height: 50 }} />
      <H size={150} dark lines={[["IT'S", false], ["STALE.", false]]} />
      <div style={{ width: 640, height: 22, background: CL.lime, marginTop: 10 }} />
    </div>
    <div style={{ position: "absolute", left: 80, bottom: 150, fontFamily: MONO, fontSize: 28, color: "#2E5A45" }}>What that means, in 30 seconds →</div>
    <Foot dark />
  </AbsoluteFill>
);
const Lines: React.FC<{ stale?: boolean }> = ({ stale = true }) => {
  const W = 900;
  const Hh = 380;
  const price = Array.from({ length: 30 }, (_, i) => [i * (W / 29), 200 - Math.sin(i * 0.45) * 60 - i * 3]);
  const step = 6;
  const oracle = price.map(([x], i) => [x, price[Math.floor(i / step) * step][1]]);
  return (
    <svg width={W} height={Hh} style={{ background: "#00241A", border: `2px solid ${CL.line}` }}>
      <line x1={0} x2={W} y1={340} y2={340} stroke="#FF6B5A" strokeWidth={3} strokeDasharray="10 8" />
      <polyline points={price.map((p) => p.join(",")).join(" ")} fill="none" stroke={CL.lime} strokeWidth={5} />
      {stale ? <polyline points={oracle.map(([x, y], i) => (i > 0 ? `${x},${oracle[i - 1][1]} ${x},${y}` : `${x},${y}`)).join(" ")} fill="none" stroke="#E2A23B" strokeWidth={5} strokeDasharray="2 0" /> : null}
      <text x={20} y={36} fontFamily="JetBrains Mono" fontSize={22} fill={CL.lime}>— price</text>
      {stale ? <text x={170} y={36} fontFamily="JetBrains Mono" fontSize={22} fill="#E2A23B">— oracle (lagging)</text> : null}
      <text x={W - 20} y={330} textAnchor="end" fontFamily="JetBrains Mono" fontSize={20} fill="#FF6B5A">liquidation line</text>
    </svg>
  );
};
const Slide: React.FC<{ n: number; tag: string; lines: [string, boolean][]; body: string; children?: React.ReactNode }> = ({ n, tag, lines, body, children }) => (
  <AbsoluteFill>
    <Grid />
    <div style={{ position: "absolute", left: 80, top: 96 }}><Tag text={tag} /></div>
    <Num n={`0${n} / 05`} />
    <div style={{ position: "absolute", left: 80, top: 200 }}>
      <H size={64} lines={lines} />
      <div style={{ height: 30 }} />
      <Body>{body}</Body>
    </div>
    <div style={{ position: "absolute", left: 90, top: 760 }}>{children}</div>
    <Foot />
  </AbsoluteFill>
);
const P2s2: React.FC = () => (
  <Slide n={2} tag="01 / THE ORACLE" lines={[["AN ORACLE REPORTS", false], ["THE PRICE YOUR", false], ["LOAN USES.", true]]} body="Your DeFi loan doesn't see the market. It sees the oracle feed the protocol reads.">
    <Lines stale={false} />
  </Slide>
);
const P2s3: React.FC = () => (
  <Slide n={3} tag="02 / STALE" lines={[["IF THE FEED LAGS,", false], ["YOUR HEALTH LOOKS", false], ["BETTER THAN IT IS.", true]]} body="Stale isn't wrong on purpose. It's just late, and a late price changes your buffer.">
    <Lines />
  </Slide>
);
const P2s4: React.FC = () => (
  <Slide n={4} tag="03 / TOKENIZED STOCKS" lines={[["MARKETS CLOSE.", false], ["NEWS DOESN'T.", true]]} body="Closed exchanges, overnight gaps, issuer events and thinner liquidity add risk crypto-native collateral doesn't have.">
    <div style={{ display: "flex", gap: 24 }}>
      {[
        ["closed", "Closed markets"],
        ["stress", "Overnight gaps"],
        ["eye", "Issuer events"],
      ].map(([k, l]) => (
        <div key={k} style={{ width: 290, padding: "28px 24px", background: CL.evergreen, border: `2px solid ${CL.line}`, boxShadow: `8px 8px 0 ${CL.shadow}`, fontFamily: PIX, fontSize: 22, color: CL.mint }}>
          {l}
        </div>
      ))}
    </div>
  </Slide>
);
const P2s5: React.FC = () => (
  <Slide n={5} tag="04 / COLLATERA" lines={[["PRICE. ORACLE AGE.", false], ["LIQUIDATION LINE.", false], ["SIDE BY SIDE.", true]]} body="Read-only monitoring for DeFi loans backed by tokenized stocks & ETFs. No keys. No signatures.">
    <div style={{ display: "flex", gap: 14 }}>
      <Chip text="READ-ONLY" />
      <Chip text="NO KEYS" />
      <Chip text="NO SIGNATURES" />
    </div>
    <div style={{ marginTop: 40, fontFamily: PIX, fontSize: 30, color: CL.lime }}>TRY THE DEMO → COLLATERA.BUZZ/APP</div>
  </Slide>
);

/* ── P3 position health explained ── */
const P3: React.FC = () => (
  <AbsoluteFill>
    <Grid />
    <div style={{ position: "absolute", left: 80, top: 96 }}><Tag text="ONE PANEL / THREE QUESTIONS" /></div>
    <div style={{ position: "absolute", left: 80, top: 190 }}>
      <H size={70} lines={[["POSITION", false], ["HEALTH.", true]]} />
      <div style={{ height: 24 }} />
      <Body>Three numbers that tell you how close you are.</Body>
    </div>
    <div style={{ position: "absolute", left: 80, top: 560, width: 920, background: "#00241A", border: `2px solid ${CL.line}`, boxShadow: `12px 12px 0 ${CL.shadow}`, padding: "30px 34px" }}>
      <div style={{ display: "flex", fontFamily: PIX, fontSize: 24, color: CL.lime, marginBottom: 20 }}>
        POSITION HEALTH<span style={{ marginLeft: "auto", color: CL.sage, fontSize: 18 }}>SIMULATED DATA</span>
      </div>
      {[
        ["Buffer", "14.7%", "distance to your liquidation threshold"],
        ["Oracle age", "89 min", "how old the price under it is"],
        ["LTV", "39.8%", "borrowed vs collateral posted"],
      ].map(([k, v, d], i) => (
        <div key={k} style={{ padding: "22px 0", borderTop: i ? `1.5px solid ${CL.line}` : "none" }}>
          <div style={{ display: "flex", alignItems: "baseline", fontFamily: MONO, fontSize: 36, color: CL.mint }}>
            {k}
            <span style={{ marginLeft: "auto", fontFamily: PIX, fontSize: 40, color: i === 1 ? CL.lime : CL.mint }}>{v}</span>
          </div>
          <div style={{ fontFamily: MONO, fontSize: 24, color: CL.sage, marginTop: 8 }}>→ {d}</div>
        </div>
      ))}
      <div style={{ height: 18, background: "#00140E", border: `1px solid ${CL.line}`, marginTop: 14 }}>
        <div style={{ width: "64%", height: "100%", background: CL.lime }} />
      </div>
    </div>
    <div style={{ position: "absolute", right: 80, bottom: 160 }}>
      <Mascot cell={10} />
    </div>
    <Foot />
  </AbsoluteFill>
);

/* ── P5 markets close (1:1) ── */
const P5: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{ display: "flex", flexDirection: "row" }}>
      <div style={{ flex: 1, background: "#EAF7DF", position: "relative" }}>
        <div style={{ position: "absolute", left: 60, top: 70, fontFamily: PIX, fontSize: 26, color: INK }}>■ MARKET OPEN</div>
        <div style={{ position: "absolute", right: 60, top: 60, width: 80, height: 80, background: "#E2A23B" }} />
      </div>
      <div style={{ flex: 1, background: CL.night, position: "relative" }}>
        <div style={{ position: "absolute", right: 60, top: 70, fontFamily: PIX, fontSize: 26, color: CL.lime }}>■ MARKET CLOSED</div>
        <div style={{ position: "absolute", left: 60, top: 50, width: 80, height: 80, borderRadius: "50%", boxShadow: `22px -10px 0 0 ${CL.mint}` }} />
      </div>
    </AbsoluteFill>
    <svg width={1080} height={1080} style={{ position: "absolute", inset: 0 }}>
      <polyline points="40,640 140,620 240,600 340,610 440,580 540,580 640,580 740,580 840,580 900,580" fill="none" stroke={CL.lime} strokeWidth={7} />
      <polyline points="540,580 900,580" fill="none" stroke="#E2A23B" strokeWidth={7} strokeDasharray="14 10" />
      <polyline points="900,580 900,700 1040,720" fill="none" stroke="#FF6B5A" strokeWidth={7} />
      <rect x={540} y={560} width={360} height={170} fill="rgba(255,107,90,0.12)" stroke="#FF6B5A" strokeDasharray="6 6" />
      <text x={720} y={760} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={22} fill="#FFB4A8">the gap your oracle can't see</text>
    </svg>
    <div style={{ position: "absolute", left: 60, top: 220 }}>
      <div style={{ fontFamily: PIX, fontWeight: 700, fontSize: 88, lineHeight: 1.1, color: INK }}>MARKETS</div>
      <div style={{ fontFamily: PIX, fontWeight: 700, fontSize: 88, lineHeight: 1.1, color: INK }}>CLOSE.</div>
    </div>
    <div style={{ position: "absolute", right: 60, top: 220, textAlign: "right" }}>
      <div style={{ fontFamily: PIX, fontWeight: 700, fontSize: 88, lineHeight: 1.1, color: CL.mint }}>LOANS</div>
      <div style={{ fontFamily: PIX, fontWeight: 700, fontSize: 88, lineHeight: 1.1, color: CL.lime }}>DON'T.</div>
    </div>
    <div style={{ position: "absolute", left: 60, bottom: 60, fontFamily: MONO, fontSize: 20, color: "#2E5A45" }}>Illustrative timeline</div>
    <div style={{ position: "absolute", right: 60, bottom: 60, fontFamily: PIX, fontSize: 20, color: CL.sage }}>collatera.buzz</div>
  </AbsoluteFill>
);

/* ── P8 token is a proposal (1:1) ── */
const P8: React.FC = () => (
  <AbsoluteFill>
    <PaperBg />
    <div style={{ position: "absolute", left: 70, top: 80 }}><Tag text="TOKEN ROLE / PRINCIPLES" dark /></div>
    <div style={{ position: "absolute", left: 70, top: 280 }}>
      <H size={84} dark lines={[["A TOKEN IS", false], ["A PROPOSAL,", false], ["NOT A", false], ["PROMISE.", false]]} />
      <div style={{ width: 470, height: 18, background: CL.lime, marginTop: 6 }} />
      <div style={{ marginTop: 50, fontFamily: MONO, fontSize: 30, color: "#2E5A45" }}>Paid usage comes first.</div>
    </div>
    <div style={{ position: "absolute", right: 70, top: 300 }}>
      <Mascot cell={14} />
    </div>
    <div style={{ position: "absolute", left: 70, bottom: 70, fontFamily: MONO, fontSize: 19, color: "#3B6B55", width: 800 }}>Tokens do not guarantee returns or value. Any token role remains a proposal until usage proves it is needed.</div>
  </AbsoluteFill>
);

/* ── P6 ecosystem map (16:9) ── */
const VEN: [string, string][] = [
  ["Aave", "Lending market"],
  ["Euler", "Lending market"],
  ["Morpho", "Lending network"],
  ["Sentora", "Vault curator"],
];
const P6: React.FC = () => (
  <AbsoluteFill>
    <Grid />
    <div style={{ position: "absolute", left: 110, top: 90 }}><Tag text="ECOSYSTEM / WHERE THE COLLATERAL LIVES" /></div>
    <div style={{ position: "absolute", left: 110, top: 150 }}>
      <H size={60} lines={[["BUILT AROUND THE LENDING STACK.", false]]} />
    </div>
    <div style={{ position: "absolute", left: 110, top: 300, display: "flex", gap: 30 }}>
      {VEN.map(([n, r]) => (
        <div key={n} style={{ width: 400, padding: "34px 30px", background: CL.evergreen, border: `2px solid ${CL.line}`, boxShadow: `10px 10px 0 ${CL.shadow}` }}>
          <div style={{ fontFamily: PIX, fontSize: 40, color: CL.mint }}>{n}</div>
          <div style={{ fontFamily: MONO, fontSize: 22, color: CL.sage, marginTop: 8 }}>{r}</div>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 0, width: 1920, top: 520, textAlign: "center", fontFamily: PIX, fontSize: 24, color: CL.lime }}>↓ TOKENIZED COLLATERAL SETTLES ON ↓</div>
    <div style={{ position: "absolute", left: 110, top: 590, width: 1700, padding: "34px 40px", border: `3px solid ${CL.lime}`, background: CL.evergreen, boxShadow: `12px 12px 0 ${CL.shadow}` }}>
      <div style={{ fontFamily: PIX, fontSize: 44, color: CL.lime }}>Robinhood Chain</div>
      <div style={{ fontFamily: MONO, fontSize: 24, color: CL.sage, marginTop: 8 }}>Settlement layer · chain ID 4663 · Arbitrum-based Ethereum L2 built for tokenized stocks.</div>
    </div>
    <div style={{ position: "absolute", left: 110, top: 850, fontFamily: MONO, fontSize: 21, color: CL.sage, width: 1700 }}>Coverage targets shown with public data. Collatera is not affiliated with or endorsed by these projects. Which protocols are live on Robinhood Chain varies, so check each venue before relying on it.</div>
    <div style={{ position: "absolute", right: 110, bottom: 60 }}>
      <Footer />
    </div>
  </AbsoluteFill>
);

/* ── Article headers (16:9) ── */
const Header: React.FC<{ tag: string; lines: [string, boolean][]; visual?: React.ReactNode; light?: boolean }> = ({ tag, lines, visual, light }) => (
  <AbsoluteFill>
    {light ? <PaperBg /> : <Grid />}
    <div style={{ position: "absolute", left: 110, top: 110 }}><Tag text={tag} dark={light} /></div>
    <div style={{ position: "absolute", left: 110, top: 230 }}>
      <H size={70} dark={light} lines={lines} />
    </div>
    <div style={{ position: "absolute", right: 110, top: 200 }}>{visual}</div>
    <div style={{ position: "absolute", left: 110, bottom: 80 }}>{light ? <Foot dark /> : <Footer />}</div>
  </AbsoluteFill>
);
const A1: React.FC = () => <Header tag="ARTICLE / 01" lines={[["WHY TOKENIZED-STOCK", false], ["COLLATERAL NEEDS", false], ["ORACLE FRESHNESS", true], ["CHECKS.", true]]} visual={<div style={{ transform: "scale(0.75)", transformOrigin: "100% 0" }}><Lines /></div>} />;
const A2: React.FC = () => <Header tag="ARTICLE / 02" lines={[["THE OVERNIGHT GAP:", false], ["WHEN MARKETS CLOSE", false], ["AND LOANS DON'T.", true]]} visual={<Mascot cell={22} />} />;
const A3: React.FC = () => (
  <Header
    tag="ARTICLE / 03"
    lines={[["READING YOUR", false], ["POSITION HEALTH:", false], ["BUFFER, ORACLE", true], ["AGE, LTV.", true]]}
    visual={
      <div style={{ transform: "scale(0.62)", transformOrigin: "100% 0" }}>
        <Terminal t={2.4} />
      </div>
    }
  />
);
const A4: React.FC = () => <Header light tag="ARTICLE / 04" lines={[["MONITORING FIRST,", false], ["AUTOMATION LATER.", false]]} visual={<Mascot cell={22} />} />;
const A5: React.FC = () => <Header tag="ARTICLE / 05" lines={[["WHERE TOKENIZED", false], ["COLLATERAL LIVES:", false], ["THE LENDING STACK,", true], ["MAPPED.", true]]} visual={<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>{VEN.map(([n]) => <div key={n} style={{ width: 300, padding: "26px 24px", background: CL.evergreen, border: `2px solid ${CL.line}`, boxShadow: `8px 8px 0 ${CL.shadow}`, fontFamily: PIX, fontSize: 30, color: CL.mint }}>{n}</div>)}</div>} />;

const make = (list: React.FC[], dw: number, dh: number): React.FC =>
  function Still() {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    const P = list[Math.min(frame, list.length - 1)];
    const s = Math.min(width / dw, height / dh);
    return (
      <AbsoluteFill style={{ background: CL.night, justifyContent: "center", alignItems: "center" }}>
        <div style={{ position: "relative", width: dw, height: dh, flexShrink: 0, overflow: "hidden", transform: `scale(${s})` }}>
          <P />
        </div>
      </AbsoluteFill>
    );
  };

export const CampaignPosts45 = make([P2s1, P2s2, P2s3, P2s4, P2s5, P3], 1080, 1350);
export const CampaignPostsSquare = make([P5, P8], 1080, 1080);
export const CampaignPostsWide = make([P6, A1, A2, A3, A4, A5], 1920, 1080);
