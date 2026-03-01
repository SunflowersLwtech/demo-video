import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

interface TextSlamProps {
  children: React.ReactNode;
  startFrame: number;
  fromScale?: number;
  damping?: number;
  stiffness?: number;
}

export const TextSlam: React.FC<TextSlamProps> = ({
  children,
  startFrame,
  fromScale = 2.5,
  damping = 12,
  stiffness = 200,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const elapsed = frame - startFrame;

  if (elapsed < 0) {
    return (
      <div style={{ opacity: 0 }}>
        {children}
      </div>
    );
  }

  const progress = spring({
    frame: elapsed,
    fps,
    config: {
      damping,
      stiffness,
      mass: 0.8,
    },
  });

  const scale = fromScale + (1 - fromScale) * progress;

  const blur = interpolate(progress, [0, 1], [8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(progress, [0, 0.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        filter: `blur(${blur}px)`,
        opacity,
      }}
    >
      {children}
    </div>
  );
};
