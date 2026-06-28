"use client";

import { useState } from "react";

const CLAUDE_PROMPT = `Convert my workout program into JSON for the Health Tracker PWA custom program importer.

OUTPUT RULES (follow exactly):
- Return ONLY valid JSON. No markdown, no code fences, no explanation before or after.
- Use this nested structure:
{
  "name": "Your Program Name",
  "weeks": [
    {
      "week": 1,
      "days": [
        {
          "day": "A",
          "blocks": [
            {
              "name": "Warm-up",
              "exercises": [
                {
                  "id": "unique-id-1",
                  "name": "Exercise name",
                  "sets": 3,
                  "reps": 10,
                  "description": "Optional form cue",
                  "videoUrl": "https://www.youtube.com/watch?v=VIDEO_ID"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

SCHEDULE RULES:
- Day "A" = Monday, "B" = Wednesday, "C" = Friday (3-day split only).
- Include as many weeks as my program has (week 1, 2, 3, …).
- Group exercises into blocks (e.g. "Warm-up", "Main", "Cool-down").

EXERCISE FIELDS:
- "name" is required for every exercise.
- "id" is optional but recommended (unique string per exercise).
- Use "sets" + "reps" for strength moves.
- Use "holdSeconds" for holds (e.g. plank 30).
- Use "minutes" for timed/cardio (e.g. elliptical 15).
- "description" is optional (form cues, notes).

VIDEO RULES (important):
- For EVERY exercise, find a clear, reputable form-demonstration video.
- Include "videoUrl" on each exercise: https://www.youtube.com/watch?v=VIDEO_ID or the 11-character video ID.
- Prefer trusted channels: ATHLEAN-X, Squat University, Scott Herman Fitness, Jeff Nippard, Calisthenic Movement, Bob & Brad, or official equipment demos.
- Match equipment in the video to the prescription (dumbbell vs barbell vs bodyweight).
- Pick the clearest coaching video, not a random clip or meme.
- If you cannot find a reliable video, omit "videoUrl" for that exercise.

Now convert this program:
[PASTE YOUR PROGRAM HERE]`;

const CHATGPT_PROMPT = `Act as a fitness JSON converter. I'll describe my workout program, and you convert it to JSON for the Health Tracker PWA.

CRITICAL: Return ONLY valid JSON. No markdown, no explanation, no code blocks.

JSON Structure:
{
  "name": "Program Name",
  "weeks": [
    {
      "week": 1,
      "days": [
        {
          "day": "A",
          "blocks": [
            {
              "name": "Block Name",
              "exercises": [
                {
                  "id": "id-1",
                  "name": "Exercise Name",
                  "sets": 3,
                  "reps": 10,
                  "holdSeconds": null,
                  "minutes": null,
                  "description": "Form cues",
                  "videoUrl": "https://www.youtube.com/watch?v=VIDEO_ID"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

Key Rules:
1. Days: "A" = Mon, "B" = Wed, "C" = Fri (3-day split)
2. For strength: use "sets" + "reps"
3. For holds: use "holdSeconds"
4. For cardio: use "minutes"
5. Find real YouTube videos for every exercise from: ATHLEAN-X, Squat University, Scott Herman, Jeff Nippard, Calisthenic Movement, Bob & Brad
6. Use full URLs: https://www.youtube.com/watch?v=XXXXXXXXXXXX
7. If no reliable video exists, omit "videoUrl"

My program:
[PASTE YOUR PROGRAM HERE]`;

interface AIPromptTemplateProps {
  onPromptCopied?: () => void;
}

export default function AIPromptTemplate({ onPromptCopied }: AIPromptTemplateProps) {
  const [copied, setCopied] = useState<"claude" | "chatgpt" | null>(null);
  const [selectedModel, setSelectedModel] = useState<"claude" | "chatgpt">("claude");

  const copyToClipboard = (prompt: string, model: "claude" | "chatgpt") => {
    navigator.clipboard.writeText(prompt);
    setCopied(model);
    onPromptCopied?.();
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Model Selector */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setSelectedModel("claude")}
          className={`p-3 rounded-xl font-medium transition-all ${
            selectedModel === "claude"
              ? "bg-[#79A98C] text-white"
              : "bg-[#F6F3E9] dark:bg-[#2C2622] text-[#1B1714] dark:text-white hover:bg-[#F0E9CE] dark:hover:bg-[#3D3730]"
          }`}
        >
          🧠 Claude
        </button>
        <button
          onClick={() => setSelectedModel("chatgpt")}
          className={`p-3 rounded-xl font-medium transition-all ${
            selectedModel === "chatgpt"
              ? "bg-[#79A98C] text-white"
              : "bg-[#F6F3E9] dark:bg-[#2C2622] text-[#1B1714] dark:text-white hover:bg-[#F0E9CE] dark:hover:bg-[#3D3730]"
          }`}
        >
          🤖 ChatGPT
        </button>
      </div>

      {/* Prompt Display */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#1B1714] dark:text-white">
          {selectedModel === "claude" ? "Claude Prompt" : "ChatGPT Prompt"}
        </label>
        <div className="relative">
          <textarea
            readOnly
            value={selectedModel === "claude" ? CLAUDE_PROMPT : CHATGPT_PROMPT}
            className="w-full h-64 bg-[#F6F3E9] dark:bg-[#2C2622] border border-[#F0E9CE] dark:border-[#3D3730] rounded-xl p-4 text-xs text-[#1B1714] dark:text-white font-mono resize-none"
          />
        </div>
      </div>

      {/* Copy Button */}
      <button
        onClick={() =>
          copyToClipboard(
            selectedModel === "claude" ? CLAUDE_PROMPT : CHATGPT_PROMPT,
            selectedModel
          )
        }
        className="w-full bg-[#79A98C] hover:bg-[#5E8C6E] text-white font-semibold py-3 rounded-xl transition-all active:scale-[0.98]"
      >
        {copied === selectedModel ? "✓ Copied to Clipboard!" : "📋 Copy Prompt"}
      </button>

      {/* Instructions */}
      <div className="bg-[#79A98C]/5 dark:bg-[#79A98C]/10 border border-[#79A98C]/20 rounded-lg p-4">
        <p className="text-sm text-[#79A98C] font-medium mb-3">💡 How to use:</p>
        <ol className="text-sm text-[#8A7F78] space-y-2 list-decimal list-inside">
          <li>Copy the prompt above</li>
          <li>Open {selectedModel === "claude" ? "Claude.ai" : "ChatGPT"}</li>
          <li>Paste the prompt</li>
          <li>Add your program details where it says [PASTE YOUR PROGRAM HERE]</li>
          <li>Get back JSON → paste into the text area above</li>
          <li>Click "Preview" → "Import"</li>
        </ol>
      </div>

      {/* Tips */}
      <div className="bg-[#F0E9CE] dark:bg-[#3D3730] border border-[#F0E9CE] dark:border-[#4A433E] rounded-lg p-4">
        <p className="text-sm text-[#1B1714] dark:text-[#D4CFC9] font-medium mb-2">⚡ Pro Tips:</p>
        <ul className="text-xs text-[#3D3730] dark:text-[#8A7F78] space-y-1">
          <li>• Be specific: "Push-ups, 3 sets of 10 reps" works better than vague descriptions</li>
          <li>• Include all weeks upfront: "This is a 4-week program with..."</li>
          <li>• Mention equipment: "Dumbbells", "barbell", "bodyweight only"</li>
          <li>• Describe blocks: "Warm-up: 5 min light movement, Main: strength, Cool-down: stretching"</li>
        </ul>
      </div>
    </div>
  );
}
