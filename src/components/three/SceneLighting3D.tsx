import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { getSeatPosition, type AgentConfig } from "../../constants/agents";

type LightingPhase = "discussion" | "voting" | "night" | "reveal";

interface SceneLighting3DProps {
  phase?: LightingPhase;
  speakingAgentId?: string | null;
  agents?: AgentConfig[];
}

const PHASE_COLORS: Record<LightingPhase, { tableGlow: string; underglow: string; ambient: number; tableIntensity: number; underIntensity: number }> = {
  discussion: { tableGlow: "#ff9060", underglow: "#6644cc", ambient: 0.25, tableIntensity: 0.3, underIntensity: 0.2 },
  voting: { tableGlow: "#cc2244", underglow: "#882244", ambient: 0.08, tableIntensity: 0.45, underIntensity: 0.3 },
  night: { tableGlow: "#6644cc", underglow: "#4422aa", ambient: 0.05, tableIntensity: 0.2, underIntensity: 0.35 },
  reveal: { tableGlow: "#ffffff", underglow: "#6644cc", ambient: 0.05, tableIntensity: 0.6, underIntensity: 0.15 },
};

export const SceneLighting3D: React.FC<SceneLighting3DProps> = ({
  phase = "discussion",
  speakingAgentId = null,
  agents = [],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  const colors = PHASE_COLORS[phase];

  // Subtle pulse on table glow
  const pulseSpeed = phase === "voting" ? 3.0 : 1.0;
  const pulseAmp = phase === "voting" ? 0.08 : 0.03;
  const tableIntensity = colors.tableIntensity + Math.sin(time * pulseSpeed) * pulseAmp;

  // Spotlight target
  let spotTarget: [number, number, number] = [0, 0, 0];
  if (speakingAgentId && agents.length > 0) {
    const agent = agents.find((a) => a.id === speakingAgentId);
    if (agent) {
      const pos = getSeatPosition(agent.seatIndex, agents.length);
      spotTarget = [pos[0], 1.0, pos[2]];
    }
  }

  return (
    <>
      <ambientLight intensity={colors.ambient} color="#8888cc" />

      <directionalLight position={[5, 8, 5]} intensity={0.5} color="#c8d8ff" />

      {/* Table overhead glow */}
      <pointLight
        position={[0, 3.5, 0]}
        intensity={tableIntensity}
        color={colors.tableGlow}
        distance={8}
        decay={2}
      />

      {/* Under-table glow */}
      <pointLight
        position={[0, 0.3, 0]}
        intensity={colors.underIntensity}
        color={colors.underglow}
        distance={5}
        decay={2}
      />

      {/* Cyan rim light */}
      <pointLight position={[-4, 2, 3]} intensity={0.1} color="#00ccff" distance={10} decay={2} />

      {/* Magenta rim light */}
      <pointLight position={[4, 2, -3]} intensity={0.08} color="#cc44ff" distance={10} decay={2} />

      {/* Blue back rim */}
      <pointLight position={[0, 2, -5]} intensity={0.15} color="#4466ff" distance={10} decay={2} />

      {/* Spotlight (follows speaker) */}
      <spotLight
        position={[0, 6, 0]}
        target-position={spotTarget}
        angle={0.3}
        penumbra={0.6}
        intensity={speakingAgentId ? 1.5 : 0.3}
        color="#fff5e6"
        distance={12}
        decay={2}
      />
    </>
  );
};
