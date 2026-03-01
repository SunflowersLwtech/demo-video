import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { ParticleDrift } from "../components/effects/ParticleDrift";
import { EnergyBurst } from "../components/effects/EnergyBurst";
import { TextSlam } from "../components/effects/TextSlam";
import { GlitchFlash } from "../components/effects/GlitchFlash";
import { ScreenShake } from "../components/effects/ScreenShake";
import { ScanLines } from "../components/effects/ScanLines";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";

const { fontFamily } = loadFont();

export const S01_ColdOpen: React.FC = () => {
  const frame = useCurrentFrame();

  // "In a world of AI..." text fades in quickly
  const textOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textFadeOut = interpolate(frame, [70, 85], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle vignette grows
  const vignetteOpacity = interpolate(frame, [0, 30], [0.8, 0.4], {
    extrapolateRight: "clamp",
  });

  // Ember glow at bottom
  const emberGlow = interpolate(frame, [0, 50], [0, 0.3], {
    extrapolateRight: "clamp",
  });

  // Hold pure black for 10 frames — shorter wait
  const contentVisible = frame >= 10 ? 1 : 0;

  // Hard brightness crush to black in final 8 frames
  const blackoutOpacity = interpolate(frame, [80, 88], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <ScreenShake startFrame={20} intensity={3} duration={10}>
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#000000",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Rising ember particles — only after frame 30 */}
        {contentVisible ? (
          <ParticleDrift count={60} color="#ff6b35" direction="up" />
        ) : null}

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
            opacity: emberGlow * contentVisible,
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

        {/* EnergyBurst at center before text appears */}
        <EnergyBurst startFrame={10} color="#ff6b35" particleCount={20} />

        {/* Hook text with TextSlam */}
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
          <TextSlam startFrame={15} fromScale={1.8} damping={12}>
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
          </TextSlam>
        </div>

        {/* GlitchFlash on "who can you trust?" line */}
        <GlitchFlash startFrame={35} duration={4} color="white" />

        {/* ScanLines overlay throughout */}
        <ScanLines opacity={0.04} />

        {/* Hard brightness crush to black in final 8 frames */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#000000",
            opacity: blackoutOpacity,
            pointerEvents: "none",
          }}
        />
      </div>
    </ScreenShake>
  );
};
