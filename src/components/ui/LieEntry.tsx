import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

interface LieEntryProps {
  truth: string;
  lie: string;
  agentName: string;
  agentColor: string;
  startFrame?: number;
}

export const LieEntry: React.FC<LieEntryProps> = ({
  truth,
  lie,
  agentName,
  agentColor,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);

  const opacity = interpolate(elapsed, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });
  const slideY = interpolate(elapsed, [0, 12], [20, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${slideY}px)`,
        fontFamily,
        marginBottom: 20,
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: agentColor,
          marginBottom: 8,
        }}
      >
        {agentName}
      </div>
      <div style={{ display: "flex", gap: 16 }}>
        {/* What they think */}
        <div
          style={{
            flex: 1,
            padding: "10px 14px",
            background: "rgba(68, 102, 255, 0.08)",
            border: "1px solid rgba(68, 102, 255, 0.2)",
            borderRadius: 8,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "#4466ff",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: 4,
            }}
          >
            Thinks
          </div>
          <div style={{ fontSize: 14, color: "#a1a1aa", lineHeight: 1.4 }}>
            {truth}
          </div>
        </div>
        {/* What they say */}
        <div
          style={{
            flex: 1,
            padding: "10px 14px",
            background: "rgba(255, 107, 53, 0.08)",
            border: "1px solid rgba(255, 107, 53, 0.2)",
            borderRadius: 8,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "#ff6b35",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: 4,
            }}
          >
            Says
          </div>
          <div style={{ fontSize: 14, color: "#e4e4e7", lineHeight: 1.4 }}>
            {lie}
          </div>
        </div>
      </div>
    </div>
  );
};
