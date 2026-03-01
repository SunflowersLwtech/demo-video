import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { MistralBadge } from "../components/ui/MistralBadge";
import { ParticleDrift } from "../components/effects/ParticleDrift";
import { GlitchFlash } from "../components/effects/GlitchFlash";
import { PulseRing } from "../components/effects/PulseRing";
import { ZoomPunch } from "../components/effects/ZoomPunch";
import { ScanLines } from "../components/effects/ScanLines";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";

const { fontFamily } = loadFont();

const TITLE = "COUNCIL";

// Frames at which each letter appears (faster reveal)
const LETTER_FRAMES = [10, 16, 22, 28, 34, 40, 46];

export const S02_TitleReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Letter-by-letter reveal (faster)
  const charsToShow = Math.min(
    Math.floor(interpolate(frame, [10, 45], [0, TITLE.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })),
    TITLE.length
  );

  // Orange underline grows
  const lineSpring = spring({
    frame: Math.max(0, frame - 40),
    fps,
    config: {
      damping: 10,
      stiffness: 120,
      mass: 0.8,
    },
  });
  const lineWidth = lineSpring * 500;

  // Subtitle fade
  const subtitleOpacity = interpolate(frame, [50, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Badge fade
  const badgeOpacity = interpolate(frame, [70, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Overall glow intensity
  const glowIntensity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Chromatic aberration offset
  const chromaticOffset = interpolate(frame, [10, 60], [3, 2], {
    extrapolateLeft: "clamp",
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

      {/* Micro-flash per letter reveal */}
      {LETTER_FRAMES.map((letterFrame, i) => (
        <GlitchFlash
          key={`letter-flash-${i}`}
          startFrame={letterFrame}
          duration={2}
          color="rgba(255,255,255,0.6)"
        />
      ))}

      {/* PulseRing from title center when all letters revealed */}
      <PulseRing startFrame={45} count={3} color="#ff6b35" maxRadius={400} />

      {/* ZoomPunch on entire scene content at completion */}
      <ZoomPunch startFrame={70} from={1.3} damping={12}>
        {/* COUNCIL title with chromatic aberration */}
        <div style={{ position: "relative", textAlign: "center" }}>
          {/* Red chromatic copy — behind */}
          <h1
            style={{
              fontFamily,
              fontSize: 140,
              fontWeight: 900,
              color: "transparent",
              letterSpacing: "0.15em",
              margin: 0,
              lineHeight: 1,
              position: "absolute",
              left: chromaticOffset,
              top: 0,
              WebkitTextStroke: "0px transparent",
              textShadow: `0 0 0 rgba(255, 60, 60, 0.35)`,
              filter: "none",
              mixBlendMode: "screen",
            }}
          >
            <span style={{ color: "rgba(255, 60, 60, 0.35)" }}>
              {TITLE.slice(0, charsToShow)}
            </span>
          </h1>

          {/* Cyan chromatic copy — behind */}
          <h1
            style={{
              fontFamily,
              fontSize: 140,
              fontWeight: 900,
              color: "transparent",
              letterSpacing: "0.15em",
              margin: 0,
              lineHeight: 1,
              position: "absolute",
              left: -chromaticOffset,
              top: 0,
              mixBlendMode: "screen",
            }}
          >
            <span style={{ color: "rgba(60, 220, 255, 0.35)" }}>
              {TITLE.slice(0, charsToShow)}
            </span>
          </h1>

          {/* Main title — on top */}
          <h1
            style={{
              fontFamily,
              fontSize: 140,
              fontWeight: 900,
              color: "#e4e4e7",
              letterSpacing: "0.15em",
              margin: 0,
              lineHeight: 1,
              position: "relative",
            }}
          >
            {TITLE.slice(0, charsToShow)}
            {charsToShow < TITLE.length && (
              <span style={{ opacity: 0.3, color: "#333" }}>
                {TITLE.slice(charsToShow)}
              </span>
            )}
          </h1>

          {/* Orange underline with spring overshoot */}
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
      </ZoomPunch>

      {/* Mistral badge */}
      <div style={{ position: "absolute", bottom: 80, opacity: badgeOpacity }}>
        <MistralBadge size="large" />
      </div>

      {/* ScanLines overlay */}
      <ScanLines opacity={0.03} />
    </div>
  );
};
