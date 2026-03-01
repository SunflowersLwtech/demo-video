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
import { FloatingParticles3D } from "../components/three/FloatingParticles3D";
import { StarField3D } from "../components/three/StarField3D";
import { ChatBubble } from "../components/ui/ChatBubble";
import { PhaseLabel } from "../components/ui/PhaseLabel";
import { GlassCard } from "../components/ui/GlassCard";

// Discussion messages timeline
const MESSAGES = [
  { agent: "marcus", text: "I've been watching Lyra closely. Her defense of Viktor was oddly specific — almost rehearsed.", start: 30 },
  { agent: "lyra", text: "Rehearsed? I was simply pointing out the logical inconsistency in your accusation, Marcus.", start: 110 },
  { agent: "zara", text: "That's exactly what a werewolf would say. Deflect and redirect.", start: 200 },
  { agent: "viktor", text: "Perhaps we should focus on actions, not words. Who has been suspiciously quiet?", start: 280 },
  { agent: "orion", text: "I agree with Marcus. Something about Lyra's pattern doesn't add up.", start: 350 },
];

export const S07_Discussion: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Determine who's speaking
  let speakingId: string | null = null;
  for (const msg of MESSAGES) {
    if (frame >= msg.start && frame < msg.start + 80) {
      speakingId = msg.agent;
    }
  }

  // Chat panel slides in
  const panelX = interpolate(frame, [15, 35], [400, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#060612",
        position: "relative",
      }}
    >
      {/* 3D Scene - left portion */}
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ position: [3.5, 2.5, 3.5], fov: 55 }}
        style={{ position: "absolute", inset: 0 }}
      >
        <SceneLighting3D
          phase="discussion"
          speakingAgentId={speakingId}
          agents={AGENTS}
        />
        <CouncilTable />
        {AGENTS.map((agent) => (
          <AgentFigure3D
            key={agent.id}
            config={agent}
            isSpeaking={speakingId === agent.id}
          />
        ))}
        <SciFiFloor3D />
        <FloatingParticles3D count={80} />
        <StarField3D />
        <fog attach="fog" args={["#060612", 10, 30]} />
      </ThreeCanvas>

      {/* Gradient overlay for chat readability */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 600,
          background: "linear-gradient(to right, transparent, rgba(6,6,18,0.85) 30%)",
          pointerEvents: "none",
        }}
      />

      {/* Chat panel overlay */}
      <div
        style={{
          position: "absolute",
          right: 40,
          top: 80,
          bottom: 80,
          width: 480,
          transform: `translateX(${panelX}px)`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <PhaseLabel label="Discussion Phase" color="#ff9060" />
        <div style={{ marginTop: 24, flex: 1, overflow: "hidden" }}>
          <GlassCard padding={24} borderColor="rgba(255,144,96,0.15)">
            {MESSAGES.map((msg, i) => {
              const agent = AGENTS.find((a) => a.id === msg.agent);
              if (!agent || frame < msg.start) return null;
              return (
                <ChatBubble
                  key={i}
                  agentName={agent.name}
                  agentColor={agent.color}
                  message={msg.text}
                  startFrame={msg.start}
                />
              );
            })}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
