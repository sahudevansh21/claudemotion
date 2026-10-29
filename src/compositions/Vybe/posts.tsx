import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Bg, Btn, Burst, Card, Chip, Cube, Foot, H, HLPill, LIL, Logo, Mascot, Num, OUT, Photo, Pop, Sparkle, Step, Testnet, V, W } from "./kit";

const Txt: React.FC<{ children: React.ReactNode; fs: number; w?: number; x: number; y: number; weight?: number; color?: string; align?: "left" | "center"; lh?: number }> = ({ children, fs, w = 960, x, y, weight = 600, color = V.navy, align = "left", lh = 1.18 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, fontFamily: OUT, fontWeight: weight, fontSize: fs, color, textAlign: align, lineHeight: lh }}>{children}</div>
);

/* 01 Hero */
const P1: React.FC = () => (
  <>
    <Bg />
    <Photo src="banner.jpg" x={40} y={40} w={1000} h={372} r={40} />
    <Sparkle x={930} y={380} s={70} r={10} /><Sparkle x={70} y={392} s={44} />
    <Txt x={60} y={466} fs={64} weight={800} lh={1.08}>Turn a market opinion into a trade anyone can copy, and earn every time they do.</Txt>
    <div style={{ position: "absolute", left: 60, top: 880, display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", gap: 22 }}><Step n={1} label="Pick markets" bg={V.yellow} fs={38} /><Step n={2} label="One click" bg={V.chip} fs={38} /></div>
      <Step n={3} label="Earn on every trade" bg={V.green} fs={38} />
    </div>
    <div style={{ position: "absolute", left: 60, top: 1090, display: "flex", gap: 20, alignItems: "center" }}><Btn dark fs={34}>Launch a theme</Btn><Btn fs={34}>Explore</Btn><Testnet fs={26} /></div>
    <Foot n={1} />
  </>
);

/* 02 Recipe */
const P2: React.FC = () => {
  const rows = [{ t: "NVDA", p: 40, c: V.chip }, { t: "AMD", p: 30, c: V.pink }, { t: "TSM", p: 30, c: V.yellow }];
  return (
    <>
      <Bg kind="cyan" />
      <Cube x={880} y={90} s={150} c={V.pink} r={8} /><Sparkle x={70} y={820} s={60} r={-8} />
      <Pop size={150} style={{ position: "absolute", left: 60, top: 70 }}>A theme is a recipe.</Pop>
      <Card style={{ left: 60, top: 520, width: 960, height: 420, padding: 36 }}>
        <div style={{ display: "flex", height: 120, borderRadius: 26, overflow: "hidden", border: `6px solid ${V.navy}` }}>
          {rows.map((r) => (<div key={r.t} style={{ width: `${r.p}%`, background: r.c, borderRight: r.t === "TSM" ? "none" : `6px solid ${V.navy}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: LIL, fontSize: 52, color: V.navy }}>{r.p}%</div>))}
        </div>
        <div style={{ display: "flex", gap: 20, marginTop: 36 }}>{rows.map((r) => (<div key={r.t} style={{ flex: 1, textAlign: "center" }}><div style={{ width: 54, height: 54, borderRadius: 99, background: r.c, border: `5px solid ${V.navy}`, margin: "0 auto" }} /><div style={{ fontFamily: LIL, fontSize: 64, color: V.navy, marginTop: 10 }}>{r.t}</div></div>))}</div>
        <div style={{ position: "absolute", right: 28, top: -34, transform: "rotate(6deg)" }}><Chip bg={V.yellow} fs={26} style={{ fontWeight: 700 }}>EXAMPLE</Chip></div>
      </Card>
      <Txt x={60} y={990} fs={40} weight={600}>A theme is a recipe like 40% NVDA, 30% AMD, 30% TSM. VYBE opens every leg on Hyperliquid at once.</Txt>
      <Foot n={2} />
    </>
  );
};

/* 03-05 steps */
const StepPost: React.FC<{ n: number; label: string; bg: BgK; chip: string; line: string; photo: string; pos: string }> = ({ n, label, bg, chip, line, photo, pos }) => (
  <>
    <Bg kind={bg} />
    <Sparkle x={900} y={70} s={80} r={12} /><Sparkle x={70} y={560} s={46} />
    <Num n={n} s={230} style={{ position: "absolute", left: 60, top: 70, fontSize: 130 }} />
    <div style={{ position: "absolute", left: 60, top: 340 }}><Chip bg={chip} fs={label.length > 14 ? 80 : 98}>{label}</Chip></div>
    <Txt x={60} y={520} fs={58} weight={800} lh={1.1}>{line}</Txt>
    <Photo src={photo} x={40} y={820} w={1000} h={380} pos={pos} />
    <Foot n={n + 2} />
  </>
);
type BgK = "grad" | "cyan" | "yellow" | "pink" | "lime" | "navy";
const P3: React.FC = () => <StepPost n={1} label="Pick markets" bg="yellow" chip={V.chip} line="Stock, gold or crypto. Pick the markets you believe in." photo="banner-left.jpg" pos="50% 70%" />;
const P4: React.FC = () => <StepPost n={2} label="One click" bg="cyan" chip={V.yellow} line="VYBE opens every leg on Hyperliquid at once." photo="banner.jpg" pos="50% 50%" />;
const P5: React.FC = () => <StepPost n={3} label="Earn on every trade" bg="lime" chip={V.yellow} line="Creators earn a share of the fees." photo="banner-right.jpg" pos="50% 60%" />;

/* 06 30 seconds */
const P6: React.FC = () => (
  <>
    <Bg />
    <Burst x={680} y={40} s={360} r={10} /><Cube x={70} y={90} s={150} c={V.yellow} r={-10} /><Sparkle x={900} y={520} s={90} />
    <Pop size={560} align="center" style={{ position: "absolute", left: 0, top: 150, width: 1080 }}>30</Pop>
    <Pop size={150} align="center" style={{ position: "absolute", left: 0, top: 740, width: 1080 }}>seconds</Pop>
    <Txt x={80} y={950} fs={46} weight={700} align="center" w={920}>Launch a stock, gold or crypto theme in 30 seconds.</Txt>
    <div style={{ position: "absolute", left: 0, width: 1080, top: 1110, display: "flex", justifyContent: "center", gap: 20 }}><Btn dark fs={40}>Launch a theme</Btn></div>
    <Foot n={6} />
  </>
);

/* 07 custody */
const P7: React.FC = () => (
  <>
    <Bg kind="navy" />
    <Sparkle x={880} y={80} s={90} r={10} fill={V.yellow} /><Sparkle x={90} y={820} s={60} fill={V.chip} /><Cube x={840} y={760} s={170} c={V.pink} r={8} />
    <Pop size={170} style={{ position: "absolute", left: 60, top: 80 }}>You keep custody.</Pop>
    <svg style={{ position: "absolute", left: 340, top: 520 }} width={400} height={400} viewBox="0 0 100 100">
      <path d="M28 46V32a22 22 0 0144 0v14" fill="none" stroke={V.yellow} strokeWidth={9} strokeLinecap="round" />
      <rect x="16" y="44" width="68" height="46" rx="12" fill={V.pink} stroke="#fff" strokeWidth={4} />
      <circle cx="50" cy="63" r="7" fill={V.navy} /><rect x="47" y="63" width="6" height="16" rx="3" fill={V.navy} />
    </svg>
    <Txt x={60} y={980} fs={64} weight={800} color={V.yellow} lh={1.1}>VYBE never holds funds or keys.</Txt>
    <Foot n={7} dark note="Built on Hyperliquid" />
  </>
);

/* 08 Hyperliquid */
const P8: React.FC = () => (
  <>
    <Bg kind="cyan" />
    <Sparkle x={90} y={90} s={70} /><Sparkle x={900} y={1000} s={80} r={14} /><Cube x={860} y={90} s={150} c={V.yellow} r={10} />
    <Pop size={170} style={{ position: "absolute", left: 60, top: 240 }}>Built on Hyperliquid.</Pop>
    <div style={{ position: "absolute", left: 0, width: 1080, top: 700, display: "flex", justifyContent: "center" }}><HLPill fs={72} /></div>
    <Txt x={60} y={940} fs={52} weight={700} align="center" w={960}>VYBE routes orders to Hyperliquid.</Txt>
    <Foot n={8} />
  </>
);

/* 09 three steps */
const P9: React.FC = () => (
  <>
    <Bg />
    <Burst x={760} y={30} s={300} r={-8} /><Sparkle x={60} y={60} s={60} />
    <Pop size={190} style={{ position: "absolute", left: 60, top: 130 }}>Three steps.</Pop>
    <div style={{ position: "absolute", left: 60, top: 460, display: "flex", flexDirection: "column", gap: 44 }}>
      <Step n={1} label="Pick markets" bg={V.yellow} fs={78} />
      <Step n={2} label="One click" bg={V.chip} fs={78} />
      <Step n={3} label="Earn on every trade" bg={V.green} fs={78} />
    </div>
    <Foot n={9} />
  </>
);

/* 10 next-gen */
const P10: React.FC = () => (
  <>
    <Bg />
    <Burst x={-40} y={880} s={330} r={4} /><Cube x={870} y={900} s={190} c={V.yellow} r={-6} /><Sparkle x={690} y={170} s={70} /><Sparkle x={140} y={560} s={54} />
    <div style={{ position: "absolute", left: 50, top: 70, display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}><Chip bg={V.yellow} fs={50}>Next-Gen</Chip><div style={{ display: "flex", alignItems: "center", gap: 8 }}><Num n={1} s={72} /><Chip bg={V.chip} fs={50}>Trading</Chip></div></div>
    <div style={{ position: "absolute", right: 50, top: 250, display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-end" }}><Chip bg={V.yellow} fs={50}>One Click</Chip><div style={{ display: "flex", alignItems: "center", gap: 8 }}><Num n={2} s={72} /><Chip bg={V.chip} fs={50}>Markets</Chip></div></div>
    <Logo w={940} style={{ position: "absolute", left: 70, top: 470 }} />
    <Mascot s={250} style={{ position: "absolute", left: 415, top: 880 }} ring={10} />
    <Foot n={10} />
  </>
);

/* 11 opinion -> trade */
const P11: React.FC = () => (
  <>
    <Bg kind="yellow" />
    <Sparkle x={900} y={90} s={80} /><Cube x={870} y={1080} s={130} c={V.pink} r={-8} />
    <Card bg="#fff" style={{ left: 60, top: 90, width: 760, height: 330, padding: "44px 48px" }}>
      <div style={{ fontFamily: OUT, fontWeight: 600, fontSize: 28, color: "#6b6785" }}>Your</div>
      <div style={{ fontFamily: LIL, fontSize: 112, color: V.navy, lineHeight: 1.0, marginTop: 6 }}>market opinion</div>
    </Card>
    <svg style={{ position: "absolute", left: 460, top: 450 }} width={160} height={190} viewBox="0 0 100 120"><path d="M50 8v76M22 60l28 34 28-34" fill="none" stroke={V.navy} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" /></svg>
    <Card bg={V.chip} style={{ left: 220, top: 660, width: 800, height: 330, padding: "44px 48px" }}>
      <div style={{ fontFamily: OUT, fontWeight: 600, fontSize: 28, color: V.navy }}>A trade</div>
      <div style={{ fontFamily: LIL, fontSize: 112, color: V.navy, lineHeight: 1.0, marginTop: 6 }}>anyone can copy</div>
    </Card>
    <Txt x={60} y={1100} fs={54} weight={800}>…and earn every time they do.</Txt>
    <Foot n={11} />
  </>
);

/* 12 island city */
const P12: React.FC = () => (
  <>
    <Bg kind="cyan" />
    <Photo src="banner.jpg" x={40} y={40} w={1000} h={500} pos="50% 55%" scale={1.12} />
    <Pop size={96} style={{ position: "absolute", left: 60, top: 590 }}>An island city of trading, one click and markets.</Pop>
    <div style={{ position: "absolute", left: 60, top: 980, width: 960, display: "flex", flexWrap: "wrap", gap: 20 }}>
      {["Explore", "Create", "Portfolio", "Leaderboard", "Creator"].map((t, i) => (<Chip key={t} bg={[V.yellow, V.chip, V.green, V.pink, V.yellow][i]} fs={46}>{t}</Chip>))}
    </div>
    <Foot n={12} />
  </>
);

/* 13 leaderboard */
const P13: React.FC = () => (
  <>
    <Bg kind="pink" />
    <Sparkle x={900} y={90} s={90} r={8} /><Sparkle x={70} y={100} s={56} /><Burst x={780} y={760} s={300} fill={V.yellow} r={6} />
    <Pop size={170} style={{ position: "absolute", left: 60, top: 210 }}>Check the Leaderboard.</Pop>
    <div style={{ position: "absolute", left: 130, top: 700, display: "flex", alignItems: "flex-end", gap: 24 }}>
      {[{ n: 2, h: 250, c: V.chip }, { n: 1, h: 380, c: V.yellow }, { n: 3, h: 190, c: V.green }].map((p) => (
        <div key={p.n} style={{ width: 240, height: p.h, background: p.c, border: `6px solid ${V.navy}`, borderRadius: "34px 34px 0 0", boxShadow: `8px 0 0 ${V.navy}`, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 22, boxSizing: "border-box" }}><Num n={p.n} s={96} style={{ background: "#fff" }} /></div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 60, bottom: 110, fontFamily: "'JetBrains Mono', monospace", fontSize: 18, letterSpacing: 5, color: "rgba(24,17,46,0.55)", textTransform: "uppercase" }}>Illustrative</div>
    <Foot n={13} />
  </>
);

/* 14 risk */
const P14: React.FC = () => (
  <>
    <Bg kind="lime" />
    <Sparkle x={900} y={80} s={80} r={10} /><Cube x={850} y={1090} s={120} c={V.pink} r={-8} />
    <Mascot s={220} style={{ position: "absolute", left: 60, top: 80 }} ring={9} />
    <div style={{ position: "absolute", right: 60, top: 110 }}><Testnet fs={34} /></div>
    <Pop size={170} style={{ position: "absolute", left: 60, top: 350 }}>Perps are risky.</Pop>
    <Card style={{ left: 60, top: 760, width: 960, height: 300, padding: "40px 44px" }}>
      <div style={{ fontFamily: OUT, fontWeight: 600, fontSize: 40, lineHeight: 1.3, color: V.navy }}>VYBE routes orders to Hyperliquid. You keep custody; VYBE never holds funds or keys. Perps are risky.</div>
    </Card>
    <Foot n={14} />
  </>
);

/* 15 end card */
const P15: React.FC = () => (
  <>
    <Bg />
    <Burst x={-60} y={50} s={360} r={6} /><Cube x={870} y={80} s={180} c={V.yellow} r={8} /><Sparkle x={760} y={620} s={80} /><Sparkle x={150} y={640} s={50} />
    <Mascot s={280} style={{ position: "absolute", left: 400, top: 120 }} ring={11} />
    <Logo w={880} style={{ position: "absolute", left: 100, top: 470 }} />
    <div style={{ position: "absolute", left: 0, width: 1080, top: 780, display: "flex", justifyContent: "center", gap: 20 }}><Btn dark fs={46}>Launch a theme</Btn></div>
    <div style={{ position: "absolute", left: 0, width: 1080, top: 960, display: "flex", justifyContent: "center", gap: 22, alignItems: "center" }}><HLPill fs={34} /><Testnet fs={26} /></div>
    <Txt x={0} y={1090} fs={44} weight={700} align="center" w={1080}>X @vybe_fi</Txt>
  </>
);

const POSTS = [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15];
/** VYBE posts: 15 stills, 4:5, frame N = post N+1. Render with --scale=2 for 2160x2700. */
export const VybePosts: React.FC = () => {
  const f = useCurrentFrame();
  const { width } = useVideoConfig();
  const Post = POSTS[f];
  return (
    <AbsoluteFill style={{ background: V.cyan }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transform: `scale(${width / W})`, transformOrigin: "0 0", overflow: "hidden" }}><Post /></div>
    </AbsoluteFill>
  );
};
