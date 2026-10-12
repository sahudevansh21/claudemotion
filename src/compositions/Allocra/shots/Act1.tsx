import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { AL, AL_FONTS, cue, drift, ez, lerp, shot } from "../brand";
import { Crowd, PhoneGlow, Profile } from "../components/Figures";

/* ------------------------------------------------------------------------ *
 * ACT 1 — "the noise". Fast cuts, cold grades, screens everywhere.
 * Notification copy is deliberately generic (no real tickers, no brands).
 * ------------------------------------------------------------------------ */

const TOASTS = [
  { k: "MARKETS", t: "Up 4.2% today. Don't miss it." },
  { k: "TRENDING", t: "Everyone is buying this." },
  { k: "ALERT", t: "Last chance before it moves." },
  { k: "FOR YOU", t: "The pick nobody's talking about." },
  { k: "HOT TIP", t: "Trust me on this one." },
];

const Toast: React.FC<{
  k: string;
  t: string;
  y: number;
  t0: number;
  x?: number;
  w?: number;
}> = ({ k, t, y, t0, x = 560, w = 800 }) => {
  const f = useCurrentFrame();
  const a = ez(f, t0, 10);
  if (f < t0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        padding: "22px 28px",
        borderRadius: 26,
        background: "rgba(235,240,250,0.9)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
        opacity: a,
        transform: `translateY(${lerp(a, -30, 0)}px) scale(${lerp(a, 0.96, 1)})`,
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: "#56606E",
          letterSpacing: 1.5,
        }}
      >
        {k} · now
      </div>
      <div
        style={{
          marginTop: 6,
          fontSize: 34,
          fontWeight: 600,
          color: "#11151B",
        }}
      >
        {t}
      </div>
    </div>
  );
};

/** 1. Night city, light streaks of a passing train, glassy pings. */
export const CityShot: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, #050B14 0%, #0B1A2A 60%, #101820 100%)",
      }}
    >
      {/* Skyline windows */}
      {new Array(140).fill(0).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: random(`w-x-${i}`) * 1920,
            top: 300 + random(`w-y-${i}`) * 450,
            width: 10,
            height: 14,
            background: random(`w-c-${i}`) > 0.7 ? "#FFC27A" : "#7FB6FF",
            opacity: 0.35 + 0.5 * random(`w-o-${i}`),
            filter: "blur(1px)",
          }}
        />
      ))}
      {/* Train streaks racing through */}
      {new Array(18).fill(0).map((_, i) => {
        const y = 560 + random(`s-y-${i}`) * 220;
        const speed = 90 + random(`s-v-${i}`) * 60;
        const x = ((f * speed + random(`s-x-${i}`) * 4000) % 4400) - 1600;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 900,
              height: 4 + random(`s-h-${i}`) * 8,
              background: `linear-gradient(90deg, transparent, ${random(`s-c-${i}`) > 0.5 ? "#FF5A3C" : "#E9F2FF"}, transparent)`,
              filter: "blur(2px)",
              opacity: 0.8,
            }}
          />
        );
      })}
      <AbsoluteFill style={{ transform: drift(f, 1.5) }}>
        <Profile
          id="city"
          height={620}
          glow={0.8}
          style={{ position: "absolute", left: 300, top: 300 }}
        />
        <PhoneGlow x={630} y={690} rot={-30} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** 2. Extreme close-up of a phone screen: notifications stacking up. */
