import { AbsoluteFill, Img, staticFile } from "remotion";
import { ez, Film, IO, lerp, LogoEnd, SANS, useT } from "./kit";
import TL from "./v5.json";

/**
 * V5 · "One page. Every risk in view." (content plan Day 15).
 * 30 s · 1080p60 · recreates the locked Acceternity reference (ANALYSIS.md §4):
 * the whole site laid on one tilted plane, a continuous camera fly-over under
 * a spotlight vignette, an arc carousel of sections, macro shots lit by a
 * sweeping spotlight, small grey end line, logo. Near-silent foley.
 * Sources: client-supplied site screenshots (hero, terminal, integrations)
 * + stills from the client's screen recording.
 */
const W = 1600;
const PAGE: { src: string; h: number }[] = [
  { src: "collatera-campaign/site/s5.jpg", h: (1000 / 2000) * W },
  { src: "collatera-campaign/site/s6.jpg", h: (1098 / 2000) * W },
  { src: "collatera-launch/stills/s4.jpg", h: (836 / 1544) * W },
  { src: "collatera-campaign/site/s7.jpg", h: (1025 / 2000) * W },
  { src: "collatera-launch/stills/s9.jpg", h: (836 / 1544) * W },
  { src: "collatera-launch/stills/s10.jpg", h: (836 / 1544) * W },
  { src: "collatera-launch/stills/s12.jpg", h: (836 / 1544) * W },
  { src: "collatera-launch/stills/s15.jpg", h: (836 / 1544) * W },
];
const GAP = 70;
const TOPS: number[] = [];
PAGE.reduce((y, p) => {
  TOPS.push(y);
  return y + p.h + GAP;
}, 0);
const center = (i: number, fx = 0.5, fy = 0.5) => [W * fx, TOPS[i] + PAGE[i].h * fy];

/** Camera keyframes: [t, cx, cy, scale, rotX, rotZ]. */
const KEYS: [number, number, number, number, number, number][] = [
  [0, ...center(0, 0.5, 0.45), 0.5, 36, -14] as [number, number, number, number, number, number],
  [2.4, ...center(1, 0.5, 0.4), 0.55, 34, -13] as [number, number, number, number, number, number],
  [4.8, ...center(3, 0.5, 0.5), 0.5, 32, -12] as [number, number, number, number, number, number],
  [7.2, ...center(5, 0.5, 0.5), 0.48, 34, -13] as [number, number, number, number, number, number],
  [9.6, ...center(1, 0.35, 0.55), 1.05, 24, -8] as [number, number, number, number, number, number],
  [12.4, ...center(1, 0.78, 0.5), 1.15, 22, -7] as [number, number, number, number, number, number],
  [14.6, ...center(2, 0.4, 0.6), 1.0, 26, -9] as [number, number, number, number, number, number],
  [17.4, ...center(3, 0.5, 0.45), 0.95, 26, -9] as [number, number, number, number, number, number],
  [19.2, ...center(3, 0.5, 0.75), 1.1, 28, -10] as [number, number, number, number, number, number],
];
const cam = (t: number) => {
  let k = KEYS[0].slice(1);
  for (let i = 0; i < KEYS.length - 1; i++) {
    const [t0, ...a] = KEYS[i];
    const [t1, ...b] = KEYS[i + 1];
    if (t >= t0) {
      const p = ez(t, t0, t1, IO);
      k = a.map((v, j) => lerp(p, v, b[j]));
    }
  }
  return k;
};

const Plane: React.FC<{ t: number }> = ({ t }) => {
  const [cx, cy, s, rx, rz] = cam(t);
  return (
    <div style={{ position: "absolute", left: 960, top: 560, transformOrigin: "0 0", transform: `perspective(1800px) rotateX(${rx}deg) rotateZ(${rz}deg) scale(${s}) translate(${-cx}px, ${-cy}px)` }}>
      {PAGE.map((p, i) => (
        <Img key={p.src} src={staticFile(p.src)} style={{ position: "absolute", left: 0, top: TOPS[i], width: W, height: p.h, borderRadius: 18, boxShadow: "0 40px 80px rgba(0,0,0,0.6)" }} />
      ))}
    </div>
  );
};

