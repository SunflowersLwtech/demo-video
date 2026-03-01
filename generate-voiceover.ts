/**
 * Voiceover generation script using Google Gemini TTS API.
 *
 * Usage:
 *   npx ts-node generate-voiceover.ts
 *
 * Requires: GEMINI_API_KEY in .env file
 */

import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

// Script texts (mirrored from src/constants/script.ts)
// Shortened to fit within each scene's audio window and prevent overlap.
const SCRIPT: Record<string, string | null> = {
  "scene-02": "COUNCIL. Where AI learns deception.",
  "scene-03": "A reverse Turing test. You, the hidden human among seven AI. Survive by deception.",
  "scene-04": "Upload any document. Mistral AI extracts factions, builds the world, and generates characters in under a minute.",
  "scene-05": "Each character has layers: persona, fears, alliances, and a role. Some protect. Some investigate. Some kill.",
  "scene-06": "Seven cognitive modules power every agent's decisions.",
  "scene-07": "Watch the discussion unfold. Marcus accuses Lyra. Lyra deflects to Viktor. Every word is strategic, powered by Mistral.",
  "scene-08": "Every agent thinks before speaking. What they think and say are often very different.",
  "scene-09": "Six emotion dimensions evolve in real time with each accusation and betrayal.",
  "scene-10": "Mistral's function calling enables structured decisions. Each agent casts a strategic vote weighing alliances and survival.",
  "scene-11": "Night falls. Killers choose a target. The seer investigates. The doctor protects. Dawn breaks — not everyone wakes up.",
  "scene-12": "Under the hood: Mistral AI powers multi-agent architecture. Each agent has its own memory and decision engine.",
  "scene-13": "Agents remember every accusation, track contradictions, and build mental models of who to trust.",
  "scene-14": "Every round, the tension rises. Who is lying? Who will fall?",
  "scene-15": "COUNCIL. Train your mind in deception. Upload your story. Built with Mistral AI.",
};

const OUTPUT_DIR = path.join(__dirname, "public", "audio", "voiceover");

// Gemini TTS model and voice
const MODEL = "gemini-2.5-flash-preview-tts";
const VOICE_NAME = "Orus"; // Deep, authoritative male voice

async function generateVoiceover(
  text: string,
  filename: string,
  apiKey: string
): Promise<void> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

  // Use plain text - the voice itself provides the tone
  const prompt = text;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: VOICE_NAME,
            },
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini TTS API error for ${filename}: ${response.status} ${error}`);
  }

  const data = await response.json();

  const audioPart = data.candidates?.[0]?.content?.parts?.[0]?.inlineData;
  if (!audioPart?.data) {
    throw new Error(`No audio data in response for ${filename}`);
  }

  // Decode base64 PCM data to raw file
  const pcmBuffer = Buffer.from(audioPart.data, "base64");
  const rawPath = path.join(OUTPUT_DIR, `${filename}.raw`);
  const mp3Path = path.join(OUTPUT_DIR, `${filename}.mp3`);

  fs.writeFileSync(rawPath, pcmBuffer);

  // Convert raw PCM (24kHz, 16-bit signed LE, mono) to MP3 using ffmpeg
  execSync(
    `ffmpeg -y -f s16le -ar 24000 -ac 1 -i "${rawPath}" -codec:a libmp3lame -q:a 2 "${mp3Path}"`,
    { stdio: "pipe" }
  );

  // Clean up raw file
  fs.unlinkSync(rawPath);

  const stats = fs.statSync(mp3Path);
  console.log(`Generated: ${mp3Path} (${stats.size} bytes)`);
}

async function main() {
  // Load .env file manually
  const envPath = path.join(__dirname, ".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const eqIndex = trimmed.indexOf("=");
        if (eqIndex > 0) {
          const key = trimmed.substring(0, eqIndex).trim();
          const value = trimmed.substring(eqIndex + 1).trim();
          if (!process.env[key]) {
            process.env[key] = value;
          }
        }
      }
    }
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Error: GEMINI_API_KEY environment variable is required");
    console.error("Set it in .env file or: GEMINI_API_KEY=your_key npx ts-node generate-voiceover.ts");
    process.exit(1);
  }

  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const entries = Object.entries(SCRIPT).filter(
    ([_, text]) => text !== null
  ) as [string, string][];

  console.log(`Generating ${entries.length} voiceover files using Gemini TTS (voice: ${VOICE_NAME})...`);

  let success = 0;
  let failed = 0;

  for (const [key, text] of entries) {
    try {
      await generateVoiceover(text, key, apiKey);
      success++;
      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Failed to generate ${key}:`, error);
      failed++;
    }
  }

  console.log(`\nDone! ${success} succeeded, ${failed} failed.`);
}

main();
