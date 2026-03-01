import React from "react";
import { useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import { EmotionBar } from "../components/ui/EmotionBar";
import { GlassCard } from "../components/ui/GlassCard";
import { FadeIn } from "../components/effects/FadeIn";
import { PhaseLabel } from "../components/ui/PhaseLabel";
import { ScreenShake } from "../components/effects/ScreenShake";
import { EnergyBurst } from "../components/effects/EnergyBurst";
import { ScanLines } from "../components/effects/ScanLines";
import { ContrastGrade } from "../components/effects/ContrastGrade";
import { loadFont as loadHeading } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadBody } from "@remotion/google-fonts/Inter";

const heading = loadHeading();
const body = loadBody();

const EMOTIONS = [
  { label: "Trust", value: 0.72, target: 0.35, color: "#4ECDC4" },
  { label: "Fear", value: 0.25, target: 0.68, color: "#FF6B6B" },
  { label: "Suspicion", value: 0.40, target: 0.82, color: "#FFD93D" },
  { label: "Anger", value: 0.15, target: 0.55, color: "#F1948A" },
  { label: "Confidence", value: 0.80, target: 0.45, color: "#45B7D1" },
  { label: "Loyalty", value: 0.60, target: 0.30, color: "#C39BD3" },
];

export const S09_EmotionalReactions: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Event trigger flash — stronger peak (0.8 instead of 0.4)
  const eventFlash = interpolate(
    frame,
    [60, 65, 80],
    [0, 0.8, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Subtle contrast ramp over the scene
  const contrastValue = interpolate(
    frame,
    [0, durationInFrames],
    [1.0, 1.08],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <ContrastGrade brightness={1} contrast={contrastValue} saturate={1}>
      <ScreenShake startFrame={60} intensity={3} duration={10}>
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
            gap: 80,
          }}
        >
          {/* Left: Event description */}
          <div style={{ width: 400 }}>
            <FadeIn delay={5} duration={15}>
              <PhaseLabel label="Emotional AI" color="#F1948A" />
            </FadeIn>
            <FadeIn delay={15} duration={20}>
              <h2
                style={{
                  fontFamily: heading.fontFamily,
                  fontSize: 42,
                  color: "#e4e4e7",
                  margin: "20px 0",
                  lineHeight: 1.2,
                }}
              >
                Real-time emotional intelligence
              </h2>
            </FadeIn>
            <FadeIn delay={30} duration={20}>
              <p
                style={{
                  fontFamily: body.fontFamily,
                  fontSize: 20,
                  color: "#a1a1aa",
                  lineHeight: 1.6,
                }}
              >
                Six dimensions of emotion evolve as agents process each accusation,
                defense, and betrayal.
              </p>
            </FadeIn>

            {/* Event trigger */}
            <FadeIn delay={55} duration={10}>
              <div
                style={{
                  marginTop: 30,
                  padding: "12px 18px",
                  background: "rgba(255,107,53,0.08)",
                  border: "1px solid rgba(255,107,53,0.2)",
                  borderRadius: 8,
                  fontFamily: body.fontFamily,
                  fontSize: 14,
                  color: "#ff6b35",
                }}
              >
                Event: Marcus accuses Lyra of being the werewolf
              </div>
            </FadeIn>
          </div>

          {/* Right: Emotion bars */}
          <GlassCard width={450} padding={28} borderColor="rgba(241,148,138,0.15)">
            <div
              style={{
                fontFamily: body.fontFamily,
                fontSize: 14,
                color: "#71717a",
                marginBottom: 16,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Lyra&apos;s Emotional State
            </div>
            {EMOTIONS.map((emotion, i) => (
              <EmotionBar
                key={emotion.label}
                label={emotion.label}
                value={emotion.value}
                targetValue={frame > 65 ? emotion.target : undefined}
                color={emotion.color}
                startFrame={15 + i * 8}
              />
            ))}
          </GlassCard>

          {/* Event flash overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(255,107,53,0.1)",
              opacity: eventFlash,
              pointerEvents: "none",
            }}
          />

          {/* EnergyBurst at event trigger */}
          <EnergyBurst startFrame={65} color="#F1948A" particleCount={20} />

          {/* ScanLines overlay */}
          <ScanLines opacity={0.04} />
        </div>
      </ScreenShake>
    </ContrastGrade>
  );
};
