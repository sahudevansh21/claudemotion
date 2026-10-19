import {
  AbsoluteFill,
  Img,
  interpolate,
  random,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { Easing } from "remotion";
import "../../../config/theme";
import { Mark } from "../components/Ui";
import { NS_FONTS } from "../brand";
import tl from "./launch.json";
import vo from "./vo.json";

/* ------------------------------------------------------------------ */
/* Tokens: the reference's light/dark system in Nightshift's palette     */
/* ------------------------------------------------------------------ */
const L = {
  bg: "#FFFFFF",
  ink: "#111312",
  soft: "#6B716E",
  faint: "#A9AFAC",
  line: "#E7EBE9",
  card: "#FFFFFF",
  green: "#16B37E", // Nightshift mint, deepened for white backgrounds
  greenSoft: "#E4F7EF",
  red: "#E0475B",
  redSoft: "#FBE6E9",
};
const D = { bg: "#050807", ink: "#F2F5F4", soft: "#7F8A86", mint: "#8EF0C6" };
const SANS = "Inter, system-ui, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";
const EASE = Easing.bezier(0.16, 1, 0.3, 1);
const IO = Easing.bezier(0.65, 0, 0.35, 1);
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ez = (f: number, a: number, d: number, e = EASE) => interpolate(f, [a, a + d], [0, 1], { ...CL, easing: e });
const lerp = (t: number, a: number, b: number) => a + (b - a) * t;

const SC = Object.fromEntries(tl.scenes.map((s) => [s.id, s])) as Record<string, { from: number; to: number }>;
const WORDS = tl.words as unknown as Record<string, [string, number][]>;
const sec = (s: number, fps: number) => Math.round(s * fps);

/* ------------------------------------------------------------------ */
/* Word-by-word headline: blur + fade per word (reference effect)        */
/* ------------------------------------------------------------------ */
const Words: React.FC<{
  id: string;
  hi?: string[];
  red?: string[];
  breakAfter?: string[];
  size?: number;
  dark?: boolean;
  align?: "center" | "left";
  style?: React.CSSProperties;
}> = ({ id, hi = [], red = [], breakAfter = [], size = 64, dark, align = "center", style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ink = dark ? D.ink : L.ink;
  const green = dark ? D.mint : L.green;
  return (
    <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: size, letterSpacing: -size * 0.025, lineHeight: 1.12, color: ink, textAlign: align, ...style }}>
      {WORDS[id].map(([w, t], i) => {
        const a = ez(f, t * fps, 7, EASE);
        const c = red.includes(w) ? L.red : hi.includes(w) ? green : ink;
        return (
          <span key={i}>
            <span style={{ display: "inline-block", opacity: a, filter: `blur(${(1 - a) * 10}px)`, color: c, transform: `translateY(${(1 - a) * 6}px)` }}>{w}</span>
            {breakAfter.includes(w) ? <br /> : " "}
          </span>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Dark backgrounds                                                      */
/* ------------------------------------------------------------------ */
const GLYPHS = "0123456789.+-$%()[]{}<>=/SPYQQQGLDIBIT";
/** Sparse drifting market glyphs (the reference's faint code field). */
const GlyphField: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  const f = useCurrentFrame();
  const cols = 64;
  const rows = 26;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity }}>
      {Array.from({ length: cols * rows }, (_, k) => {
        const c = k % cols;
        const r = Math.floor(k / cols);
        const seed = random(`g${k}`);
        if (seed > 0.42) return null;
        const flick = Math.floor((f + seed * 90) / 9);
        const ch = GLYPHS[Math.floor(random(`gc${k}-${flick}`) * GLYPHS.length)];
        const y = (r * 42 + f * (0.4 + seed * 0.6)) % 1100;
        const o = 0.12 + 0.45 * random(`go${k}`) * (0.6 + 0.4 * Math.sin(f / 12 + k));
        return (
          <text key={k} x={c * 30 + 6} y={y} fontFamily={MONO} fontSize={19} fill="#C9D3CF" opacity={o}>
            {ch}
          </text>
        );
      })}
    </svg>
  );
};

/** Radial particle burst (the reference's dark title backdrop). */
const Burst: React.FC<{ grow?: number }> = ({ grow = 1 }) => {
  const f = useCurrentFrame();
  const rays = 22;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: rays }, (_, r) => {
        const ang = (r / rays) * Math.PI * 2 + random(`ra${r}`) * 0.25 + f * 0.0015;
        return Array.from({ length: 70 }, (_, i) => {
          const d = (40 + random(`rd${r}-${i}`) ** 0.7 * 900) * grow;
          const j = (random(`rj${r}-${i}`) - 0.5) * 30;
          const x = 960 + Math.cos(ang) * d - Math.sin(ang) * j;
          const y = 540 + Math.sin(ang) * d + Math.cos(ang) * j;
          return <circle key={`${r}-${i}`} cx={x} cy={y} r={0.8 + random(`rs${r}-${i}`) * 1.3} fill="#DDE6E2" opacity={0.08 + random(`ro${r}-${i}`) * 0.35} />;
        });
      })}
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* Light UI card kit (code-built, Nightshift data)                       */
/* ------------------------------------------------------------------ */
const Card: React.FC<{ x: number; y: number; w: number; h?: number; rot?: number; t?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, w, h, rot = 0, t = 1, children, style }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      padding: "22px 26px",
      boxSizing: "border-box",
      borderRadius: 18,
      background: L.card,
      border: `1px solid ${L.line}`,
      boxShadow: "0 18px 50px rgba(17,19,18,0.08), 0 2px 6px rgba(17,19,18,0.04)",
      transform: `perspective(1400px) rotateY(${rot}deg) translateY(${(1 - t) * 30}px) scale(${0.96 + 0.04 * t})`,
      opacity: t,
      fontFamily: SANS,
      color: L.ink,
      ...style,
    }}
  >
    {children}
  </div>
);

