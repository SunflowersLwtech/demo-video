/**
 * Voiceover generation script using ElevenLabs API.
 *
 * Usage:
 *   ELEVENLABS_API_KEY=your_key npx ts-node generate-voiceover.ts
 *
 * Requires: ELEVENLABS_API_KEY in environment or .env file
 */

import * as fs from "fs";
import * as path from "path";

// Script texts (mirrored from src/constants/script.ts)
const SCRIPT: Record<string, string | null> = {
  "scene-02": "COUNCIL. Where artificial minds learn the art of deception.",
  "scene-03": "Seven AI agents. One table. Everyone has a secret. Not everyone will survive.",
  "scene-04": "Upload any document. A novel, a screenplay, a historical text. Mistral AI transforms it into a living game world with unique characters, relationships, and hidden motives.",
  "scene-05": "Each character is generated with four layers of personality: a public persona, private fears, secret alliances, and a hidden role. No two games are ever the same.",
  "scene-06": "Seven cognitive skill modules, from deductive reasoning to emotional manipulation, power every decision an agent makes.",
  "scene-07": "Watch the discussion unfold. Agent Marcus accuses Lyra of acting suspicious. Lyra deflects with a calculated counter-argument. Every word is a strategic move, powered by Mistral's language understanding.",
  "scene-08": "Before speaking publicly, every agent generates honest inner thoughts. What they think and what they say are often very different things.",
  "scene-09": "Six dimensions of emotion, from trust to fear, evolve in real time as agents process each accusation, defense, and betrayal.",
  "scene-10": "Mistral's function calling enables structured decision-making. Each agent casts a strategic vote, weighing alliances, suspicions, and survival instincts.",
  "scene-11": "Night falls. The werewolf chooses a target. The seer investigates. The doctor protects. Dawn reveals who survived.",
  "scene-12": "Under the hood: Mistral AI powers a multi-agent architecture where each agent runs independently, with its own memory, personality model, and decision engine.",
  "scene-13": "Agents don't just respond. They remember every accusation, track every contradiction, and build evolving mental models of who to trust.",
  "scene-15": "COUNCIL. Where AI learns to lie. Built with Mistral AI.",
};

const OUTPUT_DIR = path.join(__dirname, "public", "audio", "voiceover");

// ElevenLabs voice ID for "Adam" (deep cinematic male)
// You can change this to any voice ID from your ElevenLabs account
const VOICE_ID = "pNInz6obpgDQGcFmaJgB"; // Adam

async function generateVoiceover(
  text: string,
  filename: string,
  apiKey: string
): Promise<void> {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": apiKey,
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_monolingual_v1",
      voice_settings: {
        stability: 0.65,
        similarity_boost: 0.75,
        style: 0.3,
        use_speaker_boost: true,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs API error for ${filename}: ${response.status} ${error}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const filepath = path.join(OUTPUT_DIR, `${filename}.mp3`);
  fs.writeFileSync(filepath, buffer);
  console.log(`Generated: ${filepath} (${buffer.length} bytes)`);
}

async function main() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error("Error: ELEVENLABS_API_KEY environment variable is required");
    console.error("Usage: ELEVENLABS_API_KEY=your_key npx ts-node generate-voiceover.ts");
    process.exit(1);
  }

  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const entries = Object.entries(SCRIPT).filter(
    ([_, text]) => text !== null
  ) as [string, string][];

  console.log(`Generating ${entries.length} voiceover files...`);

  for (const [key, text] of entries) {
    try {
      await generateVoiceover(text, key, apiKey);
      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Failed to generate ${key}:`, error);
    }
  }

  console.log("Done!");
}

main();
