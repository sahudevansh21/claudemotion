import { Video } from "@remotion/media";
import { Img, interpolate, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, CL, DISPLAY, ez, IO, MONO, OUT, SANS, VERDICTS, type Deployment } from "./brand";

/** Cream paper with a cyan halftone bloom, like the Oryn banner. */
export const Paper: React.FC<{ bloom?: number; dark?: boolean; x?: number; y?: number }> = ({ bloom = 1, dark, x = 50, y = 45 }) => {
  const f = useCurrentFrame();
  const drift = Math.sin(f / 240) * 12;
  return (
    <div style={{ position: "absolute", inset: 0, background: dark ? C.ink : C.cream, overflow: "hidden" }}>
      {!dark && (
        <div
          style={{
            position: "absolute",
            inset: -60,
            opacity: 0.55 * bloom,
            backgroundImage: `radial-gradient(${C.cyan} 38%, transparent 42%)`,
            backgroundSize: "22px 22px",
            backgroundPosition: `${drift}px 0`,
            WebkitMaskImage: `radial-gradient(ellipse 55% 60% at ${x}% ${y}%, #000 0%, transparent 100%)`,
            maskImage: `radial-gradient(ellipse 55% 60% at ${x}% ${y}%, #000 0%, transparent 100%)`,
          }}
        />
      )}
      <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 220px rgba(0,0,0,${dark ? 0.7 : 0.18})` }} />
    </div>
  );
};

/** Slow camera drift wrapper: nothing is ever static. */
export const Drift: React.FC<{ children: React.ReactNode; from?: number; to?: number; dx?: number; dy?: number; len: number; rot?: number }> = ({ children, from = 1, to = 1.06, dx = 0, dy = 0, len, rot = 0 }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, len], [0, 1], { ...CL, easing: IO });
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translate(${dx * t}px, ${dy * t}px) scale(${from + (to - from) * t}) rotate(${rot * t}deg)` }}>{children}</div>
  );
};

