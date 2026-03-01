import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { GlitchFlash } from "../components/effects/GlitchFlash";
import { EnergyBurst } from "../components/effects/EnergyBurst";
import { ScanLines } from "../components/effects/ScanLines";
import { ScreenShake } from "../components/effects/ScreenShake";
import { loadFont as loadBody } from "@remotion/google-fonts/Inter";

const body = loadBody();

// --- Stage definitions ---
interface StageConfig {
  label: string;
  sublabel: string;
  borderColor: string;
  appearStart: number;
  icon: "document" | "mistral" | "globe" | "people" | "play";
}

const STAGES: StageConfig[] = [
  {
    label: "Upload",
    sublabel: "PDF / Text / Story",
    borderColor: "#94a3b8",
    appearStart: 10,
    icon: "document",
  },
  {
    label: "OCR",
    sublabel: "mistral-ocr-latest",
    borderColor: "#ff6b35",
    appearStart: 30,
    icon: "mistral",
  },
  {
    label: "World Gen",
    sublabel: "Factions \u00B7 Roles \u00B7 Conflicts",
    borderColor: "#ff6b35",
    appearStart: 50,
    icon: "globe",
  },
  {
    label: "Characters",
    sublabel: "5\u20138 Unique Agents",
    borderColor: "#7c3aed",
    appearStart: 70,
    icon: "people",
  },
  {
    label: "Game",
    sublabel: "Session Created",
    borderColor: "#3b82f6",
    appearStart: 90,
    icon: "play",
  },
];

// Arrow timing: each arrow starts 15 frames after its source stage and lasts 10 frames
const ARROWS = [
  { start: 25, end: 35 },
  { start: 45, end: 55 },
  { start: 65, end: 75 },
  { start: 85, end: 95 },
];

// --- Icon renderers ---
const DocumentIcon: React.FC = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <rect x="6" y="2" width="24" height="32" rx="3" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" fill="none" />
    <line x1="11" y1="11" x2="25" y2="11" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="11" y1="16" x2="22" y2="16" stroke="rgba(255,255,255,0.20)" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="11" y1="21" x2="20" y2="21" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="11" y1="26" x2="17" y2="26" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const MistralIcon: React.FC = () => {
  // 5-dot cross pattern (Mistral logo motif)
  const c = "#ff6b35";
  const dots: [number, number][] = [
    [18, 8],   // top
    [18, 28],  // bottom
    [8, 18],   // left
    [28, 18],  // right
    [18, 18],  // center
  ];
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      {dots.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3.5" fill={c} />
      ))}
    </svg>
  );
};

const GlobeIcon: React.FC = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <circle cx="18" cy="18" r="13" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" />
    <ellipse cx="18" cy="18" rx="7" ry="13" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />
    <line x1="5" y1="14" x2="31" y2="14" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
    <line x1="5" y1="22" x2="31" y2="22" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
  </svg>
);

const PeopleIcon: React.FC = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    {/* Left person */}
    <circle cx="13" cy="12" r="4" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" fill="none" />
    <path d="M6 28 C6 22 10 19 13 19 C16 19 20 22 20 28" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" fill="none" />
    {/* Right person */}
    <circle cx="23" cy="12" r="4" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" fill="none" />
    <path d="M16 28 C16 22 20 19 23 19 C26 19 30 22 30 28" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" fill="none" />
  </svg>
);

const PlayIcon: React.FC = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <polygon points="12,6 30,18 12,30" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);

const ICON_MAP: Record<StageConfig["icon"], React.FC> = {
  document: DocumentIcon,
  mistral: MistralIcon,
  globe: GlobeIcon,
  people: PeopleIcon,
  play: PlayIcon,
};

