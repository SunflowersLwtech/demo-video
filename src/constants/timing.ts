// Scene timing configuration (30fps, 3600 total frames = 120 seconds)
export const FPS = 30;
export const TOTAL_FRAMES = 3600;
export const TOTAL_DURATION = TOTAL_FRAMES / FPS; // 120 seconds

// Default transition overlap frames
export const TRANSITION_FRAMES = 15;

// Scene durations in frames (gross, before transition overlap)
// Optimized: shorter intro to hit product demo within 8 seconds,
// more time for impressive demo moments (Discussion, Voting, Night).
export const SCENES = {
  S01_ColdOpen: { frames: 90, label: "Cold Open" },           // 3.0s (was 5.5s)
  S02_TitleReveal: { frames: 135, label: "Title Reveal" },     // 4.5s (extended for narration)
  S03_Premise: { frames: 255, label: "Premise" },              // 8.5s (extended for narration)
  S04_DocumentUpload: { frames: 260, label: "Document Upload" }, // 8.7s (+35)
  S05_CharacterGen: { frames: 320, label: "Character Generation" }, // 10.7s (extended for narration)
  S06_SkillModules: { frames: 150, label: "Skill Modules" },   // 5.0s
  S07_Discussion: { frames: 345, label: "Discussion" },        // 11.5s (trimmed to balance audio)
  S08_InnerThoughts: { frames: 240, label: "Inner Thoughts" }, // 8.0s
  S09_EmotionalReactions: { frames: 210, label: "Emotional Reactions" }, // 7.0s
  S10_VotingPhase: { frames: 323, label: "Voting Phase" },     // 10.8s (trimmed to balance audio)
  S11_NightPhase: { frames: 353, label: "Night Phase" },       // 11.8s (key scene, +8 for transition)
  S12_Architecture: { frames: 300, label: "Architecture" },    // 10.0s
  S13_MemoryDeception: { frames: 300, label: "Memory & Deception" }, // 10.0s
  S14_Montage: { frames: 218, label: "Montage" },              // 7.3s (+8 for transition)
  S15_CallToAction: { frames: 290, label: "Call to Action" },  // 9.7s (closing impact)
} as const;

// Per-transition configuration (between scene i and scene i+1)
// type: transition visual style
// frames: overlap duration (0 = hard cut)
export type TransitionType = "fade" | "slide" | "wipe" | "flip" | "clockWipe" | "spring" | "none";

export const TRANSITIONS: { type: TransitionType; frames: number }[] = [
  { type: "spring", frames: 15 },    // S01 → S02
  { type: "fade", frames: 15 },      // S02 → S03
  { type: "spring", frames: 15 },    // S03 → S04
  { type: "flip", frames: 15 },      // S04 → S05
  { type: "fade", frames: 15 },      // S05 → S06
  { type: "clockWipe", frames: 15 }, // S06 → S07
  { type: "slide", frames: 15 },     // S07 → S08
  { type: "fade", frames: 15 },      // S08 → S09
  { type: "fade", frames: 8 },       // S09 → S10 (smooth fade)
  { type: "fade", frames: 8 },       // S10 → S11 (smooth fade)
  { type: "slide", frames: 15 },     // S11 → S12
  { type: "fade", frames: 15 },      // S12 → S13
  { type: "fade", frames: 8 },       // S13 → S14 (smooth fade)
  { type: "fade", frames: 15 },      // S14 → S15
];

// Verify total: sum of frames - sum of transition overlaps = 3600
// 3789 - 189 = 3600 ✓ (11×15 + 3×8 = 165+24 = 189)
// Changes: S02+15, S03+60, S05+50, S07-75, S10-50 (net 0)

export type SceneKey = keyof typeof SCENES;
