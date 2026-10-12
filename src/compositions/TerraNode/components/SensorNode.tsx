import { useCurrentFrame } from "remotion";
import { TN } from "../brand";

/**
 * The TerraNode field unit as pictured on the official X banner: pole,
 * tilted solar panel, LoRa antenna and a white enclosure with the wordmark
 * and leaf. Drawn in a 400×1000 box; `height` sets the rendered size.
 * Sun comes from screen-right (matches the golden-hour shots).
 */
export const SensorNode: React.FC<{
  height: number;
  style?: React.CSSProperties;
  dusk?: number;
}> = ({ height, style, dusk = 0 }) => {
  const frame = useCurrentFrame();
  const led = 0.35 + 0.65 * (Math.floor(frame / 12) % 3 === 0 ? 1 : 0.15);
  const shade = dusk > 0.5 ? 0.75 : 1;
  return (
    <svg
      width={(height * 400) / 1000}
      height={height}
      viewBox="0 0 400 1000"
      style={{ overflow: "visible", ...style }}
    >
      <defs>
        <linearGradient id="tn-pole" x1="0" x2="1">
          <stop offset="0" stopColor="#5E615E" />
          <stop offset="0.6" stopColor="#B9BDB6" />
          <stop offset="1" stopColor="#E9E3D2" />
        </linearGradient>
        <linearGradient id="tn-box" x1="0" x2="1" y1="0" y2="0.3">
          <stop offset="0" stopColor="#D9D9D2" />
          <stop offset="0.55" stopColor="#F4F3EC" />
          <stop offset="1" stopColor="#FFF4DD" />
        </linearGradient>
        <linearGradient id="tn-panel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1B2A4A" />
          <stop offset="0.6" stopColor="#24375F" />
          <stop offset="1" stopColor="#F2C27A" stopOpacity={0.9} />
        </linearGradient>
      </defs>

      {/* Pole */}
      <rect
        x={186}
        y={300}
        width={30}
        height={700}
        fill="url(#tn-pole)"
        opacity={shade}
      />
      {/* Antenna */}
      <rect x={262} y={30} width={8} height={330} rx={4} fill="#1C1C1C" />
      <rect x={256} y={330} width={20} height={40} rx={5} fill="#2A2A2A" />
      {/* Solar panel, tilted towards the sun */}
      <g opacity={shade}>
        <polygon points="40,262 262,208 300,300 78,362" fill="#C9CCC6" />
        <polygon points="50,264 258,214 292,296 84,354" fill="url(#tn-panel)" />
        <g stroke="#6E85B4" strokeOpacity={0.55} strokeWidth={2}>
          {[0.25, 0.5, 0.75].map((k) => (
            <line
              key={`v${k}`}
              x1={50 + 208 * k}
              y1={264 - 50 * k}
              x2={84 + 208 * k}
              y2={354 - 58 * k}
            />
          ))}
          <line x1={67} y1={309} x2={275} y2={255} />
        </g>
        <rect x={180} y={340} width={42} height={40} fill="#9DA19B" />
      </g>
      {/* Enclosure */}
      <rect
        x={118}
        y={392}
        width={214}
        height={262}
        rx={20}
        fill="url(#tn-box)"
        opacity={shade}
      />
      <rect
        x={118}
        y={392}
        width={34}
        height={262}
        rx={14}
        fill="#000000"
        opacity={0.08}
      />
      <text
        x={225}
        y={500}
        textAnchor="middle"
        fontFamily="Quicksand, sans-serif"
        fontWeight={700}
        fontSize={30}
        fill={TN.forest}
      >
        TerraNode
      </text>
      {/* Leaf mark */}
      <path
        d="M225 590 C 200 570, 205 538, 232 528 C 246 552, 244 578, 225 590 Z"
        fill={TN.leaf}
      />
      <path d="M225 590 L 232 540" stroke="#2D6A27" strokeWidth={2.5} />
      {/* Status LED */}
      <circle cx={300} cy={420} r={7} fill={TN.violetLight} opacity={led} />
      <circle
        cx={300}
        cy={420}
        r={18}
        fill={TN.violetLight}
        opacity={led * 0.25}
      />
      {/* Mount straps */}
      <rect x={180} y={680} width={42} height={14} rx={4} fill="#8E918B" />
      <rect x={180} y={720} width={42} height={14} rx={4} fill="#8E918B" />
    </svg>
  );
};