// --- Stage Card ---
const StageCard: React.FC<{
  stage: StageConfig;
  frame: number;
  fps: number;
}> = ({ stage, frame, fps }) => {
  const scaleSpring = spring({
    frame: Math.max(0, frame - stage.appearStart),
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.8 },
  });

  const opacity = interpolate(frame, [stage.appearStart, stage.appearStart + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const IconComponent = ICON_MAP[stage.icon];

  const sublabelColor =
    stage.icon === "mistral" ? "#9a3412" : "rgba(255,255,255,0.4)";

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scaleSpring})`,
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${stage.borderColor}30`,
        borderRadius: 12,
        padding: "16px 12px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        width: 155,
      }}
    >
      <IconComponent />
      <span
        style={{
          fontFamily: body.fontFamily,
          fontSize: 15,
          fontWeight: 700,
          color: "rgba(255,255,255,0.85)",
          letterSpacing: 0.3,
        }}
      >
        {stage.label}
      </span>
      <span
        style={{
          fontFamily: body.fontFamily,
          fontSize: 11,
          color: sublabelColor,
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        {stage.sublabel}
      </span>
    </div>
  );
};

// --- Animated Arrow ---
const AnimatedArrow: React.FC<{
  startFrame: number;
  endFrame: number;
  frame: number;
}> = ({ startFrame, endFrame, frame }) => {
  const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(frame, [startFrame, startFrame + 3, endFrame], [0, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Beam width grows with progress
  const beamWidth = 50;
  const visibleWidth = beamWidth * progress;

  return (
    <div
      style={{
        width: beamWidth,
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        opacity,
        flexShrink: 0,
      }}
    >
      {/* Main beam */}
      <div
        style={{
          width: visibleWidth,
          height: 3,
          background: "linear-gradient(90deg, #ff6b35, #ffb347, #ff6b35)",
          borderRadius: 2,
          boxShadow: "0 0 14px rgba(255,107,53,0.3)",
          position: "absolute",
          left: 0,
        }}
      />
      {/* Flowing dot particles */}
      {[0, 1, 2].map((i) => {
        const dotProgress = ((frame * 3 + i * 16) % 50) / 50;
        const dotX = dotProgress * beamWidth;
        const dotVisible = dotX < visibleWidth;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: dotX,
              top: "50%",
              width: 6,
              height: 6,
              marginTop: -3,
              borderRadius: "50%",
              background: "#ff6b35",
              boxShadow: "0 0 10px #ff6b35",
              opacity: dotVisible ? 0.8 : 0,
            }}
          />
        );
      })}
      {/* Arrow head */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: "50%",
          marginTop: -5,
          width: 0,
          height: 0,
          borderTop: "5px solid transparent",
          borderBottom: "5px solid transparent",
          borderLeft: "8px solid #ff6b35",
          opacity: progress > 0.7 ? interpolate(progress, [0.7, 1], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }) : 0,
          filter: "drop-shadow(0 0 4px rgba(255,107,53,0.5))",
        }}
      />
    </div>
  );
};

// --- Main Scene ---
export const S04_DocumentUpload: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Bottom narration text
  const textOpacity = interpolate(frame, [40, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <ScreenShake startFrame={100} intensity={4} duration={10}>
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
        {/* Pipeline row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0,
          }}
        >
          {STAGES.map((stage, i) => (
            <React.Fragment key={stage.label}>
              <StageCard stage={stage} frame={frame} fps={fps} />
              {i < STAGES.length - 1 && (
                <AnimatedArrow
                  startFrame={ARROWS[i].start}
                  endFrame={ARROWS[i].end}
                  frame={frame}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Bottom narration text */}
        <div
          style={{
            position: "absolute",
            bottom: 120,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: textOpacity,
          }}
        >
          <p
            style={{
              fontFamily: body.fontFamily,
              fontSize: 24,
              color: "#a1a1aa",
              maxWidth: 800,
              margin: "0 auto",
              lineHeight: 1.5,
            }}
          >
            Mistral AI transforms any document into a living game world
          </p>
        </div>

        {/* GlitchFlash after all stages appear */}
        <GlitchFlash startFrame={120} duration={4} color="white" />

        {/* EnergyBurst at center after all stages */}
        <EnergyBurst startFrame={120} color="#ff6b35" particleCount={20} />

        {/* ScanLines overlay */}
        <ScanLines opacity={0.03} />
      </div>
    </ScreenShake>
  );
};
