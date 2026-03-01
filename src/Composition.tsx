import React from "react";
import { Audio, interpolate, useCurrentFrame, Sequence, staticFile } from "remotion";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { flip } from "@remotion/transitions/flip";
import { clockWipe } from "@remotion/transitions/clock-wipe";

import { SCENES, TRANSITIONS, TOTAL_FRAMES, type TransitionType } from "./constants/timing";

import { S01_ColdOpen } from "./scenes/S01_ColdOpen";
import { S02_TitleReveal } from "./scenes/S02_TitleReveal";
import { S03_Premise } from "./scenes/S03_Premise";
import { S04_DocumentUpload } from "./scenes/S04_DocumentUpload";
import { S05_CharacterGen } from "./scenes/S05_CharacterGen";
import { S06_SkillModules } from "./scenes/S06_SkillModules";
import { S07_Discussion } from "./scenes/S07_Discussion";
import { S08_InnerThoughts } from "./scenes/S08_InnerThoughts";
import { S09_EmotionalReactions } from "./scenes/S09_EmotionalReactions";
import { S10_VotingPhase } from "./scenes/S10_VotingPhase";
import { S11_NightPhase } from "./scenes/S11_NightPhase";
import { S12_Architecture } from "./scenes/S12_Architecture";
import { S13_MemoryDeception } from "./scenes/S13_MemoryDeception";
import { S14_Montage } from "./scenes/S14_Montage";
import { S15_CallToAction } from "./scenes/S15_CallToAction";