const CardHead: React.FC<{ icon: string; title: string; tag?: string; tagColor?: string }> = ({ icon, title, tag, tagColor = L.green }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
    <div style={{ width: 30, height: 30, borderRadius: 8, background: L.greenSoft, color: L.green, display: "flex", justifyContent: "center", alignItems: "center", fontSize: 16 }}>{icon}</div>
    <div style={{ fontSize: 20, fontWeight: 600 }}>{title}</div>
    {tag ? <div style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 13, color: tagColor }}>{tag}</div> : null}
  </div>
);

const Row: React.FC<{ dot: string; text: string; right?: string; dim?: boolean }> = ({ dot, text, right, dim }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 16, color: dim ? L.faint : L.ink, margin: "8px 0" }}>
    <div style={{ width: 14, height: 14, borderRadius: 7, background: dot }} />
    {text}
    {right ? <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 13, color: L.faint }}>{right}</span> : null}
  </div>
);

/* ------------------------------------------------------------------ */
/* Scenes                                                                */
/* ------------------------------------------------------------------ */
const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const end = sec(SC.intro.to - SC.intro.from, fps);
  // Green particle cluster blooms before the cut to white.
  const cluster = ez(f, end - 22, 18, IO);
  const textOut = 1 - ez(f, end - 26, 10);
  return (
    <AbsoluteFill style={{ background: D.bg }}>
      <GlyphField opacity={1 - cluster * 0.6} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: textOut }}>
        <Words id="intro" dark hi={["future", "opening", "bell."]} breakAfter={["markets"]} size={76} />
      </AbsoluteFill>
      {cluster > 0 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: 260 }, (_, i) => {
            const a = random(`ca${i}`) * Math.PI * 2;
            const r = random(`cr${i}`) ** 0.6 * 260 * (0.3 + cluster);
            return <circle key={i} cx={960 + Math.cos(a) * r * 1.6} cy={560 + Math.sin(a) * r * 0.55} r={1.6} fill={D.mint} opacity={cluster * (0.3 + random(`co${i}`) * 0.7)} />;
          })}
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};

