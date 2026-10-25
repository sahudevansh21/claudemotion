import { Audio } from "@remotion/media";
import { AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { AL, AL_FONTS } from "../Allocra/brand";
import { CL, ez, IO } from "../Oryn/brand";
import { Cursor, Reveal, Swap, Typed, bgFrom, cueOf, lenOf, path, pulse, type Tl, Drift } from "../Oryn/motion";

export { Cursor, Reveal, Swap, Typed, bgFrom, cueOf, lenOf, path, pulse, Drift, ez, IO, CL, AL, AL_FONTS };
export type { Tl };

/** Allocra content kit: 1080x1920 vertical design canvas, vermilion / old-master palette, reference-film motion only. */
export const VW = 1080;
export const VH = 1920;
export const P = { red: AL.red, dark: AL.ui, panel: AL.uiPanel, line: AL.uiLine, cream: AL.cream, dim: AL.creamDim, accent: AL.accent, green: AL.green, black: AL.black };

export const serif = (size: number, color: string = P.cream, extra: React.CSSProperties = {}): React.CSSProperties => ({ fontFamily: AL_FONTS.serif, fontSize: size, lineHeight: 0.98, letterSpacing: -size * 0.025, color, ...extra });
export const mono = (size = 22, color: string = P.dim, extra: React.CSSProperties = {}): React.CSSProperties => ({ fontFamily: AL_FONTS.mono, fontSize: size, letterSpacing: size * 0.18, textTransform: "uppercase", color, ...extra });
export const sans = (size = 34, color: string = P.cream, extra: React.CSSProperties = {}): React.CSSProperties => ({ fontFamily: AL_FONTS.sans, fontSize: size, lineHeight: 1.3, color, ...extra });

export const VStage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { width } = useVideoConfig();
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: 0, width: VW, height: VH, transform: `scale(${width / VW})`, transformOrigin: "0 0", overflow: "hidden" }}>{children}</div>
    </AbsoluteFill>
  );
};

