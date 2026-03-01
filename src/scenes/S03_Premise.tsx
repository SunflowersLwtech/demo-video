import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { TextSlam } from "../components/effects/TextSlam";
import { GlitchFlash } from "../components/effects/GlitchFlash";
import { ZoomPunch } from "../components/effects/ZoomPunch";
import { ScreenShake } from "../components/effects/ScreenShake";
import { ScanLines } from "../components/effects/ScanLines";
import { loadFont as loadHeading } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadBody } from "@remotion/google-fonts/Inter";

const heading = loadHeading();
const body = loadBody();

// 7 figure positions arranged in a circle around the table
// Index 6 is the golden "YOU" figure (bottom-center, visually prominent)
const FIGURE_COUNT = 7;
const CIRCLE_RADIUS = 160;
const FIGURE_ANGLES = Array.from({ length: FIGURE_COUNT }, (_, i) => {
  // Start from top (-90 deg) and go clockwise, place golden figure at bottom
  const offset = -Math.PI / 2;
  return offset + (i / FIGURE_COUNT) * 2 * Math.PI;
});

const GOLDEN_INDEX = 6;

export const S03_Premise: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Table silhouette: fade in prominently ---
  const tableOpacity = interpolate(frame, [0, 30], [0, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Figure stagger: frames 10-60, spread across the scene ---
  const figureStartFrames = [10, 18, 26, 34, 42, 50, 55];

  // --- Text line 1: "A reverse Turing test." fade in frames 15-30 ---
  const text1Opacity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const text1Y = interpolate(frame, [15, 30], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Text line 2: "You are the hidden human." fade in frames 70-90 ---
  const text2Opacity = interpolate(frame, [70, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const text2Y = interpolate(frame, [70, 90], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Speech bubble: "Is it you?" at frame 80 ---
  const bubble1Opacity = interpolate(frame, [80, 90], [0, 0.7], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bubble1Y = interpolate(frame, [80, 90], [6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Speech bubble: "Trust no one" at frame 100 ---
  const bubble2Opacity = interpolate(frame, [100, 110], [0, 0.7], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bubble2Y = interpolate(frame, [100, 110], [6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- "YOU" label appears at frame 58 ---
  const youLabelOpacity = interpolate(frame, [58, 68], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const youLabelY = interpolate(frame, [58, 68], [8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <ScreenShake startFrame={130} intensity={3} duration={8}>
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0a0a14",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ============ Circular table silhouette (center) ============ */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -58%)",
            width: 320,
            height: 320,
            borderRadius: "50%",
            border: "2px solid rgba(200, 200, 224, 0.15)",
            opacity: tableOpacity,
            background:
              "radial-gradient(ellipse at center, rgba(200,200,224,0.04) 0%, transparent 70%)",
            boxShadow:
              "0 0 80px rgba(200,200,224,0.06), inset 0 0 60px rgba(200,200,224,0.03)",
          }}
        />

        {/* ============ 7 Figure dots around the table ============ */}
        {FIGURE_ANGLES.map((angle, i) => {
          const isGolden = i === GOLDEN_INDEX;
          const startF = figureStartFrames[i];
          const elapsed = frame - startF;

          // Spring animation for scale entrance
          const scaleProgress =
            elapsed < 0
              ? 0
              : spring({
                  frame: elapsed,
                  fps,
                  config: { damping: 14, stiffness: 180, mass: 0.6 },
                });

          const figureScale = interpolate(scaleProgress, [0, 1], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const figureOpacity = interpolate(scaleProgress, [0, 0.3], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const cx = Math.cos(angle) * CIRCLE_RADIUS;
          const cy = Math.sin(angle) * CIRCLE_RADIUS;

          const dotSize = 16;
          const color = isGolden ? "#f59e0b" : "#c8c8e0";
          const glowColor = isGolden
            ? "rgba(245, 158, 11, 0.6)"
            : "rgba(200, 200, 224, 0.2)";
          const glowSize = isGolden ? 24 : 10;
          const dotOpacity = isGolden ? 1 : 0.6;

          const figureContent = (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(calc(-50% + ${cx}px), calc(-58% + ${cy}px)) scale(${figureScale})`,
                opacity: figureOpacity * dotOpacity,
                width: dotSize,
                height: dotSize,
                borderRadius: "50%",
                background: color,
                boxShadow: `0 0 ${glowSize}px ${glowColor}, 0 0 ${glowSize * 2}px ${glowColor}`,
              }}
            />
          );

          // Golden figure gets ZoomPunch effect
          if (isGolden) {
            return (
              <React.Fragment key={`figure-${i}`}>
                <ZoomPunch startFrame={55} from={1.6} damping={14}>
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: `translate(calc(-50% + ${cx}px), calc(-58% + ${cy}px)) scale(${figureScale})`,
                      opacity: figureOpacity,
                      width: dotSize,
                      height: dotSize,
                      borderRadius: "50%",
                      background: color,
                      boxShadow: `0 0 ${glowSize}px ${glowColor}, 0 0 ${glowSize * 2}px ${glowColor}`,
                    }}
                  />
                </ZoomPunch>
                {/* "YOU" label */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: `translate(calc(-50% + ${cx}px - 14px), calc(-58% + ${cy}px - 28px + ${youLabelY}px))`,
                    opacity: youLabelOpacity,
                    fontFamily: body.fontFamily,
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#f59e0b",
                    letterSpacing: "2px",
                    textTransform: "uppercase" as const,
                    textShadow: "0 0 10px rgba(245,158,11,0.5)",
                    whiteSpace: "nowrap" as const,
                    pointerEvents: "none" as const,
                  }}
                >
                  YOU
                </div>
              </React.Fragment>
            );
          }

          return (
            <React.Fragment key={`figure-${i}`}>
              {figureContent}
            </React.Fragment>
          );
        })}

        {/* ============ Speech bubble: "Is it you?" (left side) ============ */}
        <div
          style={{
            position: "absolute",
            top: "34%",
            left: "22%",
            transform: `translateY(${bubble1Y}px)`,
            opacity: bubble1Opacity,
            fontFamily: body.fontFamily,
            fontSize: 14,
            color: "#a1a1aa",
            background: "rgba(200,200,224,0.08)",
            border: "1px solid rgba(200,200,224,0.12)",
            borderRadius: 10,
            padding: "6px 14px",
            pointerEvents: "none" as const,
            whiteSpace: "nowrap" as const,
          }}
        >
          Is it you?
        </div>

        {/* ============ Speech bubble: "Trust no one" (right side) ============ */}
        <div
          style={{
            position: "absolute",
            top: "38%",
            right: "20%",
            transform: `translateY(${bubble2Y}px)`,
            opacity: bubble2Opacity,
            fontFamily: body.fontFamily,
            fontSize: 14,
            color: "#f59e0b",
            background: "rgba(245,158,11,0.06)",
            border: "1px solid rgba(245,158,11,0.15)",
            borderRadius: 10,
            padding: "6px 14px",
            pointerEvents: "none" as const,
            whiteSpace: "nowrap" as const,
          }}
        >
          Trust no one
        </div>

        {/* ============ Text overlay at the bottom ============ */}
        <div
          style={{
            position: "absolute",
            bottom: 80,
            left: 0,
            right: 0,
            textAlign: "center",
            padding: "0 60px",
          }}
        >
          {/* Line 1: "A reverse Turing test." - frames 5-15 */}
          <div
            style={{
              opacity: text1Opacity,
              transform: `translateY(${text1Y}px)`,
              marginBottom: 14,
            }}
          >
            <p
              style={{
                fontFamily: heading.fontFamily,
                fontSize: 28,
                color: "#e4e4e7",
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              A reverse Turing test.
            </p>
          </div>

          {/* Line 2: "You are the hidden human." - frames 35-50 */}
          <div
            style={{
              opacity: text2Opacity,
              transform: `translateY(${text2Y}px)`,
              marginBottom: 14,
            }}
          >
            <p
              style={{
                fontFamily: body.fontFamily,
                fontSize: 24,
                color: "#f59e0b",
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              You are the hidden human.
            </p>
          </div>

          {/* Line 3: "Out-think. Out-lie. Out-play." - TextSlam at frame 55 */}
          <TextSlam startFrame={130} fromScale={2} damping={14}>
            <p
              style={{
                fontFamily: body.fontFamily,
                fontSize: 36,
                fontWeight: 700,
                color: "#ffffff",
                margin: 0,
                lineHeight: 1.4,
                textShadow: "0 0 20px rgba(255,255,255,0.3)",
              }}
            >
              Out-think. Out-lie. Out-play.
            </p>
          </TextSlam>
        </div>

        {/* ============ Effects ============ */}
        {/* GlitchFlash when golden figure appears */}
        <GlitchFlash
          startFrame={55}
          duration={4}
          color="rgba(245,158,11,0.6)"
        />

        {/* GlitchFlash on TextSlam line */}
        <GlitchFlash
          startFrame={130}
          duration={3}
          color="rgba(255,255,255,0.5)"
        />

        {/* ScanLines overlay */}
        <ScanLines opacity={0.03} />
      </div>
    </ScreenShake>
  );
};
