import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { path as pathOf, pulse } from "../../Oryn/motion";
import { BRAND, CL, FanMark, IO, L, MONO, SANS, camStyle, ez, type CamKey } from "../ui";

export { CL, IO, L, MONO, SANS, ez, pathOf, pulse, camStyle };
export type { CamKey };

export const NAVX = { home: 560, resumes: 700, templates: 860, tips: 1020, tracker: 1210, more: 1405 } as const;
export const NAVY = 40;
export const CX0 = 307; // site content column
export const CW = 1306;

/** Green arrow cursor with click ripple (drawn inside the camera so it zooms with the page). */
export const Cur: React.FC<{ x: number; y: number; click?: number }> = ({ x, y, click = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0, zIndex: 90 }}>
    {click > 0 && <div style={{ position: "absolute", left: -46 * click, top: -46 * click, width: 92 * click, height: 92 * click, borderRadius: 999, border: `4px solid ${L.green}`, opacity: 1 - click }} />}
    <svg width={40} height={46} viewBox="0 0 27 31" style={{ position: "absolute", left: -3, top: -3, filter: "drop-shadow(0 5px 7px rgba(0,0,0,0.28))" }}>
      <path d="M3 2 L3 24 L9 18.5 L13 28 L17.5 26 L13.5 16.8 L22 16.5 Z" fill="#17201c" stroke="#fff" strokeWidth={2} strokeLinejoin="round" />
    </svg>
  </div>
);

export const Typing: React.FC<{ text: string; at: number; cps?: number; color?: string; caret?: boolean }> = ({ text, at, cps = 24, color = L.ink, caret = true }) => {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor(((f - at) * cps) / 60)));
  const on = f >= at - 2 && n < text.length;
  return (
    <span style={{ color }}>
      {text.slice(0, n)}
      {caret && on && <span style={{ display: "inline-block", width: 2, height: "1.05em", background: color, marginLeft: 2, verticalAlign: "-0.15em" }} />}
    </span>
  );
};

/** A page: white ground, fades in with a soft blur like a route change. */
export const Pg: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg = "#ffffff" }) => {
  const f = useCurrentFrame();
  const p = ez(f, 0, 12, IO);
  return <div style={{ position: "absolute", inset: 0, background: bg, opacity: p, filter: `blur(${(1 - p) * 10}px)`, overflow: "hidden" }}>{children}</div>;
};

export const Caption: React.FC<{ n: string; text: string; len: number }> = ({ n, text, len }) => {
  const f = useCurrentFrame();
  const p = ez(f, 18, 16) * (1 - ez(f, len - 26, 14, IO));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 46, display: "flex", justifyContent: "center", opacity: p, transform: `translateY(${(1 - p) * 16}px)`, zIndex: 120 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 26px 12px 14px", borderRadius: 99, background: "rgba(23,32,28,0.92)", color: "#fff", fontFamily: SANS, fontSize: 24, fontWeight: 500, boxShadow: "0 18px 40px rgba(0,0,0,0.25)" }}>
        <span style={{ fontFamily: MONO, fontSize: 16, background: L.green, color: "#fff", borderRadius: 99, padding: "5px 12px", letterSpacing: 2 }}>{n}</span>{text}
      </div>
    </div>
  );
};

