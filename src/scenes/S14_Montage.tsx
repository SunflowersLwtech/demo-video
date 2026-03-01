import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { ParticleDrift } from "../components/effects/ParticleDrift";
import { TextSlam } from "../components/effects/TextSlam";
import { ScreenShake } from "../components/effects/ScreenShake";
import { EnergyBurst } from "../components/effects/EnergyBurst";
import { ContrastGrade } from "../components/effects/ContrastGrade";
import { ScanLines } from "../components/effects/ScanLines";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";

const { fontFamily } = loadFont();

// Rapid-fire text snippets
const CUTS = [
  { text: "Seven minds. One truth.", color: "#e4e4e7", frame: 0 },
  { text: "Deception.", color: "#FF6B6B", frame: 30 },
  { text: "Strategy.", color: "#45B7D1", frame: 55 },
  { text: "Betrayal.", color: "#C39BD3", frame: 80 },
  { text: "Survive.", color: "#4ECDC4", frame: 105 },
  { text: "COUNCIL.", color: "#ff6b35", frame: 140 },
];

export const S14_Montage: React.FC = () => {
  const frame = useCurrentFrame();

  // Find active cut
  let activeCut = CUTS[0];
  for (let ci = 0; ci < CUTS.length; ci++) {
    if (frame >= CUTS[ci].frame) {
      activeCut = CUTS[ci];
    }
  }

  // Quick flash for each cut — now stronger and colored per word
  const cutFlash = CUTS.reduce((acc, cut) => {
    const flash = interpolate(
      frame,
      [cut.frame, cut.frame + 3, cut.frame + 8],
      [0, 0.5, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    return Math.max(acc, flash);
  }, 0);

  // Text opacity (keep existing)
  const elapsed = frame - activeCut.frame;
  const textOpacity = interpolate(elapsed, [0, 3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Overall energy ramp
  const energyParticles = Math.min(30 + frame, 100);

  // ContrastGrade ramp: subtle contrast increase
  const lastCutFrame = CUTS[CUTS.length - 1].frame;
  const contrastVal = interpolate(frame, [0, lastCutFrame + 30], [1.0, 1.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const saturateVal = interpolate(frame, [0, lastCutFrame + 30], [1.0, 1.1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Is this the final "COUNCIL." word?
  const isFinalWord = activeCut.text === "COUNCIL.";

  return (
    <ContrastGrade brightness={1} contrast={contrastVal} saturate={saturateVal}>
      {/* Single dramatic shake on final "COUNCIL." */}
      <ScreenShake startFrame={CUTS[CUTS.length - 1].frame} intensity={5} duration={10}>
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

      {/* Flash overlay — stronger (0.6) and colored per active word */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: activeCut.color,
          opacity: cutFlash * 0.6,
          pointerEvents: "none",
        }}
      />

      {/* EnergyBurst on final word "COUNCIL." */}
      <EnergyBurst startFrame={140} color="#ff6b35" particleCount={30} />

      {/* ScanLines */}
      <ScanLines opacity={0.05} />

      {/* Active text — now using TextSlam for every word */}
      <TextSlam startFrame={activeCut.frame} fromScale={1.8} damping={10} stiffness={200}>
        <div
          style={{
            opacity: textOpacity,
            textAlign: "center",
            position: "relative",
          }}
        >
          {/* Chromatic aberration on final "COUNCIL." — red copy */}
          {isFinalWord && (
            <h1
              style={{
                fontFamily,
                fontSize: 120,
                fontWeight: 900,
                color: "rgba(255, 0, 0, 0.5)",
                letterSpacing: "0.05em",
                margin: 0,
                position: "absolute",
                inset: 0,
                transform: "translate(-2px, -1px)",
                pointerEvents: "none",
              }}
            >
              {activeCut.text}
            </h1>
          )}
          {/* Chromatic aberration on final "COUNCIL." — cyan copy */}
          {isFinalWord && (
            <h1
              style={{
                fontFamily,
                fontSize: 120,
                fontWeight: 900,
                color: "rgba(0, 255, 255, 0.5)",
                letterSpacing: "0.05em",
                margin: 0,
                position: "absolute",
                inset: 0,
                transform: "translate(2px, 1px)",
                pointerEvents: "none",
              }}
            >
              {activeCut.text}
            </h1>
          )}
          <h1
            style={{
              fontFamily,
              fontSize: isFinalWord ? 120 : 72,
              fontWeight: 900,
              color: activeCut.color,
              letterSpacing: "0.05em",
              margin: 0,
              textShadow: `0 0 40px ${activeCut.color}40`,
              position: "relative",
            }}
          >
            {activeCut.text}
          </h1>
        </div>
      </TextSlam>

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
      </ScreenShake>
    </ContrastGrade>
  );
};
