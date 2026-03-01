import React from "react";
import { useCurrentFrame, spring, useVideoConfig } from "remotion";
import { GlassCard } from "../components/ui/GlassCard";
import { FadeIn } from "../components/effects/FadeIn";
import { PhaseLabel } from "../components/ui/PhaseLabel";
import { GlitchFlash } from "../components/effects/GlitchFlash";
import { ScanLines } from "../components/effects/ScanLines";
import { ScreenShake } from "../components/effects/ScreenShake";
import { loadFont as loadHeading } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadBody } from "@remotion/google-fonts/Inter";

const heading = loadHeading();
const bodyFont = loadBody();

// Memory entries
const MEMORIES = [
  { round: 1, event: "Marcus accused Lyra", importance: "high", frame: 30 },
  { round: 1, event: "Lyra deflected to Zara", importance: "high", frame: 55 },
  { round: 2, event: "Viktor defended Lyra quietly", importance: "medium", frame: 80 },
  { round: 2, event: "Orion agreed with Marcus", importance: "medium", frame: 105 },
  { round: 3, event: "Zara voted for Lyra", importance: "high", frame: 130 },
];

// Deception entries
const DECEPTIONS = [
  { agent: "Lyra", truth: "Knows Viktor is ally", lie: "Publicly distances from Viktor", frame: 45 },
  { agent: "Viktor", truth: "Planning to betray Lyra", lie: "Appears to support Lyra", frame: 75 },
  { agent: "Lyra", truth: "Fears Marcus is close to truth", lie: "Acts confident and dismissive", frame: 105 },
];

export const S13_MemoryDeception: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <ScreenShake startFrame={DECEPTIONS[0].frame} intensity={3} duration={8}>
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#0a0a14",
        position: "relative",
        overflow: "hidden",
        display: "flex",
      }}
    >
      {/* GlitchFlash on each deception card entrance */}
      {DECEPTIONS.map((dec, i) => (
        <GlitchFlash key={`glitch-${i}`} startFrame={dec.frame} duration={4} color="#FF6B6B" />
      ))}

      {/* ScanLines overlay */}
      <ScanLines opacity={0.03} />

      {/* Left: Memory Timeline */}
      <div
        style={{
          width: "50%",
          padding: "60px 40px 60px 80px",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {/* Subtle blue tint overlay for memory side */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(78, 205, 196, 0.04)",
            pointerEvents: "none",
          }}
        />

        <FadeIn delay={5} duration={15}>
          <PhaseLabel label="Agent Memory" color="#4ECDC4" />
          <h2
            style={{
              fontFamily: heading.fontFamily,
              fontSize: 32,
              color: "#e4e4e7",
              margin: "12px 0 24px",
            }}
          >
            Perfect Recall
          </h2>
        </FadeIn>

        {/* Timeline */}
        <div style={{ position: "relative", paddingLeft: 20 }}>
          {/* Vertical line */}
          <div
            style={{
              position: "absolute",
              left: 4,
              top: 0,
              bottom: 0,
              width: 2,
              background: "linear-gradient(to bottom, #4ECDC4, transparent)",
              opacity: 0.3,
            }}
          />

          {MEMORIES.map((mem, i) => {
            // Spring-based opacity instead of linear interpolate
            const springProgress = spring({
              frame: Math.max(0, frame - mem.frame),
              fps,
              config: {
                damping: 14,
                stiffness: 120,
                mass: 0.8,
              },
            });
            const opacity = frame < mem.frame ? 0 : springProgress;
            return (
              <div
                key={i}
                style={{
                  opacity,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 16,
                  marginBottom: 18,
                  paddingLeft: 20,
                  position: "relative",
                }}
              >
                {/* Dot */}
                <div
                  style={{
                    position: "absolute",
                    left: -1,
                    top: 6,
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: mem.importance === "high" ? "#4ECDC4" : "#4ECDC480",
                    boxShadow: mem.importance === "high" ? "0 0 8px #4ECDC440" : "none",
                  }}
                />
                <div>
                  <div
                    style={{
                      fontFamily: bodyFont.fontFamily,
                      fontSize: 12,
                      color: "#71717a",
                      marginBottom: 2,
                    }}
                  >
                    Round {mem.round}
                  </div>
                  <div
                    style={{
                      fontFamily: bodyFont.fontFamily,
                      fontSize: 16,
                      color: "#e4e4e7",
                      lineHeight: 1.4,
                    }}
                  >
                    {mem.event}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Center divider */}
      <div
        style={{
          width: 1,
          background: "linear-gradient(to bottom, transparent, rgba(255,107,53,0.2), transparent)",
          margin: "60px 0",
        }}
      />

      {/* Right: Deception Tracking */}
      <div
        style={{
          width: "50%",
          padding: "60px 80px 60px 40px",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {/* Subtle orange tint overlay for deception side */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(255, 107, 53, 0.04)",
            pointerEvents: "none",
          }}
        />

        <FadeIn delay={15} duration={15}>
          <PhaseLabel label="Deception Tracking" color="#FF6B6B" />
          <h2
            style={{
              fontFamily: heading.fontFamily,
              fontSize: 32,
              color: "#e4e4e7",
              margin: "12px 0 24px",
            }}
          >
            The Art of the Lie
          </h2>
        </FadeIn>

        {DECEPTIONS.map((dec, i) => {
          // Spring-based opacity for deception cards
          const springProgress = spring({
            frame: Math.max(0, frame - dec.frame),
            fps,
            config: {
              damping: 12,
              stiffness: 100,
              mass: 0.8,
            },
          });
          const opacity = frame < dec.frame ? 0 : springProgress;
          return (
            <div key={i} style={{ opacity, marginBottom: 20 }}>
              <GlassCard padding={16} borderColor="rgba(255,107,53,0.1)">
                <div
                  style={{
                    fontFamily: bodyFont.fontFamily,
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#FF6B6B",
                    marginBottom: 8,
                  }}
                >
                  {dec.agent}
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: bodyFont.fontFamily,
                        fontSize: 11,
                        color: "#4466ff",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginBottom: 4,
                      }}
                    >
                      Reality
                    </div>
                    <div style={{ fontFamily: bodyFont.fontFamily, fontSize: 14, color: "#a1a1aa" }}>
                      {dec.truth}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: bodyFont.fontFamily,
                        fontSize: 11,
                        color: "#ff6b35",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginBottom: 4,
                      }}
                    >
                      Facade
                    </div>
                    <div style={{ fontFamily: bodyFont.fontFamily, fontSize: 14, color: "#e4e4e7" }}>
                      {dec.lie}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          );
        })}
      </div>
    </div>
    </ScreenShake>
  );
};