export const FeedShot: React.FC = () => {
  const f = useCurrentFrame();
  const step = cue("feed", "toastStep");
  return (
    <AbsoluteFill
      style={{
        background: "#0A0E14",
        transform: `scale(${1 + f / 900}) rotate(-4deg)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 480,
          top: -40,
          width: 960,
          height: 1200,
          borderRadius: 80,
          background: "linear-gradient(180deg,#17202E,#0C121B)",
          boxShadow: "0 0 120px rgba(120,170,255,0.35)",
        }}
      />
      {TOASTS.slice(0, 4).map((t, i) => (
        <Toast
          key={i}
          k={t.k}
          t={t.t}
          y={170 + (3 - i) * 150 - Math.max(0, Math.floor(f / step) - i) * 0}
          t0={i * step}
        />
      ))}
    </AbsoluteFill>
  );
};

/** 3. Profile lit by the phone; bubbles keep arriving. */
export const ProfileShot: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 70% 40%, #12243A 0%, #04070C 70%)",
      }}
    >
      <AbsoluteFill
        style={{ transform: `${drift(f, 1.2, 1)} scale(${1.05 + f / 1200})` }}
      >
        <Profile
          id="prof"
          height={1000}
          glow={1}
          style={{ position: "absolute", left: 330, top: 120 }}
        />
        <PhoneGlow x={1090} y={820} w={120} h={220} rot={-35} />
        <Toast
          k="FOR YOU"
          t="The pick nobody's talking about."
          y={250}
          t0={14}
          x={1150}
          w={620}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** 4. A crowd under blue light, every face in a phone. */
export const CrowdShot: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, #2B4BFF 0%, #0A1450 45%, #02030A 100%)",
      }}
    >
      <AbsoluteFill
        style={{
          transform: `translateX(${lerp(f / 54, 20, -20)}px) scale(1.06)`,
        }}
      >
        {[0.2, 0.5, 0.8].map((x, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x * 1920 - 60,
              top: -100,
              width: 120,
              height: 900,
              background:
                "linear-gradient(180deg, rgba(120,160,255,0.35), transparent)",
              transform: `rotate(${(i - 1) * 12}deg)`,
              filter: "blur(18px)",
            }}
          />
        ))}
        <Crowd rows={3} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** 5. "Every app." — a wall of apps, badges climbing. */
export const AppsShot: React.FC = () => {
  const f = useCurrentFrame();
  const cols = 9;
  const rows = 5;
  return (
    <AbsoluteFill
      style={{ background: "#03060E", transform: `scale(${1.15 - f / 600})` }}
    >
      {new Array(cols * rows).fill(0).map((_, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const hue = Math.floor(random(`app-${i}`) * 360);
        const badge = Math.floor(random(`b-${i}`) * 9) + 1 + Math.floor(f / 6);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 160 + c * 185,
              top: 150 + r * 165,
              width: 130,
              height: 130,
              borderRadius: 32,
              background: `linear-gradient(140deg, hsl(${hue} 70% 55%), hsl(${(hue + 40) % 360} 70% 30%))`,
              opacity: 0.85,
            }}
          >
            {random(`hb-${i}`) > 0.35 ? (
              <div
                style={{
                  position: "absolute",
                  right: -12,
                  top: -12,
                  minWidth: 44,
                  height: 44,
                  borderRadius: 22,
                  background: "#FF3B30",
                  color: "#fff",
                  fontFamily: "Inter",
                  fontWeight: 700,
                  fontSize: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 8px",
                }}
              >
                {badge}
              </div>
            ) : null}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** 6. "Every feed." — numbers and candles scrolling too fast to read. */
export const TickerShot: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#05080D", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: -f * 38,
          filter: "blur(1.5px)",
        }}
      >
        {new Array(60).fill(0).map((_, i) => {
          const up = random(`t-${i}`) > 0.45;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 40,
                height: 84,
                padding: "0 220px",
                fontFamily: AL_FONTS.mono,
                fontSize: 40,
                color: up ? "#3CF08C" : "#FF4B4B",
                borderBottom: "1px solid #182230",
              }}
            >
              <span
                style={{ width: 300, color: "#8FA2B8" }}
              >{`ASSET-${String(Math.floor(random(`n-${i}`) * 900) + 100)}`}</span>
              <span
                style={{ width: 260 }}
              >{`${up ? "+" : "−"}${(random(`p-${i}`) * 9).toFixed(2)}%`}</span>
              <svg width={600} height={50}>
                {new Array(24).fill(0).map((__, k) => {
                  const h = 8 + random(`c-${i}-${k}`) * 34;
                  return (
                    <rect
                      key={k}
                      x={k * 25}
                      y={50 - h}
                      width={14}
                      height={h}
                      fill={
                        random(`cc-${i}-${k}`) > 0.5 ? "#3CF08C" : "#FF4B4B"
                      }
                    />
                  );
                })}
              </svg>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** 7. "Every tip." — two thumbs, a chat full of confident strangers. */
export const TipsShot: React.FC = () => {
  const f = useCurrentFrame();
  const step = cue("tips", "toastStep");
  const msgs = [
    "trust me on this one",
    "buy before it's too late",
    "my friend made 10x",
    "everyone's in already",
    "don't overthink it",
  ];
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 60%, #1A2433 0%, #05070B 70%)",
      }}
    >
      <AbsoluteFill style={{ transform: `${drift(f, 1.5, 2)} scale(1.04)` }}>
        <div
          style={{
            position: "absolute",
            left: 640,
            top: 140,
            width: 640,
            height: 1100,
            borderRadius: 70,
            background: "#0E141D",
            border: "14px solid #1C232D",
            boxShadow: "0 0 140px rgba(140,180,255,0.3)",
          }}
        >
          {msgs.map((m, i) => {
            const t = ez(f, 8 + i * step, 8);
            if (f < 8 + i * step) return null;
            const mine = i % 2 === 1;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: 70 + i * 120,
                  [mine ? "right" : "left"]: 30,
                  maxWidth: 440,
                  padding: "18px 24px",
                  borderRadius: 30,
                  background: mine ? "#2F7BFF" : "#2A323D",
                  color: "#F2F5FA",
                  fontFamily: "Inter",
                  fontSize: 32,
                  opacity: t,
                  transform: `scale(${lerp(t, 0.85, 1)})`,
                }}
              >
                {m}
              </div>
            );
          })}
        </div>
        {/* Thumbs */}
        <div
          style={{
            position: "absolute",
            left: 520,
            top: 760,
            width: 190,
            height: 420,
            borderRadius: 95,
            background: "linear-gradient(160deg,#8C6A5A,#3E2B24)",
            transform: "rotate(28deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 1210,
            top: 760,
            width: 190,
            height: 420,
            borderRadius: 95,
            background: "linear-gradient(200deg,#8C6A5A,#3E2B24)",
            transform: "rotate(-28deg)",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** 8. Extreme close-up of an eye, the screen reflected in it. */
export const EyeShot: React.FC = () => {
  const f = useCurrentFrame();
  const { duration } = shot("eye");
  const push = interpolate(f, [0, duration], [1, 1.18]);
  const flick = Math.floor(f / 5) % 3;
  return (
    <AbsoluteFill
      style={{ background: "#2B1E1A", transform: `scale(${push})` }}
    >
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <defs>
          <radialGradient id="skin" cx="0.5" cy="0.5" r="0.7">
            <stop offset="0" stopColor="#B9907E" />
            <stop offset="1" stopColor="#3A2721" />
          </radialGradient>
          <radialGradient id="iris" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#0B0B0B" />
            <stop offset="0.32" stopColor="#0B0B0B" />
            <stop offset="0.36" stopColor="#3F6A6E" />
            <stop offset="0.75" stopColor="#2A4A4E" />
            <stop offset="1" stopColor="#0F1C1E" />
          </radialGradient>
          <clipPath id="eyeclip">
            <path d="M380 540 C 620 300, 1300 300, 1540 540 C 1300 760, 620 760, 380 540 Z" />
          </clipPath>
        </defs>
        <rect width={1920} height={1080} fill="url(#skin)" />
        <path
          d="M380 540 C 620 300, 1300 300, 1540 540 C 1300 760, 620 760, 380 540 Z"
          fill="#E8DED6"
        />
        <g clipPath="url(#eyeclip)">
          <circle cx={960} cy={540} r={250} fill="url(#iris)" />
          {new Array(48).fill(0).map((_, i) => {
            const a = (i / 48) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={960 + Math.cos(a) * 95}
                y1={540 + Math.sin(a) * 95}
                x2={960 + Math.cos(a) * 240}
                y2={540 + Math.sin(a) * 240}
                stroke="#6C9A9E"
                strokeOpacity={0.25}
                strokeWidth={3}
              />
            );
          })}
          {/* Reflected phone: a bright slab with a flickering chart */}
          <g transform="translate(880 430) skewX(-8)">
            <rect width={150} height={90} rx={8} fill="#DDEBFF" opacity={0.9} />
            <polyline
              points={
                flick === 0
                  ? "10,70 40,50 70,60 100,25 140,35"
                  : flick === 1
                    ? "10,60 40,65 70,35 100,45 140,20"
                    : "10,75 40,40 70,55 100,30 140,15"
              }
              fill="none"
              stroke="#2C5DB8"
              strokeWidth={6}
            />
          </g>
          <ellipse
            cx={960}
            cy={350}
            rx={700}
            ry={90}
            fill="#000"
            opacity={0.35}
          />
        </g>
        <path
          d="M380 540 C 620 300, 1300 300, 1540 540"
          stroke="#1A100D"
          strokeWidth={22}
          fill="none"
        />
        {new Array(40).fill(0).map((_, i) => {
          const tt = i / 39;
          const x = 400 + tt * 1120;
          const y = 540 - Math.sin(tt * Math.PI) * 230;
          return (
            <line
              key={i}
              x1={x}
              y1={y}
              x2={x + (tt - 0.5) * 60}
              y2={y - 70 - Math.sin(tt * Math.PI) * 40}
              stroke="#140B08"
              strokeWidth={5}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

/** 9. The girl. Rain on glass, phone light on her face — then she switches it off and looks up. */
export const GirlShot: React.FC = () => {
  const f = useCurrentFrame();
  const off = cue("girl", "phoneOff");
  const look = ez(f, cue("girl", "lookUp"), 30, (t) => 1 - Math.pow(1 - t, 3));
  const on = f < off ? 1 : 0;
  return (
    <AbsoluteFill style={{ background: "#03060A" }}>
      {/* Rain-streaked window with city bokeh */}
      <AbsoluteFill style={{ filter: "blur(14px)" }}>
        {new Array(40).fill(0).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: random(`gb-x-${i}`) * 1920,
              top: random(`gb-y-${i}`) * 900,
              width: 60 + random(`gb-s-${i}`) * 90,
              height: 60 + random(`gb-s-${i}`) * 90,
              borderRadius: "50%",
              background: random(`gb-c-${i}`) > 0.6 ? "#FF8A4A" : "#5A8CFF",
              opacity: 0.35,
            }}
          />
        ))}
      </AbsoluteFill>
      {new Array(60).fill(0).map((_, i) => {
        const x = random(`r-x-${i}`) * 1920;
        const y =
          ((f * (4 + random(`r-v-${i}`) * 6) + random(`r-y-${i}`) * 1200) %
            1300) -
          150;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 3,
              height: 60 + random(`r-h-${i}`) * 80,
              background:
                "linear-gradient(180deg, transparent, rgba(200,220,255,0.5))",
            }}
          />
        );
      })}
      <AbsoluteFill
        style={{ transform: `${drift(f, 0.6, 3)} scale(${1.02 + f / 2400})` }}
      >
        <Profile
          id="girl"
          height={1080}
          glow={on ? 1 : 0.08}
          glowColor="#BFD6FF"
          rim="#9FB8D8"
          tilt={lerp(look, 0, -12)}
          style={{ position: "absolute", left: 420, top: 70 }}
        />
        <PhoneGlow x={1160} y={900} w={110} h={210} rot={-40} on={on} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** 10. Black. */
export const BlackShot: React.FC = () => (
  <AbsoluteFill style={{ background: AL.black }} />
);
