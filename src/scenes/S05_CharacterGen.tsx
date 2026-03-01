import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { AGENTS } from "../constants/agents";
import { CouncilTable } from "../components/three/CouncilTable";
import { AgentFigure3D } from "../components/three/AgentFigure3D";
import { SceneLighting3D } from "../components/three/SceneLighting3D";
import { SciFiFloor3D } from "../components/three/SciFiFloor3D";
import { StarField3D } from "../components/three/StarField3D";
import { AgentCard } from "../components/ui/AgentCard";

export const S05_CharacterGen: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Agents materialize one by one (every ~30 frames)
  const agentVisibility = AGENTS.map((_, i) => {
    const appearFrame = 20 + i * 28;
    return interpolate(frame, [appearFrame, appearFrame + 15], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  });

  // Card overlay appears after agents
  const cardStartFrame = 20 + AGENTS.length * 28 + 10;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#060612",
        position: "relative",
      }}
    >
      {/* 3D Scene */}
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ position: [4, 3, 4], fov: 60 }}
        style={{ position: "absolute", inset: 0 }}
      >
        <SceneLighting3D phase="discussion" agents={AGENTS} />
        <CouncilTable />
        {AGENTS.map((agent, i) => (
          <AgentFigure3D
            key={agent.id}
            config={agent}
            visible={agentVisibility[i] > 0.1}
          />
        ))}
        <SciFiFloor3D />
        <StarField3D />
        <fog attach="fog" args={["#060612", 10, 30]} />
      </ThreeCanvas>

      {/* Agent flash effects */}
      {AGENTS.map((agent, i) => {
        const appearFrame = 20 + i * 28;
        const flashOpacity = interpolate(
          frame,
          [appearFrame, appearFrame + 5, appearFrame + 15],
          [0, 0.6, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        return (
          <div
            key={agent.id}
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(circle at 50% 50%, ${agent.color}30, transparent 50%)`,
              opacity: flashOpacity,
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* Right-side agent cards */}
      <div
        style={{
          position: "absolute",
          right: 40,
          top: 100,
          width: 280,
        }}
      >
        {AGENTS.slice(0, 4).map((agent, i) => (
          <AgentCard
            key={agent.id}
            name={agent.name}
            color={agent.color}
            role={agent.role}
            personality={agent.personality}
            startFrame={cardStartFrame + i * 12}
          />
        ))}
      </div>
    </div>
  );
};
