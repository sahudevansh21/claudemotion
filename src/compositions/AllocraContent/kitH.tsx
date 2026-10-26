import { Audio } from "@remotion/media";
import { AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { AL_FONTS, Cursor, Drift, Reveal, Swap, Typed, bgFrom, cueOf, ez, IO, CL, lenOf, mono, P, path, pulse, sans, serif, type Tl } from "./kit";
import { Grid, Logo, Preview } from "./kit";

export { AL_FONTS, Cursor, Drift, Reveal, Swap, Typed, bgFrom, cueOf, ez, IO, CL, lenOf, mono, P, path, pulse, sans, serif };
export type { Tl };

/** Allocra 16:9 kit: 1920x1080 design canvas. */
export const HW = 1920;
export const HH = 1080;

export const HStage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { width } = useVideoConfig();
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: 0, width: HW, height: HH, transform: `scale(${width / HW})`, transformOrigin: "0 0", overflow: "hidden" }}>{children}</div>
    </AbsoluteFill>
  );
};

export const FilmH: React.FC<{ tl: Tl; scenes: Record<string, React.FC>; bg: (f: number) => string; audio: string }> = ({ tl, scenes, bg, audio }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: bg(f) }}>
      <HStage>
        <Grid />
        {tl.scenes.map((s) => {
          const S = scenes[s.id];
          return (
            <Sequence key={s.id} name={s.id} from={s.start} durationInFrames={s.end - s.start + 14} premountFor={60}>
              <S />
            </Sequence>
          );
        })}
      </HStage>
      <Audio src={staticFile(audio)} />
    </AbsoluteFill>
  );
};

/* ------------------------------ wide allocation slate ------------------------------ */
export const SH_W = 1200;
export const SH_H = 680;
export const SH_SLIDER = { x0: 680, x1: 1152, y: 306 };
export const SH_TAB_Y = 602;
export const shTabX = (i: number) => 680 + ((472 - 28) / 3) * (i + 0.5) + 14 * i;

