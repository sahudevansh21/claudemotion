/** A healthy crop leaf with veins, drawn in a 400×600 box. */
export const Leaf: React.FC<{ width: number; style?: React.CSSProperties }> = ({
  width,
  style,
}) => (
  <svg
    width={width}
    height={(width * 600) / 400}
    viewBox="0 0 400 600"
    style={style}
  >
    <defs>
      <linearGradient id="tn-leaf" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#9CD36B" />
        <stop offset="0.5" stopColor="#5DA43A" />
        <stop offset="1" stopColor="#2F6E24" />
      </linearGradient>
    </defs>
    <path
      d="M200 580 C 60 470, 20 280, 110 130 C 150 70, 185 35, 200 20 C 215 35, 250 70, 290 130 C 380 280, 340 470, 200 580 Z"
      fill="url(#tn-leaf)"
    />
    <path
      d="M200 590 L 200 40"
      stroke="#D9F0B8"
      strokeOpacity={0.8}
      strokeWidth={6}
    />
    <g stroke="#D9F0B8" strokeOpacity={0.55} strokeWidth={3} fill="none">
      {[120, 190, 260, 330, 400, 470].map((y, i) => (
        <g key={y}>
          <path
            d={`M200 ${y + 40} Q ${150 - i * 4} ${y + 10}, ${90 + i * 6} ${y - 30}`}
          />
          <path
            d={`M200 ${y + 40} Q ${250 + i * 4} ${y + 10}, ${310 - i * 6} ${y - 30}`}
          />
        </g>
      ))}
    </g>
    {/* Warm rim light from the low sun */}
    <path
      d="M200 20 C 215 35, 250 70, 290 130 C 380 280, 340 470, 200 580"
      fill="none"
      stroke="#FFE3A3"
      strokeOpacity={0.7}
      strokeWidth={5}
    />
  </svg>
);
