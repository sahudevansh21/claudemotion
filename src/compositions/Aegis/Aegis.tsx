import { loadFont } from "@remotion/fonts";
import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import "../../config/theme";
import tl from "./aegis.json";

loadFont({ family: "Instrument Serif", url: staticFile("polymate/fonts/InstrumentSerif-Italic-latin.woff2"), weight: "400", style: "italic" });

/** AegisNet palette: pure black, white type, grey italics, status pills. */
const A = { bg: "#030303", ink: "#F4F4F4", soft: "#9A9A9A", faint: "#5C5C5C", line: "rgba(255,255,255,0.12)", green: "#4ADE80", amber: "#F5B544", red: "#F87171" };
const SANS = "Inter, system-ui, sans-serif";
const SERIF = "'Instrument Serif', Georgia, serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const IO = Easing.bezier(0.65, 0, 0.35, 1);
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ez = (f: number, a: number, d: number, e = OUT) => interpolate(f, [a, a + d], [0, 1], { ...CL, easing: e });
const sec = (s: number, fps: number) => Math.round(s * fps);

/* --------------------------------- mark -------------------------------- */
/** AegisNet mark: two rounded slanted bars, a dot above the first, below the second. */
export const AegisMark: React.FC<{ size: number; color?: string; glow?: number }> = ({ size, color = A.ink, glow = 0 }) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 50 40" style={{ overflow: "visible", filter: glow ? `drop-shadow(0 0 ${size * 0.08 * glow}px rgba(255,255,255,0.6))` : undefined }}>
    <g stroke={color} strokeWidth={7} strokeLinecap="round" fill={color}>
      <line x1={11.5} y1={17.5} x2={21.5} y2={33.5} />
      <line x1={26.5} y1={7} x2={36.5} y2={23} />
      <circle cx={8} cy={11} r={3.2} stroke="none" />
      <circle cx={39.5} cy={29.5} r={3.2} stroke="none" />
    </g>
  </svg>
);

/* ------------------------- particle wave (site hero) -------------------- */
const Wave: React.FC<{ opacity?: number; spread?: number }> = ({ opacity = 1, spread = 1 }) => {
  const f = useCurrentFrame();
  const N = 2600;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity }}>
      <defs>
        <radialGradient id="aeg-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="rgba(255,255,255,0.10)" />
          <stop offset="1" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <ellipse cx={960} cy={540} rx={900} ry={360} fill="url(#aeg-glow)" />
      {Array.from({ length: N }, (_, i) => {
        const u = random(`u${i}`);
        const v = random(`v${i}`) - 0.5;
        const x = -100 + u * 2120;
        const phase = u * Math.PI * 2.2 + f * 0.025;
        const thick = (0.25 + 0.75 * Math.abs(Math.sin(u * Math.PI * 1.6 + 0.6))) * 260 * spread;
        const y = 540 + Math.sin(phase) * 170 + v * thick + Math.cos(phase * 0.5 + 1) * 40;
        const edge = 1 - Math.abs(v) * 1.6;
        const o = Math.max(0, edge) * (0.25 + 0.75 * random(`o${i}`)) * (0.5 + 0.5 * Math.cos(phase - 1.2));
        return <circle key={i} cx={x} cy={y} r={0.7 + random(`r${i}`) * 1.4} fill="#EDEDED" opacity={o} />;
      })}
    </svg>
  );
};

/* ------------------------------ title cards ----------------------------- */
const Backdrop: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 55%, #1A1A1A 0%, ${A.bg} 62%)` }}>
    <Wave opacity={0.28} spread={0.8} />
    {children}
  </AbsoluteFill>
);

/** Display line: Inter + one italic serif accent. Fades in from a soft blur (reference). */
const Line: React.FC<{ parts: [string, boolean][]; t: number; size?: number; style?: React.CSSProperties }> = ({ parts, t, size = 120, style }) => (
  <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: size, letterSpacing: -size * 0.035, lineHeight: 1.04, color: A.ink, opacity: t, filter: `blur(${(1 - t) * 14}px)`, transform: `translateY(${(1 - t) * 16}px)`, whiteSpace: "nowrap", ...style }}>
    {parts.map(([s, it], i) =>
      it ? (
        <span key={i} style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, color: "#C9C9C9", letterSpacing: 0 }}>{s}</span>
      ) : (
        <span key={i}>{s}</span>
      ),
    )}
  </div>
);

const Label: React.FC<{ text: string; t: number }> = ({ text, t }) => (
  <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 6, color: A.soft, opacity: t, marginBottom: 26 }}>{text}</div>
);

