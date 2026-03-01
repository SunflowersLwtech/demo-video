import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { MistralBadge } from "../components/ui/MistralBadge";
import { ParticleDrift } from "../components/effects/ParticleDrift";
import { TextSlam } from "../components/effects/TextSlam";
import { ScreenShake } from "../components/effects/ScreenShake";
import { GlitchFlash } from "../components/effects/GlitchFlash";
import { ZoomPunch } from "../components/effects/ZoomPunch";
import { PulseRing } from "../components/effects/PulseRing";
import { ScanLines } from "../components/effects/ScanLines";
import { loadFont as loadHeading } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadBody } from "@remotion/google-fonts/Inter";

const heading = loadHeading();
const bodyFont = loadBody();

export const S15_CallToAction: React.FC = () => {
  const frame = useCurrentFrame();

  // Title opacity (TextSlam handles the scale animation now)
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
    <ScreenShake startFrame={15} intensity={5} duration={15}>
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

      {/* PulseRing from title center when title appears */}
      <PulseRing startFrame={30} count={3} color="#ff6b35" maxRadius={400} />

      {/* GlitchFlash entrance for tagline */}
      <GlitchFlash startFrame={45} duration={4} color="#ff6b35" />

      {/* ScanLines overlay */}
      <ScanLines opacity={0.03} />

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

      {/* COUNCIL — TextSlam + ScreenShake instead of simple scale/opacity */}
      <TextSlam startFrame={15} fromScale={2.0} damping={10}>
        <div
          style={{
            opacity: titleOpacity,
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
      </TextSlam>

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

      {/* Mistral badge — ZoomPunch entrance */}
      <ZoomPunch startFrame={75} from={1.4} damping={12}>
        <div style={{ opacity: badgeOpacity, marginTop: 40 }}>
          <MistralBadge size="large" />
        </div>
      </ZoomPunch>

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
          Built for the Mistral AI Hackathon 2026
        </p>
      </div>
    </div>
    </ScreenShake>
  );
};
