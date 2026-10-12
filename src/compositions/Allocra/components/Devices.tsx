import { Img, staticFile } from "remotion";

/** Laptop in 3D perspective. `children` (or `src`) render on the screen. */
export const Laptop: React.FC<{
  width: number;
  rotY?: number;
  rotX?: number;
  src?: string;
  children?: React.ReactNode;
  glow?: number;
  style?: React.CSSProperties;
}> = ({ width, rotY = -18, rotX = 6, src, children, glow = 1, style }) => {
  const h = width * 0.62;
  return (
    <div
      style={{
        position: "absolute",
        width,
        height: h * 1.12,
        perspective: 2400,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          transform: `rotateY(${rotY}deg) rotateX(${rotX}deg)`,
        }}
      >
        {/* Lid / screen */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width,
            height: h,
            borderRadius: 22,
            background: "#0D0D0F",
            padding: width * 0.018,
            boxShadow: `0 0 ${140 * glow}px rgba(255,120,80,${0.25 * glow}), 0 40px 80px rgba(0,0,0,0.6)`,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 8,
              overflow: "hidden",
              position: "relative",
              background: "#000",
            }}
          >
            {src ? (
              <Img
                src={staticFile(src)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "top left",
                }}
              />
            ) : (
              children
            )}
            {/* Screen sheen */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(115deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 35%)",
              }}
            />
          </div>
        </div>
        {/* Base */}
        <div
          style={{
            position: "absolute",
            left: -width * 0.06,
            top: h - 4,
            width: width * 1.12,
            height: h * 0.1,
            borderRadius: "0 0 26px 26px",
            background: "linear-gradient(180deg, #2A2A2E, #0E0E10)",
            transformOrigin: "top",
            transform: "rotateX(78deg)",
          }}
        />
      </div>
    </div>
  );
};

/** Phone held in a right hand (silhouetted, warm rim). Children = screen. */
export const HandPhone: React.FC<{
  x: number;
  y: number;
  w?: number;
  rot?: number;
  children: React.ReactNode;
}> = ({ x, y, w = 520, rot = -6, children }) => {
  const h = w * 2.05;
  const skin = "linear-gradient(160deg, #6A4A3C 0%, #2E1E18 70%)";
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        transform: `rotate(${rot}deg)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -150,
          bottom: -360,
          width: 560,
          height: 700,
          borderRadius: "42% 58% 30% 40%",
          background: skin,
          transform: "rotate(-12deg)",
          boxShadow: "inset 30px 20px 50px rgba(255,170,110,0.25)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 72,
          background: "#0B0B0D",
          padding: 16,
          boxShadow: "0 50px 100px rgba(0,0,0,0.6), inset 0 0 0 3px #2A2A2E",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 58,
            overflow: "hidden",
            position: "relative",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

/** macOS-style pointer. */
export const Pointer: React.FC<{ x: number; y: number; scale?: number }> = ({
  x,
  y,
  scale = 1,
}) => (
  <svg
    width={34 * scale}
    height={50 * scale}
    viewBox="0 0 34 50"
    style={{
      position: "absolute",
      left: x,
      top: y,
      filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.5))",
      zIndex: 20,
    }}
  >
    <path
      d="M2 2 L2 40 L11 31 L18 47 L24 44 L17 29 L30 29 Z"
      fill="#111"
      stroke="#fff"
      strokeWidth={2.5}
      strokeLinejoin="round"
    />
  </svg>
);

/** The Allocra asterisk mark (simplified UI icon). */
export const Mark: React.FC<{
  size: number;
  color?: string;
  core?: string;
}> = ({ size, color = "#F6DAC3", core = "#CF3321" }) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100">
    {[0, 60, 120].map((a) => (
      <path
        key={a}
        d="M0 -46 L7 -8 L0 0 L-7 -8 Z M0 46 L7 8 L0 0 L-7 8 Z"
        fill={color}
        transform={`rotate(${a})`}
      />
    ))}
    <circle r={9} fill={core} />
  </svg>
);
