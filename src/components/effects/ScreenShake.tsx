import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

interface ScreenShakeProps {
  children: React.ReactNode;
  startFrame: number;
  duration?: number;
  intensity?: number;
}

export const ScreenShake: React.FC<ScreenShakeProps> = ({
  children,
  startFrame,
  duration = 20,
  intensity = 8,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const elapsed = frame - startFrame;

  if (elapsed < 0 || elapsed >= duration) {
    return <div style={{ width: "100%", height: "100%" }}>{children}</div>;
  }

  const progress = elapsed / duration;
  const decayEnvelope = 1 - progress;
  const frequency = 1.2;
  const time = elapsed / fps;

  const translateX =
    Math.sin(time * frequency * Math.PI * 2 * 3) *
    intensity *
    decayEnvelope;
  const translateY =
    Math.sin(time * frequency * Math.PI * 2 * 2.5 + 1.3) *
    intensity *
    decayEnvelope;

  return (
    <div
      style={{
        transform: `translate(${translateX}px, ${translateY}px)`,
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
};
