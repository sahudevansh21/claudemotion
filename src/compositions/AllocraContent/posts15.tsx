import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { AL_FONTS, Logo, P, serif, sans, mono } from "./kit";

/** Allocra X-profile posts: 15 stills, 1080x1350 (4:5), frame N = post N+1. Theme: the account banner (vermilion, old-master portrait, cream serif, hairline arc). */
const W = 1080;
const H = 1350;
const RED = "#E22403";
const GOLD = "#F2C892";
const BROWN = "#3d1812";
const NOISE = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.012 0.02' numOctaves='5' seed='7'/><feColorMatrix values='0 0 0 0 0.35  0 0 0 0 0.02  0 0 0 0 0  0 0 0 1.1 -0.35'/></filter><rect width='600' height='600' filter='url(%23n)'/></svg>")`;

const cap = (size: number, color: string = P.cream, extra: React.CSSProperties = {}): React.CSSProperties => ({ fontFamily: AL_FONTS.serif, fontSize: size, letterSpacing: size * 0.34, textTransform: "uppercase", color, ...extra });

const Red: React.FC = () => (
  <>
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(120% 90% at 30% 25%, #F02A04 0%, ${RED} 45%, #C81E02 100%)` }} />
    <div style={{ position: "absolute", inset: 0, backgroundImage: NOISE, backgroundSize: "600px 600px", opacity: 0.55, mixBlendMode: "multiply" }} />
    <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 220px rgba(80,6,0,0.35)" }} />
  </>
);
const Dark: React.FC = () => (
  <>
    <div style={{ position: "absolute", inset: 0, background: P.dark }} />
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(90% 60% at 50% 0%, rgba(226,36,3,0.20), transparent 70%)" }} />
    <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 220px rgba(0,0,0,0.4)" }} />
  </>
);
const Cream: React.FC = () => (
  <>
    <div style={{ position: "absolute", inset: 0, background: P.cream }} />
    <div style={{ position: "absolute", inset: 0, backgroundImage: NOISE, backgroundSize: "600px 600px", opacity: 0.10, mixBlendMode: "multiply" }} />
  </>
);

const Foot: React.FC<{ n: number; color?: string }> = ({ n, color = "rgba(246,218,195,0.75)" }) => (
  <div style={{ ...cap(13, color, { letterSpacing: 4 }), position: "absolute", left: 70, right: 70, bottom: 46, display: "flex", justifyContent: "space-between", zIndex: 5 }}>
    <span>Allocra · Preview / TestNet demo · Not investment advice</span><span>{String(n).padStart(2, "0")}/15</span>
  </div>
);
/** "MMXXV +———" masthead from the banner. */
const Mast: React.FC<{ color?: string; right?: string }> = ({ color = GOLD, right }) => (
  <div style={{ position: "absolute", left: 70, right: 70, top: 64, display: "flex", alignItems: "center", gap: 18, ...cap(16, color) }}>
    <span>MMXXV</span><span style={{ letterSpacing: 0 }}>+</span><span style={{ flex: "0 0 170px", height: 1, background: color, opacity: 0.7 }} />
    {right && <span style={{ marginLeft: "auto", letterSpacing: 5 }}>{right}</span>}
  </div>
);
const Arc: React.FC<{ cx: number; cy: number; r: number; color?: string }> = ({ cx, cy, r, color = GOLD }) => (
  <div style={{ position: "absolute", left: cx - r, top: cy - r, width: r * 2, height: r * 2, borderRadius: r, border: `1.5px solid ${color}`, opacity: 0.6 }} />
);
const Cross: React.FC<{ x: number; y: number; s?: number; color?: string }> = ({ x, y, s = 26, color = GOLD }) => (
  <div style={{ position: "absolute", left: x - s / 2, top: y - s / 2, width: s, height: s, opacity: 0.85 }}>
    <div style={{ position: "absolute", left: s / 2, top: 0, width: 1.5, height: s, background: color }} />
    <div style={{ position: "absolute", top: s / 2, left: 0, height: 1.5, width: s, background: color }} />
  </div>
);

/** Portrait crop from the account banner, feathered into the red. */
const Portrait: React.FC<{ s: number; style?: React.CSSProperties }> = ({ s, style }) => {
  const x0 = 880, x1 = 1330, bw = 1500, bh = 500;
  const mask = "linear-gradient(90deg, transparent 0%, #000 22%, #000 78%, transparent 100%)";
  return (
    <div style={{ position: "absolute", width: (x1 - x0) * s, height: bh * s, overflow: "hidden", WebkitMaskImage: mask, maskImage: mask, ...style }}>
      <Img src={staticFile("allocra/img/banner.jpg")} style={{ position: "absolute", left: -x0 * s, top: 0, width: bw * s, height: bh * s }} />
    </div>
  );
};

const Frame: React.FC<{ src: string; w: number; h: number; pos?: string; style?: React.CSSProperties }> = ({ src, w, h, pos = "50% 50%", style }) => (
  <div style={{ width: w, border: "1px solid rgba(246,218,195,0.45)", padding: 14, boxSizing: "border-box", background: "rgba(0,0,0,0.2)", boxShadow: "0 40px 90px rgba(0,0,0,0.35)", ...style }}>
    <div style={{ width: "100%", height: h, overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos }} />
    </div>
  </div>
);
const T: React.FC<{ children: React.ReactNode; fs: number; top: number; color?: string; left?: number; right?: number; style?: React.CSSProperties }> = ({ children, fs, top, color = P.cream, left = 70, right = 70, style }) => (
  <div style={{ ...serif(fs, color, { lineHeight: 0.98 }), position: "absolute", left, right, top, ...style }}>{children}</div>
);

/* 01 cover */
const P1: React.FC = () => (
  <>
    <Red /><Mast right="Portfolios · Allocation" />
    <Arc cx={800} cy={760} r={430} />
    <Portrait s={1.55} style={{ left: 420, top: 660 }} />
    <T fs={134} top={220}>Old Masters.<br />New Allocation.</T>
    <div style={{ ...sans(30, P.cream), position: "absolute", left: 70, top: 640, width: 360 }}>Tokenized assets. Custom baskets. Portfolio intelligence.</div>
    <div style={{ ...cap(15, GOLD), position: "absolute", left: 70, top: 880 }}>Series / 01</div>
    <Foot n={1} />
  </>
);
/* 02 smarter way */
const P2: React.FC = () => (
  <>
    <Red /><Mast />
    <Arc cx={930} cy={980} r={560} />
    <Cross x={940} y={300} /><Cross x={110} y={1120} s={20} />
    <T fs={218} top={250}>A smarter<br />way to<br />allocate.</T>
    <div style={{ ...serif(46, P.cream, { fontStyle: "italic", lineHeight: 1.15 }), position: "absolute", left: 70, right: 200, bottom: 150 }}>Tokenized assets. Custom baskets. Portfolio intelligence.</div>
    <Foot n={2} />
  </>
);
/* 03-05 pillars */
const Pillar: React.FC<{ n: number; roman: string; title: React.ReactNode; img: string; pos: string; sub: string }> = ({ n, roman, title, img, pos, sub }) => (
  <>
    <Red /><Mast right={`${roman} / III`} />
    <T fs={176} top={170}>{title}</T>
    <div style={{ position: "absolute", left: 70, top: 640 }}><Frame src={img} w={940} h={470} pos={pos} /></div>
    <div style={{ ...cap(15, GOLD), position: "absolute", left: 70, top: 1190 }}>{sub}</div>
    <Foot n={n} />
  </>
);
const P3: React.FC = () => <Pillar n={3} roman="I" title={<>Tokenized<br />assets.</>} img="allocra/content/chess.jpg" pos="50% 58%" sub="Allocation, one position at a time" />;
const P4: React.FC = () => <Pillar n={4} roman="II" title={<>Custom<br />baskets.</>} img="allocra/content/scholars.jpg" pos="50% 50%" sub="Build the basket you want to own" />;
const P5: React.FC = () => <Pillar n={5} roman="III" title={<>Portfolio<br />intelligence.</>} img="allocra/content/adam.jpg" pos="40% 50%" sub="Human judgment, machine precision" />;
/* 06 plan first */
const P6: React.FC = () => (
  <>
    <Dark /><Mast />
    <T fs={150} top={150}>Plan first.</T>
    <div style={{ ...sans(34, P.cream), position: "absolute", left: 70, right: 160, top: 350 }}>Assets remain individually held until you approve a trade.</div>
    <div style={{ position: "absolute", left: 70, top: 520 }}><Frame src="allocra/img/ui-basket.webp" w={940} h={518} pos="0% 0%" /></div>
    <div style={{ ...cap(14, P.dim), position: "absolute", left: 70, top: 1110 }}>Allocra workspace · Preview / TestNet demo</div>
    <Foot n={6} />
  </>
);
/* 07 insights */
const P7: React.FC = () => (
  <>
    <Red /><Mast color={GOLD} />
    <T fs={120} top={150}>See it all<br />before you confirm.</T>
    <div style={{ position: "absolute", left: 70, top: 470 }}><Frame src="allocra/img/ui-insights.webp" w={940} h={510} pos="0% 0%" /></div>
    <div style={{ ...sans(32, P.cream), position: "absolute", left: 70, right: 120, top: 1060 }}>See concentration, overlap, quotes, and trading costs before you confirm.</div>
    <Foot n={7} />
  </>
);
/* 08 checklist */
const P8: React.FC = () => {
  const rows = [["I", "Concentration"], ["II", "Overlap"], ["III", "Quotes"], ["IV", "Trading costs"]];
  return (
    <>
      <Cream /><Mast color={RED} />
      <T fs={120} top={150} color={BROWN}>Before you<br />confirm.</T>
      <div style={{ position: "absolute", left: 70, right: 70, top: 470 }}>
        {rows.map(([r, t]) => (
          <div key={t} style={{ display: "flex", alignItems: "baseline", gap: 40, height: 168, borderTop: "1.5px solid rgba(61,24,18,0.45)", paddingTop: 30 }}>
            <span style={cap(22, RED, { width: 70 })}>{r}</span>
            <span style={serif(104, BROWN)}>{t}</span>
          </div>
        ))}
        <div style={{ borderTop: "1.5px solid rgba(61,24,18,0.45)" }} />
      </div>
      <Foot n={8} color="rgba(61,24,18,0.7)" />
    </>
  );
};
/* 09 human judgment */
const P9: React.FC = () => (
  <>
    <Red /><Mast />
    <Arc cx={760} cy={880} r={420} />
    <Portrait s={1.5} style={{ left: 405, top: 675 }} />
    <T fs={132} top={170}>Human<br />judgment,<br />machine<br />precision.</T>
    <div style={{ ...cap(15, GOLD), position: "absolute", left: 70, bottom: 130 }}>Plan with data. Decide yourself.</div>
    <Foot n={9} />
  </>
);
/* 10 decision */
const P10: React.FC = () => (
  <>
    <Dark /><Mast />
    <div style={{ position: "absolute", left: 70, top: 150 }}><Frame src="allocra/content/painter.jpg" w={940} h={520} pos="60% 40%" /></div>
    <T fs={112} top={770}>Allocation is a decision, not a default.</T>
    <div style={{ ...cap(15, GOLD), position: "absolute", left: 70, bottom: 130 }}>Private allocation desk / 01</div>
    <Foot n={10} />
  </>
);
/* 11 plan clearly */
const P11: React.FC = () => (
  <>
    <Red /><Mast />
    <T fs={124} top={150}>Plan clearly.<br />Act deliberately.</T>
    <div style={{ position: "absolute", left: (W - 540) / 2, top: 470 }}><Frame src="allocra/content/lions.jpg" w={540} h={690} pos="50% 55%" /></div>
    <Foot n={11} />
  </>
);
/* 12 read before you confirm */
const P12: React.FC = () => (
  <>
    <Cream /><Mast color={RED} />
    <div style={{ position: "absolute", right: 70, top: 150 }}><Frame src="allocra/content/reader.jpg" w={500} h={780} style={{ border: "1px solid rgba(61,24,18,0.5)", background: "rgba(61,24,18,0.06)" }} /></div>
    <T fs={118} top={170} color={BROWN} right={560}>Read<br />before<br />you<br />confirm.</T>
    <div style={{ ...sans(32, BROWN), position: "absolute", left: 70, right: 560, top: 720 }}>Quotes and trading costs, before you confirm.</div>
    <div style={{ ...serif(80, BROWN, { fontStyle: "italic" }), position: "absolute", left: 70, right: 70, bottom: 150 }}>Your assets. Your allocation.</div>
    <Foot n={12} color="rgba(61,24,18,0.7)" />
  </>
);
/* 13 universe */
const P13: React.FC = () => (
  <>
    <Dark /><Mast />
    <T fs={108} top={150}>Built around the tokenization ecosystem.</T>
    <div style={{ position: "absolute", left: 70, top: 500 }}><Frame src="allocra/content/site-universe.jpg" w={940} h={510} pos="0% 0%" /></div>
    <div style={{ ...cap(14, P.dim, { letterSpacing: 3, lineHeight: 1.7 }), position: "absolute", left: 70, right: 70, top: 1090 }}>Allocra site · The universe · Preview<br />Logos and names belong to their owners. Allocra is not affiliated with, sponsored or endorsed by these protocols.</div>
    <Foot n={13} />
  </>
);
/* 14 nav */
const P14: React.FC = () => (
  <>
    <Red /><Mast />
    <Arc cx={540} cy={700} r={520} />
    <div style={{ ...cap(16, GOLD), position: "absolute", left: 70, top: 190 }}>Private allocation desk / 01</div>
    {["Portfolios", "Allocation", "Tokenized assets"].map((t, i) => (
      <div key={t} style={{ position: "absolute", left: 70, right: 70, top: 300 + i * 270, borderTop: "1.5px solid rgba(246,218,195,0.5)", paddingTop: 36, display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <span style={serif(150, P.cream)}>{t}</span><span style={cap(18, GOLD)}>{["I", "II", "III"][i]}</span>
      </div>
    ))}
    <Foot n={14} />
  </>
);
/* 15 end */
const P15: React.FC = () => (
  <>
    <Red /><Mast />
    <Arc cx={540} cy={560} r={400} />
    <div style={{ position: "absolute", left: W / 2 - 130, top: 300 }}><Logo size={260} /></div>
    <div style={{ ...sans(52, P.cream, { fontWeight: 500, letterSpacing: -1 }), position: "absolute", left: 0, right: 0, top: 620, textAlign: "center" }}>Allocra</div>
    <T fs={104} top={730} left={60} right={60} style={{ textAlign: "center" }}>A smarter way<br />to allocate.</T>
    <div style={{ ...cap(24, P.cream, { letterSpacing: 6 }), position: "absolute", left: 0, right: 0, top: 1030, textAlign: "center" }}>allocra.buzz</div>
    <div style={{ ...mono(22, GOLD), position: "absolute", left: 0, right: 0, top: 1100, textAlign: "center" }}>@allocraa</div>
    <Foot n={15} />
  </>
);

const POSTS = [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15];
export const AllocraPosts15: React.FC = () => {
  const f = useCurrentFrame();
  const { width } = useVideoConfig();
  const Post = POSTS[f];
  return (
    <AbsoluteFill style={{ background: RED }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transform: `scale(${width / W})`, transformOrigin: "0 0", overflow: "hidden" }}>
        <Post />
      </div>
    </AbsoluteFill>
  );
};
