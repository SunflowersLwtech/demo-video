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
import { VoteTallyBar } from "../components/ui/VoteTallyBar";
import { GlassCard } from "../components/ui/GlassCard";
import { PhaseLabel } from "../components/ui/PhaseLabel";
import { GlitchFlash } from "../components/effects/GlitchFlash";
import { ScreenShake } from "../components/effects/ScreenShake";
import { EnergyBurst } from "../components/effects/EnergyBurst";
import { ContrastGrade } from "../components/effects/ContrastGrade";
import { ScanLines } from "../components/effects/ScanLines";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

// Vote results
const VOTES = [
  { agent: "lyra", votes: 4 },
  { agent: "viktor", votes: 1 },
  { agent: "marcus", votes: 1 },
  { agent: "zara", votes: 1 },
];

// Vote reveal order (who voted for whom)
const VOTE_REVEALS = [
  { voter: "marcus", target: "lyra", frame: 60 },
  { voter: "orion", target: "lyra", frame: 85 },
  { voter: "zara", target: "lyra", frame: 110 },
  { voter: "nina", target: "lyra", frame: 135 },
  { voter: "kai", target: "viktor", frame: 160 },
  { voter: "lyra", target: "marcus", frame: 185 },
  { voter: "viktor", target: "zara", frame: 210 },
];

export const S10_VotingPhase: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Red tint overlay pulses — 4x stronger
  const redPulse = 0.12 + Math.sin(frame * 0.1) * 0.08;

  // Tally panel slides in
  const tallyOpacity = interpolate(frame, [40, 60], [0, 1], {
    extrapolateRight: "clamp",
  });

  const sceneContent = (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#060612",
        position: "relative",
      }}
    >
      {/* 3D Scene with red lighting */}
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ position: [3.5, 3, 3.5], fov: 55 }}
        style={{ position: "absolute", inset: 0 }}
      >
        <SceneLighting3D phase="voting" agents={AGENTS} />
        <CouncilTable />
        {AGENTS.map((agent) => (
          <AgentFigure3D key={agent.id} config={agent} />
        ))}
        <SciFiFloor3D />
        <StarField3D />
        <fog attach="fog" args={["#060612", 10, 30]} />
      </ThreeCanvas>

      {/* Red tint overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `rgba(204,34,68,${redPulse})`,
          pointerEvents: "none",
        }}
      />

      {/* Right overlay gradient */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 550,
          background: "linear-gradient(to right, transparent, rgba(6,6,18,0.9) 30%)",
          pointerEvents: "none",
        }}
      />

      {/* Vote panel */}
      <div
        style={{
          position: "absolute",
          right: 40,
          top: 80,
          width: 420,
          opacity: tallyOpacity,
        }}
      >
        <PhaseLabel label="Voting Phase" color="#cc2244" />

        <div style={{ marginTop: 20 }}>
          <GlassCard padding={24} borderColor="rgba(204,34,68,0.2)">
            {/* Vote reveals */}
            <div
              style={{
                fontFamily,
                fontSize: 12,
                color: "#71717a",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 16,
              }}
            >
              Vote Tally
            </div>
            {VOTES.map((vote, i) => {
              const agent = AGENTS.find((a) => a.id === vote.agent);
              if (!agent) return null;
              // Count how many votes revealed so far
              const revealedVotes = VOTE_REVEALS.filter(
                (r) => r.target === vote.agent && frame >= r.frame
              ).length;
              return (
                <VoteTallyBar
                  key={agent.id}
                  agentName={agent.name}
                  agentColor={agent.color}
                  votes={Math.min(revealedVotes, vote.votes)}
                  maxVotes={AGENTS.length}
                  startFrame={50 + i * 10}
                />
              );
            })}
          </GlassCard>
        </div>

        {/* Individual vote reveals */}
        <div style={{ marginTop: 16 }}>
          {VOTE_REVEALS.map((reveal, i) => {
            if (frame < reveal.frame) return null;
            const voter = AGENTS.find((a) => a.id === reveal.voter);
            const target = AGENTS.find((a) => a.id === reveal.target);
            if (!voter || !target) return null;
            const opacity = interpolate(
              frame,
              [reveal.frame, reveal.frame + 10],
              [0, 1],
              { extrapolateRight: "clamp" }
            );
            return (
              <div
                key={i}
                style={{
                  opacity,
                  fontFamily,
                  fontSize: 14,
                  color: "#a1a1aa",
                  padding: "4px 0",
                }}
              >
                <span style={{ color: voter.color, fontWeight: 600 }}>
                  {voter.name}
                </span>
                {" voted for "}
                <span style={{ color: target.color, fontWeight: 600 }}>
                  {target.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* GlitchFlash per vote reveal (red tinted) */}
      {VOTE_REVEALS.map((reveal, i) => (
        <GlitchFlash key={`glitch-${i}`} startFrame={reveal.frame} duration={4} color="#cc2244" />
      ))}

      {/* Big GlitchFlash + EnergyBurst when majority reached (4th vote for Lyra, frame 135) */}
      <GlitchFlash startFrame={135} duration={6} color="#cc2244" />
      <EnergyBurst startFrame={135} color="#cc2244" particleCount={25} />

      {/* ScanLines overlay */}
      <ScanLines opacity={0.05} />
    </div>
  );

  // Single dramatic shake only at the majority decision moment
  return (
    <ContrastGrade brightness={1} contrast={1.15} saturate={0.9}>
      <ScreenShake startFrame={135} intensity={5} duration={10}>
        {sceneContent}
      </ScreenShake>
    </ContrastGrade>
  );
};
