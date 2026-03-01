import React from "react";
import { useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

interface ChatBubbleProps {
  agentName: string;
  agentColor: string;
  message: string;
  startFrame: number;
  charsPerFrame?: number;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  agentName,
  agentColor,
  message,
  startFrame,
  charsPerFrame = 1,
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);

  if (elapsed < 0) return null;

  const charCount = Math.min(
    Math.floor(elapsed * charsPerFrame),
    message.length
  );
  const displayText = message.slice(0, charCount);
  const opacity = Math.min(elapsed / 8, 1);

  return (
    <div
      style={{
        opacity,
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        marginBottom: 16,
        fontFamily,
      }}
    >
      {/* Avatar dot */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: agentColor,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          fontWeight: 700,
          color: "#0a0a14",
          boxShadow: `0 0 12px ${agentColor}40`,
        }}
      >
        {agentName[0]}
      </div>
      <div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: agentColor,
            marginBottom: 4,
          }}
        >
          {agentName}
        </div>
        <div
          style={{
            fontSize: 18,
            color: "#e4e4e7",
            lineHeight: 1.5,
            background: "rgba(255,255,255,0.04)",
            padding: "10px 16px",
            borderRadius: "4px 12px 12px 12px",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {displayText}
          {charCount < message.length && (
            <span
              style={{
                opacity: Math.floor(frame / 8) % 2 === 0 ? 0.8 : 0,
                color: agentColor,
              }}
            >
              |
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
