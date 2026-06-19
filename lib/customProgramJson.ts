import type { CustomProgramRow } from "./types";

/** Nested JSON shape — easiest for humans and AI to author. */
export type CustomProgramJsonDoc = {
  name?: string;
  weeks: Array<{
    week: number;
    days: Array<{
      day: "A" | "B" | "C" | string;
      blocks: Array<{
        name: string;
        exercises: Array<{
          id?: string;
          name: string;
          sets?: number;
          reps?: number;
          holdSeconds?: number;
          minutes?: number;
          description?: string;
          videoUrl?: string;
        }>;
      }>;
    }>;
  }>;
};

/** Flat JSON shape — also accepted. */
export type CustomProgramJsonFlat = {
  name?: string;
  exercises: CustomProgramRow[];
};

export type ParsedCustomProgram = {
  name?: string;
  rows: CustomProgramRow[];
};

export const CUSTOM_PROGRAM_JSON_TEMPLATE: CustomProgramJsonDoc = {
  name: "My 3-Day Program",
  weeks: [
    {
      week: 1,
      days: [
        {
          day: "A",
          blocks: [
            {
              name: "Warm-up",
              exercises: [
                {
                  id: "w1-a-jacks",
                  name: "Jumping Jacks",
                  sets: 1,
                  reps: 10,
                  description: "Light pulse to warm up",
                  videoUrl: "https://www.youtube.com/watch?v=UpH7rm0cYbM",
                },
              ],
            },
            {
              name: "Main",
              exercises: [
                { id: "w1-a-push", name: "Push-ups", sets: 3, reps: 10, videoUrl: "https://www.youtube.com/watch?v=IODxDxX7oi4" },
                { id: "w1-a-row", name: "Dumbbell row", sets: 3, reps: 12 },
              ],
            },
          ],
        },
        {
          day: "B",
          blocks: [
            {
              name: "Main",
              exercises: [{ id: "w1-b-squat", name: "Goblet squat", sets: 3, reps: 12 }],
            },
          ],
        },
        {
          day: "C",
          blocks: [
            {
              name: "Main",
              exercises: [{ id: "w1-c-rdl", name: "Romanian deadlift", sets: 3, reps: 10 }],
            },
          ],
        },
      ],
    },
  ],
};

export const CUSTOM_PROGRAM_AI_PROMPT = `Convert my workout program into JSON for the Health Tracker PWA custom program importer.

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
- For EVERY exercise, search YouTube (use web search / browsing if you have it) for a clear, reputable form-demonstration video that matches the exact exercise.
- Include "videoUrl" on each exercise: a full https://www.youtube.com/watch?v=... link, youtu.be link, or the 11-character video ID.
- Prefer trusted channels: ATHLEAN-X, Squat University, Scott Herman Fitness, Jeff Nippard, Calisthenic Movement, Bob & Brad, or official equipment demos.
- Match equipment in the video to the prescription (dumbbell vs barbell vs bodyweight).
- Pick the clearest coaching video, not a random clip or meme.
- If you cannot find a reliable video after searching, omit "videoUrl" for that exercise — do NOT invent or guess IDs.

Now convert this program:

[PASTE YOUR PROGRAM HERE]`;

function stripJsonFences(text: string): string {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)```$/i);
  if (fenceMatch) return fenceMatch[1].trim();
  return trimmed;
}

function normalizeDay(day: string): "A" | "B" | "C" {
  const d = String(day).trim().toUpperCase();
  if (d === "A" || d === "B" || d === "C") return d;
  throw new Error(`Invalid day "${day}" — use A (Monday), B (Wednesday), or C (Friday).`);
}

function nestedToRows(doc: CustomProgramJsonDoc): CustomProgramRow[] {
  if (!Array.isArray(doc.weeks) || doc.weeks.length === 0) {
    throw new Error('JSON must include a non-empty "weeks" array.');
  }

  const rows: CustomProgramRow[] = [];

  for (const w of doc.weeks) {
    const week = Number(w.week);
    if (!Number.isFinite(week) || week < 1) {
      throw new Error(`Invalid week number: ${w.week}`);
    }
    if (!Array.isArray(w.days)) continue;

    for (const d of w.days) {
      const day = normalizeDay(d.day);
      if (!Array.isArray(d.blocks)) continue;

      for (const block of d.blocks) {
        const blockName = String(block.name || "Workout").trim();
        if (!Array.isArray(block.exercises)) continue;

        for (const ex of block.exercises) {
          const exerciseName = String(ex.name || "").trim();
          if (!exerciseName) {
            throw new Error("Every exercise must have a name.");
          }

          rows.push({
            week,
            day,
            blockName,
            exerciseId: ex.id ? String(ex.id).trim() : "",
            exerciseName,
            sets: ex.sets != null ? Number(ex.sets) : undefined,
            reps: ex.reps != null ? Number(ex.reps) : undefined,
            holdSeconds: ex.holdSeconds != null ? Number(ex.holdSeconds) : undefined,
            minutes: ex.minutes != null ? Number(ex.minutes) : undefined,
            description: ex.description ? String(ex.description).trim() : undefined,
            videoUrl: ex.videoUrl ? String(ex.videoUrl).trim() : undefined,
          });
        }
      }
    }
  }

  return rows;
}

function flatToRows(doc: CustomProgramJsonFlat): CustomProgramRow[] {
  if (!Array.isArray(doc.exercises) || doc.exercises.length === 0) {
    throw new Error('JSON must include a non-empty "exercises" array.');
  }

  return doc.exercises.map((row, i) => {
    const exerciseName = String(row.exerciseName || "").trim();
    if (!exerciseName) throw new Error(`Row ${i + 1} is missing exerciseName.`);

    return {
      week: Number(row.week) || 1,
      day: normalizeDay(row.day || "A"),
      blockName: String(row.blockName || "Workout").trim(),
      exerciseId: row.exerciseId ? String(row.exerciseId).trim() : "",
      exerciseName,
      sets: row.sets != null ? Number(row.sets) : undefined,
      reps: row.reps != null ? Number(row.reps) : undefined,
      holdSeconds: row.holdSeconds != null ? Number(row.holdSeconds) : undefined,
      minutes: row.minutes != null ? Number(row.minutes) : undefined,
      description: row.description ? String(row.description).trim() : undefined,
      videoUrl: row.videoUrl ? String(row.videoUrl).trim() : undefined,
    };
  });
}

export function parseCustomProgramJson(text: string): ParsedCustomProgram {
  const cleaned = stripJsonFences(text);
  if (!cleaned) throw new Error("Paste or upload JSON to import a program.");

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("Invalid JSON — check for missing commas, quotes, or brackets.");
  }

  if (Array.isArray(parsed)) {
    return { rows: flatToRows({ exercises: parsed as CustomProgramRow[] }) };
  }

  if (parsed && typeof parsed === "object") {
    const obj = parsed as Record<string, unknown>;

    if (Array.isArray(obj.weeks)) {
      return {
        name: obj.name ? String(obj.name).trim() : undefined,
        rows: nestedToRows(obj as CustomProgramJsonDoc),
      };
    }

    if (Array.isArray(obj.exercises)) {
      return {
        name: obj.name ? String(obj.name).trim() : undefined,
        rows: flatToRows(obj as CustomProgramJsonFlat),
      };
    }
  }

  throw new Error('JSON must have a "weeks" array (nested) or "exercises" array (flat).');
}

export function formatTemplateJson(): string {
  return JSON.stringify(CUSTOM_PROGRAM_JSON_TEMPLATE, null, 2);
}
