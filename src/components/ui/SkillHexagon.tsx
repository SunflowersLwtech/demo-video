import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

interface SkillHexagonProps {
  label: string;
  icon: string; // emoji or single char
  color: string;
  angle: number; // position angle in radians
  radius: number; // orbit radius
  startFrame?: number;
  centerX?: number;
  centerY?: number;
}

export const SkillHexagon: React.FC<SkillHexagonProps> = ({
  label,
  icon,
  color,
  angle,
  radius,
  startFrame = 0,
  centerX = 960,
  centerY = 540,
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);

  const scale = interpolate(elapsed, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(elapsed, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Slow orbit
  const orbitSpeed = 0.003;
  const currentAngle = angle + frame * orbitSpeed;
  const x = centerX + Math.cos(currentAngle) * radius - 55;
  const y = centerY + Math.sin(currentAngle) * radius - 55;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 110,
        height: 110,
        opacity,
        transform: `scale(${scale})`,
        fontFamily,
      }}
    >
      {/* Hexagon shape via clip-path */}
      <div
        style={{
          width: 110,
          height: 110,
          clipPath:
            "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
          background: `linear-gradient(135deg, ${color}22, ${color}44)`,
          border: `2px solid ${color}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        }}
      >
        <span style={{ fontSize: 28 }}>{icon}</span>
        <span
          style={{
            fontSize: 11,
            color: "#e4e4e7",
            fontWeight: 600,
            textAlign: "center",
            lineHeight: 1.1,
            padding: "0 8px",
          }}
        >
          {label}
        </span>
      </div>
      {/* Glow effect */}
      <div
        style={{
          position: "absolute",
          inset: -8,
          clipPath:
            "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
          background: `${color}08`,
          filter: `blur(8px)`,
          zIndex: -1,
        }}
      />
    </div>
  );
};
