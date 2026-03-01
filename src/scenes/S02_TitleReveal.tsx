import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { MistralBadge } from "../components/ui/MistralBadge";
import { ParticleDrift } from "../components/effects/ParticleDrift";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";

const { fontFamily } = loadFont();

const TITLE = "COUNCIL";

export const S02_TitleReveal: React.FC = () => {
  const frame = useCurrentFrame();

  // Letter-by-letter reveal
  const charsToShow = Math.min(
    Math.floor(interpolate(frame, [15, 60], [0, TITLE.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })),
    TITLE.length
  );

  // Orange underline grows
  const lineWidth = interpolate(frame, [50, 90], [0, 500], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtitle fade
  const subtitleOpacity = interpolate(frame, [70, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Badge fade
  const badgeOpacity = interpolate(frame, [90, 115], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Overall glow intensity
  const glowIntensity = interpolate(frame, [40, 80], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#0a0a14",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ParticleDrift count={30} color="#ff6b35" direction="up" />

      {/* Title glow */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 200,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(255,107,53,0.12), transparent 70%)",
          opacity: glowIntensity,
          filter: "blur(40px)",
        }}
      />

      {/* COUNCIL title */}
      <div style={{ position: "relative", textAlign: "center" }}>
        <h1
          style={{
            fontFamily,
            fontSize: 140,
            fontWeight: 900,
            color: "#e4e4e7",
            letterSpacing: "0.15em",
            margin: 0,
            lineHeight: 1,
          }}
        >
          {TITLE.slice(0, charsToShow)}
          {charsToShow < TITLE.length && (
            <span style={{ opacity: 0.3, color: "#333" }}>
              {TITLE.slice(charsToShow)}
            </span>
          )}
        </h1>

        {/* Orange underline */}
        <div
          style={{
            width: lineWidth,
            height: 3,
            background: "linear-gradient(90deg, transparent, #ff6b35, transparent)",
            margin: "16px auto 0",
          }}
        />

        {/* Subtitle */}
        <p
          style={{
            fontFamily,
            fontSize: 28,
            color: "#a1a1aa",
            marginTop: 24,
            opacity: subtitleOpacity,
            letterSpacing: "0.05em",
          }}
        >
          Where artificial minds learn the art of deception
        </p>
      </div>

      {/* Mistral badge */}
      <div style={{ position: "absolute", bottom: 80, opacity: badgeOpacity }}>
        <MistralBadge size="large" />
      </div>
    </div>
  );
};
