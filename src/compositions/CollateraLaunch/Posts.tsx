import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { CL } from "../Collatera/brand";
import { Mascot } from "../Collatera/components/Mascot";
import { INK, MONO, PAPER, PIX } from "./Kit";
import { Footer, Grid, Pixels } from "./Poster";
import { Terminal } from "./Shots";

/**
 * COLLATERA social posts, 4:5 (design 1080×1350, rendered 2160×2700).
 * fps = 1, one frame per post: render with `remotion still --frame=N`.
 * All copy is from collatera.buzz / the X bio; terminal values are the
 * site's simulated demo data and are labelled as such.
 */
const Tag: React.FC<{ text: string; dark?: boolean }> = ({ text, dark }) => (
  <div style={{ fontFamily: PIX, fontSize: 20, color: dark ? INK : CL.lime, display: "flex", alignItems: "center", gap: 12 }}>
    <div style={{ width: 10, height: 10, background: dark ? INK : CL.lime }} />
    {text}
  </div>
);

const Title: React.FC<{ lines: [string, boolean][]; size: number; color?: string }> = ({ lines, size, color = CL.mint }) => (
  <div style={{ fontFamily: PIX, fontWeight: 700, fontSize: size, lineHeight: 1.12, color, textShadow: color === INK ? "none" : `${size * 0.06}px ${size * 0.06}px 0 ${CL.shadow}` }}>
    {lines.map(([l, hi]) => (
      <div key={l} style={{ color: hi ? (color === INK ? INK : CL.lime) : color }}>{l}</div>
    ))}
  </div>
);

const Sub: React.FC<{ children: React.ReactNode; dark?: boolean }> = ({ children, dark }) => (
  <div style={{ fontFamily: MONO, fontSize: 28, lineHeight: 1.5, color: dark ? "#2E5A45" : CL.mint, opacity: 0.92, width: 900 }}>{children}</div>
);

const Index: React.FC<{ n: number; dark?: boolean }> = ({ n, dark }) => (
  <div style={{ position: "absolute", right: 80, top: 96, fontFamily: PIX, fontSize: 20, color: dark ? INK : CL.sage }}>0{n} / 05</div>
);

/* 1 — Hook on mint paper */
const P1: React.FC = () => (
  <AbsoluteFill style={{ background: PAPER }}>
    <AbsoluteFill style={{ backgroundImage: `radial-gradient(${INK}1f 1.3px, transparent 1.4px)`, backgroundSize: "26px 26px" }} />
    <div style={{ position: "absolute", left: 80, top: 96 }}><Tag text="COLLATERA" dark /></div>
    <Index n={1} dark />
    <div style={{ position: "absolute", left: 80, top: 330 }}>
      <Title size={92} color={INK} lines={[["YOUR ORACLE", false], ["SAYS FINE.", false]]} />
      <div style={{ height: 60 }} />
      <div style={{ fontFamily: PIX, fontWeight: 700, fontSize: 150, color: INK, lineHeight: 1 }}>IT'S</div>
      <div style={{ fontFamily: PIX, fontWeight: 700, fontSize: 150, color: INK, lineHeight: 1.05 }}>STALE.</div>
      <div style={{ width: 640, height: 22, background: CL.lime, marginTop: 10 }} />
    </div>
    {[[120, 260], [830, 300], [960, 760], [110, 1040], [700, 1120]].map(([x, y], i) => (
      <div key={i} style={{ position: "absolute", left: x, top: y, width: 9, height: 9, background: INK }} />
    ))}
    <div style={{ position: "absolute", right: 80, bottom: 90 }}>
      <Mascot cell={16} />
    </div>
    <div style={{ position: "absolute", left: 80, bottom: 96, fontFamily: MONO, fontSize: 26, color: "#2E5A45" }}>
      Catch stale oracles before they catch you.
    </div>
  </AbsoluteFill>
);

