// Scene timing configuration (30fps, 3600 total frames = 120 seconds)
export const FPS = 30;
export const TOTAL_FRAMES = 3600;
export const TOTAL_DURATION = TOTAL_FRAMES / FPS; // 120 seconds

// Transition overlap frames (distributed across 14 transitions)
export const TRANSITION_FRAMES = 15; // each transition overlap

// Scene durations in frames (gross, before transition overlap)
export const SCENES = {
  S01_ColdOpen: { frames: 165, label: "Cold Open" },
  S02_TitleReveal: { frames: 165, label: "Title Reveal" },
  S03_Premise: { frames: 165, label: "Premise" },
  S04_DocumentUpload: { frames: 225, label: "Document Upload" },
  S05_CharacterGen: { frames: 255, label: "Character Generation" },
  S06_SkillModules: { frames: 165, label: "Skill Modules" },
  S07_Discussion: { frames: 465, label: "Discussion" },
  S08_InnerThoughts: { frames: 255, label: "Inner Thoughts" },
  S09_EmotionalReactions: { frames: 225, label: "Emotional Reactions" },
  S10_VotingPhase: { frames: 315, label: "Voting Phase" },
  S11_NightPhase: { frames: 315, label: "Night Phase" },
  S12_Architecture: { frames: 315, label: "Architecture" },
  S13_MemoryDeception: { frames: 315, label: "Memory & Deception" },
  S14_Montage: { frames: 210, label: "Montage" },
  S15_CallToAction: { frames: 255, label: "Call to Action" },
} as const;

// Verify total: sum of frames - (14 transitions * TRANSITION_FRAMES) = 3600
// 3810 - 210 = 3600 ✓

export type SceneKey = keyof typeof SCENES;
