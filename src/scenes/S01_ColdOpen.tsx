import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { ParticleDrift } from "../components/effects/ParticleDrift";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";

const { fontFamily } = loadFont();

export const S01_ColdOpen: React.FC = () => {
  const frame = useCurrentFrame();

  // "In a world of AI..." text fades in at ~2s
  const textOpacity = interpolate(frame, [45, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textFadeOut = interpolate(frame, [130, 155], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle vignette grows
  const vignetteOpacity = interpolate(frame, [0, 60], [0.8, 0.4], {
    extrapolateRight: "clamp",
  });

  // Ember glow at bottom
  const emberGlow = interpolate(frame, [0, 90], [0, 0.3], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#000000",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Rising ember particles */}
      <ParticleDrift count={60} color="#ff6b35" direction="up" />

      {/* Bottom ember glow */}
      <div
        style={{
          position: "absolute",
          bottom: -100,
          left: "50%",
          transform: "translateX(-50%)",
          width: 1200,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(255,107,53,0.15), transparent 70%)",
          opacity: emberGlow,
        }}
      />

      {/* Vignette overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.9) 100%)",
          opacity: vignetteOpacity,
        }}
      />

      {/* Hook text */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: textOpacity * textFadeOut,
        }}
      >
        <p
          style={{
            fontFamily,
            fontSize: 48,
            color: "#e4e4e7",
            textAlign: "center",
            lineHeight: 1.4,
            letterSpacing: "0.02em",
            maxWidth: 800,
          }}
        >
          In a world of AI...{"\n"}
          <span style={{ color: "#ff6b35" }}>who can you trust?</span>
        </p>
      </div>
    </div>
  );
};
