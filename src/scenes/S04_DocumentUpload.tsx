import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { loadFont as loadBody } from "@remotion/google-fonts/Inter";

const body = loadBody();

export const S04_DocumentUpload: React.FC = () => {
  const frame = useCurrentFrame();

  // Document icon scales in
  const docScale = interpolate(frame, [10, 35], [0, 1], { extrapolateRight: "clamp" });
  const docOpacity = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp" });

  // Arrow + transformation
  const arrowOpacity = interpolate(frame, [50, 70], [0, 1], { extrapolateRight: "clamp" });

  // World elements emerge
  const worldOpacity = interpolate(frame, [80, 110], [0, 1], { extrapolateRight: "clamp" });
  const worldScale = interpolate(frame, [80, 120], [0.6, 1], { extrapolateRight: "clamp" });

  // Narration text
  const textOpacity = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp" });

  // Glow effect connecting doc to world
  const glowWidth = interpolate(frame, [55, 90], [0, 300], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#0a0a14",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 80 }}>
        {/* Document icon */}
        <div
          style={{
            opacity: docOpacity,
            transform: `scale(${docScale})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 160,
              height: 200,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            {/* Document lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  width: 100 - i * 10,
                  height: 4,
                  background: `rgba(255,255,255,${0.15 - i * 0.02})`,
                  borderRadius: 2,
                }}
              />
            ))}
          </div>
          <span style={{ fontFamily: body.fontFamily, fontSize: 16, color: "#71717a" }}>
            Any document
          </span>
        </div>

        {/* Arrow / energy beam */}
        <div style={{ opacity: arrowOpacity, position: "relative" }}>
          <div
            style={{
              width: glowWidth,
              height: 3,
              background: "linear-gradient(90deg, #ff6b35, #ffb347, #ff6b35)",
              borderRadius: 2,
              boxShadow: "0 0 20px rgba(255,107,53,0.3)",
            }}
          />
          {/* Animated dots along the beam */}
          {[0, 1, 2].map((i) => {
            const dotX = ((frame * 3 + i * 100) % 300);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: dotX,
                  top: -3,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#ff6b35",
                  boxShadow: "0 0 12px #ff6b35",
                  opacity: dotX < glowWidth ? 0.8 : 0,
                }}
              />
            );
          })}
        </div>

        {/* Game world elements */}
        <div
          style={{
            opacity: worldOpacity,
            transform: `scale(${worldScale})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,107,53,0.15), rgba(15,15,26,0.9))",
              border: "1px solid rgba(255,107,53,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 40px rgba(255,107,53,0.1)",
            }}
          >
            {/* Mini agent figures */}
            {[0, 1, 2, 3, 4, 5, 6].map((i) => {
              const angle = (i / 7) * Math.PI * 2 - Math.PI / 2;
              const r = 60;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: 100 + Math.cos(angle) * r - 6,
                    top: 100 + Math.sin(angle) * r - 6,
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: ["#4ECDC4", "#FF6B6B", "#45B7D1", "#FFD93D", "#C39BD3", "#F1948A", "#76D7C4"][i],
                    boxShadow: `0 0 8px ${["#4ECDC4", "#FF6B6B", "#45B7D1", "#FFD93D", "#C39BD3", "#F1948A", "#76D7C4"][i]}40`,
                  }}
                />
              );
            })}
          </div>
          <span style={{ fontFamily: body.fontFamily, fontSize: 16, color: "#71717a" }}>
            Living game world
          </span>
        </div>
      </div>

      {/* Bottom narration text */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: textOpacity,
        }}
      >
        <p
          style={{
            fontFamily: body.fontFamily,
            fontSize: 24,
            color: "#a1a1aa",
            maxWidth: 700,
            margin: "0 auto",
            lineHeight: 1.5,
          }}
        >
          Mistral AI transforms any document into a living game world
        </p>
      </div>
    </div>
  );
};
