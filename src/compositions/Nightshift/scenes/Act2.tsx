import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ETFS, money, NS, NS_EASE, NS_FONTS, STOCKS } from "../brand";
import { Cursor, GridCanvas, Node, PriceCard, StatusLine, Wire } from "../components/Ui";
import { cue, ez, lerp } from "../timeline";

/** 5 / 9. Light statement card, lines wipe up one after another (as in the reference). */
export const StatementCard: React.FC<{ id: string; lines: [string, string] }> = ({ id, lines }) => {
  const f = useCurrentFrame();
  const at = [cue(id, "line1"), cue(id, "line2")];
  const drift = interpolate(f, [0, 60], [1.0, 1.04]);
  return (
    <AbsoluteFill style={{ background: NS.paper, justifyContent: "center", alignItems: "center" }}>
      <div style={{ transform: `scale(${drift})`, textAlign: "center" }}>
        {lines.map((l, i) => {
          const t = ez(f, at[i], 10);
          return (
            <div key={l} style={{ overflow: "hidden", padding: "6px 0" }}>
              <div
                style={{
                  fontFamily: NS_FONTS.display,
                  fontWeight: 800,
                  fontSize: 96,
                  color: NS.ink,
                  letterSpacing: -1,
                  lineHeight: 1.12,
                  transform: `translateY(${lerp(t, 110, 0)}%)`,
                }}
              >
                {l}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Spark: React.FC<{ seed: string; w: number; h: number; t: number }> = ({ seed, w, h, t }) => {
  const pts = Array.from({ length: 40 }, (_, i) => {
    const y = 0.5 + 0.32 * Math.sin(i / 3 + random(seed) * 6) * random(`${seed}a${i}`) + (i / 40 - 0.5) * 0.3 * (random(`${seed}d`) - 0.3);
    return `${(i / 39) * w},${(1 - Math.min(0.95, Math.max(0.05, y))) * h}`;
  }).join(" ");
  return (
    <svg width={w} height={h}>
      <polyline
        points={pts}
        fill="none"
        stroke={NS.up}
        strokeWidth={3}
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - t}
      />
    </svg>
  );
};

/** 6. Zoom-out wall: every ETF token and top stock fills with its fair value, ENGINE cursor roams. */
export const WallShot: React.FC = () => {
  const f = useCurrentFrame();
  const step = cue("wall", "step") * 2;
  const cam = ez(f, 0, 70, NS_EASE.inOut);
  const scale = lerp(cam, 1.35, 0.94);
  const cx = interpolate(f, [0, 30, 60, 90], [520, 1180, 760, 1460], { easing: NS_EASE.inOut });
  const cy = interpolate(f, [0, 30, 60, 90], [330, 420, 760, 700], { easing: NS_EASE.inOut });
  return (
    <GridCanvas pan={[-f, -f * 0.5]}>
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: "30% 35%" }}>
        {ETFS.map((e, i) => {
          const t = ez(f, 6 + i * step, 14);
          const c = ez(f, 6 + i * step, 24);
          return (
            <div key={e.sym} style={{ position: "absolute", left: 140 + i * 420, top: 170, opacity: t, transform: `translateY(${lerp(t, 30, 0)}px)` }}>
              <PriceCard sym={e.sym} price={money(lerp(c, e.price * 0.9, e.price))} chg={e.chg} conf={e.conf} width={380} />
            </div>
          );
        })}
        {STOCKS.map((s, i) => {
          const at = 6 + (i + 4) * step;
          const t = ez(f, at, 14);
          const c = ez(f, at, 24);
          return (
            <div
              key={s.sym}
              style={{
                position: "absolute",
                left: 140 + i * 420,
                top: 470,
                width: 380,
                padding: "24px 28px",
                boxSizing: "border-box",
                borderRadius: 18,
                background: NS.panel,
                border: `1.5px solid ${NS.line}`,
                opacity: t,
                transform: `translateY(${lerp(t, 30, 0)}px)`,
                fontFamily: NS_FONTS.mono,
              }}
            >
              <div style={{ fontFamily: NS_FONTS.sans, fontWeight: 600, fontSize: 30, color: NS.text }}>
                {s.name} <span style={{ fontFamily: NS_FONTS.mono, fontWeight: 400, fontSize: 20, color: NS.dim, marginLeft: 8 }}>{s.sym}</span>
              </div>
              <div style={{ fontSize: 16, letterSpacing: 2.5, color: NS.dim, marginTop: 18 }}>NIGHTSHIFT FAIR VALUE</div>
              <div style={{ fontFamily: NS_FONTS.display, fontWeight: 500, fontSize: 52, color: NS.text, margin: "6px 0", letterSpacing: -1 }}>
                {money(lerp(c, s.price * 0.9, s.price))}
              </div>
              <div style={{ fontSize: 17, color: NS.down, letterSpacing: 1 }}>
                {s.chg} vs close {money(s.close)}
              </div>
              <div style={{ margin: "16px 0 10px" }}>
                <Spark seed={s.sym} w={320} h={70} t={c} />
              </div>
              <div style={{ fontSize: 17, color: NS.dim, letterSpacing: 1 }}>Conf. {s.conf}</div>
            </div>
          );
        })}
      </AbsoluteFill>
      <StatusLine text="NYSE CLOSED · MON 06:36 ET" style={{ position: "absolute", right: 120, top: 100 }} />
      <Cursor x={cx} y={cy} who="engine" />
    </GridCanvas>
  );
};

/** 7. Engine state card (site copy). YOU taps it, the engine comes online. */
export const StatusShot: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tap = cue("status", "tap");
  const on = ez(f, cue("status", "online"), 12);
  const press = spring({ frame: f - tap, fps, config: { damping: 10, stiffness: 260 } });
  const move = ez(f, 0, tap, NS_EASE.inOut);
  const zoom = interpolate(f, [0, 60], [1.02, 1.08]);
  const card = (children: React.ReactNode, x: number, glow = 0) => (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 290,
        width: 780,
        height: 460,
        boxSizing: "border-box",
        padding: "48px 56px",
        borderRadius: 28,
        background: `linear-gradient(160deg, ${NS.panelHi}, ${NS.panel})`,
        border: `1.5px solid ${glow > 0 ? `rgba(185,245,216,${0.15 + 0.6 * glow})` : NS.line}`,
        boxShadow: `0 30px 90px rgba(0,0,0,0.6), 0 0 ${90 * glow}px rgba(111,240,194,${0.35 * glow})`,
      }}
    >
      {children}
    </div>
  );
  const label = { fontFamily: NS_FONTS.mono, fontSize: 22, letterSpacing: 4, color: NS.dim } as const;
  const big = { fontFamily: NS_FONTS.display, fontWeight: 500, fontSize: 96, color: NS.text, letterSpacing: -2, lineHeight: 1.1 } as const;
  return (
    <AbsoluteFill style={{ background: NS.bg }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <StatusLine text="LIVE · NYSE CLOSED · MON 06:36 ET" style={{ position: "absolute", left: 140, top: 170 }} />
        <div style={{ transform: `scale(${f >= tap ? lerp(press, 0.97, 1) : 1})`, transformOrigin: "520px 520px", position: "absolute", inset: 0 }}>
          {card(
            <>
              <div style={label}>ENGINE STATE</div>
              <div style={{ ...big, marginTop: 70, position: "relative", height: 110 }}>
                <span style={{ position: "absolute", opacity: 1 - on }}>Standby.</span>
                <span style={{ position: "absolute", opacity: on, color: NS.mint, textShadow: `0 0 30px rgba(111,240,194,0.5)` }}>Online.</span>
              </div>
              <div style={{ fontFamily: NS_FONTS.sans, fontSize: 44, color: NS.dim, marginTop: 40 }}>Touch to start</div>
            </>,
            140,
            on,
          )}
        </div>
        {card(
          <>
            <div style={label}>AFTER HOURS</div>
            <div style={{ ...big, marginTop: 50 }}>
              The city
              <br />
              never closes.
            </div>
            <div style={{ fontFamily: NS_FONTS.sans, fontSize: 44, color: NS.dim, marginTop: 30 }}>Enter the city</div>
          </>,
          1000,
        )}
        <div style={{ position: "absolute", left: 140, top: 800, opacity: on }}>
          <StatusLine text="ENGINE ONLINE" size={26} style={{ color: NS.mint }} />
        </div>
      </AbsoluteFill>
      <Cursor x={lerp(move, 1300, 560)} y={lerp(move, 900, 640)} who="you" press={f >= tap && f < tap + 5 ? 1 : 0} />
    </AbsoluteFill>
  );
};

const Badge: React.FC<{ live?: boolean }> = ({ live }) => (
  <span
    style={{
      fontFamily: NS_FONTS.mono,
      fontSize: 18,
      padding: "6px 14px",
      borderRadius: 10,
      background: live ? "rgba(185,245,216,0.12)" : "rgba(232,194,122,0.12)",
      color: live ? NS.mint : NS.amber,
      letterSpacing: 1,
    }}
  >
    {live ? "Live" : "Testnet-ready"}
  </span>
);

const Verified: React.FC<{ n: number }> = ({ n }) => (
  <div
    style={{
      display: "inline-block",
      fontFamily: NS_FONTS.mono,
      fontSize: 17,
      padding: "6px 14px",
      borderRadius: 20,
      border: `1.5px solid ${NS.line}`,
      color: NS.text,
      margin: "4px 0 14px",
    }}
  >
    Mathematically verified · {n} properties
  </div>
);

/** 8. Product chain (product page): Oracle feeds the Vault and the Guardian. */
export const ProductsShot: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = (c: string) => spring({ frame: f - cue("products", c), fps, config: { damping: 13, stiffness: 190 } });
  const head = ez(f, cue("products", "head"), 14);
  const wires = ez(f, cue("products", "wires"), 14, NS_EASE.inOut);
  const oracle = { x: 140, y: 470, w: 520 };
  const vault = { x: 1200, y: 330, w: 560 };
  const guard = { x: 1200, y: 680, w: 560 };
  const text = { fontFamily: NS_FONTS.sans, fontSize: 26, color: NS.dim, lineHeight: 1.35 } as const;
  const cx = interpolate(f, [0, 20, 44, 75], [900, 520, 1500, 1620], { easing: NS_EASE.inOut, extrapolateRight: "clamp" });
  const cy = interpolate(f, [0, 20, 44, 75], [900, 640, 520, 880], { easing: NS_EASE.inOut, extrapolateRight: "clamp" });
  return (
    <GridCanvas pan={[-f * 1.2, 0]}>
      <div
        style={{
          position: "absolute",
          left: 140,
          top: 110,
          opacity: head,
          transform: `translateY(${lerp(head, 24, 0)}px)`,
          fontFamily: NS_FONTS.display,
          fontWeight: 500,
          fontSize: 60,
          lineHeight: 1.15,
          color: NS.text,
          letterSpacing: -1.5,
        }}
      >
        One live price, and the
        <br />
        products built on it.
      </div>
      <Wire from={[oracle.x + oracle.w + 2, oracle.y + 92]} to={[vault.x - 2, vault.y + 92]} t={wires} />
      <Wire from={[oracle.x + oracle.w + 2, oracle.y + 92]} to={[guard.x - 2, guard.y + 92]} t={wires} />
      <Node x={oracle.x} y={oracle.y} w={oracle.w} title="ORACLE" t={pop("oracle")} outputs={["FAIR VALUE"]}>
        <div style={{ marginBottom: 6 }}><Badge live /></div>
        <Verified n={6} />
        <div style={text}>A fair value every minute.</div>
      </Node>
      <Node x={vault.x} y={vault.y} w={vault.w} title="VAULT" t={pop("vault")} inputs={["PRICE"]}>
        <div style={{ marginBottom: 6 }}><Badge /></div>
        <Verified n={8} />
        <div style={text}>Lends against it.</div>
      </Node>
      <Node x={guard.x} y={guard.y} w={guard.w} title="GUARDIAN" t={pop("guardian")} inputs={["PRICE"]}>
        <div style={{ marginBottom: 6 }}><Badge /></div>
        <Verified n={6} />
        <div style={text}>Monitors loans with it.</div>
      </Node>
      <Cursor x={cx} y={cy} who="engine" />
    </GridCanvas>
  );
};

