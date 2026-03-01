import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { getSeatPosition, type AgentConfig } from "../../constants/agents";

interface AgentFigure3DProps {
  config: AgentConfig;
  isSpeaking?: boolean;
  isThinking?: boolean;
  totalSeats?: number;
  visible?: boolean;
}

export const AgentFigure3D: React.FC<AgentFigure3DProps> = ({
  config,
  isSpeaking = false,
  isThinking = false,
  totalSeats = 7,
  visible = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  const pos = getSeatPosition(config.seatIndex, totalSeats);
  const facingAngle = Math.atan2(-pos[0], -pos[2]);

  // Compute all animated values deterministically from frame
  const floatY = Math.sin(time * 0.8 + config.seatIndex) * 0.015;

  let headY = 1.0;
  let groupScale = 1.0;
  let groupY = floatY;
  let groupRotY = facingAngle;
  let bodyEmissive = 0.05;
  let ringOpacity = 0.2;
  let pulseVisible = false;
  let pulseScale = 1;
  let pulseOpacity = 0.3;
  let beamVisible = false;
  let beamOpacity = 0.06;

  if (isSpeaking) {
    headY = 1.0 + Math.sin(time * 8) * 0.03;
    groupScale = Math.sin(time * 6) * 0.02 + 1.0;
    bodyEmissive = 0.2 + Math.sin(time * 4) * 0.15;
    ringOpacity = 0.6;
    pulseVisible = true;
    pulseScale = 1 + Math.sin(time * 4) * 0.3;
    pulseOpacity = 0.4 - Math.sin(time * 4) * 0.2;
    beamVisible = true;
    beamOpacity = 0.06 + Math.sin(time * 3) * 0.03;
  } else if (isThinking) {
    groupRotY = facingAngle + Math.sin(time * 3) * 0.05;
    groupY = Math.sin(time * 4) * 0.02 + floatY;
    bodyEmissive = 0.15;
  } else {
    groupScale = Math.sin(time * 1.5) * 0.01 + 1.0;
  }

  // Ring rotation
  const ringRotZ = time * 0.5;

  if (!visible) return null;

  return (
    <group position={pos}>
      <group
        position={[0, groupY, 0]}
        rotation={[0, groupRotY, 0]}
        scale={[groupScale, groupScale, groupScale]}
      >
        {/* Base glow ring */}
        <mesh
          rotation={[-Math.PI / 2, 0, ringRotZ]}
          position={[0, 0.02, 0]}
        >
          <ringGeometry args={[0.28, 0.35, 32]} />
          <meshBasicMaterial
            color={config.color}
            transparent
            opacity={ringOpacity}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Speaking pulse ring */}
        {pulseVisible && (
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.03, 0]}
            scale={[pulseScale, pulseScale, 1]}
          >
            <ringGeometry args={[0.35, 0.55, 32]} />
            <meshBasicMaterial
              color={config.color}
              transparent
              opacity={pulseOpacity}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        )}

        {/* Body */}
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.18, 0.24, 0.85, 16]} />
          <meshStandardMaterial
            color={config.color}
            emissive={config.color}
            emissiveIntensity={bodyEmissive}
            metalness={0.5}
            roughness={0.4}
          />
        </mesh>

        {/* Body segmentation rings */}
        <mesh position={[0, 0.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.235, 0.245, 32]} />
          <meshBasicMaterial
            color={config.color}
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[0, 0.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.21, 0.22, 32]} />
          <meshBasicMaterial
            color={config.color}
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Shoulder accent */}
        <mesh position={[0, 0.88, 0]}>
          <cylinderGeometry args={[0.2, 0.18, 0.06, 16]} />
          <meshStandardMaterial
            color={config.color}
            emissive={config.color}
            emissiveIntensity={isSpeaking ? 0.5 : 0.1}
            metalness={0.5}
            roughness={0.4}
          />
        </mesh>

        {/* Head */}
        <mesh position={[0, headY, 0]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial
            color={config.color}
            emissive={config.color}
            emissiveIntensity={isSpeaking ? 0.5 : isThinking ? 0.2 : 0.05}
            metalness={0.3}
            roughness={0.5}
          />
        </mesh>

        {/* Visor ring */}
        <mesh position={[0, headY + 0.02, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.16, 0.012, 8, 32]} />
          <meshBasicMaterial
            color={config.color}
            transparent
            opacity={isSpeaking ? 0.9 : 0.5}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Head glow halo (speaking) */}
        {isSpeaking && (
          <mesh position={[0, headY, 0]}>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshBasicMaterial
              color={config.color}
              transparent
              opacity={0.08}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        )}

        {/* Vertical light beam (speaking) */}
        {beamVisible && (
          <mesh position={[0, 2.2, 0]}>
            <cylinderGeometry args={[0.03, 0.06, 2.0, 8]} />
            <meshBasicMaterial
              color={config.color}
              transparent
              opacity={beamOpacity}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        )}
      </group>
    </group>
  );
};
