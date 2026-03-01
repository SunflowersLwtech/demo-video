import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";

export const SciFiFloor3D: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  const spinRingRotation = time * 0.12;

  return (
    <group>
      {/* Reflective dark floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <circleGeometry args={[12, 64]} />
        <meshStandardMaterial color="#08081a" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Subtle radial glow under table */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[1.5, 3.2, 64]} />
        <meshBasicMaterial
          color="#ff6b35"
          transparent
          opacity={0.04}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Concentric floor rings */}
      {[4, 6, 8].map((r) => (
        <mesh key={r} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
          <ringGeometry args={[r - 0.01, r + 0.01, 64]} />
          <meshBasicMaterial
            color="#4466ff"
            transparent
            opacity={0.02}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Slowly rotating accent ring */}
      <mesh
        rotation={[-Math.PI / 2, 0, spinRingRotation]}
        position={[0, 0.008, 0]}
      >
        <ringGeometry args={[3.4, 3.5, 64]} />
        <meshBasicMaterial
          color="#ff6b35"
          transparent
          opacity={0.04}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};
