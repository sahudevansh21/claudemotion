import { AbsoluteFill } from "remotion";
import { ez, Film, Glyph, K, LogoEnd, MONO, Plate, SANS, Scribble, Underline, useT, Words } from "./kit";
import TL from "./v7.json";

/**
 * V7 · "Monitoring first. Automation later." (content plan Day 14).
 * 20 s · 1080p60 · locked Notion AI reference (ANALYSIS.md §2): word reveals,
 * underline, plate wipes, roadmap cards with tick pills, scribble, logo.
 * Copy verbatim from collatera.buzz roadmap + token-role sections.
 */
const GREEN = "#1E9B4F";
const T = { fontFamily: SANS, fontWeight: 500, letterSpacing: -1.8, color: K.ink } as const;

const Hook: React.FC = () => (
  <AbsoluteFill style={{ background: K.paper, justifyContent: "center", alignItems: "center" }}>
    <div style={{ ...T, fontSize: 104, textAlign: "center", lineHeight: 1.1 }}>
      <div>
        <Words text="Monitoring first." at={0.05} />
      </div>
      <div style={{ display: "inline-block", position: "relative" }}>
        <Words text="Automation later." at={0.55} />
        <div style={{ position: "absolute", right: -4, bottom: -22 }}>
          <Underline width={300} at={1.45} color={GREEN} stroke={7} />
        </div>
      </div>
    </div>
  </AbsoluteFill>
);

const Card: React.FC<{ tag: string; title: string; children: React.ReactNode }> = ({ tag, title, children }) => (
  <div style={{ width: 1180, background: "#FFFFFF", borderRadius: 28, padding: "44px 52px", boxShadow: "0 30px 70px rgba(0,48,31,0.14)" }}>
    <div style={{ fontFamily: MONO, fontSize: 22, color: "#6E8578", letterSpacing: 2 }}>{tag}</div>
    <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 52, color: K.ink, marginTop: 10, letterSpacing: -1 }}>{title}</div>
    <div style={{ marginTop: 28 }}>{children}</div>
  </div>
);

const NOW = ["One demo vault modeled on Algorand lending markets", "Read-only position monitoring", "No keys, no funds moved", "No automatic execution"];
const Now: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill>
      <Plate color={K.mintPlate} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", transform: `scale(${1 + ez(t, 0, 4) * 0.04})` }}>
        <Card tag="NOW / V1" title="Read-only monitoring">
          {NOW.map((n, i) => {
            const p = ez(t, 1.0 + i * 0.6, 1.3 + i * 0.6);
            return (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20, fontFamily: SANS, fontSize: 36, color: K.ink, opacity: 0.25 + 0.75 * p }}>
                <span style={{ width: 40, height: 40, borderRadius: 99, background: p > 0.5 ? GREEN : "#E1EAE4", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.8 + 0.2 * p})` }}>
                  <Glyph kind="check" size={26} color="#FFFFFF" />
                </span>
                {n}
              </div>
            );
          })}
        </Card>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Later: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill>
      <Plate color={K.butter} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", transform: `scale(${1 + ez(t, 0, 4) * 0.04})` }}>
        <Card tag="LATER / CONDITIONAL" title="Limited automation, conditionally">
          <div style={{ fontFamily: SANS, fontSize: 36, lineHeight: 1.45, color: K.ink, maxWidth: 1060 }}>
            <Words text="Independent operators could bond to execute jobs users authorize and earn service fees." at={0.6} step={0.05} />
          </div>
        </Card>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 1080, top: 820 }}>
        <Scribble lines={["Needs funding,", "legal review & security checks"]} at={1.6} size={28} rotate={-4} />
      </div>
    </AbsoluteFill>
  );
};

const Paid: React.FC = () => (
  <AbsoluteFill style={{ background: K.paper, justifyContent: "center", alignItems: "center" }}>
    <div style={{ ...T, fontSize: 88, textAlign: "center", lineHeight: 1.2 }}>
      <div>
        <Words text="Paid usage comes first." at={0.05} />
      </div>
      <div style={{ display: "inline-block", position: "relative", marginTop: 20 }}>
        <Words text="A token is a proposal, not a promise." at={1.0} hi={["promise"]} hiColor={GREEN} />
        <div style={{ position: "absolute", right: 0, bottom: -24 }}>
          <Underline width={330} at={2.3} color={GREEN} stroke={6} />
        </div>
      </div>
    </div>
  </AbsoluteFill>
);

const Disc: React.FC = () => (
  <AbsoluteFill style={{ background: K.paper, justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 30 }}>
    <div style={{ ...T, fontSize: 60, textAlign: "center" }}>
      <Words text="Subscriptions and B2B accounts fund monitoring." at={0.05} step={0.06} />
    </div>
    <div style={{ fontFamily: MONO, fontSize: 28, color: "#5D6F64" }}>
      <Words text="Tokens do not guarantee returns or value." at={0.9} step={0.05} />
    </div>
  </AbsoluteFill>
);

const Logo: React.FC = () => <LogoEnd light at={0} line="read-only · no keys · no signatures" />;

export const CollateraV7: React.FC = () => <Film scenes={TL.scenes} map={{ hook: Hook, now: Now, later: Later, paid: Paid, disc: Disc, logo: Logo }} audio="collatera-campaign/v7/mix.wav" bg={K.paper} glow={false} />;
