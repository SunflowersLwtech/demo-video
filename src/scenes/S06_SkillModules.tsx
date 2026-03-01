import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { SkillHexagon } from "../components/ui/SkillHexagon";
import { FadeIn } from "../components/effects/FadeIn";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

const SKILLS = [
  { label: "Deductive\nReasoning", icon: "\u{1F9E0}", color: "#4ECDC4" },
  { label: "Emotional\nManipulation", icon: "\u{1F3AD}", color: "#FF6B6B" },
  { label: "Strategic\nPlanning", icon: "\u{265F}\u{FE0F}", color: "#45B7D1" },
  { label: "Social\nDeduction", icon: "\u{1F50D}", color: "#FFD93D" },
  { label: "Memory\nRetrieval", icon: "\u{1F4BE}", color: "#C39BD3" },
  { label: "Trust\nModeling", icon: "\u{1F91D}", color: "#F1948A" },
  { label: "Deception\nCraft", icon: "\u{1F47E}", color: "#76D7C4" },
];

export const S06_SkillModules: React.FC = () => {
  const frame = useCurrentFrame();

  // Central Mistral logo pulse
  const logoScale = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const logoGlow = 0.3 + Math.sin(frame * 0.1) * 0.1;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#0a0a14",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Central Mistral logo */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${logoScale})`,
        }}
      >
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,107,53,0.2), rgba(255,107,53,0.05))",
            border: "2px solid rgba(255,107,53,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 40px rgba(255,107,53,${logoGlow})`,
          }}
        >
          {/* Mistral dots */}
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", width: 40, justifyContent: "center" }}>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: i % 2 === 0 ? "#ff6b35" : "#ffb347",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Orbiting skill hexagons */}
      {SKILLS.map((skill, i) => (
        <SkillHexagon
          key={i}
          label={skill.label}
          icon={skill.icon}
          color={skill.color}
          angle={(i / SKILLS.length) * Math.PI * 2}
          radius={280}
          startFrame={15 + i * 8}
        />
      ))}

      {/* Title */}
      <FadeIn delay={5} duration={15} style={{ position: "absolute", top: 60, left: 0, right: 0, textAlign: "center" }}>
        <p
          style={{
            fontFamily,
            fontSize: 18,
            color: "#ff6b35",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            fontWeight: 600,
          }}
        >
          Cognitive Skill Modules
        </p>
      </FadeIn>
    </div>
  );
};
