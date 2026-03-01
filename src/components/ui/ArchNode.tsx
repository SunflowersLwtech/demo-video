import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

interface ArchNodeProps {
  label: string;
  description?: string;
  color: string;
  x: number;
  y: number;
  width?: number;
  startFrame?: number;
  isCenter?: boolean;
}

export const ArchNode: React.FC<ArchNodeProps> = ({
  label,
  description,
  color,
  x,
  y,
  width = 180,
  startFrame = 0,
  isCenter = false,
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);

  const scale = interpolate(elapsed, [0, 15], [0.5, 1], {
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(elapsed, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x - width / 2,
        top: y - (isCenter ? 40 : 30),
        width,
        opacity,
        transform: `scale(${scale})`,
        fontFamily,
      }}
    >
      <div
        style={{
          padding: isCenter ? "16px 20px" : "10px 16px",
          background: isCenter
            ? `linear-gradient(135deg, ${color}20, ${color}40)`
            : "rgba(15, 15, 26, 0.9)",
          border: `1px solid ${color}${isCenter ? "80" : "40"}`,
          borderRadius: 12,
          textAlign: "center",
          boxShadow: isCenter ? `0 0 24px ${color}20` : `0 4px 12px rgba(0,0,0,0.3)`,
        }}
      >
        <div
          style={{
            fontSize: isCenter ? 18 : 14,
            fontWeight: 700,
            color: isCenter ? color : "#e4e4e7",
            marginBottom: description ? 4 : 0,
          }}
        >
          {label}
        </div>
        {description && (
          <div style={{ fontSize: 11, color: "#71717a", lineHeight: 1.3 }}>
            {description}
          </div>
        )}
      </div>
    </div>
  );
};
