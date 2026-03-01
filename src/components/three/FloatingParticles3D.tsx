import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";

interface FloatingParticles3DProps {
  count?: number;
}

export const FloatingParticles3D: React.FC<FloatingParticles3DProps> = ({
  count = 100,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  // Generate initial positions and velocities deterministically
  const particles = useMemo(() => {
    const data: { x: number; y: number; z: number; vx: number; vy: number; vz: number }[] = [];
    // Use seeded random for determinism
    let seed = 42;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    for (let i = 0; i < count; i++) {
      data.push({
        x: (rand() - 0.5) * 14,
        y: rand() * 5 + 0.5,
        z: (rand() - 0.5) * 14,
        vx: (rand() - 0.5) * 0.003,
        vy: (rand() - 0.5) * 0.002,
        vz: (rand() - 0.5) * 0.003,
      });
    }
    return data;
  }, [count]);

  // Compute positions deterministically from frame
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const p = particles[i];
      // Simple deterministic motion: initial + velocity * frame, with sine wrap
      const x = p.x + Math.sin(time * 0.5 + i * 0.7) * 1.5;
      const y = p.y + Math.sin(time * 0.3 + i * 1.1) * 0.5;
      const z = p.z + Math.cos(time * 0.4 + i * 0.9) * 1.5;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
    }
    return pos;
  }, [count, particles, time]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#ff6b35"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