export const SlateH: React.FC<{ p?: number; metrics?: number; monthly?: number; tab?: number }> = ({ p = 1, metrics = 1, monthly = 1, tab = 1 }) => {
  const slices = [{ k: "US equity", v: 55 }, { k: "International equity", v: 25 }, { k: "US bonds", v: 20 }];
  const R = 112, C2 = 2 * Math.PI * R;
  let acc = 0;
  const amount = Math.round(1200 * monthly);
  const hx = SH_SLIDER.x0 + (SH_SLIDER.x1 - SH_SLIDER.x0) * 0.46 * monthly;
  return (
    <div style={{ position: "relative", width: SH_W, height: SH_H, background: "rgba(61,24,18,0.92)", border: "2px solid rgba(246,218,195,0.35)", boxShadow: "0 50px 120px rgba(0,0,0,0.5)" }}>
      <div style={{ position: "absolute", left: 48, right: 48, top: 36, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={mono(18, P.cream)}>Allocation slate / draft</div>
        <Preview />
      </div>
      <div style={{ position: "absolute", left: 48, top: 78, ...serif(80, P.cream) }}>Core allocation</div>
      <svg style={{ position: "absolute", left: 48, top: 210 }} width={300} height={300} viewBox="0 0 300 300">
        <g transform="translate(150 150) rotate(-90)">
          <circle r={R} fill="none" stroke="rgba(246,218,195,0.14)" strokeWidth={48} />
          {slices.map((sl, i) => {
            const len = (sl.v / 100) * C2 * p;
            const col = i === 0 ? P.cream : i === 1 ? P.accent : "rgba(246,218,195,0.5)";
            const el = <circle key={i} r={R} fill="none" stroke={col} strokeWidth={48} strokeDasharray={`${Math.max(0, len - 3)} ${C2}`} strokeDashoffset={(-acc * C2 * p) / 100} />;
            acc += sl.v;
            return el;
          })}
        </g>
        <text x={150} y={160} textAnchor="middle" style={{ fontFamily: AL_FONTS.mono, fontSize: 24, fill: P.cream, letterSpacing: 2 }}>3 ETFs</text>
      </svg>
      <div style={{ position: "absolute", left: 390, width: 240, top: 240 }}>
        {slices.map((sl, i) => (
          <div key={sl.k} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", ...sans(24, P.cream), height: 74, opacity: ez(p * 100, 10 + i * 12, 20) }}>
            <span style={{ maxWidth: 150, lineHeight: 1.15 }}>{sl.k}</span><span style={{ fontFamily: AL_FONTS.mono, fontSize: 28 }}>{sl.v}%</span>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 680, width: 472, top: 214, display: "flex", justifyContent: "space-between", ...mono(18, P.cream) }}>
        <span>Monthly purchase</span><span>${amount.toLocaleString("en-US")}</span>
      </div>
      <div style={{ position: "absolute", left: SH_SLIDER.x0, width: SH_SLIDER.x1 - SH_SLIDER.x0, top: SH_SLIDER.y - 2, height: 4, background: "rgba(246,218,195,0.3)" }} />
      <div style={{ position: "absolute", left: SH_SLIDER.x0, width: hx - SH_SLIDER.x0, top: SH_SLIDER.y - 2, height: 4, background: P.cream }} />
      <div style={{ position: "absolute", left: hx - 13, top: SH_SLIDER.y - 13, width: 26, height: 26, borderRadius: 99, background: P.accent, border: `3px solid ${P.cream}` }} />
      <div style={{ position: "absolute", left: 680, width: 472, top: 384, opacity: metrics, borderTop: "1px solid rgba(246,218,195,0.25)", paddingTop: 22, display: "flex", justifyContent: "space-between" }}>
        {[["Issuer tilt", "High"], ["Overlap", "0%"], ["Est. cost / yr", "$0.50"]].map(([k, v]) => (
          <div key={k}><div style={mono(14, P.dim)}>{k}</div><div style={{ fontFamily: AL_FONTS.mono, fontSize: 34, color: P.cream, marginTop: 8 }}>{v}</div></div>
        ))}
      </div>
      {["Income", "Core", "Growth"].map((t, i) => (
        <div key={t} style={{ position: "absolute", top: 570, height: 64, left: 680 + i * ((472 - 28) / 3 + 14), width: (472 - 28) / 3, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(246,218,195,0.35)", background: i === tab ? P.cream : "transparent", ...mono(17, i === tab ? "#3d1812" : P.dim) }}>{t}</div>
      ))}
    </div>
  );
};

/** Painting in the site's thin-bordered frame (landscape layouts). */
export const PaintingH: React.FC<{ src: string; w: number; h: number; zoom?: number }> = ({ src, w, h, zoom = 1 }) => (
  <div style={{ width: w, border: "1px solid rgba(246,218,195,0.35)", padding: 14, boxSizing: "border-box", background: "rgba(0,0,0,0.18)" }}>
    <div style={{ width: "100%", height: h, overflow: "hidden" }}>
      <Img src={staticFile(`allocra/content/${src}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})` }} />
    </div>
  </div>
);

export const EndCardH: React.FC<{ line: React.ReactNode; n: number; at?: number; url?: boolean }> = ({ line, n, at = 14, url = true }) => {
  const f = useCurrentFrame();
  const p = ez(f, at, 40);
  return (
    <Drift n={n} from={1} to={1.03}>
      <div style={{ position: "absolute", left: HW / 2 - 110, top: 120, opacity: p, filter: `blur(${(1 - p) * 18}px)`, transform: `scale(${0.88 + 0.12 * p})` }}><Logo size={220} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 370, textAlign: "center", ...sans(46, P.cream, { fontWeight: 500, letterSpacing: -1 }), opacity: p }}>Allocra</div>
      <div style={{ position: "absolute", left: 160, right: 160, top: 450, textAlign: "center" }}>
        <Reveal at={at + 50} style={serif(96, P.cream, { textAlign: "center" })}>{line}</Reveal>
      </div>
      {url && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 790, textAlign: "center", ...mono(24, P.cream) }}>
          <Typed text="allocra.buzz" at={at + 110} cps={14} color={P.cream} />
        </div>
      )}
      <div style={{ position: "absolute", left: 120, right: 120, bottom: 70, textAlign: "center", ...mono(14, "rgba(246,218,195,0.55)", { letterSpacing: 3 }) }}>
        <Reveal at={at + 150}>Assets remain individually held · Preview / TestNet demo · Not investment advice</Reveal>
      </div>
    </Drift>
  );
};
