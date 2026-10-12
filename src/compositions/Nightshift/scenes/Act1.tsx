import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ETFS, money, NS, NS_EASE, NS_FONTS } from "../brand";
import {
  Chip,
  Cursor,
  GridCanvas,
  Mark,
  Node,
  PriceCard,
  StatusLine,
  typed,
  Wire,
} from "../components/Ui";
import { cue, ez, lerp } from "../timeline";

const SPY = ETFS[0];

/** 1. Logo build: mark snaps together, wordmark types on, ENGINE pill pops, a fair-value card flies in on the YOU cursor. */
export const LogoShot: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mark = spring({ frame: f - cue("logo", "mark"), fps, config: { damping: 14, stiffness: 160 } });
  const word = typed("NIGHTSHIFT", f, cue("logo", "word"), 2);
  const pill = spring({ frame: f - cue("logo", "pill"), fps, config: { damping: 11, stiffness: 220 } });
  const card = ez(f, cue("logo", "card"), 18);
  const lift = ez(f, cue("logo", "card"), 22, NS_EASE.inOut);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 55%, #0C1F19 0%, ${NS.bg} 60%)`,
      }}
    >
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          transform: `translate(${lerp(lift, 0, -180)}px, ${lerp(lift, 0, -40)}px) scale(${lerp(lift, 1, 0.86)})`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 34 }}>
          <div style={{ transform: `scale(${lerp(mark, 0.4, 1)}) rotate(${lerp(mark, -25, 0)}deg)` }}>
            <Mark size={150} t={mark} id="logo-mark" />
          </div>
          <div
            style={{
              fontFamily: NS_FONTS.word,
              fontSize: 104,
              color: NS.text,
              letterSpacing: 10,
              textShadow: `0 0 30px rgba(111,240,194,0.35)`,
              minWidth: 40,
            }}
          >
            {word}
          </div>
          <div style={{ transform: `scale(${pill})`, opacity: Math.min(1, pill * 2) }}>
            <Chip size={34}>ENGINE</Chip>
          </div>
        </div>
      </AbsoluteFill>
      {card > 0 ? (
        <div
          style={{
            position: "absolute",
            left: lerp(card, 2000, 1360),
            top: lerp(card, -300, 700),
            transform: `rotate(${lerp(card, 24, -6)}deg)`,
          }}
        >
          <PriceCard sym={SPY.sym} price={money(SPY.price)} chg={SPY.chg} conf={SPY.conf} width={400} />
          <Cursor x={300} y={150} who="you" />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/** 2. Desk: the YOU cursor drags the card onto the node canvas; camera drifts toward the prompt box. */
export const DeskShot: React.FC = () => {
  const f = useCurrentFrame();
  const grab = cue("desk", "grab");
  const drop = cue("desk", "drop");
  const drag = ez(f, grab, drop - grab, NS_EASE.inOut);
  const pan = ez(f, 36, 24, NS_EASE.inOut);
  const settle = spring({ frame: f - drop, fps: 30, config: { damping: 12, stiffness: 200 } });
  const cx = lerp(drag, 1180, 520);
  const cy = lerp(drag, 520, 380);
  return (
    <GridCanvas pan={[-f * 2 - pan * 640, -f]}>
      <AbsoluteFill style={{ transform: `translateX(${-pan * 640}px)` }}>
        {/* Empty node slots on the canvas */}
        {[
          [440, 300],
          [440, 640],
          [960, 640],
        ].map(([x, y], i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 420,
              height: 200,
              borderRadius: 18,
              border: `2px dashed rgba(185,245,216,${i === 0 ? 0.25 + 0.35 * drag : 0.12})`,
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            left: cx - 30,
            top: cy - 20,
            transform: `rotate(${lerp(drag, -6, 0) * (f < drop ? 1 : 1 - settle)}deg) scale(${f < grab ? 1 : f < drop ? 1.04 : lerp(settle, 1.04, 1)})`,
          }}
        >
          <PriceCard sym={SPY.sym} price={money(SPY.price)} chg={SPY.chg} conf={SPY.conf} width={400} />
          <Cursor x={300} y={150} who="you" press={f >= grab && f < grab + 4 ? 1 : 0} />
        </div>
        {/* Sidebar with the prompt box (camera arrives here at the end) */}
        <div
          style={{
            position: "absolute",
            left: 1720,
            top: 0,
            width: 840,
            height: 1080,
            background: NS.panel,
            borderLeft: `1.5px solid ${NS.line}`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 60,
              right: 60,
              bottom: 120,
              height: 280,
              borderRadius: 32,
              background: NS.panelHi,
              border: `1.5px solid ${NS.line}`,
            }}
          />
        </div>
      </AbsoluteFill>
      <StatusLine text="LIVE · NYSE CLOSED · MON 06:36 ET" style={{ position: "absolute", left: 120, top: 100 }} />
    </GridCanvas>
  );
};

const PROMPT = "When Wall Street sleeps, the Nightshift engine keeps pricing.";

/** 3. Prompt box types the site's line; YOU presses "Start the engine". */
export const PromptShot: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = cue("prompt", "type");
  const step = cue("prompt", "step");
  const click = cue("prompt", "click");
  const shown = typed(PROMPT, f, start, step);
  const caret = Math.floor(f / 8) % 2 === 0 && shown.length < PROMPT.length;
  const zoom = interpolate(f, [0, 75], [1.0, 1.05]);
  const move = ez(f, 40, click - 40, NS_EASE.inOut);
  const press = spring({ frame: f - click, fps, config: { damping: 9, stiffness: 260 } });
  const flash = interpolate(f - click, [0, 3, 14], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: NS.panel }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            position: "relative",
            width: 1560,
            height: 520,
            borderRadius: 48,
            background: NS.panelHi,
            border: `2px solid ${NS.line}`,
            boxShadow: "0 40px 120px rgba(0,0,0,0.55)",
            padding: "70px 80px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              fontFamily: NS_FONTS.sans,
              fontSize: 78,
              lineHeight: 1.25,
              color: NS.text,
              letterSpacing: -1,
            }}
          >
            {shown}
            {caret ? <span style={{ color: NS.mint }}>|</span> : null}
          </div>
          <div style={{ position: "absolute", left: 80, bottom: 70, fontFamily: NS_FONTS.sans, fontSize: 60, color: NS.dim }}>
            +
          </div>
          <div
            style={{
              position: "absolute",
              right: 70,
              bottom: 56,
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "24px 40px",
              borderRadius: 60,
              background: NS.mint,
              color: NS.ink,
              fontFamily: NS_FONTS.sans,
              fontWeight: 600,
              fontSize: 44,
              transform: `scale(${f >= click ? lerp(press, 0.9, 1) : 1})`,
              boxShadow: `0 0 ${20 + 80 * flash}px rgba(111,240,194,${0.3 + 0.6 * flash})`,
            }}
          >
            <div style={{ width: 14, height: 14, borderRadius: 7, background: NS.ink }} />
            Start the engine ↗
          </div>
          <Cursor
            x={lerp(move, 760, 1290)}
            y={lerp(move, 600, 440)}
            who="you"
            press={f >= click && f < click + 5 ? 1 : 0}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** 4. The ENGINE cursor builds the pricing graph: three inputs → Oracle → fair value (copy from the product page). */
export const BuildShot: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = (c: string) => spring({ frame: f - cue("build", c), fps, config: { damping: 13, stiffness: 190 } });
  const inputs = [
    { c: "in1", title: "OVERNIGHT FUTURES", y: 190 },
    { c: "in2", title: "WORLD MARKETS", y: 450 },
    { c: "in3", title: "SENTIMENT", y: 710 },
  ];
  const oracle = { x: 760, y: 360, w: 420 };
  const out = { x: 1360, y: 330, w: 420 };
  const wire = ez(f, cue("build", "wire"), 14, NS_EASE.inOut);
  const outT = pop("out");
  const wireOut = ez(f, cue("build", "out") - 6, 10, NS_EASE.inOut);
  const count = ez(f, cue("build", "out"), 22);
  // ENGINE cursor visits each spawn point just before it appears.
  const path: [number, number, number][] = [
    [0, 360, 140],
    [cue("build", "in1"), 420, 230],
    [cue("build", "in2"), 420, 490],
    [cue("build", "in3"), 420, 750],
    [cue("build", "oracle"), 1020, 420],
    [cue("build", "out"), 1640, 380],
    [90, 1700, 640],
  ];
  const frames = path.map((p) => p[0]);
  const cx = interpolate(f, frames, path.map((p) => p[1]), { extrapolateRight: "clamp", easing: NS_EASE.inOut });
  const cy = interpolate(f, frames, path.map((p) => p[2]), { extrapolateRight: "clamp", easing: NS_EASE.inOut });
  const zoom = interpolate(f, [0, 90], [1.04, 0.98]);
  return (
    <GridCanvas pan={[-f * 1.5, 0]}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        {inputs.map((n, i) => (
          <Wire
            key={n.c}
            from={[140 + 400 + 2, n.y + 92]}
            to={[oracle.x - 2, oracle.y + 92 + 40 * i]}
            t={wire}
          />
        ))}
        <Wire from={[oracle.x + oracle.w + 2, oracle.y + 92]} to={[out.x - 2, out.y + 92]} t={wireOut} />
        {inputs.map((n) => (
          <Node key={n.c} x={140} y={n.y} w={400} title={n.title} t={pop(n.c)} outputs={["SIGNAL"]} />
        ))}
        <Node
          x={oracle.x}
          y={oracle.y}
          w={oracle.w}
          title="ORACLE"
          t={pop("oracle")}
          inputs={["FUTURES", "MARKETS", "SENTIMENT"]}
          outputs={["FAIR VALUE", "CONF"]}
        >
          <div style={{ fontSize: 18, letterSpacing: 2, color: NS.dim }}>EVERY MINUTE</div>
        </Node>
        <Node x={out.x} y={out.y} w={out.w} title="SPY · FAIR VALUE" t={outT} inputs={["FAIR VALUE"]}>
          <div style={{ fontFamily: NS_FONTS.display, fontWeight: 500, fontSize: 66, color: NS.text, letterSpacing: -1 }}>
            {money(lerp(count, 700, SPY.price))}
          </div>
          <div style={{ fontSize: 20, letterSpacing: 2, color: NS.up, marginTop: 6 }}>
            {SPY.chg} <span style={{ color: NS.dim }}>· CONF {Math.round(lerp(count, 0, SPY.conf))}</span>
          </div>
        </Node>
      </AbsoluteFill>
      <Cursor x={cx} y={cy} who="engine" />
    </GridCanvas>
  );
};

