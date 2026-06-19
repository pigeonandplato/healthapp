// Chacha Training — 5-day weekly split (Mon–Fri)
// Knee/back-friendly strength program with video guides per exercise.

import { Exercise, ExerciseBlock, ExerciseMedia } from "./types";

export const CHACHA_PROGRAM_ID = "chacha-training-v1";

function yt(videoId: string, alt: string): ExerciseMedia {
  return {
    type: "video",
    videoUrl: `https://www.youtube.com/embed/${videoId}`,
    alt,
  };
}

function ex(
  id: string,
  name: string,
  tldr: string,
  videoId: string,
  category: string,
  prescription: Exercise["prescription"] = { sets: 3, reps: 10, description: "3 × 10 reps" }
): Exercise {
  return {
    id,
    name,
    description: tldr,
    phase: 0,
    media: yt(videoId, name),
    prescription,
    instructions: [tldr],
    commonMistakes: [],
    stopConditions: ["Sharp joint pain", "Pain above 5/10 that worsens next day"],
    category,
  };
}

// ── Monday: Legs ─────────────────────────────────────────────────────────────
const mondayBlocks: ExerciseBlock[] = [
  {
    id: "chacha-mon-legs",
    name: "🦵 Monday — Legs",
    description: "Hip/ankle mobility + knee-friendly leg strength",
    estimatedMinutes: 45,
    exercises: [
      ex("chacha-1", "Hip and ankle mobility", "Loosen hips/ankles so knees and back don't take all the load.", "R9S6uA4Y5V4", "Mobility", { description: "5–8 min flow" }),
      ex("chacha-2", "Box squat (bodyweight or light goblet)", "Controlled squat depth, less stress on knees and spine than heavy barbell squats.", "YybyS_IeQp4", "Legs"),
      ex("chacha-3", "Static split squat / supported lunge", "Builds single-leg strength while holding on so knees/ankles feel stable.", "3u6yV2L7pbg", "Legs", { sets: 3, reps: 8, description: "3 × 8 per leg" }),
      ex("chacha-4", "Dumbbell Romanian deadlift", "Trains hamstrings and glutes with a hip hinge, minimal knee bend, back kept neutral.", "9_pY7mG6eW4", "Legs"),
      ex("chacha-5", "Leg press (short range, moderate load)", "Load legs without heavy weight on your spine; limit knee depth.", "yZ8b9vH6w88", "Legs"),
      ex("chacha-6", "Lateral band walks", "Strengthens hip stabilizers to take pressure off knees and lower back.", "3_eX6qD73lY", "Legs", { sets: 3, reps: 12, description: "3 × 12 steps each direction" }),
      ex("chacha-7", "Standing or seated calf raises", "Builds calf strength for ankle stability with very low back stress.", "uD9HqXf8t9g", "Legs", { sets: 3, reps: 15, description: "3 × 15 reps" }),
    ],
  },
];

