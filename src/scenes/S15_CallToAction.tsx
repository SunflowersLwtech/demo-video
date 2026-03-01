import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { MistralBadge } from "../components/ui/MistralBadge";
import { ParticleDrift } from "../components/effects/ParticleDrift";
import { loadFont as loadHeading } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadBody } from "@remotion/google-fonts/Inter";

const heading = loadHeading();
const bodyFont = loadBody();

export const S15_CallToAction: React.FC = () => {
  const frame = useCurrentFrame();

  // Title scale in
  const titleScale = interpolate(frame, [10, 40], [0.8, 1], {
    extrapolateRight: "clamp",
  });
  const titleOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Tagline
  const taglineOpacity = interpolate(frame, [40, 60], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Badge
  const badgeOpacity = interpolate(frame, [70, 90], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Credits
  const creditsOpacity = interpolate(frame, [100, 120], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Orange line
  const lineWidth = interpolate(frame, [30, 65], [0, 400], {
    extrapolateRight: "clamp",
  });

  // Subtle glow pulse
  const glowPulse = 0.15 + Math.sin(frame * 0.08) * 0.05;

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
      <ParticleDrift count={40} color="#ff6b35" direction="up" />

      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "35%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(255,107,53,0.1), transparent 60%)",
          opacity: glowPulse / 0.2,
          filter: "blur(60px)",
        }}
      />

      {/* COUNCIL */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: heading.fontFamily,
            fontSize: 160,
            fontWeight: 900,
            color: "#e4e4e7",
            letterSpacing: "0.15em",
            margin: 0,
            lineHeight: 1,
          }}
        >
          COUNCIL
        </h1>
      </div>

      {/* Orange line */}
      <div
        style={{
          width: lineWidth,
          height: 3,
          background: "linear-gradient(90deg, transparent, #ff6b35, transparent)",
          margin: "20px 0",
        }}
      />

      {/* Tagline */}
      <div style={{ opacity: taglineOpacity, textAlign: "center" }}>
        <p
          style={{
            fontFamily: heading.fontFamily,
            fontSize: 32,
            color: "#a1a1aa",
            margin: 0,
          }}
        >
          Where AI learns to lie
        </p>
      </div>

      {/* Mistral badge */}
      <div style={{ opacity: badgeOpacity, marginTop: 40 }}>
        <MistralBadge size="large" />
      </div>

      {/* Credits */}
      <div
        style={{
          opacity: creditsOpacity,
          position: "absolute",
          bottom: 60,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: bodyFont.fontFamily,
            fontSize: 16,
            color: "#71717a",
            margin: 0,
          }}
        >
          Built for the Mistral AI Hackathon 2025
        </p>
      </div>
    </div>
  );
};
