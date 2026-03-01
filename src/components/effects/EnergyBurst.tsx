import React, { useMemo } from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface EnergyBurstProps {
  startFrame: number;
  particleCount?: number;
  color?: string;
  duration?: number;
  x?: string;
  y?: string;
}

interface Particle {
  angle: number;
  speed: number;
  size: number;
}

export const EnergyBurst: React.FC<EnergyBurstProps> = ({
  startFrame,
  particleCount = 20,
  color = "#ff6b35",
  duration = 15,
  x = "50%",
  y = "50%",
}) => {
  const frame = useCurrentFrame();

  const particles = useMemo<Particle[]>(() => {
    const result: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const seed = ((i * 2654435761) >>> 0) % 1000;
      result.push({
        angle,
        speed: 80 + (seed / 1000) * 120,
        size: 3 + (seed % 5),
      });
    }
    return result;
  }, [particleCount]);

  const elapsed = frame - startFrame;

  if (elapsed < 0 || elapsed >= duration) {
    return null;
  }

  const progress = interpolate(elapsed, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(progress, [0, 0.2, 1], [1, 0.8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: 0,
          height: 0,
        }}
      >
        {particles.map((p, i) => {
          const distance = p.speed * progress;
          const px = Math.cos(p.angle) * distance;
          const py = Math.sin(p.angle) * distance;

          const particleOpacity = interpolate(
            progress,
            [0, 0.3, 1],
            [1, 0.9, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );

          const particleScale = interpolate(
            progress,
            [0, 0.5, 1],
            [1, 0.8, 0.2],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                width: p.size,
                height: p.size,
                borderRadius: "50%",
                background: color,
                boxShadow: `0 0 ${p.size * 2}px ${color}`,
                opacity: particleOpacity * opacity,
                transform: `translate(${px}px, ${py}px) scale(${particleScale})`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
