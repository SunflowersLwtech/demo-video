import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

interface AgentCardProps {
  name: string;
  color: string;
  role: string;
  personality: string;
  startFrame?: number;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  name,
  color,
  role,
  personality,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);

  const opacity = interpolate(elapsed, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });
  const slideX = interpolate(elapsed, [0, 15], [30, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${slideX}px)`,
        padding: "14px 18px",
        background: "rgba(15, 15, 26, 0.9)",
        border: `1px solid ${color}40`,
        borderLeft: `3px solid ${color}`,
        borderRadius: 10,
        fontFamily,
        marginBottom: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 700,
            color: "#0a0a14",
          }}
        >
          {name[0]}
        </div>
        <span style={{ fontSize: 18, fontWeight: 700, color }}>{name}</span>
        <span
          style={{
            fontSize: 12,
            color: "#71717a",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {role}
        </span>
      </div>
      <div style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.4 }}>
        {personality}
      </div>
    </div>
  );
};
