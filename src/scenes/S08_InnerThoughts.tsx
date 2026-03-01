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
import { LieEntry } from "../components/ui/LieEntry";
import { PhaseLabel } from "../components/ui/PhaseLabel";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

const THOUGHT_DATA = [
  {
    agent: "lyra",
    thinks: "Marcus is getting too close to the truth. I need to redirect suspicion toward Zara.",
    says: "I think we should consider Zara's behavior. She's been very aggressive — is she hiding something?",
  },
  {
    agent: "viktor",
    thinks: "My alliance with Lyra is at risk. If she goes down, I'm next. I need to appear neutral.",
    says: "Let's not jump to conclusions. We should hear from everyone before making accusations.",
  },
];

export const S08_InnerThoughts: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Split screen: 3D left, thoughts right
  const panelOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Brain icon pulse
  const brainScale = 1 + Math.sin(frame * 0.15) * 0.05;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#060612",
        position: "relative",
        display: "flex",
      }}
    >
      {/* Left: 3D scene */}
      <div style={{ width: "50%", height: "100%", position: "relative" }}>
        <ThreeCanvas
          width={width / 2}
          height={height}
          camera={{ position: [2.5, 2, 2.5], fov: 55 }}
        >
          <SceneLighting3D phase="discussion" agents={AGENTS} />
          <CouncilTable />
          {AGENTS.map((agent) => (
            <AgentFigure3D
              key={agent.id}
              config={agent}
              isThinking={agent.id === "lyra" || agent.id === "viktor"}
            />
          ))}
          <SciFiFloor3D />
          <StarField3D />
          <fog attach="fog" args={["#060612", 10, 30]} />
        </ThreeCanvas>
      </div>

      {/* Right: Thought panel */}
      <div
        style={{
          width: "50%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 40px",
          opacity: panelOpacity,
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div
            style={{
              fontSize: 36,
              transform: `scale(${brainScale})`,
            }}
          >
            {"\u{1F9E0}"}
          </div>
          <div>
            <PhaseLabel label="Inner Thoughts" color="#4466ff" />
            <p style={{ fontFamily, fontSize: 14, color: "#71717a", margin: "4px 0 0" }}>
              What they think vs. what they say
            </p>
          </div>
        </div>

        {/* Thought entries */}
        {THOUGHT_DATA.map((data, i) => {
          const agent = AGENTS.find((a) => a.id === data.agent);
          if (!agent) return null;
          return (
            <LieEntry
              key={i}
              truth={data.thinks}
              lie={data.says}
              agentName={agent.name}
              agentColor={agent.color}
              startFrame={40 + i * 60}
            />
          );
        })}
      </div>

      {/* Divider line */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 60,
          bottom: 60,
          width: 1,
          background: "linear-gradient(to bottom, transparent, rgba(68,102,255,0.3), transparent)",
        }}
      />
    </div>
  );
};