// ── Tuesday: Cardio / Grip / Core ───────────────────────────────────────────
const tuesdayBlocks: ExerciseBlock[] = [
  {
    id: "chacha-tue-cardio",
    name: "❤️ Cardio",
    description: "Low-impact conditioning",
    estimatedMinutes: 20,
    exercises: [
      ex("chacha-8", "Cross-trainer / elliptical", "Low-impact cardio that's easier on knees and ankles than running.", "vVjH2nK1WqQ", "Cardio", { minutes: 15, description: "15–20 min moderate pace" }),
    ],
  },
  {
    id: "chacha-tue-grip",
    name: "✊ Grip / hanging",
    description: "Grip strength + gentle spinal decompression",
    estimatedMinutes: 15,
    exercises: [
      ex("chacha-9", "Farmer carry (moderate dumbbells)", "Improves grip and core tension while walking upright, back stays neutral.", "p5M6L6f3hjg", "Grip", { sets: 3, description: "3 × 30–40 sec walk" }),
      ex("chacha-10", "Pinch holds", "Pure grip strength work without loading the spine or knees much.", "8XW6uO4x9_E", "Grip", { sets: 3, description: "3 × 20–30 sec holds" }),
      ex("chacha-11", "Supported dead hang (feet touching box)", "Gentle decompression for the spine with less strain than a full bodyweight hang.", "b4O6uO_3H5Y", "Grip", { sets: 3, description: "3 × 15–30 sec hangs" }),
    ],
  },
  {
    id: "chacha-tue-core",
    name: "🧱 Core",
    description: "Spine-friendly core stability",
    estimatedMinutes: 15,
    exercises: [
      ex("chacha-12", "Dead bug", "Core stability exercise that trains abs without bending the spine a lot.", "4XLEnwUr_V4", "Core", { sets: 3, reps: 8, description: "3 × 8 per side" }),
      ex("chacha-13", "Bird dog", "Teaches back and core to stay stable while arms/legs move, great for low-back control.", "wiF9KrmGAOg", "Core", { sets: 3, reps: 8, description: "3 × 8 per side" }),
      ex("chacha-14", "Side plank", "Builds side core strength without loaded twisting that could irritate the spine.", "K3HEn8V_9M4", "Core", { sets: 3, holdSeconds: 20, description: "3 × 20 sec each side" }),
      ex("chacha-15", "Front plank", "Simple full-core brace drill, no crunching so it's easier on the back.", "pSHjTRCQxIw", "Core", { sets: 3, holdSeconds: 30, description: "3 × 30 sec" }),
    ],
  },
];

// ── Wednesday: Chest ─────────────────────────────────────────────────────────
const wednesdayBlocks: ExerciseBlock[] = [
  {
    id: "chacha-wed-chest",
    name: "💪 Wednesday — Chest",
    description: "Joint-friendly chest pressing and flies",
    estimatedMinutes: 40,
    exercises: [
      ex("chacha-16", "Push-ups (hands elevated if needed)", "Chest and triceps work with a natural position for wrists and shoulders.", "Mo07RIm_Zfs", "Chest"),
      ex("chacha-17", "Flat bench press (barbell or dumbbell)", "Main chest strength move while lying supported, minimal stress on knees/ankles.", "rT7DgCr-3ps", "Chest"),
      ex("chacha-18", "Incline dumbbell press", "Hits upper chest and shoulders in a joint-friendly angle.", "8iPvZ69Y19A", "Chest"),
      ex("chacha-19", "Machine or cable chest press", "Back is supported so you can press without worrying about spine position.", "W79v21_M6hY", "Chest"),
      ex("chacha-20", "Chest fly (cable or light DB)", "Adds chest stretch and squeeze with light load so shoulders stay safe.", "eGjt4lk66zo", "Chest"),
      ex("chacha-21", "Optional assisted/band dips", "Extra chest/triceps work only if shoulders and back feel 100% okay.", "J32Ym7qXz3c", "Chest", { description: "Optional · 2 × 8–10 if feeling good" }),
    ],
  },
];

// ── Thursday: Back ─────────────────────────────────────────────────────────
const thursdayBlocks: ExerciseBlock[] = [
  {
    id: "chacha-thu-back",
    name: "🔙 Thursday — Back",
    description: "Supported pulling + glute work for spine health",
    estimatedMinutes: 45,
    exercises: [
      ex("chacha-22", "Cat-camel / light back mobility", "Gently moves the spine to reduce stiffness without loading it.", "CXD020DbeBM", "Mobility", { description: "5 min gentle flow" }),
      ex("chacha-23", "Lat pulldown (neutral or shoulder-width grip)", "Trains lats and upper back while seated and supported.", "CAwf7n6Luuc", "Back"),
      ex("chacha-24", "One-arm dumbbell row (bench-supported)", "Rowing strength with support so your low back doesn't work as hard as a stabilizer.", "pYcpY20QaFM", "Back", { sets: 3, reps: 10, description: "3 × 10 per arm" }),
      ex("chacha-25", "Chest-supported row", "Upper-back strength without loading the lower back at all.", "H75im9fA1G8", "Back"),
      ex("chacha-26", "Hip thrust or glute bridge", "Glute strength for hip and back support, very little knee or spine movement.", "LM8LGhm76N4", "Back/Glutes"),
      ex("chacha-27", "Superman / alternate Superman (small range, optional)", "Light lower-back endurance work; keep the range tiny to avoid irritation.", "z6PJMT2y8GQ", "Back", { description: "Optional · 2 × 8–10 small range" }),
      ex("chacha-28", "Shrugs", "Builds traps to help posture without stressing knees or ankles.", "MInyXw9w_zE", "Back"),
    ],
  },
];

