import React from "react";
import { Audio, interpolate, useCurrentFrame, Sequence } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";

import { SCENES, TRANSITION_FRAMES } from "./constants/timing";

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
  transition: "fade" | "slide" | "wipe";
}[] = [
  { key: "S01", component: S01_ColdOpen, frames: SCENES.S01_ColdOpen.frames, transition: "fade" },
  { key: "S02", component: S02_TitleReveal, frames: SCENES.S02_TitleReveal.frames, transition: "fade" },
  { key: "S03", component: S03_Premise, frames: SCENES.S03_Premise.frames, transition: "fade" },
  { key: "S04", component: S04_DocumentUpload, frames: SCENES.S04_DocumentUpload.frames, transition: "slide" },
  { key: "S05", component: S05_CharacterGen, frames: SCENES.S05_CharacterGen.frames, transition: "wipe" },
  { key: "S06", component: S06_SkillModules, frames: SCENES.S06_SkillModules.frames, transition: "fade" },
  { key: "S07", component: S07_Discussion, frames: SCENES.S07_Discussion.frames, transition: "wipe" },
  { key: "S08", component: S08_InnerThoughts, frames: SCENES.S08_InnerThoughts.frames, transition: "slide" },
  { key: "S09", component: S09_EmotionalReactions, frames: SCENES.S09_EmotionalReactions.frames, transition: "fade" },
  { key: "S10", component: S10_VotingPhase, frames: SCENES.S10_VotingPhase.frames, transition: "wipe" },
  { key: "S11", component: S11_NightPhase, frames: SCENES.S11_NightPhase.frames, transition: "fade" },
  { key: "S12", component: S12_Architecture, frames: SCENES.S12_Architecture.frames, transition: "slide" },
  { key: "S13", component: S13_MemoryDeception, frames: SCENES.S13_MemoryDeception.frames, transition: "fade" },
  { key: "S14", component: S14_Montage, frames: SCENES.S14_Montage.frames, transition: "fade" },
  { key: "S15", component: S15_CallToAction, frames: SCENES.S15_CallToAction.frames, transition: "fade" },
];

function getPresentation(type: "fade" | "slide" | "wipe"): ReturnType<typeof fade> {
  switch (type) {
    case "slide":
      return slide({ direction: "from-right" }) as unknown as ReturnType<typeof fade>;
    case "wipe":
      return wipe({ direction: "from-left" }) as unknown as ReturnType<typeof fade>;
    case "fade":
    default:
      return fade();
  }
}

// Background music with volume ducking
const BackgroundMusic: React.FC = () => {
  const frame = useCurrentFrame();

  // Fade in over first 2 seconds, maintain, fade out in last 3 seconds
  const volume = interpolate(
    frame,
    [0, 60, 3510, 3600],
    [0, 0.15, 0.15, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <Audio
      src="/audio/vibe.mp3"
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
      }}
    >
      {/* Background music */}
      <BackgroundMusic />

      {/* SFX at key moments */}
      <Sequence from={0} layout="none">
        <Audio src="/audio/sfx-game-start.mp3" volume={0.3} />
      </Sequence>

      {/* Vote SFX at S10 start (~frame 2085 estimated) */}

      {/* Scene assembly with transitions */}
      <TransitionSeries>
        {SCENE_LIST.map((scene, i) => {
          const SceneComponent = scene.component;
          return (
            <React.Fragment key={scene.key}>
              <TransitionSeries.Sequence durationInFrames={scene.frames}>
                <SceneComponent />
              </TransitionSeries.Sequence>
              {i < SCENE_LIST.length - 1 && (
                <TransitionSeries.Transition
                  presentation={getPresentation(SCENE_LIST[i + 1].transition)}
                  timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
                />
              )}
            </React.Fragment>
          );
        })}
      </TransitionSeries>
    </div>
  );
};
