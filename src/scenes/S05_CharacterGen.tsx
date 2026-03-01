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
import { ScreenShake } from "../components/effects/ScreenShake";
import { GlitchFlash } from "../components/effects/GlitchFlash";
import { ScanLines } from "../components/effects/ScanLines";

export const S05_CharacterGen: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Agents materialize one by one (every ~28 frames)
  const agentAppearFrames = AGENTS.map((_, i) => 20 + i * 28);

  const agentVisibility = AGENTS.map((_, i) => {
    const appearFrame = agentAppearFrames[i];
    return interpolate(frame, [appearFrame, appearFrame + 15], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  });

  // Card overlay appears after agents
  const cardStartFrame = 20 + AGENTS.length * 28 + 10;

  // Single subtle shake at the first and last agent appearance
  return (
    <ScreenShake startFrame={agentAppearFrames[0]} intensity={3} duration={8}>
    <ScreenShake startFrame={agentAppearFrames[AGENTS.length - 1]} intensity={4} duration={10}>

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

      {/* Agent flash effects — increased intensity to 1.0 */}
      {AGENTS.map((agent, i) => {
        const appearFrame = agentAppearFrames[i];
        const flashOpacity = interpolate(
          frame,
          [appearFrame, appearFrame + 5, appearFrame + 15],
          [0, 1.0, 0],
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

      {/* GlitchFlash on alternating agents (every other agent) */}
      {AGENTS.map((agent, i) => {
        if (i % 2 !== 0) return null; // even-indexed agents get glitch
        return (
          <GlitchFlash
            key={`glitch-${agent.id}`}
            startFrame={agentAppearFrames[i]}
            duration={5}
            color={agent.color}
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

      {/* ScanLines overlay */}
      <ScanLines opacity={0.04} />
    </div>
    </ScreenShake>
    </ScreenShake>
  );
};