/** Fine grid + soft vignette, like the site. */
export const Grid: React.FC<{ o?: number }> = ({ o = 0.06 }) => (
  <>
    <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(246,218,195,${o}) 1px, transparent 1px), linear-gradient(90deg, rgba(246,218,195,${o}) 1px, transparent 1px)`, backgroundSize: "36px 36px" }} />
    <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 260px rgba(0,0,0,0.35)" }} />
  </>
);

export const Film: React.FC<{ tl: Tl; scenes: Record<string, React.FC>; bg: (f: number) => string; audio: string }> = ({ tl, scenes, bg, audio }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: bg(f) }}>
      <VStage>
        <Grid />
        {tl.scenes.map((s) => {
          const S = scenes[s.id];
          return (
            <Sequence key={s.id} name={s.id} from={s.start} durationInFrames={s.end - s.start + 14} premountFor={60}>
              <S />
            </Sequence>
          );
        })}
      </VStage>
      <Audio src={staticFile(audio)} />
    </AbsoluteFill>
  );
};

export const Logo: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <Img src={staticFile("allocra/content/logo.png")} style={{ width: size, height: size, borderRadius: size * 0.22, boxShadow: "0 24px 60px rgba(0,0,0,0.4)", ...style }} />
);

export const Preview: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <div style={{ ...mono(20, P.cream), display: "flex", alignItems: "center", gap: 10, ...style }}>
    <span style={{ width: 12, height: 12, borderRadius: 99, background: P.green, display: "inline-block" }} />Preview
  </div>
);

/** Allocation slate from the site (US equity 55 / International 25 / US bonds 20). Fixed 900x1040 layout so cursor targets are exact. */
export const SLATE_W = 900;
export const SLATE_H = 1040;
/** Slider track x-range and y, tab centres (relative to the slate's top-left). */
export const SLATE_SLIDER = { x0: 48, x1: 852, y: 682 };
export const SLATE_TAB_Y = 935;
export const slateTabX = (i: number) => 48 + (804 - 28) / 3 * (i + 0.5) + 14 * i;

export const Slate: React.FC<{ p?: number; metrics?: number; monthly?: number; tab?: number }> = ({ p = 1, metrics = 1, monthly = 1, tab = 1 }) => {
  const slices = [{ k: "US equity", v: 55 }, { k: "International equity", v: 25 }, { k: "US bonds", v: 20 }];
  const R = 134, C2 = 2 * Math.PI * R;
  let acc = 0;
  const amount = Math.round(1200 * monthly);
  const hx = SLATE_SLIDER.x0 + (SLATE_SLIDER.x1 - SLATE_SLIDER.x0) * 0.46 * monthly;
  const abs = (t: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 48, right: 48, top: t, ...extra });
  return (
    <div style={{ position: "relative", width: SLATE_W, height: SLATE_H, background: "rgba(61,24,18,0.92)", border: "2px solid rgba(246,218,195,0.35)", boxShadow: "0 50px 120px rgba(0,0,0,0.5)" }}>
      <div style={abs(42, { display: "flex", justifyContent: "space-between", alignItems: "center" })}>
        <div style={mono(19, P.cream)}>Allocation slate / draft</div>
        <Preview />
      </div>
      <div style={abs(88, serif(88, P.cream))}>Core allocation</div>
      <svg style={{ position: "absolute", left: 48, top: 214 }} width={340} height={340} viewBox="0 0 340 340">
        <g transform="translate(170 170) rotate(-90)">
          <circle r={R} fill="none" stroke="rgba(246,218,195,0.14)" strokeWidth={56} />
          {slices.map((sl, i) => {
            const len = (sl.v / 100) * C2 * p;
            const col = i === 0 ? P.cream : i === 1 ? P.accent : "rgba(246,218,195,0.5)";
            const el = <circle key={i} r={R} fill="none" stroke={col} strokeWidth={56} strokeDasharray={`${Math.max(0, len - 3)} ${C2}`} strokeDashoffset={(-acc * C2 * p) / 100} />;
            acc += sl.v;
            return el;
          })}
        </g>
        <text x={170} y={182} textAnchor="middle" style={{ fontFamily: AL_FONTS.mono, fontSize: 28, fill: P.cream, letterSpacing: 2 }}>3 ETFs</text>
      </svg>
      <div style={{ position: "absolute", left: 430, right: 48, top: 262 }}>
        {slices.map((sl, i) => (
          <div key={sl.k} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", ...sans(30, P.cream), height: 78, opacity: ez(p * 100, 10 + i * 12, 20) }}>
            <span>{sl.k}</span><span style={{ fontFamily: AL_FONTS.mono, fontSize: 32 }}>{sl.v}%</span>
          </div>
        ))}
      </div>
      <div style={abs(590, { borderTop: "1px solid rgba(246,218,195,0.25)", paddingTop: 26, display: "flex", justifyContent: "space-between", ...mono(21, P.cream) })}>
        <span>Monthly purchase</span><span>${amount.toLocaleString("en-US")}</span>
      </div>
      <div style={{ position: "absolute", left: SLATE_SLIDER.x0, width: SLATE_SLIDER.x1 - SLATE_SLIDER.x0, top: SLATE_SLIDER.y - 2, height: 4, background: "rgba(246,218,195,0.3)" }} />
      <div style={{ position: "absolute", left: SLATE_SLIDER.x0, width: hx - SLATE_SLIDER.x0, top: SLATE_SLIDER.y - 2, height: 4, background: P.cream }} />
      <div style={{ position: "absolute", left: hx - 14, top: SLATE_SLIDER.y - 14, width: 28, height: 28, borderRadius: 99, background: P.accent, border: `3px solid ${P.cream}` }} />
      <div style={abs(752, { opacity: metrics, borderTop: "1px solid rgba(246,218,195,0.25)", paddingTop: 26, display: "flex", justifyContent: "space-between" })}>
        {[["Issuer tilt", "High"], ["Overlap", "0%"], ["Est. cost / yr", "$0.50"]].map(([k, v]) => (
          <div key={k}>
            <div style={mono(16, P.dim)}>{k}</div>
            <div style={{ fontFamily: AL_FONTS.mono, fontSize: 40, color: P.cream, marginTop: 10 }}>{v}</div>
          </div>
        ))}
      </div>
      {["Income", "Core", "Growth"].map((t, i) => (
        <div key={t} style={{ position: "absolute", top: 900, height: 70, left: 48 + i * ((804 - 28) / 3 + 14), width: (804 - 28) / 3, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(246,218,195,0.35)", background: i === tab ? P.cream : "transparent", ...mono(19, i === tab ? "#3d1812" : P.dim) }}>{t}</div>
      ))}
    </div>
  );
};

/** Painting in the site's thin-bordered frame, with serif caption + mono sub. */
export const Painting: React.FC<{ src: string; w: number; h: number; title?: string; sub?: string; zoom?: number; style?: React.CSSProperties }> = ({ src, w, h, title, sub, zoom = 1, style }) => (
  <div style={{ width: w, border: "1px solid rgba(246,218,195,0.35)", padding: 16, boxSizing: "border-box", background: "rgba(0,0,0,0.18)", ...style }}>
    <div style={{ width: "100%", height: h, overflow: "hidden" }}>
      <Img src={staticFile(`allocra/content/${src}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})` }} />
    </div>
    {title && <div style={serif(46, P.cream, { marginTop: 18 })}>{title}</div>}
    {sub && <div style={mono(17, P.dim, { marginTop: 8 })}>{sub}</div>}
  </div>
);

export const EndCardA: React.FC<{ line: React.ReactNode; n: number; url?: boolean; at?: number }> = ({ line, n, url = true, at = 14 }) => {
  const f = useCurrentFrame();
  const p = ez(f, at, 40);
  return (
    <Drift n={n} from={1} to={1.03}>
      <div style={{ position: "absolute", left: VW / 2 - 130, top: 560, opacity: p, filter: `blur(${(1 - p) * 18}px)`, transform: `scale(${0.88 + 0.12 * p})` }}><Logo size={260} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 880, textAlign: "center", ...sans(54, P.cream, { fontWeight: 500, letterSpacing: -1 }), opacity: p }}>Allocra</div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 990, textAlign: "center" }}>
        <Reveal at={at + 50} style={serif(78, P.cream, { textAlign: "center" })}>{line}</Reveal>
      </div>
      {url && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1290, textAlign: "center", ...mono(26, P.cream) }}>
          <Typed text="allocra.buzz" at={at + 110} cps={14} color={P.cream} />
        </div>
      )}
      <div style={{ position: "absolute", left: 80, right: 80, bottom: 120, textAlign: "center", ...mono(14, "rgba(246,218,195,0.55)", { letterSpacing: 3, lineHeight: 1.6 }) }}>
        <Reveal at={at + 150}>Assets remain individually held · Preview / TestNet demo · Not investment advice</Reveal>
      </div>
    </Drift>
  );
};

export { interpolate };
