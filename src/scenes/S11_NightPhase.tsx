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
import { Letterbox } from "../components/effects/Letterbox";
import { GlitchFlash } from "../components/effects/GlitchFlash";
import { ScreenShake } from "../components/effects/ScreenShake";
import { EnergyBurst } from "../components/effects/EnergyBurst";
import { ScanLines } from "../components/effects/ScanLines";
import { loadFont as loadHeading } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadBody } from "@remotion/google-fonts/Inter";

const heading = loadHeading();
const bodyFont = loadBody();

export const S11_NightPhase: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Phase progression
  const isNight = frame < 200;
  const isDawn = frame >= 200;

  // Purple tint for night
  const purpleTint = isNight
    ? interpolate(frame, [0, 30], [0, 0.15], { extrapolateRight: "clamp" })
    : interpolate(frame, [200, 240], [0.15, 0], { extrapolateRight: "clamp" });

  // Elimination flash at frame ~150 — stronger peak (0.9 instead of 0.5)
  const eliminationFlash = interpolate(
    frame,
    [145, 150, 160],
    [0, 0.9, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Dawn glow
  const dawnGlow = isDawn
    ? interpolate(frame, [200, 280], [0, 0.1], { extrapolateRight: "clamp" })
    : 0;

  // Night event labels
  const werewolfLabel = interpolate(frame, [40, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const seerLabel = interpolate(frame, [80, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const doctorLabel = interpolate(frame, [120, 135], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dawnLabel = isDawn
    ? interpolate(frame, [210, 230], [0, 1], { extrapolateRight: "clamp" })
    : 0;

  return (
    <Letterbox barHeight={60} delay={0} duration={6}>
      <ScreenShake startFrame={150} intensity={5} duration={10}>
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#060612",
            position: "relative",
          }}
        >
          {/* 3D Scene with night lighting */}
          <ThreeCanvas
            width={width}
            height={height}
            camera={{ position: [4, 3.5, 4], fov: 55 }}
            style={{ position: "absolute", inset: 0 }}
          >
            <SceneLighting3D
              phase={isNight ? "night" : "reveal"}
              agents={AGENTS}
            />
            <CouncilTable />
            {AGENTS.map((agent) => (
              <AgentFigure3D key={agent.id} config={agent} />
            ))}
            <SciFiFloor3D />
            <StarField3D />
            <fog attach="fog" args={["#060612", 8, 25]} />
          </ThreeCanvas>

          {/* Purple night tint */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(100,68,204,0.15)",
              opacity: purpleTint / 0.15,
              pointerEvents: "none",
            }}
          />

          {/* Elimination flash */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(255,255,255,0.2)",
              opacity: eliminationFlash,
              pointerEvents: "none",
            }}
          />

          {/* Dawn golden glow */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(255,179,71,0.08), transparent 50%)",
              opacity: dawnGlow / 0.1,
              pointerEvents: "none",
            }}
          />

          {/* Night event labels */}
          <div
            style={{
              position: "absolute",
              left: 80,
              bottom: 140,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div style={{ opacity: werewolfLabel }}>
              <span
                style={{
                  fontFamily: bodyFont.fontFamily,
                  fontSize: 20,
                  color: "#cc2244",
                  fontWeight: 600,
                }}
              >
                {"\u{1F5E1}\uFE0F"} The Killer chooses a target...
              </span>
            </div>
            <div style={{ opacity: seerLabel }}>
              <span
                style={{
                  fontFamily: bodyFont.fontFamily,
                  fontSize: 20,
                  color: "#45B7D1",
                  fontWeight: 600,
                }}
              >
                {"\u{1F52E}"} The Seer investigates...
              </span>
            </div>
            <div style={{ opacity: doctorLabel }}>
              <span
                style={{
                  fontFamily: bodyFont.fontFamily,
                  fontSize: 20,
                  color: "#F1948A",
                  fontWeight: 600,
                }}
              >
                {"\u{1FA7A}"} The Doctor protects...
              </span>
            </div>
            <div style={{ opacity: dawnLabel }}>
              <span
                style={{
                  fontFamily: heading.fontFamily,
                  fontSize: 28,
                  color: "#ffb347",
                  fontWeight: 700,
                }}
              >
                Dawn breaks — not everyone wakes up.
              </span>
            </div>
          </div>

          {/* GlitchFlash for each night event label appearance */}
          <GlitchFlash startFrame={40} duration={4} color="#cc2244" />
          <GlitchFlash startFrame={80} duration={4} color="#45B7D1" />
          <GlitchFlash startFrame={120} duration={4} color="#F1948A" />

          {/* Red strobe on werewolf choice */}
          <GlitchFlash startFrame={45} duration={3} color="#cc2244" />

          {/* EnergyBurst at elimination moment */}
          <EnergyBurst startFrame={150} color="white" particleCount={20} />

          {/* Strong ScanLines overlay */}
          <ScanLines opacity={0.05} />
        </div>
      </ScreenShake>
    </Letterbox>
  );
};