// ── Friday: Arms & Shoulders ─────────────────────────────────────────────────
const fridayBlocks: ExerciseBlock[] = [
  {
    id: "chacha-fri-biceps",
    name: "💪 Biceps",
    description: "Wrist-friendly arm work",
    estimatedMinutes: 12,
    exercises: [
      ex("chacha-29", "Dumbbell curl", "Simple biceps work with neutral, controllable wrist position.", "ykJmrZ5v0M0", "Biceps"),
      ex("chacha-30", "Hammer curl", "Biceps and forearms with a neutral grip that's easier on the wrist.", "TwD-YGOY5kE", "Biceps"),
      ex("chacha-31", "Reverse curl", "Hits forearms and biceps; keep weight light for wrist comfort.", "4K9E_DclpYg", "Biceps"),
    ],
  },
  {
    id: "chacha-fri-shoulders",
    name: "🏋️ Shoulders",
    description: "Supported overhead and rear-delt work",
    estimatedMinutes: 15,
    exercises: [
      ex("chacha-32", "Seated DB or machine shoulder press (back supported)", "Overhead strength with back support so you don't arch and stress your spine.", "qEwKCR5JCog", "Shoulders"),
      ex("chacha-33", "Lateral raise", "Builds side delts with light weight and minimal joint loading.", "3VcKaXpzqRo", "Shoulders", { sets: 3, reps: 12, description: "3 × 12 reps" }),
      ex("chacha-34", "Face pull", "Great for upper-back and rear-shoulder posture, helps protect shoulders long-term.", "V8dZ39E_u38", "Shoulders", { sets: 3, reps: 15, description: "3 × 15 reps" }),
      ex("chacha-35", "Reverse fly (cable/band or incline bench)", "Targets rear delts and upper back without heavy spinal loading.", "KzL_n_zizv8", "Shoulders", { sets: 3, reps: 12, description: "3 × 12 reps" }),
    ],
  },
  {
    id: "chacha-fri-triceps",
    name: "🔱 Triceps",
    description: "Stable-elbow triceps isolation",
    estimatedMinutes: 12,
    exercises: [
      ex("chacha-36", "Cable pushdown", "Triceps work with very stable elbow/wrist position and no back stress.", "2-LAMcpzODU", "Triceps"),
      ex("chacha-37", "Overhead rope extension (light)", "Extra triceps work; keep load light and core tight to protect your back.", "ns-VnF9q9pM", "Triceps"),
      ex("chacha-38", "Kickbacks", "Isolation for triceps with small weights and controlled motion so joints stay happy.", "6SS6K3lAwWI", "Triceps", { sets: 3, reps: 12, description: "3 × 12 per arm" }),
    ],
  },
];

export type ChachaDayRotation = "A" | "B" | "C" | "D" | "E";

export const chachaProgramBlocks: Record<ChachaDayRotation, ExerciseBlock[]> = {
  A: mondayBlocks,
  B: tuesdayBlocks,
  C: wednesdayBlocks,
  D: thursdayBlocks,
  E: fridayBlocks,
};

export const CHACHA_DAY_LABELS: Record<ChachaDayRotation, string> = {
  A: "Monday · Legs",
  B: "Tuesday · Cardio / Grip / Core",
  C: "Wednesday · Chest",
  D: "Thursday · Back",
  E: "Friday · Arms & Shoulders",
};

export function getChachaBlocksForDay(day: ChachaDayRotation): ExerciseBlock[] {
  return JSON.parse(JSON.stringify(chachaProgramBlocks[day])) as ExerciseBlock[];
}

export const allChachaExercises: Exercise[] = [];
Object.values(chachaProgramBlocks).forEach((dayBlocks) => {
  dayBlocks.forEach((block) => {
    allChachaExercises.push(...block.exercises);
  });
});
