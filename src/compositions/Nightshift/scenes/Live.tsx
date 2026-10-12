import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ETFS, NS, NS_EASE, NS_FONTS } from "../brand";
import { City } from "../components/City";
import { GridCanvas, Mark, StatusLine, typed } from "../components/Ui";
import live from "../live.json";
import { ez, lerp, makeTimeline } from "../timeline";
import { Stack } from "./Act3";

const { cue } = makeTimeline(live);

/** Rails, in the order the brief lists them. Logos from the supplied strip. */
export const PARTNERS = [
  { id: "algorand", name: "Algorand", w: 865, h: 228 },
  { id: "harmonic", name: "Harmonic", w: 948, h: 237 },
  { id: "sentora", name: "Sentora", w: 857, h: 270 },
  { id: "morpho", name: "Morpho", w: 902, h: 187 },
] as const;

/** Logos are sized by width so the four wordmarks read at equal weight. */
const Logo: React.FC<{ p: (typeof PARTNERS)[number]; width: number; style?: React.CSSProperties }> = ({
  p,
  width,
  style,
}) => (
  <Img
    src={staticFile(`nightshift/partners/${p.id}.png`)}
    style={{ width, height: (width * p.h) / p.w, ...style }}
  />
);

const LivePill: React.FC<{ t: number; size?: number }> = ({ t, size = 22 }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size * 0.45,
        padding: `${size * 0.3}px ${size * 0.7}px`,
        borderRadius: size,
        background: NS.mint,
        color: NS.ink,
        fontFamily: NS_FONTS.display,
        fontWeight: 700,
        fontSize: size,
        letterSpacing: 1.5,
        transform: `scale(${t})`,
        boxShadow: `0 0 ${24 * t}px rgba(111,240,194,0.5)`,
      }}
    >
      <div
        style={{
          width: size * 0.45,
          height: size * 0.45,
          borderRadius: size,
          background: NS.ink,
          opacity: 0.45 + 0.55 * Math.abs(Math.cos(f / 6)),
        }}
      />
      LIVE
    </div>
  );
};

/** 1. "MARKETS / CLOSE." over the sleeping city. */
export const CloseShot: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <City cam={{ scale: lerp(f / 60, 1.08, 1.16), x: 0, y: 0 }} />
      <Stack words={["MARKETS", "CLOSE."]} at={[cue("close", "word1"), cue("close", "word2")]} align="left" size={190} />
      <StatusLine text="LIVE · NYSE CLOSED · MON 06:36 ET" style={{ position: "absolute", left: 124, bottom: 110, color: NS.mint }} />
    </AbsoluteFill>
  );
};

/** 2. "PRICES / SHOULD / NOT." — tight on the ticker ring. */
export const ShouldShot: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <City cam={{ scale: lerp(f / 45, 2.0, 2.12), x: -180, y: 520 }} />
      <Stack
        words={["PRICES", "SHOULD", "NOT."]}
        at={[cue("should", "word1"), cue("should", "word2"), cue("should", "word3")]}
        align="right"
        size={180}
      />
    </AbsoluteFill>
  );
};

const CORE: [number, number] = [960, 560];
const SLOTS: [number, number][] = [
  [380, 330],
  [1540, 330],
  [380, 790],
  [1540, 790],
];
const CARD_W = 470;
const CARD_H = 190;

/** Point on a horizontal-tangent cubic from a to b at t. */
const bez = (a: [number, number], b: [number, number], t: number): [number, number] => {
  const dir = Math.sign(b[0] - a[0]) || 1;
  const dx = Math.abs(b[0] - a[0]) * 0.5;
  const c1: [number, number] = [a[0] + dir * dx, a[1]];
  const c2: [number, number] = [b[0] - dir * dx, b[1]];
  const u = 1 - t;
  return [0, 1].map(
    (i) => u * u * u * a[i] + 3 * u * u * t * c1[i] + 3 * u * t * t * c2[i] + t * t * t * b[i],
  ) as [number, number];
};