// Scene config array for TransitionSeries
const SCENE_LIST: {
  key: string;
  component: React.FC;
  frames: number;
  voiceover: string | null; // path to voiceover MP3 or null
}[] = [
  { key: "S01", component: S01_ColdOpen, frames: SCENES.S01_ColdOpen.frames, voiceover: null },
  { key: "S02", component: S02_TitleReveal, frames: SCENES.S02_TitleReveal.frames, voiceover: staticFile("audio/voiceover/scene-02.mp3") },
  { key: "S03", component: S03_Premise, frames: SCENES.S03_Premise.frames, voiceover: staticFile("audio/voiceover/scene-03.mp3") },
  { key: "S04", component: S04_DocumentUpload, frames: SCENES.S04_DocumentUpload.frames, voiceover: staticFile("audio/voiceover/scene-04.mp3") },
  { key: "S05", component: S05_CharacterGen, frames: SCENES.S05_CharacterGen.frames, voiceover: staticFile("audio/voiceover/scene-05.mp3") },
  { key: "S06", component: S06_SkillModules, frames: SCENES.S06_SkillModules.frames, voiceover: staticFile("audio/voiceover/scene-06.mp3") },
  { key: "S07", component: S07_Discussion, frames: SCENES.S07_Discussion.frames, voiceover: staticFile("audio/voiceover/scene-07.mp3") },
  { key: "S08", component: S08_InnerThoughts, frames: SCENES.S08_InnerThoughts.frames, voiceover: staticFile("audio/voiceover/scene-08.mp3") },
  { key: "S09", component: S09_EmotionalReactions, frames: SCENES.S09_EmotionalReactions.frames, voiceover: staticFile("audio/voiceover/scene-09.mp3") },
  { key: "S10", component: S10_VotingPhase, frames: SCENES.S10_VotingPhase.frames, voiceover: staticFile("audio/voiceover/scene-10.mp3") },
  { key: "S11", component: S11_NightPhase, frames: SCENES.S11_NightPhase.frames, voiceover: staticFile("audio/voiceover/scene-11.mp3") },
  { key: "S12", component: S12_Architecture, frames: SCENES.S12_Architecture.frames, voiceover: staticFile("audio/voiceover/scene-12.mp3") },
  { key: "S13", component: S13_MemoryDeception, frames: SCENES.S13_MemoryDeception.frames, voiceover: staticFile("audio/voiceover/scene-13.mp3") },
  { key: "S14", component: S14_Montage, frames: SCENES.S14_Montage.frames, voiceover: staticFile("audio/voiceover/scene-14.mp3") },
  { key: "S15", component: S15_CallToAction, frames: SCENES.S15_CallToAction.frames, voiceover: staticFile("audio/voiceover/scene-15.mp3") },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getPresentation(type: TransitionType): any {
  switch (type) {
    case "slide":
      return slide({ direction: "from-right" });
    case "wipe":
      return wipe({ direction: "from-left" });
    case "flip":
      return flip({ direction: "from-right" });
    case "clockWipe":
      return clockWipe({ width: 1920, height: 1080 });
    case "spring":
    case "fade":
    default:
      return fade();
  }
}

function getTiming(type: TransitionType, frames: number) {
  if (type === "spring") {
    return springTiming({ durationInFrames: frames });
  }
  return linearTiming({ durationInFrames: frames });
}

// Compute absolute start frame for each scene
function computeSceneStarts(): number[] {
  const starts: number[] = [0];
  for (let i = 1; i < SCENE_LIST.length; i++) {
    const prevStart = starts[i - 1];
    const prevDuration = SCENE_LIST[i - 1].frames;
    const transitionOverlap = TRANSITIONS[i - 1]?.frames ?? 0;
    starts.push(prevStart + prevDuration - transitionOverlap);
  }
  return starts;
}

const SCENE_STARTS = computeSceneStarts();

// Background music with volume ducking during voiceover
const BackgroundMusic: React.FC = () => {
  const frame = useCurrentFrame();

  // Fade in over first 2 seconds, maintain, fade out in last 3 seconds
  const volume = interpolate(
    frame,
    [0, 60, TOTAL_FRAMES - 90, TOTAL_FRAMES],
    [0, 0.25, 0.25, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <Audio
      src={staticFile("audio/vibe.mp3")}
      volume={volume}
      loop
    />
  );
};

export const CouncilDemo: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#0a0a14",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background music */}
      <BackgroundMusic />

      {/* SFX at key moments */}
      <Sequence from={0} layout="none">
        <Audio src={staticFile("audio/sfx-game-start.mp3")} volume={0.5} />
      </Sequence>

      {/* Tension SFX at S10 voting phase start */}
      <Sequence from={SCENE_STARTS[9]} layout="none">
        <Audio src={staticFile("audio/sfx-tension.mp3")} volume={0.35} />
      </Sequence>

      {/* Vote SFX at each vote reveal in S10 */}
      {[60, 85, 110, 135, 160, 185, 210].map((localFrame) => (
        <Sequence key={`vote-${localFrame}`} from={SCENE_STARTS[9] + localFrame} layout="none">
          <Audio src={staticFile("audio/sfx-vote.mp3")} volume={0.3} />
        </Sequence>
      ))}

      {/* Phase transition SFX at S11 night start */}
      <Sequence from={SCENE_STARTS[10]} layout="none">
        <Audio src={staticFile("audio/sfx-phase-transition.mp3")} volume={0.4} />
      </Sequence>

      {/* Elimination SFX at S11 elimination flash (local frame 150) */}
      <Sequence from={SCENE_STARTS[10] + 150} layout="none">
        <Audio src={staticFile("audio/sfx-eliminate.mp3")} volume={0.45} />
      </Sequence>

      {/* Game end SFX at S15 start */}
      <Sequence from={SCENE_STARTS[14]} layout="none">
        <Audio src={staticFile("audio/sfx-game-end.mp3")} volume={0.4} />
      </Sequence>

      {/* Per-scene voiceover audio (with delay offsets to avoid transition overlap) */}
      {SCENE_LIST.map((scene, i) => {
        if (!scene.voiceover) return null;
        // Delay voiceover slightly so audio starts after transition completes
        const voDelay = i <= 1 ? 20 : 5; // S02 needs larger delay (transition from S01)
        return (
          <Sequence key={`vo-${scene.key}`} from={SCENE_STARTS[i] + voDelay} layout="none">
            <Audio src={scene.voiceover} volume={0.85} />
          </Sequence>
        );
      })}

      {/* Scene assembly with transitions */}
      <TransitionSeries>
        {SCENE_LIST.map((scene, i) => {
          const SceneComponent = scene.component;
          const transition = TRANSITIONS[i];
          return (
            <React.Fragment key={scene.key}>
              <TransitionSeries.Sequence durationInFrames={scene.frames}>
                <SceneComponent />
              </TransitionSeries.Sequence>
              {i < SCENE_LIST.length - 1 && transition && transition.frames > 0 && (
                <TransitionSeries.Transition
                  presentation={getPresentation(transition.type)}
                  timing={getTiming(transition.type, transition.frames)}
                />
              )}
            </React.Fragment>
          );
        })}
      </TransitionSeries>
    </div>
  );
};