/* 2 — Watch the price. Watch the oracle. */
const P2: React.FC = () => (
  <AbsoluteFill>
    <Grid />
    <div style={{ position: "absolute", left: 80, top: 96 }}><Tag text="LIVE VIEW / SIMULATED DATA" /></div>
    <Index n={2} />
    <div style={{ position: "absolute", left: 80, top: 190 }}>
      <Title size={62} lines={[["WATCH THE PRICE.", false], ["WATCH THE ORACLE.", true]]} />
      <div style={{ height: 30 }} />
      <Sub>Tokenized-asset price, oracle freshness and your liquidation line, side by side.</Sub>
    </div>
    <div style={{ position: "absolute", left: 60, top: 620, perspective: 1800 }}>
      <div style={{ transformOrigin: "0% 0%", transform: "rotateX(10deg) rotateY(-8deg) scale(0.7)" }}>
        <Terminal t={2.4} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 700, top: 560, padding: "14px 20px", background: CL.lime, color: INK, fontFamily: PIX, fontSize: 24, boxShadow: `8px 8px 0 ${CL.shadow}` }}>
      ● ORACLE STALE
    </div>
    <div style={{ position: "absolute", left: 80, bottom: 80 }}><Footer /></div>
  </AbsoluteFill>
);

/* 3 — Know what backs your position */
const CARDS = [
  ["01 / BUFFER", "COLLATERAL HEALTH", "Understand the distance between your position and its liquidation threshold."],
  ["02 / PRICE", "FRESHNESS CHECKS", "Spot stale oracle prices, issuer events, and changing market conditions."],
  ["03 / CLOSED MARKETS", "LIQUIDITY RISK", "Account for closed exchanges, overnight gaps, and thinner liquidity."],
] as const;

const P3: React.FC = () => (
  <AbsoluteFill>
    <Grid />
    <div style={{ position: "absolute", left: 80, top: 96 }}><Tag text="ONE FOCUSED VIEW / FIRST RELEASE" /></div>
    <Index n={3} />
    <div style={{ position: "absolute", left: 80, top: 190 }}>
      <Title size={68} lines={[["KNOW WHAT BACKS", false], ["YOUR POSITION.", true]]} />
      <div style={{ height: 26 }} />
      <Sub>Read-only monitoring for supported DeFi loans backed by tokenized stocks and ETFs, starting on Algorand.</Sub>
    </div>
    <div style={{ position: "absolute", left: 80, top: 560, display: "flex", flexDirection: "column", gap: 20 }}>
      {CARDS.map(([k, h, d], i) => (
        <div
          key={k}
          style={{
            width: 920,
            padding: "22px 30px",
            boxSizing: "border-box",
            background: CL.evergreen,
            border: `2px solid ${i === 1 ? CL.lime : CL.line}`,
            boxShadow: `10px 10px 0 ${CL.shadow}${i === 1 ? ", 0 0 50px rgba(117,255,0,0.22)" : ""}`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ fontFamily: PIX, fontSize: 18, color: CL.lime }}>{k}</div>
          <div style={{ fontFamily: PIX, fontSize: 32, color: CL.mint, marginTop: 10 }}>{h}</div>
          <div style={{ fontFamily: MONO, fontSize: 22, lineHeight: 1.4, color: CL.sage, marginTop: 8 }}>{d}</div>
          <div style={{ position: "absolute", right: 0, bottom: 0, width: 0, height: 0, borderLeft: "44px solid transparent", borderBottom: `44px solid ${CL.line}` }} />
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 80, bottom: 80 }}><Footer /></div>
  </AbsoluteFill>
);

/* 4 — Four steps */
const STEPS = [
  ["MONITOR", "See supported positions and collateral buffers in one dashboard."],
  ["STRESS TEST", "Explore price drops, stale feeds, and overnight gap scenarios."],
  ["GET ALERTS", "Learn what changed, why it matters, and what to review."],
  ["PREVIEW REPAYMENT", "Review before-and-after impact. You confirm any repayment yourself."],
] as const;

const P4: React.FC = () => (
  <AbsoluteFill>
    <Grid />
    <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, opacity: 0.5 }}>
      {[0, 1, 2, 3].map((i) => {
        const pts: string[] = [];
        for (let y = 0; y <= 1350; y += 15) pts.push(`${960 + Math.sin(y / (150 + i * 30) + i) * (40 + i * 14)},${y}`);
        return <path key={i} d={`M${pts.join(" L")}`} fill="none" stroke={i % 2 ? CL.lime : CL.mint} strokeWidth={2} opacity={0.5} style={{ filter: "drop-shadow(0 0 6px rgba(117,255,0,0.8))" }} />;
      })}
    </svg>
    <div style={{ position: "absolute", left: 80, top: 96 }}><Tag text="SEE IT / UNDERSTAND IT / DECIDE" /></div>
    <Index n={4} />
    <div style={{ position: "absolute", left: 80, top: 190 }}>
      <Title size={64} lines={[["KNOW WHAT", false], ["CHANGED BEFORE", false], ["YOU ACT.", true]]} />
    </div>
    <div style={{ position: "absolute", left: 80, top: 470, width: 800 }}>
      {STEPS.map(([h, d], i) => (
        <div key={h} style={{ display: "flex", gap: 28, padding: "22px 0", borderTop: `2px solid ${i === 0 ? CL.lime : CL.line}` }}>
          <div style={{ fontFamily: PIX, fontSize: 30, color: CL.lime, width: 64 }}>0{i + 1}</div>
          <div>
            <div style={{ fontFamily: PIX, fontSize: 36, color: CL.mint }}>{h}</div>
            <div style={{ fontFamily: MONO, fontSize: 24, lineHeight: 1.4, color: CL.sage, marginTop: 8 }}>{d}</div>
          </div>
        </div>
      ))}
      <div style={{ borderTop: `2px solid ${CL.line}` }} />
    </div>
    <div style={{ position: "absolute", left: 80, bottom: 80 }}><Footer /></div>
  </AbsoluteFill>
);

