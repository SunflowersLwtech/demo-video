import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface PulseRingProps {
  startFrame: number;
  count?: number;
  color?: string;
  maxRadius?: number;
  stagger?: number;
}

export const PulseRing: React.FC<PulseRingProps> = ({
  startFrame,
  count = 3,
  color = "#ff6b35",
  maxRadius = 400,
  stagger = 5,
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {Array.from({ length: count }).map((_, i) => {
        const ringStart = startFrame + i * stagger;
        const elapsed = frame - ringStart;
        const ringDuration = 25;

        if (elapsed < 0 || elapsed >= ringDuration) {
          return null;
        }

        const progress = interpolate(
          elapsed,
          [0, ringDuration],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        const radius = maxRadius * progress;

        const opacity = interpolate(
          progress,
          [0, 0.3, 1],
          [0.8, 0.6, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        const borderWidth = interpolate(
          progress,
          [0, 1],
          [3, 1],
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
              width: radius * 2,
              height: radius * 2,
              borderRadius: "50%",
              border: `${borderWidth}px solid ${color}`,
              opacity,
              boxShadow: `0 0 ${8 + radius * 0.05}px ${color}`,
            }}
          />
        );
      })}
    </div>
  );
};
