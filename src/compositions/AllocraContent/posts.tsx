import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Grid, Logo, P, Painting, Slate, mono, sans, serif } from "./kit";
import { ProtoCard } from "./videos";

/** Allocra posts: 10 stills, 1080x1350 (4:5), frame N = post N+1. Render with --scale=2 for 2160x2700. */
const W = 1080;
const H = 1350;

const Foot: React.FC<{ n: number; dark?: boolean }> = ({ n, dark = true }) => (
  <div style={{ ...mono(14, dark ? "rgba(246,218,195,0.65)" : "rgba(61,24,18,0.7)", { letterSpacing: 3 }), position: "absolute", left: 70, right: 70, bottom: 48, display: "flex", justifyContent: "space-between" }}>
    <span>Allocra · Preview / TestNet demo · Not investment advice</span><span>{String(n).padStart(2, "0")}/10</span>
  </div>
);
const Bg: React.FC<{ c: string }> = ({ c }) => <div style={{ position: "absolute", inset: 0, background: c }} />;
const Tag: React.FC<{ children: string; color?: string }> = ({ children, color = P.cream }) => <div style={{ ...mono(20, color), position: "absolute", left: 70, top: 70 }}>{children}</div>;

const P1: React.FC = () => (
  <>
    <Bg c={P.red} /><Grid />
    <Tag>Private allocation desk / 01</Tag>
    <div style={{ position: "absolute", right: 70, top: 56 }}><Logo size={96} /></div>
    <div style={{ ...serif(250), position: "absolute", left: 60, top: 300 }}>Your assets.<br />Your<br />allocation.</div>
    <div style={{ ...sans(36, P.cream), position: "absolute", left: 70, right: 120, bottom: 150, lineHeight: 1.3 }}>Plan a tokenized ETF basket around the positions you actually want to own.</div>
    <div style={{ ...mono(18, P.cream), position: "absolute", left: 70, bottom: 105 }}>MMXXVI +</div>
    <Foot n={1} />
  </>
);
const P2: React.FC = () => (
  <>
    <Bg c={P.dark} /><Grid />
    <Tag>Plan first</Tag>
    <div style={{ ...serif(104), position: "absolute", left: 70, top: 120 }}>See it before<br />you confirm.</div>
    <div style={{ position: "absolute", left: 150, top: 335, transform: "scale(0.86)", transformOrigin: "0 0" }}><Slate /></div>
    <Foot n={2} />
  </>
);
const paintPost = (img: string, w: number, h: number, title: React.ReactNode, sub: string, n: number, extra?: string): React.FC => () => (
  <>
    <Bg c={P.dark} /><Grid />
    <Tag>{extra ?? "Old masters. New allocation."}</Tag>
    <div style={{ position: "absolute", left: (W - w) / 2, top: 130 }}><Painting src={img} w={w} h={h} /></div>
    <div style={{ ...serif(104), position: "absolute", left: 70, right: 70, top: 130 + h + 84 }}>{title}</div>
    <div style={{ ...mono(20, P.dim), position: "absolute", left: 70, right: 70, top: 130 + h + 84 + 250 }}>{sub}</div>
    <Foot n={n} />
  </>
);
const P3 = paintPost("adam", 940, 560, <span>Human judgment,<br />machine precision.</span>, "Plan with data. Decide yourself.", 3);
const P4 = paintPost("scholars", 940, 520, <span>Look beneath<br />the percentages.</span>, "Overlap, concentration, cost", 4);
const P5 = paintPost("reader", 640, 700, <span>Read before<br />you act.</span>, "Quotes and costs, checked first", 5, "The collection / 02");
const P6 = paintPost("lions", 600, 700, <span>Hold steady.</span>, "Volatility is part of the story", 6, "The collection / 02");

