import { TN } from "../brand";

const SKIN = "linear-gradient(160deg, #E2B08A 0%, #C98E68 55%, #9E6A4C 100%)";

/** A hand gripping a device edge: palm + thumb, drawn with soft shading. */
const Hand: React.FC<{
  side: "left" | "right";
  style?: React.CSSProperties;
}> = ({ side, style }) => {
  const flip = side === "left" ? 1 : -1;
  return (
    <div style={{ position: "absolute", width: 360, height: 420, ...style }}>
      {/* Palm/fingers behind the device edge */}
      <div
        style={{
          position: "absolute",
          [side]: 0,
          bottom: 0,
          width: 300,
          height: 360,
          borderRadius: "46% 54% 40% 60% / 50% 50% 40% 50%",
          background: SKIN,
          boxShadow: "inset -20px -30px 60px rgba(80,40,20,0.35)",
          transform: `rotate(${flip * 12}deg)`,
        }}
      />
      {/* Thumb over the bezel */}
      <div
        style={{
          position: "absolute",
          [side]: 150,
          top: 30,
          width: 92,
          height: 200,
          borderRadius: 46,
          background: SKIN,
          boxShadow:
            "inset -10px -12px 24px rgba(80,40,20,0.35), 0 10px 20px rgba(0,0,0,0.25)",
          transform: `rotate(${flip * 38}deg)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 22,
            top: 14,
            width: 48,
            height: 54,
            borderRadius: "40% 40% 45% 45%",
            background: "rgba(255,225,205,0.55)",
          }}
        />
      </div>
    </div>
  );
};

/** Tablet held in two hands. Children render on the screen. */
export const Tablet: React.FC<{
  width: number;
  height: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ width, height, children, style }) => (
  <div style={{ position: "absolute", width, height, ...style }}>
    <Hand side="left" style={{ left: -150, bottom: -210 }} />
    <Hand side="right" style={{ right: -150, bottom: -210 }} />
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: 44,
        background: "#141414",
        padding: 26,
        boxShadow: "0 50px 90px rgba(0,0,0,0.45), inset 0 0 0 2px #3A3A3A",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 22,
          overflow: "hidden",
          background: TN.paper,
          position: "relative",
        }}
      >
        {children}
      </div>
    </div>
    {/* Thumbs on top of the bezel */}
    <div
      style={{
        position: "absolute",
        left: -30,
        bottom: 60,
        width: 90,
        height: 170,
        borderRadius: 45,
        background: SKIN,
        transform: "rotate(28deg)",
        boxShadow: "0 8px 18px rgba(0,0,0,0.3)",
      }}
    />
    <div
      style={{
        position: "absolute",
        right: -30,
        bottom: 60,
        width: 90,
        height: 170,
        borderRadius: 45,
        background: SKIN,
        transform: "rotate(-28deg)",
        boxShadow: "0 8px 18px rgba(0,0,0,0.3)",
      }}
    />
  </div>
);

/** Phone held in a right hand. Children render on the screen. */
export const Phone: React.FC<{
  width: number;
  height: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ width, height, children, style }) => (
  <div style={{ position: "absolute", width, height, ...style }}>
    <div
      style={{
        position: "absolute",
        right: -120,
        bottom: -260,
        width: 520,
        height: 640,
        borderRadius: "40% 60% 30% 40% / 40% 40% 30% 30%",
        background: SKIN,
        boxShadow: "inset -30px -40px 80px rgba(80,40,20,0.35)",
        transform: "rotate(-14deg)",
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: 70,
        background: "#121212",
        padding: 18,
        boxShadow: "0 50px 90px rgba(0,0,0,0.45), inset 0 0 0 3px #3A3A3A",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 54,
          overflow: "hidden",
          background: "linear-gradient(180deg, #DDE7D8 0%, #F4F7F2 60%)",
          position: "relative",
        }}
      >
        {children}
      </div>
    </div>
    {/* Fingertips curling round the left edge */}
    {[0, 1, 2, 3].map((i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: -22,
          top: height * 0.4 + i * 92,
          width: 58,
          height: 84,
          borderRadius: "28px 22px 22px 28px",
          background: SKIN,
          boxShadow:
            "inset -8px -10px 16px rgba(80,40,20,0.35), 0 6px 12px rgba(0,0,0,0.25)",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: 6,
            top: 12,
            width: 18,
            height: 30,
            borderRadius: 9,
            background: "rgba(255,226,206,0.6)",
          }}
        />
      </div>
    ))}
  </div>
);
