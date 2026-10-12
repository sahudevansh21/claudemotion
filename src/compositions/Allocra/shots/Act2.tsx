import {
  AbsoluteFill,
  Img,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { AL, AL_EASE, AL_FONTS, cue, drift, ez, lerp, shot } from "../brand";
import { HandPhone, Laptop, Mark, Pointer } from "../components/Devices";

/* ------------------------------------------------------------------------ *
 * ACT 2 — "the answer". Warm dawn, slow camera, the real Allocra product.
 * Screens use the supplied UI screenshots; the basket sliders are re-driven
 * in place so the weights visibly move.
 * ------------------------------------------------------------------------ */

const IMG_W = 2000; // screenshot native width

/** Warm dawn room seen through a window — used as a blurred plate too. */
const DawnRoom: React.FC<{ blur?: number }> = ({ blur = 0 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ filter: blur ? `blur(${blur}px)` : undefined }}>
      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, #3A2418 0%, #1A100B 100%)",
        }}
      />
      {/* Window */}
      <div
        style={{
          position: "absolute",
          left: 980,
          top: 60,
          width: 820,
          height: 760,
          background:
            "linear-gradient(180deg, #F6C58A 0%, #F08A4B 45%, #B4482A 75%, #4A2418 100%)",
          boxShadow: "0 0 240px rgba(255,160,90,0.55)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            bottom: 0,
            width: 16,
            background: "#140B07",
            transform: "translateX(-50%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "48%",
            left: 0,
            right: 0,
            height: 16,
            background: "#140B07",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 470,
            top: 360,
            width: 160,
            height: 160,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, #FFF4D6 0%, #FFD08A 40%, rgba(255,180,100,0) 70%)",
          }}
        />
      </div>
      {/* God rays */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 600 + i * 140,
            top: 120,
            width: 220,
            height: 1200,
            background:
              "linear-gradient(180deg, rgba(255,200,140,0.18), rgba(255,200,140,0))",
            transform: `rotate(${32 + i * 3}deg)`,
            transformOrigin: "top",
            filter: "blur(20px)",
            opacity: 0.8 + 0.2 * Math.sin(f / 50 + i),
          }}
        />
      ))}
      {/* Dust in the light */}
      {new Array(36).fill(0).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 700 + random(`d-x-${i}`) * 900 + Math.sin(f / 60 + i) * 20,
            top:
              200 +
              random(`d-y-${i}`) * 600 -
              ((f * 0.2 * random(`d-v-${i}`)) % 200),
            width: 4,
            height: 4,
            borderRadius: 2,
            background: "#FFE1B8",
            opacity: 0.5 * random(`d-o-${i}`),
          }}
        />
      ))}
      {/* Desk */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 820,
          bottom: 0,
          background: "linear-gradient(180deg, #4A2C1C 0%, #1E120B 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

/** 11. Dawn. She's at the desk, laptop open, the room finally quiet. */
export const DawnShot: React.FC = () => {
  const f = useCurrentFrame();
  const { duration } = shot("dawn");
  const fadeIn = ez(f, 0, 40, AL_EASE.inOut);
  const push = interpolate(f, [0, duration], [1.0, 1.08]);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill
        style={{
          opacity: fadeIn,
          transform: `${drift(f, 0.5, 4)} scale(${push})`,
          transformOrigin: "60% 55%",
        }}
      >
        <DawnRoom />
        <Laptop
          width={520}
          rotY={28}
          rotX={4}
          src="allocra/img/ui-home.webp"
          glow={0.8}
          style={{ left: 1000, top: 520 }}
        />
        {/* Her silhouette from behind, rim-lit by the window */}
        <svg
          width={760}
          height={900}
          viewBox="0 0 760 900"
          style={{ position: "absolute", left: 380, top: 300 }}
        >
          {/* shoulders + neck */}
          <path
            d="M60 900 C 80 640, 170 470, 300 440 L 330 330 L 430 330 L 460 440 C 590 470, 680 640, 700 900 Z"
            fill="#0B0705"
          />
          {/* head + hair falling past the shoulders */}
          <ellipse cx={380} cy={230} rx={100} ry={120} fill="#0B0705" />
          <path
            d="M282 220 C 270 340, 250 470, 230 560 L 300 520 C 300 420, 300 320, 300 240 Z"
            fill="#0B0705"
          />
          <path
            d="M478 220 C 490 340, 510 470, 530 560 L 460 520 C 460 420, 460 320, 460 240 Z"
            fill="#0B0705"
          />
          {/* window rim light down her right side */}
          <path
            d="M478 140 C 500 200, 495 300, 520 400 C 600 470, 680 640, 700 900"
            stroke="#FFB878"
            strokeOpacity={0.75}
            strokeWidth={6}
            fill="none"
          />
          <path
            d="M478 150 C 488 190, 488 230, 482 270"
            stroke="#FFD2A0"
            strokeOpacity={0.6}
            strokeWidth={4}
            fill="none"
          />
        </svg>
        {/* Coffee + steam */}
        <div
          style={{
            position: "absolute",
            left: 1600,
            top: 760,
            width: 90,
            height: 100,
            borderRadius: "0 0 22px 22px",
            background: "linear-gradient(90deg,#2A1A12,#6A4030)",
          }}
        />
        {[0, 1].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 1630 + i * 20 + Math.sin(f / 25 + i) * 10,
              top: 640 - ((f * 0.6 + i * 40) % 120),
              width: 18,
              height: 70,
              borderRadius: 9,
              background: "rgba(255,230,200,0.25)",
              filter: "blur(8px)",
            }}
          />
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** 12. Over the shoulder — push into the screen: "Your assets. Your allocation." */
export const ScreenShot: React.FC = () => {
  const f = useCurrentFrame();
  const { duration } = shot("screen");
  const push = interpolate(f, [0, duration], [1.0, 1.35], {
    easing: AL_EASE.slow,
  });
  return (
    <AbsoluteFill style={{ background: "#120A06" }}>
      <DawnRoom blur={16} />
      <AbsoluteFill
        style={{
          transform: `${drift(f, 0.4, 5)} scale(${push})`,
          transformOrigin: "56% 48%",
        }}
      >
        <Laptop
          width={1280}
          rotY={-10}
          rotX={3}
          src="allocra/img/ui-home.webp"
          glow={1}
          style={{ left: 420, top: 180 }}
        />
      </AbsoluteFill>
      {/* Foreground shoulder + hair, out of focus */}
      <div
        style={{
          position: "absolute",
          left: -260,
          top: 380,
          width: 820,
          height: 1000,
          borderRadius: "48% 52% 0 0",
          background: "#070403",
          filter: "blur(18px)",
          transform: `translateX(${lerp(f / duration, 0, -60)}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 300,
          top: 360,
          width: 40,
          height: 700,
          background: "rgba(255,170,110,0.25)",
          filter: "blur(16px)",
          transform: "rotate(8deg)",
        }}
      />
    </AbsoluteFill>
  );
};

/* -------------------- My basket: real UI, re-driven -------------------- */
const ROWS = [
  { y: 652, from: 34, to: 55 },
  { y: 750, from: 33, to: 27 },
  { y: 849, from: 33, to: 18 },
];
const TRACK = { x0: 783, x1: 1182 };

const BasketUI: React.FC<{
  drag: number;
  rowsIn: number[];
  totalGlow: number;
}> = ({ drag, rowsIn, totalGlow }) => (
  <div style={{ position: "relative", width: IMG_W, height: 1102 }}>
    <Img
      src={staticFile("allocra/img/ui-basket.webp")}
      style={{ width: IMG_W, height: 1102 }}
    />
    {ROWS.map((r, i) => {
      const v = Math.round(lerp(drag, r.from, r.to));
      const hx = TRACK.x0 + ((TRACK.x1 - TRACK.x0) * v) / 100;
      return (
        <div key={i} style={{ opacity: rowsIn[i] }}>
          {/* Mask the static slider + value, redraw them live */}
          <div
            style={{
              position: "absolute",
              left: 770,
              top: r.y - 16,
              width: 520,
              height: 32,
              background: AL.uiPanel,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: TRACK.x0,
              top: r.y - 1,
              width: TRACK.x1 - TRACK.x0,
              height: 2,
              background: "#57463E",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: TRACK.x0,
              top: r.y - 1,
              width: hx - TRACK.x0,
              height: 2,
              background: "#F1D6C4",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: hx - 8,
              top: r.y - 8,
              width: 16,
              height: 16,
              borderRadius: 8,
              background: AL.accent,
              boxShadow: "0 0 0 3px rgba(207,51,33,0.25)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 1200,
              top: r.y - 12,
              width: 74,
              textAlign: "right",
              fontFamily: AL_FONTS.sans,
              fontWeight: 600,
              fontSize: 17,
              color: "#F1D6C4",
            }}
          >
            {v}%
          </div>
        </div>
      );
    })}
    {/* "100%" basket total glows when the call is made */}
    <div
      style={{
        position: "absolute",
        left: 1262,
        top: 908,
        width: 74,
        height: 36,
        borderRadius: 6,
        boxShadow: `0 0 ${30 * totalGlow}px rgba(246,218,195,${0.6 * totalGlow})`,
        border: `2px solid rgba(246,218,195,${0.7 * totalGlow})`,
      }}
    />
  </div>
);

/** 13. "Three ETFs. My weights. My call." */
export const BasketShot: React.FC = () => {
  const f = useCurrentFrame();
  const { duration } = shot("basket");
  const rowsAt = cue("basket", "rows");
  const step = cue("basket", "rowStep");
  const drag = ez(
    f,
    cue("basket", "drag"),
    cue("basket", "dragEnd") - cue("basket", "drag"),
    AL_EASE.inOut,
  );
  const total = ez(f, cue("basket", "total"), 14);
  const rowsIn = [0, 1, 2].map(
    (i) => 0.35 + 0.65 * ez(f, rowsAt + i * step, 12),
  );
  // Camera: slow glide across the allocation panel
  const s = 1.55;
  const cx = interpolate(f, [0, duration], [820, 980], {
    easing: AL_EASE.slow,
  });
  const cy = interpolate(f, [0, duration], [700, 760], {
    easing: AL_EASE.slow,
  });
  const knobX =
    TRACK.x0 +
    ((TRACK.x1 - TRACK.x0) * lerp(drag, ROWS[0].from, ROWS[0].to)) / 100;
  return (
    <AbsoluteFill style={{ background: AL.ui, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transformOrigin: "0 0",
          transform: `translate(${960 - cx * s}px, ${540 - cy * s}px) scale(${s}) ${drift(f, 0.25, 6)}`,
        }}
      >
        <BasketUI drag={drag} rowsIn={rowsIn} totalGlow={total} />
        {f >= cue("basket", "drag") - 20 ? (
          <Pointer x={knobX - 4} y={ROWS[0].y + 2} scale={0.8} />
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

/** 14. "The overlap. The concentration. The cost." — camera finds each. */
export const DiagnosticsShot: React.FC = () => {
  const f = useCurrentFrame();
  const targets = [
    {
      at: cue("diagnostics", "overlap"),
      x: 1650,
      y: 790,
      box: [1408, 730, 490, 112],
    },
    {
      at: cue("diagnostics", "issuer"),
      x: 1650,
      y: 650,
      box: [1408, 590, 490, 112],
    },
    {
      at: cue("diagnostics", "cost"),
      x: 1650,
      y: 910,
      box: [1408, 865, 490, 82],
    },
  ] as const;
  const idx = f >= targets[2].at ? 2 : f >= targets[1].at ? 1 : 0;
  const keys = [
    0,
    targets[0].at,
    targets[1].at,
    targets[1].at + 18,
    targets[2].at,
    targets[2].at + 18,
  ];
  const xs = [
    1650,
    targets[0].x,
    targets[0].x,
    targets[1].x,
    targets[1].x,
    targets[2].x,
  ];
  const ys = [
    720,
    targets[0].y,
    targets[0].y,
    targets[1].y,
    targets[1].y,
    targets[2].y,
  ];
  const opt = {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: AL_EASE.inOut,
  } as const;
  const cx = interpolate(f, keys, xs, opt);
  const cy = interpolate(f, keys, ys, opt);
  const s = 2.1;
  const b = targets[idx].box;
  const hl = ez(f, targets[idx].at, 12);
  return (
    <AbsoluteFill style={{ background: AL.ui, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transformOrigin: "0 0",
          transform: `translate(${960 - cx * s}px, ${540 - cy * s}px) scale(${s})`,
        }}
      >
        <Img
          src={staticFile("allocra/img/ui-basket.webp")}
          style={{ width: IMG_W, height: 1102 }}
        />
        <div
          style={{
            position: "absolute",
            left: b[0],
            top: b[1],
            width: b[2],
            height: b[3],
            borderRadius: 6,
            border: `1.5px solid rgba(246,218,195,${0.8 * hl})`,
            boxShadow: `0 0 ${24 * hl}px rgba(246,218,195,${0.35 * hl})`,
          }}
        />
      </div>
      {/* Rack focus: everything outside the highlight softly defocused */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(32,19,14,0) 30%, rgba(32,19,14,0.55) 75%)",
        }}
      />
    </AbsoluteFill>
  );
};

/** 15. "All of it, before I trade." — the checks, on her phone. */
export const PhoneShot: React.FC = () => {
  const f = useCurrentFrame();
  const at = cue("phone", "checks");
  const step = cue("phone", "checkStep");
  const enter = ez(f, 0, 30);
  const checks = [
    { t: "Market window", s: "Confirm each ETF is open", v: "CHECK" },
    { t: "Quote comparison", s: "Refresh at order preview", v: "READY" },
    { t: "Underlying overlap", s: "11% in this sample", v: "LOW" },
  ];
  return (
    <AbsoluteFill>
      <DawnRoom blur={22} />
      <AbsoluteFill
        style={{
          transform: `${drift(f, 0.6, 7)} translateY(${lerp(enter, 80, 0)}px)`,
        }}
      >
        <HandPhone x={700} y={150} w={520}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: AL.ui,
              padding: "70px 34px",
              fontFamily: AL_FONTS.sans,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Mark size={30} />
              <span style={{ color: AL.cream, fontSize: 26, fontWeight: 600 }}>
                Allocra
              </span>
            </div>
            <div
              style={{
                marginTop: 40,
                fontFamily: AL_FONTS.serif,
                fontSize: 64,
                lineHeight: 1,
                color: AL.cream,
                letterSpacing: -1.5,
              }}
            >
              Before you trade
            </div>
            <div style={{ marginTop: 8, fontSize: 20, color: AL.creamDim }}>
              Checks to review
            </div>
            {checks.map((c, i) => {
              const t = ez(f, at + i * step, 14);
              return (
                <div
                  key={c.t}
                  style={{
                    marginTop: i === 0 ? 34 : 0,
                    padding: "22px 0",
                    borderBottom: `1px solid ${AL.uiLine}`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    opacity: 0.25 + 0.75 * t,
                  }}
                >
                  <div>
                    <div
                      style={{ fontSize: 22, fontWeight: 600, color: AL.cream }}
                    >
                      {c.t}
                    </div>
                    <div
                      style={{
                        fontFamily: AL_FONTS.mono,
                        fontSize: 14,
                        color: AL.creamDim,
                        marginTop: 4,
                      }}
                    >
                      {c.s}
                    </div>
                  </div>
                  <span
                    style={{
                      fontFamily: AL_FONTS.mono,
                      fontSize: 16,
                      color: AL.green,
                      opacity: t,
                    }}
                  >
                    {c.v}
                  </span>
                </div>
              );
            })}
          </div>
        </HandPhone>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** 16. "And nothing moves until I say so." — cursor near the button; she waits. */
export const ApproveShot: React.FC = () => {
  const f = useCurrentFrame();
  const { duration } = shot("approve");
  const s = interpolate(f, [0, duration], [2.3, 2.6], { easing: AL_EASE.slow });
  const cx = 420;
  const cy = 830;
  const hover = ez(f, cue("approve", "hover"), 30, AL_EASE.inOut);
  const px = lerp(hover, 520, 296);
  const py = lerp(hover, 960, 818);
  const focus = ez(f, cue("approve", "hold"), 30);
  return (
    <AbsoluteFill style={{ background: AL.red, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transformOrigin: "0 0",
          transform: `translate(${960 - cx * s}px, ${540 - cy * s}px) scale(${s})`,
        }}
      >
        <Img
          src={staticFile("allocra/img/ui-home.webp")}
          style={{
            width: IMG_W,
            height: 1086,
            filter: `blur(${lerp(focus, 0, 1.2)}px)`,
          }}
        />
        {/* The footnote comes into focus, everything else falls away */}
        <div
          style={{
            position: "absolute",
            left: 118,
            top: 856,
            width: 590,
            height: 36,
            overflow: "hidden",
            opacity: focus,
          }}
        >
          <Img
            src={staticFile("allocra/img/ui-home.webp")}
            style={{
              position: "absolute",
              left: -118,
              top: -856,
              width: IMG_W,
              height: 1086,
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: 112,
            top: 852,
            width: 602,
            height: 44,
            borderRadius: 4,
            boxShadow: `0 0 ${30 * focus}px rgba(255,220,190,${0.5 * focus})`,
          }}
        />
        <Pointer x={px} y={py} scale={0.7} />
      </div>
    </AbsoluteFill>
  );
};
