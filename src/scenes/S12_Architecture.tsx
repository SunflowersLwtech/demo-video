import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { ArchNode } from "../components/ui/ArchNode";
import { FadeIn } from "../components/effects/FadeIn";
import { PhaseLabel } from "../components/ui/PhaseLabel";
import { loadFont as loadHeading } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadBody } from "@remotion/google-fonts/Inter";

const heading = loadHeading();
const bodyFont = loadBody();

// Architecture nodes
const NODES = [
  { label: "Mistral AI", description: "Large Language Model", x: 960, y: 300, color: "#ff6b35", isCenter: true, start: 15 },
  { label: "Agent Memory", description: "Long-term recall", x: 560, y: 180, color: "#4ECDC4", start: 40 },
  { label: "Personality Engine", description: "4-layer model", x: 1360, y: 180, color: "#45B7D1", start: 50 },
  { label: "Emotion System", description: "6-axis dynamic", x: 460, y: 400, color: "#F1948A", start: 60 },
  { label: "Decision Engine", description: "Strategic voting", x: 1460, y: 400, color: "#FFD93D", start: 70 },
  { label: "Discussion Manager", description: "Turn & topic flow", x: 560, y: 580, color: "#C39BD3", start: 80 },
  { label: "Function Calling", description: "Structured actions", x: 1360, y: 580, color: "#76D7C4", start: 90 },
  { label: "Game Orchestrator", description: "Phase management", x: 960, y: 700, color: "#FF6B6B", start: 100 },
];

// Connections between nodes (from center to others)
const CONNECTIONS = [
  { from: 0, to: 1 }, { from: 0, to: 2 },
  { from: 0, to: 3 }, { from: 0, to: 4 },
  { from: 0, to: 5 }, { from: 0, to: 6 },
  { from: 7, to: 5 }, { from: 7, to: 6 },
  { from: 1, to: 3 }, { from: 2, to: 4 },
];

export const S12_Architecture: React.FC = () => {
  const frame = useCurrentFrame();

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
      {/* Title */}
      <div style={{ position: "absolute", top: 40, left: 80 }}>
        <FadeIn delay={0} duration={15}>
          <PhaseLabel label="System Architecture" color="#ff6b35" />
        </FadeIn>
        <FadeIn delay={10} duration={20}>
          <h2
            style={{
              fontFamily: heading.fontFamily,
              fontSize: 36,
              color: "#e4e4e7",
              margin: "12px 0 0",
            }}
          >
            Under the Hood
          </h2>
        </FadeIn>
      </div>

      {/* Connection lines (SVG) */}
      <svg
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        viewBox="0 0 1920 1080"
      >
        {CONNECTIONS.map((conn, i) => {
          const from = NODES[conn.from];
          const to = NODES[conn.to];
          const lineStart = Math.max(from.start, to.start);
          const lineOpacity = interpolate(
            frame,
            [lineStart, lineStart + 20],
            [0, 0.2],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          return (
            <line
              key={i}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={from.color}
              strokeWidth={1}
              opacity={lineOpacity}
            />
          );
        })}
      </svg>

      {/* Architecture nodes */}
      {NODES.map((node, i) => (
        <ArchNode
          key={i}
          label={node.label}
          description={node.description}
          color={node.color}
          x={node.x}
          y={node.y}
          startFrame={node.start}
          isCenter={node.isCenter}
          width={node.isCenter ? 220 : 180}
        />
      ))}

      {/* Bottom description */}
      <FadeIn delay={110} duration={20} style={{ position: "absolute", bottom: 60, left: 80, right: 80 }}>
        <p
          style={{
            fontFamily: bodyFont.fontFamily,
            fontSize: 18,
            color: "#71717a",
            textAlign: "center",
          }}
        >
          Each agent runs independently with its own memory, personality model, and decision engine — all powered by Mistral AI
        </p>
      </FadeIn>
    </div>
  );
};
