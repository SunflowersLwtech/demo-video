import React from "react";
import { useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

interface TypewriterTextProps {
  text: string;
  startFrame?: number;
  charsPerFrame?: number;
  fontSize?: number;
  color?: string;
  style?: React.CSSProperties;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  startFrame = 0,
  charsPerFrame = 0.8,
  fontSize = 24,
  color = "#e4e4e7",
  style,
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);
  const charCount = Math.min(Math.floor(elapsed * charsPerFrame), text.length);
  const displayText = text.slice(0, charCount);

  const cursorOpacity =
    charCount < text.length ? (Math.floor(frame / 8) % 2 === 0 ? 1 : 0) : 0;

  return (
    <span
      style={{
        fontFamily,
        fontSize,
        color,
        lineHeight: 1.6,
        ...style,
      }}
    >
      {displayText}
      <span style={{ opacity: cursorOpacity, color: "#ff6b35" }}>|</span>
    </span>
  );
};
