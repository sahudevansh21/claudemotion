import { AbsoluteFill, useVideoConfig } from "remotion";
import { CL } from "../Collatera/brand";
import { Mascot } from "../Collatera/components/Mascot";
import { MONO, PIX } from "./Kit";
import { Terminal } from "./Shots";

/**
 * COLLATERA launch posters (stills, fps = 1). Frame 0 = 16:9 layout, the
 * composition's own aspect decides the layout. Design canvas: 1920×1080
 * (landscape) or 1080×1350 (4:5), scaled to the output size.
 */
export const Grid: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 72% 42%, rgba(117,255,0,0.20) 0%, transparent 45%), radial-gradient(ellipse at 50% 50%, ${CL.evergreen} 0%, ${CL.night} 85%)`,
      }}
    />
    <AbsoluteFill
      style={{
        backgroundImage: `radial-gradient(${CL.sage}38 1.2px, transparent 1.3px)`,
        backgroundSize: "28px 28px",
      }}
    />
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(${CL.line}22 1px, transparent 1px), linear-gradient(90deg, ${CL.line}22 1px, transparent 1px)`,
        backgroundSize: "112px 112px",
      }}
    />
  </AbsoluteFill>
);

export const Pixels: React.FC<{ spots: [number, number, number][] }> = ({ spots }) => (
  <>
    {spots.map(([x, y, s], i) => (
      <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, background: i % 3 ? CL.lime : CL.panel }} />
    ))}
  </>
);

export const Chip: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ padding: "10px 16px", border: `2px solid ${CL.line}`, background: CL.evergreen, fontFamily: PIX, fontSize: 18, color: CL.mint, boxShadow: `5px 5px 0 ${CL.shadow}` }}>
    {text}
  </div>
);

const Headline: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ fontFamily: PIX, fontWeight: 700, fontSize: size, lineHeight: 1.12, color: CL.mint, textShadow: `${size * 0.06}px ${size * 0.06}px 0 ${CL.shadow}` }}>
    CATCH STALE
    <br />
    ORACLES
    <br />
    BEFORE
    <br />
    <span style={{ color: CL.lime }}>THEY CATCH YOU.</span>
  </div>
);

export const Eyebrow: React.FC = () => (
  <div style={{ fontFamily: PIX, fontSize: 20, color: CL.lime, display: "flex", alignItems: "center", gap: 12 }}>
    <div style={{ width: 10, height: 10, background: CL.lime }} />
    COLLATERAL RISK MONITORING / 001
  </div>
);

export const Footer: React.FC = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: MONO, fontSize: 22, color: CL.sage }}>
    <span style={{ fontFamily: PIX, color: CL.lime, fontSize: 24 }}>collatera.buzz</span>
    <span>·</span>
    <span>@collatera_io</span>
  </div>
);

const Landscape: React.FC = () => (
  <AbsoluteFill>
    <Grid />
    <Pixels spots={[[1180, 120, 22], [1700, 210, 14], [1780, 520, 18], [1500, 90, 10]]} />
    <div style={{ position: "absolute", left: 110, top: 150 }}>
      <Eyebrow />
      <div style={{ height: 30 }} />
      <Headline size={76} />
      <div style={{ marginTop: 34, fontFamily: MONO, fontSize: 26, lineHeight: 1.5, color: CL.mint, width: 760, opacity: 0.9 }}>
        Monitoring collateral risk across DeFi and tokenized assets. Real-time signals. Smarter risk decisions.
      </div>
      <div style={{ display: "flex", gap: 14, marginTop: 34 }}>
        <Chip text="READ-ONLY" />
        <Chip text="NO KEYS" />
        <Chip text="NO SIGNATURES" />
      </div>
    </div>
    <div style={{ position: "absolute", left: 1270, top: 120, filter: "drop-shadow(0 0 60px rgba(117,255,0,0.35))" }}>
      <Mascot cell={38} />
    </div>
    <div style={{ position: "absolute", left: 1070, top: 600, perspective: 2000 }}>
      <div style={{ transformOrigin: "0% 0%", transform: "rotateY(-16deg) rotateX(8deg) scale(0.56)" }}>
        <Terminal t={2.4} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 110, bottom: 90 }}>
      <Footer />
    </div>
  </AbsoluteFill>
);

const Portrait: React.FC = () => (
  <AbsoluteFill>
    <Grid />
    <Pixels spots={[[860, 110, 18], [960, 300, 12], [990, 640, 16]]} />
    <div style={{ position: "absolute", left: 80, top: 100 }}>
      <Eyebrow />
    </div>
    <div style={{ position: "absolute", right: 90, top: 170, filter: "drop-shadow(0 0 50px rgba(117,255,0,0.35))" }}>
      <Mascot cell={26} />
    </div>
    <div style={{ position: "absolute", left: 80, top: 520 }}>
      <Headline size={76} />
      <div style={{ display: "flex", gap: 12, marginTop: 30 }}>
        <Chip text="READ-ONLY" />
        <Chip text="NO KEYS" />
        <Chip text="NO SIGNATURES" />
      </div>
    </div>
    <div style={{ position: "absolute", left: 80, top: 990, perspective: 1800 }}>
      <div style={{ transformOrigin: "0% 0%", transform: "rotateX(14deg) rotateZ(-2deg) scale(0.68)" }}>
        <Terminal t={2.4} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 260, background: `linear-gradient(transparent, ${CL.night} 70%)` }} />
    <div style={{ position: "absolute", left: 80, bottom: 70 }}>
      <Footer />
    </div>
  </AbsoluteFill>
);

export const CollateraPoster: React.FC = () => {
  const { width, height } = useVideoConfig();
  const portrait = height > width;
  const dw = portrait ? 1080 : 1920;
  const dh = portrait ? 1350 : 1080;
  const scale = Math.min(width / dw, height / dh);
  return (
    <AbsoluteFill style={{ background: CL.night, justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "relative", width: dw, height: dh, flexShrink: 0, overflow: "hidden", transform: `scale(${scale})` }}>
        {portrait ? <Portrait /> : <Landscape />}
      </div>
    </AbsoluteFill>
  );
};
