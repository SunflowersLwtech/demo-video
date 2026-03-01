import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

interface EmotionBarProps {
  label: string;
  value: number; // 0-1
  color: string;
  startFrame?: number;
  targetValue?: number; // animate from value to targetValue
}

export const EmotionBar: React.FC<EmotionBarProps> = ({
  label,
  value,
  color,
  startFrame = 0,
  targetValue,
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);

  const barWidth = interpolate(elapsed, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const currentValue =
    targetValue !== undefined
      ? interpolate(elapsed, [0, 60], [value, targetValue], {
          extrapolateRight: "clamp",
        })
      : value;

  return (
    <div style={{ marginBottom: 14, fontFamily }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <span style={{ fontSize: 16, color: "#a1a1aa", fontWeight: 500 }}>
          {label}
        </span>
        <span style={{ fontSize: 16, color, fontWeight: 600 }}>
          {Math.round(currentValue * 100)}%
        </span>
      </div>
      <div
        style={{
          height: 8,
          background: "rgba(255,255,255,0.06)",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${currentValue * barWidth * 100}%`,
            background: `linear-gradient(90deg, ${color}, ${color}88)`,
            borderRadius: 4,
            boxShadow: `0 0 8px ${color}40`,
          }}
        />
      </div>
    </div>
  );
};
