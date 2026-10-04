// Strong Muscles — 5-day weekly split (Mon–Fri).
// Upper / lower / cardio days come from the imported plan.
// Hip and ankle mobility (same video as Chacha flexibility) is added
// at the start of Monday, Wednesday, and Friday.

import type { Exercise, ExerciseBlock, ExerciseMedia } from "./types";
import plan from "./strongMusclesPlan.json";

export const STRONG_PROGRAM_ID = "strong-muscles-v1";

export type StrongDayRotation = "A" | "B" | "C" | "D" | "E";

/** Hip and ankle mobility flow used at the start of Mon / Wed / Fri, and in Tuesday's warm-up. */
export const HIP_MOBILITY_VIDEO_ID = "WUKHM6-ekJM";

const DEFAULT_STOP: string[] = [
  "Sharp or shooting pain in knee, back, or wrist",
  "Pain above 5/10 that lingers or worsens the next day",
  "Numbness, tingling, or loss of strength",
];

type PlanExercise = {
  id: string;
  name: string;
  sets?: number;
  reps?: number;
  holdSeconds?: number;
  minutes?: number;
  description?: string;
  videoUrl?: string;
};

type PlanBlock = {
  name: string;
  exercises: PlanExercise[];
};

type PlanDay = {
  day: StrongDayRotation;
  blocks: PlanBlock[];
};

function yt(videoId: string, alt: string): ExerciseMedia {
  return {
    type: "video",
    videoUrl: `https://www.youtube.com/embed/${videoId}`,
    alt,
  };
}

function youtubeId(url?: string): string | undefined {
  if (!url) return undefined;
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  return match?.[1];
}

function prescriptionText(ex: PlanExercise): string {
  const parts: string[] = [];
  if (ex.sets && ex.reps) parts.push(`${ex.sets} × ${ex.reps}`);
  else if (ex.sets && ex.holdSeconds) parts.push(`${ex.sets} × ${ex.holdSeconds}s`);
  else if (ex.minutes) parts.push(`${ex.minutes} min`);
  if (ex.description) parts.push(ex.description);
  return parts.join(" · ") || "As prescribed";
}

function hipMobilityExercise(id: string): Exercise {
  return {
    id,
    name: "Hip and ankle mobility",
    description: "Loosen hips/ankles so knees and back don't take all the load.",
    phase: 0,
    media: yt(HIP_MOBILITY_VIDEO_ID, "Hip and ankle mobility"),
    prescription: { description: "5–8 min flow" },
    instructions: [
      "Move slowly — no bouncing into end ranges.",
      "Hip circles, 90/90 switches, ankle pumps, and gentle calf stretches.",
      "Stop each drill before pain; mobility should feel like relief, not strain.",
      "Breathe steadily — don't hold your breath.",
    ],
    commonMistakes: [
      "Forcing deep stretches when tissues are cold",
      "Letting the low back round during hip stretches",
      "Rushing through — 5–8 min of quality beats 2 min of cranking",
    ],
    stopConditions: DEFAULT_STOP,
    category: "Mobility",
  };
}

function toExercise(ex: PlanExercise): Exercise {
  if (ex.name === "Hip and ankle mobility") {
    return hipMobilityExercise(`strong-${ex.id}`);
  }

  const videoId = youtubeId(ex.videoUrl);
  const instructions = ex.description
    ? ex.description
        .split(/(?<=\.)\s+/)
        .map((line) => line.trim())
        .filter(Boolean)
    : [`Perform ${ex.name} with control.`, "Keep pain at 0–3/10. Back off if it climbs."];

  return {
    id: `strong-${ex.id}`,
    name: ex.name,
    description: ex.description || ex.name,
    phase: 0,
    media: videoId
      ? yt(videoId, ex.name)
      : { type: "svg", alt: ex.name },
    prescription: {
      sets: ex.sets,
      reps: ex.reps,
      holdSeconds: ex.holdSeconds,
      minutes: ex.minutes,
      description: prescriptionText(ex),
    },
    instructions,
    commonMistakes: [
      "Rushing the reps instead of controlling the lowering",
      "Adding load before the movement feels stable",
    ],
    stopConditions: DEFAULT_STOP,
    category: ex.minutes && !ex.sets ? "Cardio" : "Strength",
  };
}

function estimateMinutes(exercises: Exercise[]): number {
  return exercises.reduce((sum, ex) => {
    if (ex.prescription.minutes) return sum + ex.prescription.minutes;
    if (ex.prescription.sets) return sum + ex.prescription.sets * 3;
    return sum + 6;
  }, 0);
}

function flexibilityBlock(day: StrongDayRotation): ExerciseBlock {
  const exercise = hipMobilityExercise(`strong-${day.toLowerCase()}-hip-mobility`);
  return {
    id: `strong-${day.toLowerCase()}-flexibility`,
    name: "Flexibility",
    description: "Hip and ankle mobility before the session",
    estimatedMinutes: 8,
    exercises: [exercise],
  };
}

/** Mon / Wed / Fri — the flexibility flow goes at the very start. */
const FLEXIBILITY_FIRST_DAYS = new Set<StrongDayRotation>(["A", "C", "E"]);

function buildDay(day: PlanDay): ExerciseBlock[] {
  const blocks: ExerciseBlock[] = day.blocks.map((block, index) => {
    const exercises = block.exercises.map(toExercise);
    return {
      id: `strong-${day.day.toLowerCase()}-block-${index}`,
      name: block.name,
      estimatedMinutes: estimateMinutes(exercises),
      exercises,
    };
  });

  if (!FLEXIBILITY_FIRST_DAYS.has(day.day)) return blocks;

  const withoutExistingMobility = blocks
    .map((block) => ({
      ...block,
      exercises: block.exercises.filter((ex) => ex.name !== "Hip and ankle mobility"),
    }))
    .filter((block) => block.exercises.length > 0)
    .map((block) => ({
      ...block,
      estimatedMinutes: estimateMinutes(block.exercises),
    }));

  return [flexibilityBlock(day.day), ...withoutExistingMobility];
}

const weekDays = (plan.weeks[0]?.days ?? []) as PlanDay[];

export const strongProgramBlocks: Record<StrongDayRotation, ExerciseBlock[]> = {
  A: buildDay(weekDays.find((d) => d.day === "A")!),
  B: buildDay(weekDays.find((d) => d.day === "B")!),
  C: buildDay(weekDays.find((d) => d.day === "C")!),
  D: buildDay(weekDays.find((d) => d.day === "D")!),
  E: buildDay(weekDays.find((d) => d.day === "E")!),
};

export const STRONG_DAY_LABELS: Record<StrongDayRotation, string> = {
  A: "Monday · Upper",
  B: "Tuesday · Lower",
  C: "Wednesday · Cardio + core",
  D: "Thursday · Upper",
  E: "Friday · Lower",
};

export function getStrongBlocksForDay(day: StrongDayRotation): ExerciseBlock[] {
  return JSON.parse(JSON.stringify(strongProgramBlocks[day])) as ExerciseBlock[];
}

export const allStrongExercises: Exercise[] = [];
Object.values(strongProgramBlocks).forEach((dayBlocks) => {
  dayBlocks.forEach((block) => {
    allStrongExercises.push(...block.exercises);
  });
});
