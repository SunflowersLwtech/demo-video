import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface LetterboxProps {
  children: React.ReactNode;
  barHeight?: number;
  delay?: number;
  duration?: number;
}

export const Letterbox: React.FC<LetterboxProps> = ({
  children,
  barHeight = 80,
  delay = 0,
  duration = 20,
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const h = barHeight * progress;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {children}
      {/* Top bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: h,
          background: "#000",
          zIndex: 10,
        }}
      />
      {/* Bottom bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: h,
          background: "#000",
          zIndex: 10,
        }}
      />
    </div>
  );
};
