import React from "react";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

interface MistralBadgeProps {
  size?: "small" | "large";
  style?: React.CSSProperties;
}

export const MistralBadge: React.FC<MistralBadgeProps> = ({
  size = "small",
  style,
}) => {
  const isLarge = size === "large";

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: isLarge ? 12 : 8,
        padding: isLarge ? "12px 24px" : "6px 14px",
        background: "rgba(255, 107, 53, 0.08)",
        border: "1px solid rgba(255, 107, 53, 0.2)",
        borderRadius: isLarge ? 12 : 8,
        fontFamily,
        ...style,
      }}
    >
      {/* Mistral-style colored dots */}
      <div style={{ display: "flex", gap: isLarge ? 4 : 3 }}>
        {["#ff6b35", "#ffb347", "#ff6b35", "#ffb347", "#ff6b35"].map(
          (c, i) => (
            <div
              key={i}
              style={{
                width: isLarge ? 8 : 5,
                height: isLarge ? 8 : 5,
                borderRadius: "50%",
                background: c,
              }}
            />
          )
        )}
      </div>
      <span
        style={{
          fontSize: isLarge ? 20 : 14,
          fontWeight: 600,
          color: "#ff6b35",
          letterSpacing: "0.02em",
        }}
      >
        Powered by Mistral AI
      </span>
    </div>
  );
};