const Cards: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = (i: number) => ez(f, 4 + i * 4, 18);
  const drift = (i: number) => Math.sin(f / 40 + i) * 4;
  const click = sec(0.8, fps);
  const press = interpolate(f, [click, click + 4, click + 10], [0, 1, 0], CL);
  const bars = Array.from({ length: 12 }, (_, i) => 0.35 + 0.6 * (i / 11) * (0.8 + 0.2 * random(`b${i}`)));
  const conf = Math.round(interpolate(f, [10, 60], [64, 99], CL));
  return (
    <AbsoluteFill style={{ background: L.bg }}>
      <Card x={110} y={70 + drift(0)} w={500} rot={8} t={t(0)}>
        <CardHead icon="◷" title="oracle feed" tag="● every minute" />
        <Row dot={L.green} text="SPY fair value  $769.89" right="1m" />
        <Row dot={L.green} text="QQQ fair value  $723.64" right="1m" />
        <Row dot={L.green} text="GLD fair value  $379.99" right="1m" />
        <Row dot={f > 40 ? L.green : L.faint} text="IBIT fair value  $46.52" right="1m" />
      </Card>
      <Card x={130} y={410 + drift(1)} w={480} rot={8} t={t(1)}>
        <CardHead icon="✦" title="stale feed" tag="last close" tagColor={L.faint} />
        <Row dot={L.red} text="SPY frozen at $763.25" right="Fri" />
        <Row dot={L.red} text="Drift vs stale feed  +0.87%" right="now" />
        <div style={{ position: "absolute", left: 120, bottom: -18, transform: `scale(${1 - press * 0.1})` }}>
          <div style={{ padding: "6px 14px", borderRadius: 14, background: L.green, color: "#fff", fontSize: 13, fontWeight: 600, boxShadow: `0 0 0 ${press * 10}px rgba(22,179,126,0.18)` }}>● Nightshift engine</div>
        </div>
      </Card>
      <Card x={150} y={690 + drift(2)} w={470} rot={8} t={t(2)}>
        <CardHead icon="⛨" title="guardian rules" tag="base · demo" tagColor={L.faint} />
        <Row dot={L.green} text="Re-check every loan on each update" />
        <Row dot={L.line} text="Rebalance before liquidation" dim={f < 70} />
        <Row dot={L.line} text="Alert in the app" dim={f < 85} />
      </Card>
      <Card x={1360} y={80 + drift(3)} w={450} rot={-8} t={t(3)}>
        <CardHead icon="!" title="monday gaps" tag="3 open" tagColor={L.red} />
        <Row dot={L.red} text="Weekend news hits at the open" right="2d" />
        <Row dot={L.red} text="Frozen close since Friday" right="64h" />
        <Row dot="#F2B544" text="Visible liquidation levels" right="now" />
      </Card>
      <Card x={1370} y={390 + drift(4)} w={440} rot={-8} t={t(4)}>
        <CardHead icon="◎" title="confidence" tag={`${conf} / 100`} />
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 90 }}>
          {bars.map((b, i) => (
            <div key={i} style={{ flex: 1, height: `${b * 100 * ez(f, 10 + i * 2, 20)}%`, background: L.green, borderRadius: 3, opacity: 0.85 }} />
          ))}
        </div>
      </Card>
      <Card x={1380} y={660 + drift(5)} w={430} rot={-8} t={t(5)}>
        <CardHead icon="↗" title="error vs open" />
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <svg width={220} height={70}>
            <polyline points="0,20 40,32 80,26 120,44 160,50 200,58 220,60" fill="none" stroke="#F2B544" strokeWidth={3} />
          </svg>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 46, fontWeight: 500 }}>5.9<span style={{ fontSize: 22 }}> bps</span></div>
            <div style={{ fontFamily: MONO, fontSize: 13, color: L.green }}>▼ 82% vs frozen close</div>
          </div>
        </div>
      </Card>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <Words id="cards" hi={["prices", "moving"]} breakAfter={["prices"]} size={58} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Waffle of hours across ~6 weeks: red = hours the traditional feed is frozen. */
