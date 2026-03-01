import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

interface ScanLinesProps {
  opacity?: number;
  lineHeight?: number;
  gap?: number;
}

export const ScanLines: React.FC<ScanLinesProps> = ({
  opacity = 0.04,
  lineHeight = 2,
  gap = 4,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalStep = lineHeight + gap;
  const crawlSpeed = 30;
  const time = frame / fps;
  const yOffset = (time * crawlSpeed) % totalStep;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background: `repeating-linear-gradient(
          0deg,
          rgba(0, 0, 0, ${opacity}) 0px,
          rgba(0, 0, 0, ${opacity}) ${lineHeight}px,
          transparent ${lineHeight}px,
          transparent ${totalStep}px
        )`,
        backgroundPositionY: `${yOffset}px`,
        backgroundSize: `100% ${totalStep}px`,
      }}
    />
  );
};
