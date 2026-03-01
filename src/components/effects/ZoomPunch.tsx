import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";

interface ZoomPunchProps {
  children: React.ReactNode;
  startFrame: number;
  from?: number;
  to?: number;
  damping?: number;
}

export const ZoomPunch: React.FC<ZoomPunchProps> = ({
  children,
  startFrame,
  from = 1.3,
  to = 1.0,
  damping = 12,
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
      stiffness: 200,
      mass: 0.6,
    },
  });

  const scale = from + (to - from) * progress;

  return (
    <div style={{ transform: `scale(${scale})` }}>
      {children}
    </div>
  );
};
