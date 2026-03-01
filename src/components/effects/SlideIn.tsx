import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface SlideInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  from?: "bottom" | "top" | "left" | "right";
  distance?: number;
  style?: React.CSSProperties;
}

export const SlideIn: React.FC<SlideInProps> = ({
  children,
  delay = 0,
  duration = 20,
  from = "bottom",
  distance = 40,
  style,
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = progress;

  const translateMap = {
    bottom: `translateY(${(1 - progress) * distance}px)`,
    top: `translateY(${-(1 - progress) * distance}px)`,
    left: `translateX(${-(1 - progress) * distance}px)`,
    right: `translateX(${(1 - progress) * distance}px)`,
  };

  return (
    <div
      style={{
        opacity,
        transform: translateMap[from],
        ...style,
      }}
    >
      {children}
    </div>
  );
};