/* 5 — Add an address to monitor */
const P5: React.FC = () => (
  <AbsoluteFill>
    <Grid />
    <Pixels spots={[[900, 200, 16], [980, 330, 10], [70, 1180, 12]]} />
    <div style={{ position: "absolute", left: 80, top: 96 }}><Tag text="READ-ONLY BETA / ALGORAND TESTNET" /></div>
    <Index n={5} />
    <div style={{ position: "absolute", left: 80, top: 190 }}>
      <Title size={76} lines={[["ADD AN ADDRESS", false], ["TO MONITOR.", true]]} />
      <div style={{ height: 26 }} />
      <Sub>Connect a wallet or paste any Algorand address. We never ask for keys or signatures. This only reads public data.</Sub>
    </div>
    <div style={{ position: "absolute", left: 80, top: 640, width: 920 }}>
      <div style={{ display: "flex", gap: 16 }}>
        <div style={{ flex: 1, padding: "26px 26px", background: "#00241A", border: `2px solid ${CL.line}`, fontFamily: MONO, fontSize: 26, color: CL.sage }}>
          Paste an Algorand address<span style={{ color: CL.lime }}>▍</span>
        </div>
        <div style={{ padding: "26px 34px", background: CL.lime, color: INK, fontFamily: PIX, fontSize: 28, boxShadow: `8px 8px 0 ${CL.shadow}` }}>WATCH</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 22, fontFamily: MONO, fontSize: 22, color: CL.mint }}>
        No wallet handy? Try a sample:
        {["DEMO 1", "DEMO 2", "DEMO 3"].map((d) => (
          <div key={d} style={{ padding: "8px 14px", border: `2px solid ${CL.line}`, fontFamily: PIX, fontSize: 16 }}>{d}</div>
        ))}
      </div>
      <div style={{ marginTop: 40, marginLeft: 380, width: 540, background: "#00241A", border: `2px solid ${CL.lime}`, boxShadow: `10px 10px 0 ${CL.shadow}, 0 0 50px rgba(117,255,0,0.2)` }}>
        <div style={{ padding: "16px 22px", fontFamily: PIX, fontSize: 18, color: CL.lime, borderBottom: `2px solid ${CL.line}` }}>CHOOSE A WALLET</div>
        {["WalletConnect", "Pera", "Defly"].map((w) => (
          <div key={w} style={{ padding: "18px 22px", fontFamily: MONO, fontSize: 26, color: CL.mint, borderBottom: `1px solid ${CL.line}` }}>{w}</div>
        ))}
        <div style={{ padding: "16px 22px", fontFamily: MONO, fontSize: 20, color: CL.sage }}>Read-only. Collatera never asks you to sign or move funds.</div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 80, bottom: 80 }}><Footer /></div>
  </AbsoluteFill>
);

const POSTS = [P1, P2, P3, P4, P5];

export const CollateraPosts: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const P = POSTS[Math.min(frame, POSTS.length - 1)];
  const scale = Math.min(width / 1080, height / 1350);
  return (
    <AbsoluteFill style={{ background: CL.night, justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "relative", width: 1080, height: 1350, flexShrink: 0, overflow: "hidden", transform: `scale(${scale})` }}>
        <P />
      </div>
    </AbsoluteFill>
  );
};