const PROT: [string, string, string, string][] = [
  ["Ondo Finance", "@Ondo", "383.9K", "March 2021"], ["xStocks", "@xStocksFi", "87.3K", "April 2025"], ["Centrifuge", "@centrifuge", "94.2K", "April 2018"],
  ["Maple", "@maplefinance", "62.4K", "August 2019"], ["Chainlink", "@chainlink", "1.3M", "June 2013"],
];
const P7: React.FC = () => (
  <>
    <Bg c={P.dark} /><Grid />
    <Tag>The universe / 03</Tag>
    <div style={{ ...serif(104), position: "absolute", left: 70, right: 70, top: 130 }}>Built around the tokenization ecosystem.</div>
    <div style={{ position: "absolute", left: 70, right: 70, top: 470 }}>
      {PROT.map(([n, h, f, j]) => (
        <div key={n} style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", height: 124, borderTop: "1px solid rgba(246,218,195,0.3)", paddingTop: 22 }}>
          <div><div style={serif(58)}>{n}</div><div style={mono(16, P.dim, { marginTop: 8 })}>{h}</div></div>
          <div style={{ textAlign: "right" }}><div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 40, color: P.cream }}>{f}</div><div style={mono(14, P.dim, { marginTop: 6 })}>followers on X · joined {j}</div></div>
        </div>
      ))}
    </div>
    <div style={{ ...mono(14, "rgba(246,218,195,0.7)", { letterSpacing: 1.5, lineHeight: 1.6 }), position: "absolute", left: 70, right: 70, bottom: 100 }}>Source: official X profiles, checked 24 Oct 2026. Logos and names belong to their owners. Allocra is not affiliated with, sponsored or endorsed by these protocols.</div>
    <Foot n={7} />
  </>
);
const P8: React.FC = () => (
  <>
    <Bg c={P.red} /><Grid />
    <Tag>Verify it yourself</Tag>
    <div style={{ ...serif(150), position: "absolute", left: 70, right: 70, top: 200 }}>Every figure comes from the protocol’s own X profile.</div>
    <div style={{ position: "absolute", left: 70, top: 940, background: P.cream, ...sans(34, "#3d1812", { fontWeight: 500 }), padding: "26px 44px" }}>Verify on X ↗</div>
    <div style={{ ...sans(34, P.cream), position: "absolute", left: 70, right: 100, top: 1090 }}>With a link to check it yourself.</div>
    <div style={{ ...mono(16, P.cream), position: "absolute", left: 70, top: 1190 }}>Source: official X profile, checked 24 Oct 2026.</div>
    <Foot n={8} />
  </>
);
const P9: React.FC = () => (
  <>
    <Bg c={P.cream} />
    <Tag color="#3d1812">Allocation</Tag>
    <div style={{ position: "absolute", right: 70, top: 56 }}><Logo size={96} /></div>
    <div style={{ ...serif(230, "#3d1812"), position: "absolute", left: 60, top: 280 }}>Allocation<br />is a decision,<br />not a default.</div>
    <Foot n={9} dark={false} />
  </>
);
const P10: React.FC = () => (
  <>
    <Bg c={P.red} /><Grid />
    <div style={{ position: "absolute", left: W / 2 - 150, top: 170 }}><Logo size={300} /></div>
    <div style={{ ...sans(56, P.cream, { fontWeight: 500, letterSpacing: -1 }), position: "absolute", left: 0, right: 0, top: 520, textAlign: "center" }}>Allocra</div>
    <div style={{ ...serif(130), position: "absolute", left: 60, right: 60, top: 640, textAlign: "center" }}>Plan clearly.<br />Act deliberately.</div>
    <div style={{ ...sans(32, P.cream), position: "absolute", left: 60, right: 60, top: 980, textAlign: "center" }}>Assets remain individually held.</div>
    <div style={{ ...mono(26, P.cream), position: "absolute", left: 0, right: 0, top: 1060, textAlign: "center" }}>allocra.buzz</div>
    <Foot n={10} />
  </>
);

const POSTS = [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10];
export const AllocraPosts: React.FC = () => {
  const f = useCurrentFrame();
  const { width } = useVideoConfig();
  const Post = POSTS[f];
  return (
    <AbsoluteFill style={{ background: P.dark }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transform: `scale(${width / W})`, transformOrigin: "0 0", overflow: "hidden" }}>
        <Post />
      </div>
    </AbsoluteFill>
  );
};
export { ProtoCard };