const Spot: React.FC<{ r?: number; x?: number; y?: number }> = ({ r = 34, x = 50, y = 52 }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse ${r * 1.5}% ${r * 1.4}% at ${x}% ${y}%, transparent 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.92) 100%)` }} />
);

const Fly: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Plane t={t} />
      <Spot r={lerp(ez(t, 0, 2), 26, 36)} />
    </AbsoluteFill>
  );
};

const ARC = ["collatera-campaign/site/s5.jpg", "collatera-campaign/site/s6.jpg", "collatera-launch/stills/s4.jpg", "collatera-campaign/site/s7.jpg", "collatera-launch/stills/s9.jpg", "collatera-launch/stills/s10.jpg", "collatera-launch/stills/s12.jpg", "collatera-launch/stills/s15.jpg"];
const Arc: React.FC = () => {
  const t = useT();
  const rot = lerp(ez(t, 0, 5.2, IO), 18, -18);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 150, width: 1920, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 54, color: "#D9E4DD", letterSpacing: -1, transform: "perspective(1200px) rotateX(18deg) rotateZ(-6deg)", opacity: ez(t, 0.3, 0.8) }}>
        Every section, one focused view.
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, perspective: 1600 }}>
        <div style={{ position: "absolute", left: 960, top: 640, transformStyle: "preserve-3d", transform: "rotateX(16deg) rotateZ(-6deg)" }}>
        {ARC.map((src, i) => {
          const a = (i - (ARC.length - 1) / 2) * 11 + rot;
          const rad = (a * Math.PI) / 180;
          const R = 1300;
          const x = Math.sin(rad) * R;
          const z = Math.cos(rad) * R - R;
          const front = 1 - Math.min(1, Math.abs(a) / 40);
          return (
            <div key={src + i} style={{ position: "absolute", left: x - 260, top: -160, width: 520, height: 320, transform: `translateZ(${z}px) rotateY(${-a}deg)`, borderRadius: 14, overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,0.6)", opacity: 0.35 + 0.65 * front, border: `1.5px solid rgba(117,255,0,${0.15 + 0.45 * front})` }}>
              <Img src={staticFile(src)} style={{ width: 520, height: 320, objectFit: "cover" }} />
            </div>
          );
        })}
        </div>
      </div>
      <Spot r={40} />
    </AbsoluteFill>
  );
};

const Macro: React.FC = () => {
  const t = useT();
  const sweep = lerp(ez(t, 0, 3.2, IO), 15, 85);
  const z = lerp(ez(t, 0, 3.2, IO), 2.3, 2.6);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 960, top: 560, transformOrigin: "0 0", transform: `perspective(1400px) rotateX(26deg) rotateZ(-10deg) scale(${z}) translate(${-W * lerp(ez(t, 0, 3.2), 0.24, 0.34)}px, ${-(W / 2) * 0.66}px)` }}>
        <Img src={staticFile("collatera-campaign/site/s5.jpg")} style={{ width: W, height: W / 2, borderRadius: 18 }} />
      </div>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 34% 40% at ${sweep}% 55%, rgba(255,255,255,0.18) 0%, transparent 50%, rgba(0,0,0,0.9) 100%)`, mixBlendMode: "normal" }} />
    </AbsoluteFill>
  );
};

const Pages: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill style={{ background: "#000", justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 40, color: "#C7D2CC" }}>
        <span style={{ opacity: ez(t, 0.05, 0.4) }}>Collatera.</span>
        <span style={{ opacity: ez(t, 0.6, 1.0), marginLeft: 12 }}>Every risk, in view.</span>
      </div>
    </AbsoluteFill>
  );
};

const Logo: React.FC = () => <LogoEnd at={0} line="collatera.buzz" />;

export const CollateraV5: React.FC = () => <Film scenes={TL.scenes} map={{ fly: Fly, arc: Arc, macro: Macro, pages: Pages, logo: Logo }} audio="collatera-campaign/v5/mix.wav" bg="#000" glow={false} />;