const Chip: React.FC<{ children: React.ReactNode; t?: number; style?: React.CSSProperties }> = ({ children, t = 1, style }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 16px", borderRadius: 10, border: `1px solid ${A.line}`, background: "rgba(255,255,255,0.04)", fontFamily: MONO, fontSize: 24, color: A.ink, opacity: t, ...style }}>{children}</span>
);

const Rings: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => {
  const f = useCurrentFrame();
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {[0, 1, 2].map((k) => {
        const p = ((f / 45 + k / 3) % 1);
        return <circle key={k} cx={x} cy={y} r={70 + p * 120} fill="none" stroke="#FFFFFF" strokeWidth={1.5} opacity={(1 - p) * 0.35 * t} />;
      })}
    </svg>
  );
};

const TMeet: React.FC = () => {
  const f = useCurrentFrame();
  const t = ez(f, 4, 16);
  const m = ez(f, 12, 18);
  return (
    <Backdrop>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <Label text="AGENTIC DEFI INFRASTRUCTURE" t={ez(f, 0, 12)} />
        <div style={{ display: "flex", alignItems: "center", gap: 44 }}>
          <Line parts={[["Meet ", false], ["AegisNet.", true]]} t={t} size={150} />
          <div style={{ opacity: m, transform: `scale(${0.6 + 0.4 * m}) rotate(${(1 - m) * -20}deg)` }}>
            <AegisMark size={130} glow={1} />
          </div>
        </div>
      </AbsoluteFill>
    </Backdrop>
  );
};

const TIdentity: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const name = "agent1.aegisnet.eth";
  const ts = sec(0.9, fps);
  const n = Math.max(0, Math.min(name.length, Math.floor((f - ts) / 1.5)));
  const m = ez(f, 8, 16);
  return (
    <Backdrop>
      <Rings x={1500} y={540} t={m} />
      <div style={{ position: "absolute", left: 220, top: 430 }}>
        <Line parts={[["Every agent, an ", false], ["identity.", true]]} t={ez(f, 2, 14)} size={104} />
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 30, fontFamily: SANS, fontSize: 30, color: A.soft, opacity: ez(f, 14, 12) }}>
          bound to
          <Chip>
            {name.slice(0, n)}
            <span style={{ display: "inline-block", width: 12, height: 26, background: A.ink, opacity: Math.floor(f / 8) % 2 ? 0.3 : 1 }} />
          </Chip>
        </div>
        <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 2, color: A.faint, marginTop: 22, opacity: ez(f, sec(1.9, fps), 10) }}>whitelist · daily limit · threshold</div>
      </div>
      <div style={{ position: "absolute", left: 1500 - 85, top: 540 - 85, width: 170, height: 170, borderRadius: 85, border: `1.5px solid ${A.line}`, background: "radial-gradient(circle, #1C1C1C, #0A0A0A)", display: "flex", justifyContent: "center", alignItems: "center", opacity: m, transform: `scale(${0.7 + 0.3 * m})`, boxShadow: "0 0 80px rgba(255,255,255,0.08)" }}>
        <AegisMark size={92} glow={0.8} />
      </div>
    </Backdrop>
  );
};

const TTrades: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rows: { parts: [string, boolean][]; chip: string; color: string }[] = [
    { parts: [["small ones ", false], ["run.", true]], chip: "$250 swap → limits OK → executed", color: A.green },
    { parts: [["big ones ", false], ["wait.", true]], chip: "$25,000 swap → over threshold → Midnight ZK", color: A.amber },
    { parts: [["rogue ones ", false], ["stop.", true]], chip: "rogue call → not whitelisted → rejected", color: A.red },
  ];
  const idx = Math.min(2, Math.floor(f / fps));
  const local = f - idx * fps;
  const r = rows[idx];
  return (
    <Backdrop>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <Line parts={[["Every trade,", false]]} t={ez(f, 2, 12)} size={116} />
        <Line key={idx} parts={r.parts} t={ez(local, 0, 10)} size={116} />
        <div style={{ marginTop: 40, opacity: ez(local, 6, 10) }}>
          <Chip>
            <span style={{ width: 10, height: 10, borderRadius: 5, background: r.color, boxShadow: `0 0 10px ${r.color}` }} />
            {r.chip}
          </Chip>
        </div>
      </AbsoluteFill>
    </Backdrop>
  );
};