/** 10. Big zoom on the Oracle: three inputs into a confidence ring; YOU and ENGINE trade places. */
export const ZoomShot: React.FC = () => {
  const f = useCurrentFrame();
  const ring = ez(f, cue("zoom", "ring"), 30, NS_EASE.inOut);
  const zoom = interpolate(f, [0, 60], [1.12, 1.0], { easing: NS_EASE.out });
  const you = ez(f, cue("zoom", "you"), 22, NS_EASE.inOut);
  const eng = ez(f, cue("zoom", "engine") - 14, 20, NS_EASE.inOut);
  const R = 150;
  const circ = 2 * Math.PI * R;
  const ports = ["OVERNIGHT FUTURES", "WORLD MARKETS", "SENTIMENT"];
  return (
    <GridCanvas cell={72} pan={[-f * 3, 0]}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        {ports.map((p, i) => (
          <Wire key={p} from={[-100, 260 + i * 260]} to={[400, 470 + i * 90]} t={1} width={6} />
        ))}
        <Wire from={[1640, 560]} to={[2100, 380]} t={ez(f, 30, 16)} width={6} />
        <div
          style={{
            position: "absolute",
            left: 400,
            top: 250,
            width: 1240,
            height: 620,
            borderRadius: 30,
            background: NS.panel,
            border: `2px solid ${NS.line}`,
            boxShadow: "0 40px 120px rgba(0,0,0,0.6)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: 100,
              background: `linear-gradient(90deg, ${NS.deep}, #145343)`,
              display: "flex",
              alignItems: "center",
              padding: "0 44px",
              gap: 20,
              fontFamily: NS_FONTS.mono,
              fontSize: 36,
              letterSpacing: 5,
              color: NS.mint,
            }}
          >
            <div style={{ width: 20, height: 20, borderRadius: 10, background: NS.mint, boxShadow: `0 0 18px ${NS.glow}` }} />
            ORACLE
          </div>
          {ports.map((p, i) => (
            <div key={p} style={{ position: "absolute", left: 40, top: 200 + i * 90, fontFamily: NS_FONTS.mono, fontSize: 28, letterSpacing: 3, color: NS.dim }}>
              {p}
            </div>
          ))}
          <svg width={360} height={360} style={{ position: "absolute", left: 760, top: 160 }}>
            <circle cx={180} cy={180} r={R} fill="none" stroke={NS.line} strokeWidth={16} />
            <circle
              cx={180}
              cy={180}
              r={R}
              fill="none"
              stroke={NS.mint}
              strokeWidth={16}
              strokeLinecap="round"
              strokeDasharray={`${circ * 0.78 * ring} ${circ}`}
              transform="rotate(-90 180 180)"
              style={{ filter: `drop-shadow(0 0 10px ${NS.glow})` }}
            />
          </svg>
          <div style={{ position: "absolute", left: 760, top: 160, width: 360, height: 360, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <div style={{ fontFamily: NS_FONTS.mono, fontSize: 24, letterSpacing: 4, color: NS.dim }}>CONF</div>
            <div style={{ fontFamily: NS_FONTS.display, fontWeight: 700, fontSize: 110, color: NS.text }}>{Math.round(78 * ring)}</div>
          </div>
          <div style={{ position: "absolute", left: 440, top: 540, fontFamily: NS_FONTS.mono, fontSize: 26, letterSpacing: 3, color: NS.text }}>
            SPY · {money(ETFS[0].price)}
          </div>
        </div>
      </AbsoluteFill>
      <Cursor x={lerp(you, 200, 560)} y={lerp(you, 1100, 760)} who="you" />
      <Cursor x={lerp(eng, 1500, 1320)} y={lerp(eng, 120, 300)} who="engine" press={f >= cue("zoom", "engine") && f < cue("zoom", "engine") + 5 ? 1 : 0} />
    </GridCanvas>
  );
};
