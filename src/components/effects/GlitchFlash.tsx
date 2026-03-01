import React, { useMemo } from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface GlitchFlashProps {
  startFrame: number;
  duration?: number;
  color?: string;
}

interface GlitchBar {
  top: number;
  height: number;
  offsetX: number;
}

export const GlitchFlash: React.FC<GlitchFlashProps> = ({
  startFrame,
  duration = 4,
  color = "white",
}) => {
  const frame = useCurrentFrame();

  const bars = useMemo<GlitchBar[]>(() => {
    const result: GlitchBar[] = [];
    const barCount = 6 + Math.floor(7 * 0.7);
    for (let i = 0; i < barCount; i++) {
      const seed = (i * 2654435761) % 1000;
      result.push({
        top: (seed / 1000) * 100,
        height: 2 + ((seed * 3) % 15),
        offsetX: -30 + ((seed * 7) % 60),
      });
    }
    return result;
  }, []);

  const elapsed = frame - startFrame;

  if (elapsed < 0 || elapsed >= duration) {
    return null;
  }

  const opacity = duration <= 2
    ? interpolate(elapsed, [0, duration - 1], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : interpolate(elapsed, [0, 1, duration - 1], [0.9, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  const chromaticOffset = interpolate(elapsed, [0, duration], [6, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        mixBlendMode: "screen",
        opacity,
      }}
    >
      {/* Displacement bars */}
      {bars.map((bar, i) => (
        <div
          key={`bar-${i}`}
          style={{
            position: "absolute",
            top: `${bar.top}%`,
            left: 0,
            right: 0,
            height: bar.height,
            background: color,
            transform: `translateX(${bar.offsetX * (1 - elapsed / duration)}px)`,
            opacity: 0.6 + (i % 3) * 0.15,
          }}
        />
      ))}

      {/* Red chromatic strip */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(
            0deg,
            transparent 0%,
            rgba(255, 0, 0, 0.15) 20%,
            transparent 40%,
            rgba(255, 0, 0, 0.1) 60%,
            transparent 80%
          )`,
          transform: `translateX(${chromaticOffset}px)`,
        }}
      />

      {/* Cyan chromatic strip */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(
            0deg,
            transparent 10%,
            rgba(0, 255, 255, 0.15) 30%,
            transparent 50%,
            rgba(0, 255, 255, 0.1) 70%,
            transparent 90%
          )`,
          transform: `translateX(${-chromaticOffset}px)`,
        }}
      />
    </div>
  );
};
