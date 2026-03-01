import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

interface PhaseLabelProps {
  label: string;
  color?: string;
  startFrame?: number;
}

export const PhaseLabel: React.FC<PhaseLabelProps> = ({
  label,
  color = "#ff6b35",
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);

  const opacity = interpolate(elapsed, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });
  const lineWidth = interpolate(elapsed, [5, 25], [0, 120], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontFamily,
      }}
    >
      <div
        style={{
          width: lineWidth,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${color})`,
        }}
      />
      <span
        style={{
          fontSize: 14,
          fontWeight: 600,
          color,
          textTransform: "uppercase",
          letterSpacing: "0.15em",
        }}
      >
        {label}
      </span>
    </div>
  );
};
