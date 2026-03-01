import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  delay: number;
}

interface ParticleDriftProps {
  count?: number;
  color?: string;
  direction?: "up" | "down";
}

// Deterministic seeded pseudo-random (Remotion requires deterministic rendering)
function seededRand(seed: number): number {
  return (((seed * 2654435761) >>> 0) % 10000) / 10000;
}

export const ParticleDrift: React.FC<ParticleDriftProps> = ({
  count = 50,
  color = "#ff6b35",
  direction = "up",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  const particles = useMemo<Particle[]>(() => {
    const arr: Particle[] = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: seededRand(i * 6 + 1) * 1920,
        y: seededRand(i * 6 + 2) * 1080,
        size: 2 + seededRand(i * 6 + 3) * 4,
        speed: 20 + seededRand(i * 6 + 4) * 40,
        opacity: 0.2 + seededRand(i * 6 + 5) * 0.6,
        delay: seededRand(i * 6 + 6) * 5,
      });
    }
    return arr;
  }, [count]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {particles.map((p, i) => {
        const t = time + p.delay;
        const yOffset = direction === "up" ? -p.speed * t : p.speed * t;
        const y = ((p.y + yOffset) % 1200 + 1200) % 1200 - 60;
        const x = p.x + Math.sin(t * 0.5 + i) * 20;
        const flicker = 0.5 + Math.sin(t * 3 + i * 2) * 0.5;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: color,
              opacity: p.opacity * flicker,
              boxShadow: `0 0 ${p.size * 2}px ${color}`,
            }}
          />
        );
      })}
    </div>
  );
};