/** Word reveal: blur + rise + overshoot-free expo-out. */
export const Word: React.FC<{ children: React.ReactNode; at: number; size: number; color?: string; outline?: boolean; style?: React.CSSProperties }> = ({ children, at, size, color = C.blue, outline, style }) => {
  const f = useCurrentFrame();
  const p = ez(f, at, 26);
  return (
    <div
      style={{
        fontFamily: DISPLAY,
        fontSize: size,
        lineHeight: 0.92,
        letterSpacing: 2,
        textTransform: "uppercase",
        color: outline ? "transparent" : color,
        WebkitTextStroke: outline ? `${Math.max(3, size / 50)}px ${color}` : undefined,
        opacity: p,
        transform: `translateY(${(1 - p) * 70}px) scale(${0.94 + 0.06 * p})`,
        filter: `blur(${(1 - p) * 18}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Mono: React.FC<{ children: React.ReactNode; size?: number; color?: string; at?: number; style?: React.CSSProperties }> = ({ children, size = 22, color = C.ink, at = 0, style }) => {
  const f = useCurrentFrame();
  const p = ez(f, at, 30);
  return (
    <div style={{ fontFamily: MONO, fontSize: size, color, letterSpacing: size * 0.08, textTransform: "uppercase", opacity: p, transform: `translateY(${(1 - p) * 16}px)`, ...style }}>{children}</div>
  );
};

export const Barcode: React.FC<{ w: number; h: number; color?: string; seed?: string; progress?: number }> = ({ w, h, color = C.ink, seed = "b", progress = 1 }) => {
  const n = Math.floor(w / 6);
  return (
    <div style={{ display: "flex", gap: 2, height: h, width: w, alignItems: "stretch", overflow: "hidden" }}>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} style={{ flex: random(`${seed}${i}`) > 0.55 ? 2 : 1, background: color, opacity: i / n < progress ? 1 : 0.15 }} />
      ))}
    </div>
  );
};

/** Hard-shadowed chunky neo-brutalist panel. */
export const Block: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties; shadow?: number; border?: number; radius?: number; bg?: string; borderColor?: string }> = ({ children, style, shadow = 12, border = 5, radius = 22, bg = C.paper, borderColor = C.ink }) => (
  <div style={{ background: bg, border: `${border}px solid ${borderColor}`, borderRadius: radius, boxShadow: `${shadow}px ${shadow}px 0 ${borderColor}`, ...style }}>{children}</div>
);

export const Chip: React.FC<{ status: keyof typeof VERDICTS; size?: number; style?: React.CSSProperties }> = ({ status, size = 22, style }) => {
  const v = VERDICTS[status];
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.4, background: v.chip, color: v.chipFg, fontFamily: MONO, fontWeight: 700, fontSize: size, letterSpacing: size * 0.06, textTransform: "uppercase", padding: `${size * 0.28}px ${size * 0.7}px`, borderRadius: 999, ...style }}>
      <span>{v.glyph}</span>
      <span>{v.label}</span>
    </div>
  );
};

/** One board card, laid out like the real site (ticker, verdict chip, reason, barcode). */
export const VerdictCard: React.FC<{ d: Deployment; w: number; h: number; style?: React.CSSProperties }> = ({ d, w, h, style }) => {
  const v = VERDICTS[d.status];
  const dark = d.status === "divergent" || d.status === "open";
  const sub = dark ? "rgba(255,255,255,0.6)" : "rgba(13,13,15,0.6)";
  const title = d.status === "divergent" ? C.red : d.status === "closed" ? C.blue : d.status === "redemption" ? "#fff" : d.status === "open" ? "#d8f0d0" : d.status === "stale" ? C.blue : C.blue;
  const titleColor = d.status === "pending" ? C.blue : title;
  return (
    <Block bg={v.bg} border={4} radius={20} shadow={10} borderColor={C.ink} style={{ width: w, height: h, padding: 26, boxSizing: "border-box", position: "relative", display: "flex", flexDirection: "column", ...style }}>
      <div style={{ fontFamily: MONO, fontSize: 13, color: sub, letterSpacing: 2, textTransform: "uppercase", display: "flex", justifyContent: "space-between" }}>
        <span>Chain {d.chain}</span>
        {d.status === "divergent" && <span style={{ color: C.red, border: `2px solid ${C.red}`, padding: "1px 8px", transform: "rotate(4deg)", fontWeight: 700 }}>1 mismatch</span>}
      </div>
      <div style={{ fontFamily: DISPLAY, fontSize: 82, lineHeight: 1, color: titleColor, marginTop: 6 }}>{d.sym}</div>
      <div style={{ fontFamily: SANS, fontSize: 15, color: sub, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.name}</div>
      <Chip status={d.status} size={15} style={{ marginTop: 14, alignSelf: "flex-start" }} />
      <div style={{ fontFamily: MONO, fontSize: 13, lineHeight: 1.4, color: d.status === "divergent" ? "#ff6f5a" : v.fg, opacity: 1, marginTop: 12, flex: 1, overflow: "hidden" }}>{d.reason}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 8 }}>
        <div style={{ fontFamily: MONO, fontSize: 13, color: v.fg, fontWeight: 700 }}>{d.next}</div>
        <Barcode w={90} h={34} color={dark ? "rgba(255,255,255,0.8)" : C.ink} seed={d.sym + d.chain} />
      </div>
    </Block>
  );
};

/** A slice of the real screen recording, framed like a browser window. */
export const SiteClip: React.FC<{ fromSec: number; w: number; style?: React.CSSProperties; rate?: number }> = ({ fromSec, w, style, rate = 1 }) => {
  const { fps } = useVideoConfig();
  const h = (w * 1050) / 1920;
  return (
    <Block radius={26} shadow={18} border={6} bg={C.cream} style={{ width: w, overflow: "hidden", ...style }}>
      <div style={{ height: 38, background: C.ink, display: "flex", alignItems: "center", gap: 10, padding: "0 16px" }}>
        {[C.red, C.yellow, C.green].map((c) => (
          <div key={c} style={{ width: 13, height: 13, borderRadius: 99, background: c }} />
        ))}
        <div style={{ marginLeft: 16, flex: 1, height: 22, borderRadius: 99, background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.65)", fontFamily: MONO, fontSize: 12, display: "flex", alignItems: "center", paddingLeft: 14 }}>oryn · state-of-the-asset layer</div>
      </div>
      <Video src={staticFile("oryn/clips/site.mp4")} muted trimBefore={Math.round(fromSec * fps)} playbackRate={rate} style={{ width: w, height: h, display: "block" }} />
    </Block>
  );
};

export const Badge: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <Img src={staticFile("oryn/img/logo.png")} style={{ width: size, height: size, borderRadius: "50%", boxShadow: `0 ${size * 0.05}px ${size * 0.12}px rgba(13,13,15,0.28)`, ...style }} />
);

export { OUT };