const THuman: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const prove = ez(f, sec(0.9, fps), sec(0.95, fps), (x) => x);
  const done = f > sec(1.9, fps);
  return (
    <Backdrop>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <Line parts={[["A ", false], ["human", true], [" on the big calls.", false]]} t={ez(f, 2, 14)} size={112} />
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 44, opacity: ez(f, 12, 12) }}>
          <Chip>≥ $1,000</Chip>
          <span style={{ fontFamily: MONO, color: A.faint, fontSize: 24 }}>→</span>
          <Chip>Midnight ZK gate</Chip>
          <div style={{ display: "flex", alignItems: "center", gap: 5, height: 40, marginLeft: 10 }}>
            {Array.from({ length: 24 }, (_, i) => {
              const on = i / 24 < prove;
              const h = 10 + Math.abs(Math.sin(i * 1.7 + f / 4)) * 26 * (on && !done ? 1 : 0.35);
              return <div key={i} style={{ width: 5, height: h, borderRadius: 3, background: on ? (done ? A.green : A.ink) : A.faint }} />;
            })}
          </div>
        </div>
        <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 2, color: done ? A.green : A.faint, marginTop: 26, opacity: ez(f, 24, 10) }}>
          {done ? "✓ cleared · nullifier committed" : "waiting for the owner's proof…"}
        </div>
      </AbsoluteFill>
    </Backdrop>
  );
};

const TGuardrails: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Backdrop>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, opacity: ez(f, 0, 12), marginBottom: 30 }}>
          <AegisMark size={64} glow={0.6} />
          <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 44, color: A.ink, letterSpacing: -1 }}>AegisNet</span>
        </div>
        <Line parts={[["Give your first agent ", false], ["guardrails.", true]]} t={ez(f, 6, 14)} size={100} />
        <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 2, color: A.soft, marginTop: 34, opacity: ez(f, 20, 12) }}>
          5 contracts live on Sepolia · ENS · Midnight · 1inch · Uniswap
        </div>
      </AbsoluteFill>
    </Backdrop>
  );
};

const LogoEnd: React.FC = () => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const m = ez(f, 2, 26);
  const w = ez(f, 18, 20);
  const out = interpolate(f, [durationInFrames - 14, durationInFrames - 1], [1, 0], CL);
  return (
    <AbsoluteFill style={{ background: "#000", justifyContent: "center", alignItems: "center", flexDirection: "column", opacity: out }}>
      <div style={{ opacity: m, transform: `scale(${0.82 + 0.18 * m + f * 0.0006})`, filter: `blur(${(1 - m) * 10}px)` }}>
        <AegisMark size={260} glow={1.4} />
      </div>
      <div style={{ marginTop: 50, fontFamily: SANS, fontWeight: 500, fontSize: 40, letterSpacing: 22, marginRight: -22, color: A.ink, opacity: w }}>AEGISNET</div>
      <div style={{ marginTop: 18, fontFamily: MONO, fontSize: 18, letterSpacing: 4, color: A.faint, opacity: ez(f, sec(1.3, fps), 14) }}>aegisnet.solrun.fun</div>
    </AbsoluteFill>
  );
};

/* -------------------------------- clips --------------------------------- */
const Clip: React.FC<{ name: string; len: number; seed: number }> = ({ name, len, seed }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, len], [0, 1], { ...CL, easing: IO });
  const z = 1.06 + 0.1 * t;
  const dx = (random(`cx${seed}`) - 0.5) * 80 * t;
  const dy = (random(`cy${seed}`) - 0.5) * 50 * t;
  const inT = ez(f, 0, 8);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${dx}px, ${dy}px) scale(${z * (1.04 - 0.04 * inT)})`, filter: `blur(${(1 - inT) * 10}px)`, opacity: 0.4 + 0.6 * inT }}>
        <Video src={staticFile(`aegis/clips/${name}.mp4`)} muted style={{ width: 1920, height: 1056, marginTop: 12 }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(0,0,0,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};

const TITLES: Record<string, React.FC> = { "t-meet": TMeet, "t-identity": TIdentity, "t-trades": TTrades, "t-human": THuman, "t-guardrails": TGuardrails, logo: LogoEnd };

export const AegisLaunchFilm: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {tl.scenes.map((s, i) => {
        const from = sec(s.from, fps);
        const len = sec(s.to, fps) - from;
        const T = TITLES[s.id];
        return (
          <Sequence key={s.id} name={s.id} from={from} durationInFrames={len} premountFor={fps}>
            {"clip" in s && s.clip ? <Clip name={s.clip} len={len} seed={i} /> : <T />}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
