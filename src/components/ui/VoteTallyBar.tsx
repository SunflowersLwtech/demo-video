import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

interface VoteTallyBarProps {
  agentName: string;
  agentColor: string;
  votes: number;
  maxVotes: number;
  startFrame?: number;
}

export const VoteTallyBar: React.FC<VoteTallyBarProps> = ({
  agentName,
  agentColor,
  votes,
  maxVotes,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);

  const width = interpolate(elapsed, [0, 25], [0, votes / maxVotes], {
    extrapolateRight: "clamp",
  });

  const countDisplay = Math.min(
    Math.floor(interpolate(elapsed, [0, 25], [0, votes], { extrapolateRight: "clamp" })),
    votes
  );

  return (
    <div style={{ marginBottom: 12, fontFamily }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 4,
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: agentColor,
          }}
        />
        <span style={{ fontSize: 18, color: "#e4e4e7", fontWeight: 500, width: 80 }}>
          {agentName}
        </span>
        <div
          style={{
            flex: 1,
            height: 24,
            background: "rgba(255,255,255,0.04)",
            borderRadius: 6,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${width * 100}%`,
              background: `linear-gradient(90deg, ${agentColor}, ${agentColor}88)`,
              borderRadius: 6,
              boxShadow: `0 0 12px ${agentColor}30`,
            }}
          />
        </div>
        <span style={{ fontSize: 20, color: agentColor, fontWeight: 700, width: 30, textAlign: "right" }}>
          {countDisplay}
        </span>
      </div>
    </div>
  );
};
