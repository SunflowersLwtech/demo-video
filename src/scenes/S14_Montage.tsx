import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { ParticleDrift } from "../components/effects/ParticleDrift";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";

const { fontFamily } = loadFont();

// Rapid-fire text snippets
const CUTS = [
  { text: "Seven minds. One table.", color: "#e4e4e7", frame: 0 },
  { text: "Deception.", color: "#FF6B6B", frame: 30 },
  { text: "Strategy.", color: "#45B7D1", frame: 55 },
  { text: "Betrayal.", color: "#C39BD3", frame: 80 },
  { text: "Survival.", color: "#4ECDC4", frame: 105 },
  { text: "COUNCIL.", color: "#ff6b35", frame: 140 },
];

export const S14_Montage: React.FC = () => {
  const frame = useCurrentFrame();

  // Find active cut
  let activeCut = CUTS[0];
  for (const cut of CUTS) {
    if (frame >= cut.frame) activeCut = cut;
  }

  // Quick flash for each cut
  const cutFlash = CUTS.reduce((acc, cut) => {
    const flash = interpolate(
      frame,
      [cut.frame, cut.frame + 3, cut.frame + 8],
      [0, 0.5, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    return Math.max(acc, flash);
  }, 0);

  // Text scale punch
  const elapsed = frame - activeCut.frame;
  const textScale = interpolate(elapsed, [0, 5, 15], [1.2, 1.0, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textOpacity = interpolate(elapsed, [0, 3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Overall energy ramp
  const energyParticles = Math.min(30 + frame, 100);

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
      <ParticleDrift count={energyParticles} color="#ff6b35" direction="up" />

      {/* Flash overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "white",
          opacity: cutFlash * 0.3,
          pointerEvents: "none",
        }}
      />

      {/* Active text */}
      <div
        style={{
          opacity: textOpacity,
          transform: `scale(${textScale})`,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily,
            fontSize: activeCut.text === "COUNCIL." ? 120 : 72,
            fontWeight: 900,
            color: activeCut.color,
            letterSpacing: "0.05em",
            margin: 0,
            textShadow: `0 0 40px ${activeCut.color}40`,
          }}
        >
          {activeCut.text}
        </h1>
      </div>

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse, transparent 40%, rgba(0,0,0,0.6) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