const Ico: React.FC<{ d: string; c?: string; s?: number }> = ({ d, c = L.muted, s = 22 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);
export const IcoFile2: React.FC<{ c?: string; s?: number }> = (p) => <Ico {...p} d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8zM14 3v5h5M9 13h6M9 17h6" />;
export const IcoEye: React.FC<{ c?: string; s?: number }> = (p) => <Ico {...p} d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z" />;
export const IcoGrid: React.FC<{ c?: string; s?: number }> = (p) => <Ico {...p} d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />;

/** Top navigation, logged-in, active item underlined; `more` highlights the More menu. */
export const Nav: React.FC<{ active?: keyof typeof NAVX; moreOpen?: boolean; hover?: keyof typeof NAVX }> = ({ active, moreOpen, hover }) => {
  const item = (k: keyof typeof NAVX, label: string, extra?: React.ReactNode) => {
    const on = active === k || (k === "more" && moreOpen);
    return (
      <div key={k} style={{ position: "absolute", left: NAVX[k] - 100, width: 200, top: 0, height: 80, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, whiteSpace: "nowrap", fontFamily: SANS, fontSize: 22, fontWeight: 500, color: on ? L.greenDeep : hover === k ? L.greenDeep : L.ink }}>
        {k === "more" && <IcoGrid c={on ? L.greenDeep : L.ink} s={24} />}
        {label}{extra}
        {on && <div style={{ position: "absolute", left: 30, right: 30, bottom: 6, height: 4, borderRadius: 4, background: L.green }} />}
      </div>
    );
  };
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 80, background: "#fff", boxShadow: "0 2px 14px rgba(0,0,0,0.06)", zIndex: 60 }}>
      <div style={{ position: "absolute", left: CX0, top: 14, display: "flex", alignItems: "center", gap: 12 }}>
        <FanMark size={50} />
        <span style={{ fontFamily: BRAND, fontWeight: 700, fontSize: 40, color: L.ink, letterSpacing: -0.5 }}>Lampzi</span>
      </div>
      {item("home", "Home")}{item("resumes", "My Resumes")}{item("templates", "Templates")}{item("tips", "Resume Tips")}
      {item("tracker", "Job Tracker", <span style={{ marginLeft: 6, fontSize: 13, fontWeight: 700, letterSpacing: 1, color: "#fff", background: "linear-gradient(90deg,#8b5cf6,#a78bfa)", borderRadius: 99, padding: "3px 10px" }}>NEW</span>)}
      {item("more", "More")}
      <div style={{ position: "absolute", left: 1548, top: 18, width: 44, height: 44, borderRadius: 99, background: "#cfe3d9", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={26} height={26} viewBox="0 0 24 24" fill={L.greenDeep}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" /></svg>
      </div>
    </div>
  );
};

/** Procedural mini resume used for template thumbnails without a supplied capture. */
export const Mini: React.FC<{ w: number; h: number; accent: string; variant: number }> = ({ w, h, accent, variant }) => {
  const bar = (wd: number, o = 0.2) => <div style={{ height: 5, width: `${wd}%`, borderRadius: 3, background: `rgba(53,62,73,${o})`, marginTop: 7 }} />;
  return (
    <div style={{ width: w, height: h, background: "#fff", padding: "26px 28px", boxSizing: "border-box", overflow: "hidden", border: `1px solid ${L.line}` }}>
      <div style={{ textAlign: variant % 2 ? "left" : "center", fontFamily: variant % 3 === 0 ? "Georgia, serif" : SANS, fontWeight: 700, fontSize: 24, color: "#1f242b" }}>John Doe</div>
      <div style={{ textAlign: variant % 2 ? "left" : "center", fontFamily: SANS, fontSize: 10, color: "#6b7280", marginTop: 2 }}>Senior Software Engineer · San Francisco, CA</div>
      {["Summary", "Work Experience", "Education", "Skills"].map((s, i) => (
        <div key={s} style={{ marginTop: 14 }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 10.5, color: accent, letterSpacing: 1, textTransform: "uppercase", borderBottom: `1.5px solid ${accent}`, paddingBottom: 2 }}>{s}</div>
          {bar(96)}{bar(90)}{i === 1 && bar(94)}{i === 1 && bar(72)}{bar(60, 0.14)}
        </div>
      ))}
    </div>
  );
};

export const Illus: React.FC<{ at?: number }> = ({ at = 0 }) => {
  const f = useCurrentFrame();
  return <div style={{ position: "absolute", left: 60, bottom: 46, fontFamily: MONO, fontSize: 15, letterSpacing: 5, textTransform: "uppercase", color: "rgba(53,62,73,0.45)", opacity: ez(f, at, 14), zIndex: 120 }}>Illustrative</div>;
};
export { Img, staticFile, interpolate };
