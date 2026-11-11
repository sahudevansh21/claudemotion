import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/** Still-post host: 1080x1350 design canvas, fps=1, frame N renders post N+1, scaled to the output width. */
export const PW = 1080;
export const PH = 1350;
export const makeStill = (posts: React.FC[], bg: string): React.FC => () => {
  const f = useCurrentFrame();
  const { width } = useVideoConfig();
  const Post = posts[f];
  return (
    <AbsoluteFill style={{ background: bg }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: PW, height: PH, transform: `scale(${width / PW})`, transformOrigin: "0 0", overflow: "hidden" }}>
        <Post />
      </div>
    </AbsoluteFill>
  );
};