const Stale: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cols = 60;
  const marker = 36; // engine switched on from this column
  const grow = interpolate(f, [4, 40], [0, cols], CL);
  return (
    <AbsoluteFill style={{ background: L.bg }}>
      <div style={{ position: "absolute", top: 170, width: 1920, textAlign: "center" }}>
        <Words id="stale" red={["stale", "prices."]} size={68} />
      </div>
      <div style={{ position: "absolute", left: 270, top: 380, fontFamily: MONO, fontSize: 15, color: L.soft }}>hours priced per night</div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: cols }, (_, c) => {
          if (c > grow) return null;
          const h = 10 + Math.floor(random(`h${c}`) * 6);
          return Array.from({ length: h }, (_, r) => {
            const frozen = c < marker ? r < 6 + Math.floor(random(`fz${c}`) * 5) * (1 - c / marker) + (c < marker ? 2 : 0) : false;
            const priced = c >= marker && r < 4 + Math.floor(random(`pr${c}`) * 3);
            const fill = frozen ? L.red : priced && c > marker + 18 ? L.green : "#E3E7E5";
            return <rect key={`${c}-${r}`} x={270 + c * 17} y={860 - r * 17} width={13} height={13} rx={2} fill={fill} />;
          });
        })}
        {grow > marker ? (
          <g>
            <line x1={270 + marker * 17 - 3} x2={270 + marker * 17 - 3} y1={500} y2={876} stroke={L.green} strokeWidth={2} />
          </g>
        ) : null}
      </svg>
      {grow > marker ? (
        <div style={{ position: "absolute", left: 270 + marker * 17 + 6, top: 486, padding: "6px 14px", borderRadius: 10, background: L.greenSoft, border: `1px solid ${L.green}`, fontFamily: MONO, fontSize: 14, color: L.ink, opacity: ez(f, 26, 8) }}>
          ● engine on: fair value every minute
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 270, top: 900, fontFamily: MONO, fontSize: 14, color: L.soft }}>
        <span style={{ display: "inline-block", width: 12, height: 12, background: L.red, marginRight: 8 }} />frozen at last close  <span style={{ display: "inline-block", width: 12, height: 12, background: "#E3E7E5", margin: "0 8px 0 24px" }} />market hours
      </div>
      <div style={{ position: "absolute", left: 1330, top: 640, fontFamily: MONO, fontSize: 15, color: L.soft }}>
        frozen hours per week
        <div style={{ fontFamily: SANS, fontSize: 66, marginTop: 10 }}>
          <span style={{ color: L.red }}>135</span>
          <span style={{ color: L.faint, fontSize: 40 }}> → </span>
          <span style={{ color: L.green, opacity: ez(f, sec(0.9, fps), 8) }}>0</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Gaps: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const turn = ez(f, sec(0.55, fps), 22, IO);
  const R = 150;
  const C = 2 * Math.PI * R;
  const ring = interpolate(f, [0, 20], [0.15, 0.62], CL);
  const bps = lerp(turn, 33, 5.9);
  return (
    <AbsoluteFill style={{ background: L.bg }}>
      <div style={{ position: "absolute", left: 380, top: 400 }}>
        <Words id="gaps" hi={["Smaller"]} align="left" size={72} />
      </div>
      <div style={{ position: "absolute", left: 1150, top: 140, width: 400, height: 400 }}>
        <svg width={400} height={400}>
          <circle cx={200} cy={200} r={R} fill="none" stroke={L.line} strokeWidth={14} />
          <circle cx={200} cy={200} r={R} fill="none" stroke={turn > 0.5 ? L.green : L.red} strokeWidth={14} strokeLinecap="round" strokeDasharray={`${C * lerp(turn, ring, 1)} ${C}`} transform="rotate(-90 200 200)" />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", fontFamily: MONO }}>
          <div style={{ fontSize: 24, color: L.ink }}>error vs open</div>
          <div style={{ fontSize: 18, color: turn > 0.5 ? L.green : L.red, marginTop: 6 }}>{turn > 0.5 ? "✓ fair value" : "✕ frozen close"}</div>
        </div>
        <div style={{ position: "absolute", left: 300, top: -20, padding: "6px 14px", borderRadius: 10, background: L.greenSoft, border: `1px solid ${L.green}`, fontFamily: MONO, fontSize: 14, opacity: ez(f, 30, 8) }}>⚡ priced overnight</div>
      </div>
      <Card x={1060} y={640} w={600} t={ez(f, 6, 14)}>
        <div style={{ display: "flex" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, color: L.soft }}>avg error vs next open</div>
            <div style={{ fontSize: 52, fontWeight: 500, color: turn > 0.5 ? L.green : L.red, marginTop: 8 }}>{bps.toFixed(1)}<span style={{ fontSize: 24 }}> bps</span></div>
          </div>
          <div style={{ width: 1, background: L.line, margin: "0 24px" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, color: L.soft }}>vs the frozen close</div>
            <div style={{ fontSize: 52, fontWeight: 500, color: L.green, marginTop: 8, opacity: turn }}>−82%</div>
          </div>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

const Loans: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pick = sec(1.1, fps);
  const sel = ez(f, pick, 10);
  const rows = [
    ["Friday close", "$763.25", "64h old"],
    ["Stale feed", "$763.25", "frozen"],
    ["Nightshift fair value", "$769.89", "1 min · conf 99"],
    ["Delayed quote", "$765.10", "15m+"],
    ["Manual mark", "—", "unknown"],
  ];
  return (
    <AbsoluteFill style={{ background: L.bg }}>
      <div style={{ position: "absolute", left: 150, top: 110 }}>
        <Words id="loans" hi={["Safer"]} breakAfter={["on"]} align="left" size={64} />
      </div>
      <Card x={150} y={500} w={460} t={ez(f, 2, 14)}>
        <CardHead icon="▣" title="Loan collateral" />
        <div style={{ fontSize: 30, fontWeight: 500 }}>10 SPY</div>
        <div style={{ fontFamily: MONO, fontSize: 14, color: L.soft, marginTop: 6 }}>Vault on Base · demo</div>
      </Card>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {rows.map((_, i) => {
          const y = 300 + i * 150 + 60;
          const on = i === 2;
          const t = ez(f, 8 + i * 3, 14);
          return <path key={i} d={`M610 600 C 690 600, 690 ${y}, 770 ${y}`} fill="none" stroke={on && sel > 0 ? L.green : L.line} strokeWidth={on && sel > 0 ? 3 : 2} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - t} />;
        })}
      </svg>
      {rows.map(([name, px, age], i) => {
        const on = i === 2 && sel > 0;
        return (
          <div
            key={name}
            style={{
              position: "absolute",
              left: 770,
              top: 300 + i * 150,
              width: 1000,
              height: 120,
              boxSizing: "border-box",
              padding: "0 30px",
              display: "flex",
              alignItems: "center",
              gap: 22,
              borderRadius: 16,
              background: on ? "#F2FBF7" : L.card,
              border: `${on ? 2 : 1}px solid ${on ? L.green : L.line}`,
              boxShadow: "0 12px 34px rgba(17,19,18,0.06)",
              opacity: ez(f, 8 + i * 3, 14),
              fontFamily: SANS,
            }}
          >
            <div style={{ width: 46, height: 46, borderRadius: 12, background: on ? L.greenSoft : "#F4F6F5", display: "flex", justifyContent: "center", alignItems: "center", color: on ? L.green : L.soft, fontSize: 20 }}>{on ? "✦" : "◷"}</div>
            <div style={{ fontSize: 24, fontWeight: on ? 600 : 400, color: on ? L.ink : L.soft }}>{name}</div>
            {on ? <div style={{ fontFamily: MONO, fontSize: 13, color: L.green, padding: "4px 10px", borderRadius: 10, background: L.greenSoft, opacity: sel }}>● Selected</div> : null}
            <div style={{ marginLeft: "auto", textAlign: "right", fontFamily: MONO }}>
              <div style={{ fontSize: 22, color: on ? L.green : L.ink }}>{px}</div>
              <div style={{ fontSize: 14, color: on ? L.green : L.faint }}>{age}</div>
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", right: 150, bottom: 40, fontFamily: MONO, fontSize: 13, color: L.faint }}>Example · prices from the Oracle page snapshot</div>
    </AbsoluteFill>
  );
};

const NODES = [
  { id: "vault", x: 330, y: 560, title: "Vault", sub: "Borrow USDG against ETF tokens", tag: "live on Base · demo", main: true },
  { id: "guardian", x: 640, y: 380, title: "Guardian", sub: "Re-checks every loan on each update", tag: "" },
  { id: "cloak", x: 1280, y: 380, title: "Cloak", sub: "ZK proofs of solvency", tag: "" },
  { id: "ledger", x: 1590, y: 560, title: "Ledger", sub: "Pre-open calls stamped on Algorand", tag: "" },
  { id: "earn", x: 640, y: 760, title: "Earn", sub: "Idle USDG · Sentora RWA rate", tag: "" },
  { id: "board", x: 1280, y: 760, title: "Leaderboard", sub: "Every wallet, on public chains", tag: "" },
];

const Layer: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const core = ez(f, sec(0.5, fps), 14);
  return (
    <AbsoluteFill style={{ background: L.bg }}>
      <div style={{ position: "absolute", top: 70, width: 1920, display: "flex", justifyContent: "center", alignItems: "center", gap: 12, opacity: ez(f, 2, 10) }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: "#0B1310", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Mark size={26} glow={0} id="layer-mark" />
        </div>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 24 }}>Nightshift</div>
      </div>
      <div style={{ position: "absolute", top: 140, width: 1920 }}>
        <Words id="layer" hi={["Nightshift,", "after-hours"]} breakAfter={["after-hours"]} size={50} />
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <ellipse cx={960} cy={570} rx={660} ry={220} fill="none" stroke={L.line} strokeWidth={2} strokeDasharray="5 8" opacity={core} />
        {NODES.map((n, i) => {
          const t = ez(f, sec(0.8 + i * 0.5, fps), 12);
          return <line key={n.id} x1={960} y1={570} x2={n.x} y2={n.y} stroke={L.line} strokeWidth={2} strokeDasharray="4 7" opacity={t} />;
        })}
      </svg>
      <div style={{ position: "absolute", left: 960 - 170, top: 570 - 52, width: 340, height: 104, borderRadius: 18, background: "#fff", border: `2px solid ${L.green}`, boxShadow: `0 0 0 8px ${L.greenSoft}, 0 20px 50px rgba(17,19,18,0.08)`, display: "flex", alignItems: "center", gap: 16, padding: "0 22px", boxSizing: "border-box", transform: `scale(${0.9 + 0.1 * core})`, opacity: core, fontFamily: SANS }}>
        <div style={{ width: 52, height: 52, borderRadius: 12, background: "#0B1310", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Mark size={32} glow={0.4} id="core-mark" />
        </div>
        <div>
          <div style={{ fontSize: 24, fontWeight: 600 }}>Oracle</div>
          <div style={{ fontSize: 15, color: L.soft }}>Fair value every minute · live</div>
        </div>
      </div>
      {NODES.map((n, i) => {
        const t = ez(f, sec(0.8 + i * 0.5, fps), 12);
        return (
          <div key={n.id} style={{ position: "absolute", left: n.x - 160, top: n.y - 44, width: 320, minHeight: 88, boxSizing: "border-box", padding: "16px 20px", borderRadius: 14, background: "#fff", border: `${n.main ? 2 : 1}px solid ${n.main ? L.green : L.line}`, boxShadow: n.main ? `0 0 0 6px ${L.greenSoft}` : "0 12px 34px rgba(17,19,18,0.06)", opacity: t, transform: `translateY(${(1 - t) * 14}px)`, fontFamily: SANS }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontSize: 20, fontWeight: 600 }}>{n.title}</div>
              {n.tag ? <div style={{ marginLeft: "auto", fontSize: 12, fontFamily: MONO, color: L.green, background: L.greenSoft, padding: "3px 8px", borderRadius: 8 }}>{n.tag}</div> : null}
            </div>
            <div style={{ fontSize: 14, color: L.soft, marginTop: 6 }}>{n.sub}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Meet: React.FC = () => {
  const f = useCurrentFrame();
  const grow = interpolate(f, [0, 70], [0.6, 1.1], CL);
  const word = ez(f, 6, 14);
  const by = ez(f, 26, 14);
  return (
    <AbsoluteFill style={{ background: D.bg }}>
      <Burst grow={grow} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <div style={{ fontFamily: NS_FONTS.word, fontSize: 104, letterSpacing: 10, color: D.ink, opacity: word, filter: `blur(${(1 - word) * 12}px)` }}>NIGHTSHIFT</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 26, opacity: by, fontFamily: SANS, fontSize: 24, color: D.soft }}>
          <Mark size={28} glow={0.6} id="meet-mark" />
          <span style={{ color: D.ink }}>nightshift.buzz</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Product screens with captions, motion-blur zooms and a cursor          */
/* ------------------------------------------------------------------ */
type Shot = { src: string; from: [number, number, number]; to: [number, number, number]; cursor?: [number, number, number, number] };
const SHOTS: Record<string, Shot> = {
  hero: { src: "hero.jpg", from: [1.02, 0, 0], to: [1.18, -80, -40] },
  oracle: { src: "oracle.jpg", from: [1.05, 0, 0], to: [1.12, 0, -40] },
  oracleZoom: { src: "oracle.jpg", from: [1.7, 420, 120], to: [1.85, 470, 110] },
  oracleApi: { src: "oracle.jpg", from: [1.9, -640, -600], to: [2.0, -700, -660] },
  transparency: { src: "transparency.jpg", from: [1.1, 0, 60], to: [1.25, 40, -40] },
  app: { src: "app.jpg", from: [1.05, 0, 0], to: [1.2, 60, -30], cursor: [700, 520, 360, 610] },
  guardian: { src: "guardian.jpg", from: [1.15, 60, 40], to: [1.3, 120, 20] },
  proof: { src: "proof.jpg", from: [1.05, 0, 0], to: [1.2, -60, -60], cursor: [1300, 760, 1380, 850] },
  leaderboard: { src: "leaderboard.jpg", from: [1.05, 0, 0], to: [1.18, 0, -40] },
};

const ScreenShot: React.FC<{ shot: Shot; len: number }> = ({ shot, len }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, len], [0, 1], { ...CL, easing: IO });
  const s = lerp(t, shot.from[0], shot.to[0]);
  const x = lerp(t, shot.from[1], shot.to[1]);
  const y = lerp(t, shot.from[2], shot.to[2]);
  const blurIn = interpolate(f, [0, 8], [14, 0], CL);
  const cur = shot.cursor;
  const ct = ez(f, 6, Math.max(10, len - 22), IO);
  const press = cur ? interpolate(f, [len - 14, len - 10, len - 4], [0, 1, 0], CL) : 0;
  return (
    <div style={{ position: "absolute", left: 160, top: 170, width: 1600, height: 1000, borderRadius: 18, overflow: "hidden", boxShadow: "0 40px 100px rgba(17,19,18,0.18), 0 0 0 1px rgba(17,19,18,0.06)", background: "#0B0F0D" }}>
      <Img src={staticFile(`nightshift/site/${shot.src}`)} style={{ width: 1600, height: 1000, transform: `translate(${x}px, ${y}px) scale(${s})`, transformOrigin: "50% 40%", filter: `blur(${blurIn}px)` }} />
      {cur ? (
        <div style={{ position: "absolute", left: lerp(ct, cur[0], cur[2]), top: lerp(ct, cur[1], cur[3]), transform: `scale(${1 - press * 0.15})` }}>
          <svg width={30} height={34} viewBox="0 0 30 34"><path d="M3 3 L27 14 L16 17 L11 30 Z" fill="#fff" stroke="#111" strokeWidth={2} strokeLinejoin="round" /></svg>
          <div style={{ position: "absolute", left: 22, top: 26, padding: "5px 12px", borderRadius: 12, background: "#2F6BFF", color: "#fff", fontFamily: SANS, fontSize: 14, fontWeight: 600, boxShadow: `0 0 0 ${press * 10}px rgba(47,107,255,0.2)` }}>you</div>
        </div>
      ) : null}
    </div>
  );
};

const Screens: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const base = SC.screens.from;
  const caps = tl.captions;
  return (
    <AbsoluteFill style={{ background: "#FAFBFA" }}>
      {caps.map((c, i) => {
        const from = sec(c.at - base, fps);
        const to = i + 1 < caps.length ? sec(caps[i + 1].at - base, fps) : sec(SC.screens.to - base, fps);
        if (f < from || f >= to) return null;
        const lf = f - from;
        const cap = ez(lf, 0, 10);
        return (
          <AbsoluteFill key={c.text}>
            <div style={{ position: "absolute", top: 62, width: 1920, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 52, letterSpacing: -1.2, color: L.ink, opacity: cap, filter: `blur(${(1 - cap) * 8}px)` }}>{c.text}</div>
            <Sequence from={from} durationInFrames={to - from} premountFor={fps}>
              <ScreenShot shot={SHOTS[c.shot]} len={to - from} />
            </Sequence>
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

const End: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const word = ez(f, 6, 14);
  const by = ez(f, 18, 12);
  const cmd = "open nightshift.buzz";
  const typeStart = sec(1.0, fps);
  const n = Math.max(0, Math.min(cmd.length, Math.floor((f - typeStart) / 1.8)));
  const pill = ez(f, typeStart - 8, 10);
  const tags = [["Live", 35.4], ["Proven", 35.95], ["On the record", 36.55]] as const;
  const out = interpolate(f, [sec(5.3, fps), sec(5.8, fps)], [1, 0], CL);
  return (
    <AbsoluteFill style={{ background: D.bg, opacity: out }}>
      <Burst grow={interpolate(f, [0, 170], [0.8, 1.15], CL)} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", transform: "translateY(-60px)" }}>
        <div style={{ fontFamily: NS_FONTS.word, fontSize: 96, letterSpacing: 10, color: D.ink, opacity: word, filter: `blur(${(1 - word) * 12}px)` }}>NIGHTSHIFT</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 18, opacity: by, fontFamily: SANS, fontSize: 22, color: D.soft }}>
          <Mark size={26} glow={0.6} id="end-mark2" /> <span>Tokenized ETFs, priced after the bell</span>
        </div>
        <div style={{ marginTop: 44, padding: "16px 26px", borderRadius: 14, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", fontFamily: MONO, fontSize: 34, color: D.ink, opacity: pill, display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ color: D.soft }}>$</span>
          {cmd.slice(0, n)}
          <span style={{ display: "inline-block", width: 18, height: 38, background: D.mint, opacity: Math.floor(f / 10) % 2 ? 0.4 : 1 }} />
        </div>
        <div style={{ display: "flex", gap: 22, marginTop: 34, fontFamily: SANS, fontSize: 40, fontWeight: 500 }}>
          {tags.map(([t, at], i) => {
            const a = ez(f, sec(at - SC.end.from, fps), 8);
            return (
              <span key={t} style={{ opacity: a, filter: `blur(${(1 - a) * 8}px)`, color: i === 2 ? D.mint : D.ink }}>
                {t}
                {i < 2 ? <span style={{ color: D.soft, marginLeft: 22 }}>·</span> : null}
              </span>
            );
          })}
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", bottom: 60, width: 1920, textAlign: "center", fontFamily: MONO, fontSize: 15, letterSpacing: 2, color: "rgba(242,245,244,0.4)", opacity: ez(f, sec(3.2, fps), 12) }}>
        LIVE PRICES + PAPER-TRADING DEMO · NIGHTSHIFT DOESN’T SELL TOKENS. BUY THEM FROM A REGULATED PROVIDER.
      </div>
    </AbsoluteFill>
  );
};

const SCENES: Record<string, React.FC> = { intro: Intro, cards: Cards, stale: Stale, gaps: Gaps, loans: Loans, layer: Layer, meet: Meet, screens: Screens, end: End };

/** NIGHTSHIFT launch film — the supplied reference's structure, timing, effects and VO rhythm, rebuilt for Nightshift. */
export const NightshiftLaunchFilm: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {tl.scenes.map((s) => {
        const C = SCENES[s.id];
        return (
          <Sequence key={s.id} name={s.id} from={sec(s.from, fps)} durationInFrames={sec(s.to, fps) - sec(s.from, fps)} premountFor={fps}>
            <C />
          </Sequence>
        );
      })}
      {Object.entries(vo).map(([id, v]) => (
        <Sequence key={id} name={`vo-${id}`} from={sec(v.at, fps)} durationInFrames={Math.ceil(v.seconds * fps) + 2} premountFor={fps}>
          <Audio src={staticFile(`nightshift/launch-vo/${id}.wav`)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