const LinkWire: React.FC<{ from: [number, number]; to: [number, number]; t: number; flow: number; seed: number }> = ({
  from,
  to,
  t,
  flow,
  seed,
}) => {
  const f = useCurrentFrame();
  const dir = Math.sign(to[0] - from[0]) || 1;
  const dx = Math.abs(to[0] - from[0]) * 0.5;
  const d = `M${from[0]} ${from[1]} C${from[0] + dir * dx} ${from[1]} ${to[0] - dir * dx} ${to[1]} ${to[0]} ${to[1]}`;
  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke={NS.mint}
        strokeWidth={4}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - t}
        opacity={t > 0 ? 0.9 : 0}
        style={{ filter: `drop-shadow(0 0 8px ${NS.glow})` }}
      />
      {flow > 0
        ? [0, 1, 2].map((k) => {
            const p = ((f + seed * 7) / 28 + k / 3) % 1;
            const [x, y] = bez(from, to, p);
            return <circle key={k} cx={x} cy={y} r={7} fill="#E8FFF5" opacity={flow} style={{ filter: `drop-shadow(0 0 10px ${NS.glow})` }} />;
          })
        : null}
    </g>
  );
};

/** 3. The engine core comes online and connects to each rail; each one goes LIVE. */
export const NetworkShot: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const core = spring({ frame: f - cue("network", "core"), fps, config: { damping: 14, stiffness: 140 } });
  const push = ez(f, cue("network", "push"), 30, NS_EASE.inOut);
  const zoom = lerp(f / 180, 1.0, 1.06) * lerp(push, 1, 1.07);
  const ring = ETFS.map((e) => `${e.sym} ${e.price.toFixed(2)} · CONF ${e.conf}`).join("   ·   ") + "   ·   ";
  const wireLen = cue("network", "wire");
  return (
    <GridCanvas pan={[-f * 1.2, -f * 0.4]}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: `${CORE[0]}px ${CORE[1]}px` }}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {PARTNERS.map((p, i) => {
            const at = cue("network", `p${i + 1}`);
            const t = ez(f, at, wireLen, NS_EASE.inOut);
            const left = SLOTS[i][0] < CORE[0];
            const from: [number, number] = [CORE[0] + (left ? -150 : 150), CORE[1] + (SLOTS[i][1] < CORE[1] ? -40 : 40)];
            const to: [number, number] = [SLOTS[i][0] + (left ? CARD_W / 2 : -CARD_W / 2), SLOTS[i][1]];
            return <LinkWire key={p.id} from={from} to={to} t={t} flow={ez(f, at + wireLen, 8)} seed={i} />;
          })}
        </svg>
        {/* Engine core (after the site hero) */}
        <div
          style={{
            position: "absolute",
            left: CORE[0] - 150,
            top: CORE[1] - 150,
            width: 300,
            height: 300,
            borderRadius: 150,
            background: "radial-gradient(circle, #10251E 0%, #070C0A 70%)",
            border: `3px solid rgba(185,245,216,${0.25 + 0.5 * core})`,
            boxShadow: `0 0 ${60 + 80 * push}px rgba(111,240,194,${0.25 + 0.35 * push}), inset 0 0 50px rgba(111,240,194,0.15)`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transform: `scale(${core})`,
          }}
        >
          <Mark size={130} t={core} glow={1 + push} id="live-core" />
        </div>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: core }}>
          <circle cx={CORE[0]} cy={CORE[1]} r={196} fill="none" stroke="rgba(232,160,90,0.45)" strokeWidth={2} strokeDasharray="5 12" strokeDashoffset={-f * 1.5} />
          <path id="live-ring" d={`M${CORE[0] - 176} ${CORE[1]} a176 176 0 1 1 352 0 a176 176 0 1 1 -352 0`} fill="none" />
          <text fontFamily="'JetBrains Mono', monospace" fontSize={17} letterSpacing={2} fill={NS.mint} opacity={0.8}>
            <textPath href="#live-ring" startOffset={`${(f * 0.25) % 50}%`}>
              {ring + ring}
            </textPath>
          </text>
        </svg>
        {PARTNERS.map((p, i) => {
          const at = cue("network", `p${i + 1}`);
          const card = spring({ frame: f - at - 2, fps, config: { damping: 14, stiffness: 180 } });
          const on = spring({ frame: f - at - wireLen, fps, config: { damping: 9, stiffness: 240 } });
          const flash = interpolate(f - at - wireLen, [0, 3, 18], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div
              key={p.id}
              style={{
                position: "absolute",
                left: SLOTS[i][0] - CARD_W / 2,
                top: SLOTS[i][1] - CARD_H / 2,
                width: CARD_W,
                height: CARD_H,
                boxSizing: "border-box",
                borderRadius: 26,
                background: `linear-gradient(160deg, ${NS.panelHi}, ${NS.panel})`,
                border: `2px solid rgba(185,245,216,${0.08 + 0.55 * Math.min(1, on)})`,
                boxShadow: `0 30px 80px rgba(0,0,0,0.55), 0 0 ${30 + 90 * flash}px rgba(111,240,194,${0.12 * on + 0.5 * flash})`,
                opacity: Math.min(1, card * 1.5),
                transform: `scale(${lerp(card, 0.8, 1)})`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 22,
              }}
            >
              <Logo p={p} width={290} style={{ opacity: lerp(Math.min(1, on), 0.45, 1) }} />
              <div style={{ position: "absolute", top: -22, right: 26 }}>
                <LivePill t={Math.min(1.05, on)} />
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
      <StatusLine text="NIGHTSHIFT ENGINE · CONNECTING RAILS" style={{ position: "absolute", left: 120, top: 100 }} />
    </GridCanvas>
  );
};

/** 4. "NOW LIVE ON" + the four rails in a row (beat drop). */
export const LineupShot: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const head = spring({ frame: f - cue("lineup", "head"), fps, config: { damping: 12, stiffness: 200 } });
  return (
    <AbsoluteFill style={{ background: NS.bg }}>
      <AbsoluteFill style={{ opacity: 0.35 }}>
        <City cam={{ scale: lerp(f / 75, 1.25, 1.32), x: 0, y: -120 }} speed={2} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(5,8,7,0.55) 0%, rgba(5,8,7,0.9) 75%)" }} />
      <div
        style={{
          position: "absolute",
          top: 230,
          width: 1920,
          textAlign: "center",
          fontFamily: NS_FONTS.display,
          fontWeight: 800,
          fontSize: 150,
          letterSpacing: -3,
          color: "#FFFFFF",
          transform: `scale(${lerp(head, 1.25, 1)})`,
          opacity: Math.min(1, head * 2),
        }}
      >
        NOW <span style={{ color: NS.mint, textShadow: "0 0 40px rgba(111,240,194,0.45)" }}>LIVE</span> ON
      </div>
      <div style={{ position: "absolute", top: 600, width: 1920, display: "flex", justifyContent: "center", alignItems: "center", gap: 80 }}>
        {PARTNERS.map((p, i) => {
          const t = spring({ frame: f - cue("lineup", "logos") - i * cue("lineup", "step"), fps, config: { damping: 13, stiffness: 200 } });
          return (
            <div key={p.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30, opacity: Math.min(1, t * 1.5), transform: `translateY(${lerp(t, 40, 0)}px)` }}>
              <div style={{ height: 96, display: "flex", alignItems: "center" }}>
                <Logo p={p} width={300} />
              </div>
              <LivePill t={t} size={20} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** 5. End card: mark + wordmark, line, rails strip. */
export const LiveEndShot: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mark = spring({ frame: f - cue("end", "mark"), fps, config: { damping: 14, stiffness: 150 } });
  const word = typed("NIGHTSHIFT", f, cue("end", "word"), 2);
  const line = ez(f, cue("end", "line"), 16);
  const rails = ez(f, cue("end", "rails"), 18);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 42%, rgba(20,70,55,0.6) 0%, ${NS.bg} 55%)` }}>
      <div style={{ position: "absolute", top: 300, width: 1920, display: "flex", justifyContent: "center", alignItems: "center", gap: 40 }}>
        <div style={{ transform: `scale(${lerp(mark, 0.5, 1)})` }}>
          <Mark size={150} t={mark} id="live-end" />
        </div>
        <div style={{ fontFamily: NS_FONTS.word, fontSize: 104, letterSpacing: 12, color: NS.text, textShadow: "0 0 34px rgba(111,240,194,0.4)", width: 930 }}>
          {word}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 530,
          width: 1920,
          textAlign: "center",
          opacity: line,
          transform: `translateY(${lerp(line, 16, 0)}px)`,
          fontFamily: NS_FONTS.display,
          fontWeight: 500,
          fontSize: 56,
          color: NS.text,
          letterSpacing: -1,
        }}
      >
        Markets close. <span style={{ color: NS.mint }}>Prices should not.</span>
      </div>
      <div style={{ position: "absolute", top: 760, width: 1920, display: "flex", flexDirection: "column", alignItems: "center", gap: 28, opacity: rails }}>
        <div style={{ fontFamily: NS_FONTS.mono, fontSize: 22, letterSpacing: 6, color: NS.dim }}>LIVE ON</div>
        <div style={{ display: "flex", gap: 70, alignItems: "center" }}>
          {PARTNERS.map((p) => (
            <Logo key={p.id} p={p} width={180} style={{ opacity: 0.9 }} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
