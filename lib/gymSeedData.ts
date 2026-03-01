// Gym PPL (Push/Pull/Legs) Workout Program
// Day A: Chest (Push)
// Day B: Back + Biceps (Pull)
// Day C: Shoulders + Legs

import { Exercise, ExerciseBlock, ExerciseMedia } from "./types";

// Gym exercise media mappings (Google Drive images)
export const gymExerciseMediaMap: Record<string, ExerciseMedia> = {
  // Day A - Chest
  "gym-chest-press": {
    type: "image",
    src: "https://drive.google.com/uc?id=1rTXUQ8vJgzRMnAjYa8UTbQtm9L450U1V",
    alt: "Dumbbell Plain Chest Press",
  },
  "gym-chest-fly": {
    type: "image",
    src: "https://drive.google.com/uc?id=1AeLQIO4HGZsS5gkWCDGM61Dyv5wzBayE",
    alt: "Dumbbell Plain Fly",
  },
  "gym-decline-press": {
    type: "image",
    src: "https://drive.google.com/uc?id=17yANdDfdDIrlk4Tj_Dw5I7eEpDAHvVX_",
    alt: "Dumbbell Decline Press",
  },
  "gym-decline-fly": {
    type: "image",
    src: "https://drive.google.com/uc?id=1kN-kIkzh5zpjmUWH3daO1YmDcJziLizR",
    alt: "Dumbbell Decline Fly",
  },
  "gym-incline-press": {
    type: "image",
    src: "https://drive.google.com/uc?id=1xCEWpDHU4Tntd-PtlsmlF_a_Kct90HK1",
    alt: "Dumbbell Incline Chest Press",
  },
  "gym-incline-fly": {
    type: "image",
    src: "https://drive.google.com/uc?id=11WfE1GOICVDyoOjrsSFv5w7pLhAwjYDS",
    alt: "Dumbbell Incline Fly",
  },

  // Day B - Back + Biceps
  "gym-wide-pulldown": {
    type: "image",
    src: "https://drive.google.com/uc?id=1A7fav4FB9Bhx0ni12x4PgimpUY33_1qT",
    alt: "Wide Pull Down",
  },
  "gym-narrow-pulldown": {
    type: "image",
    src: "https://drive.google.com/uc?id=140bfEMfQiK9ibGceCN1fuvaDHFwzkdxD",
    alt: "Narrow Pull Down",
  },
  "gym-seated-row": {
    type: "image",
    src: "https://drive.google.com/uc?id=1dkzJb17OgScV3wFgcP6SF27cI4UvbDNh",
    alt: "Seated Cable Row",
  },
  "gym-incline-row": {
    type: "image",
    src: "https://drive.google.com/uc?id=159ggOCtKGDNl0phlafzen1o2d-fZoWPX",
    alt: "Dumbbell Inclined Row",
  },
  "gym-barbell-curl": {
    type: "image",
    src: "https://drive.google.com/uc?id=1juARGkM6MyUcedRbGjlTFMs6pTSfqu5v",
    alt: "Barbell Curl",
  },
  "gym-dumbbell-curl": {
    type: "image",
    src: "https://drive.google.com/uc?id=19CHCYdnY2kocdesSse0oh5xBxZv-Xvqg",
    alt: "Dumbbell Curl",
  },
  "gym-hammer-curl": {
    type: "image",
    src: "https://drive.google.com/uc?id=1tYoa4yz3sUL9vRpsT1Egih50Jp4cLHpr",
    alt: "Dumbbell Hammer Curl",
  },
  "gym-mixed-curl": {
    type: "image",
    src: "https://drive.google.com/uc?id=1ktplvFCvb2M31X_A_q3MYNfR3iwNbWqy",
    alt: "Dumbbell Mixed Curl",
  },

  // Day C - Shoulders + Legs
  "gym-db-overhead-press": {
    type: "image",
    src: "https://drive.google.com/uc?id=1H0rLGwzEaYu3dH-nJao_YDs7g7ajp2mr",
    alt: "Dumbbell Overhead Press",
  },
  "gym-bb-overhead-press": {
    type: "image",
    src: "https://drive.google.com/uc?id=1QShnKgVksffmFuHMQqw1qOotgYdkiPKV",
    alt: "Barbell Overhead Press",
  },
  "gym-shrugs": {
    type: "image",
    src: "https://drive.google.com/uc?id=14gLHFxSSxecRJORb41XLlVDwWSpnw5Hv",
    alt: "Shoulder Shrugs",
  },
  "gym-shoulder-fly": {
    type: "image",
    src: "https://drive.google.com/uc?id=1HBZAywjrNUGrLvjFIPCYRGCEOWSAVTdd",
    alt: "Dumbbell Shoulder Fly",
  },
  "gym-squats": {
    type: "image",
    src: "https://drive.google.com/uc?id=1HotV5Ex_H9sBa1Miea2coslwxz46JHCc",
    alt: "Squats with Dumbbell",
  },
  "gym-walking-lunges": {
    type: "image",
    src: "https://drive.google.com/uc?id=1RIKCIMinm7HF01byYtsCsMnfW8dZBV7C",
    alt: "Walking Lunges",
  },
  "gym-step-up": {
    type: "image",
    src: "https://drive.google.com/uc?id=1SimKDEpyjG13uNrp5M4fj6eQ_jrIBSDP",
    alt: "Step Up",
  },
  "gym-leg-extension": {
    type: "image",
    src: "https://drive.google.com/uc?id=1X72uo90YF-9Ke75jO4WE_zsLI7FHxPe4",
    alt: "Leg Extension",
  },
  "gym-leg-press": {
    type: "image",
    src: "https://drive.google.com/uc?id=1_Qpo1EVZQl_IfGfqWJqTQmap_KxWUPr6",
    alt: "Leg Press",
  },
};

// ==================== DAY A: CHEST (PUSH) ====================
const gymDayA: ExerciseBlock[] = [
  {
    id: "gym-a-chest",
    name: "💪 Chest Day (Push)",
    description: "Complete chest workout with presses and flies",
    estimatedMinutes: 25,
    exercises: [
      {
        id: "gym-exercise-1",
        name: "Dumbbell Plain Chest Press",
        description: "Flat bench dumbbell press for overall chest development",
        phase: 0,
        media: gymExerciseMediaMap["gym-chest-press"],
        prescription: { sets: 3, reps: 10, description: "3 × 10 reps" },
        instructions: [
          "Lie flat on bench with dumbbells at chest level",
          "Press up until arms are extended",
          "Lower with control back to starting position",
        ],
        commonMistakes: ["Bouncing weights", "Arching back excessively"],
        stopConditions: ["Shoulder pain", "Chest discomfort"],
        category: "Chest",
      },
      {
        id: "gym-exercise-2",
        name: "Dumbbell Plain Fly",
        description: "Flat bench fly for chest stretch and isolation",
        phase: 0,
        media: gymExerciseMediaMap["gym-chest-fly"],
        prescription: { sets: 3, reps: 10, description: "3 × 10 reps" },
        instructions: [
          "Lie flat with dumbbells above chest, palms facing",
          "Lower arms out to sides in arc motion",
          "Squeeze chest to bring weights back together",
        ],
        commonMistakes: ["Going too heavy", "Bending elbows too much"],
        stopConditions: ["Shoulder strain", "Sharp pain"],
        category: "Chest",
      },
      {
        id: "gym-exercise-3",
        name: "Dumbbell Decline Press",
        description: "Decline press targeting lower chest",
        phase: 0,
        media: gymExerciseMediaMap["gym-decline-press"],
        prescription: { sets: 3, reps: 10, description: "3 × 10 reps" },
        instructions: [
          "Set bench to decline position",
          "Press dumbbells up from chest",
          "Lower with control",
        ],
        commonMistakes: ["Too steep decline", "Rushing reps"],
        stopConditions: ["Dizziness", "Shoulder pain"],
        category: "Chest",
      },
      {
        id: "gym-exercise-4",
        name: "Dumbbell Decline Fly",
        description: "Decline fly for lower chest isolation",
        phase: 0,
        media: gymExerciseMediaMap["gym-decline-fly"],
        prescription: { sets: 3, reps: 10, description: "3 × 10 reps" },
        instructions: [
          "Set bench to decline position",
          "Open arms wide in arc motion",
          "Squeeze to bring weights together",
        ],
        commonMistakes: ["Going too deep", "Losing tension"],
        stopConditions: ["Shoulder discomfort"],
        category: "Chest",
      },
      {
        id: "gym-exercise-5",
        name: "Dumbbell Incline Chest Press",
        description: "Incline press targeting upper chest",
        phase: 0,
        media: gymExerciseMediaMap["gym-incline-press"],
        prescription: { sets: 3, reps: 10, description: "3 × 10 reps" },
        instructions: [
          "Set bench to 30-45 degree incline",
          "Press dumbbells up from upper chest",
          "Lower with control to starting position",
        ],
        commonMistakes: ["Incline too steep", "Flaring elbows"],
        stopConditions: ["Shoulder impingement"],
        category: "Chest",
      },
      {
        id: "gym-exercise-6",
        name: "Dumbbell Incline Fly",
        description: "Incline fly for upper chest development",
        phase: 0,
        media: gymExerciseMediaMap["gym-incline-fly"],
        prescription: { sets: 3, reps: 10, description: "3 × 10 reps" },
        instructions: [
          "Set bench to incline position",
          "Open arms in wide arc",
          "Squeeze upper chest to close",
        ],
        commonMistakes: ["Excessive weight", "Poor mind-muscle connection"],
        stopConditions: ["Front shoulder pain"],
        category: "Chest",
      },
    ],
  },
];

// ==================== DAY B: BACK + BICEPS (PULL) ====================
const gymDayB: ExerciseBlock[] = [
  {
    id: "gym-b-back",
    name: "🔙 Back Day",
    description: "Back exercises for width and thickness",
    estimatedMinutes: 20,
    exercises: [
      {
        id: "gym-exercise-7",
        name: "Wide Pull Down",
        description: "Lat pulldown with wide grip for back width",
        phase: 0,
        media: gymExerciseMediaMap["gym-wide-pulldown"],
        prescription: { sets: 3, reps: 10, description: "3 × 10 reps" },
        instructions: [
          "Grip bar wider than shoulder width",
          "Pull down to upper chest",
          "Control the return",
        ],
        commonMistakes: ["Leaning too far back", "Using momentum"],
        stopConditions: ["Shoulder pain", "Neck strain"],
        category: "Back",
      },
      {
        id: "gym-exercise-8",
        name: "Narrow Pull Down",
        description: "Close grip pulldown for back thickness",
        phase: 0,
        media: gymExerciseMediaMap["gym-narrow-pulldown"],
        prescription: { sets: 3, reps: 10, description: "3 × 10 reps" },
        instructions: [
          "Use close grip or V-bar attachment",
          "Pull down to upper chest",
          "Squeeze lats at bottom",
        ],
        commonMistakes: ["Pulling with arms only", "Short range of motion"],
        stopConditions: ["Elbow pain"],
        category: "Back",
      },
      {
        id: "gym-exercise-9",
        name: "Seated Cable Row",
        description: "Cable row for mid-back thickness",
        phase: 0,
        media: gymExerciseMediaMap["gym-seated-row"],
        prescription: { sets: 3, reps: 10, description: "3 × 10 reps" },
        instructions: [
          "Sit with feet on platform, knees slightly bent",
          "Pull handle to lower chest/upper abs",
          "Squeeze shoulder blades together",
        ],
        commonMistakes: ["Rounding lower back", "Excessive body swing"],
        stopConditions: ["Lower back pain"],
        category: "Back",
      },
      {
        id: "gym-exercise-10",
        name: "Dumbbell Inclined Row",
        description: "Chest-supported row for back isolation",
        phase: 0,
        media: gymExerciseMediaMap["gym-incline-row"],
        prescription: { sets: 3, reps: 10, description: "3 × 10 reps" },
        instructions: [
          "Lie face down on incline bench",
          "Row dumbbells up to sides",
          "Squeeze back at top",
        ],
        commonMistakes: ["Using too much weight", "Not retracting scapula"],
        stopConditions: ["Shoulder pain"],
        category: "Back",
      },
    ],
  },
  {
    id: "gym-b-biceps",
    name: "💪 Biceps",
    description: "Bicep exercises for arm development",
    estimatedMinutes: 15,
    exercises: [
      {
        id: "gym-exercise-11",
        name: "Barbell Curl",
        description: "Classic barbell curl for bicep mass",
        phase: 0,
        media: gymExerciseMediaMap["gym-barbell-curl"],
        prescription: { sets: 3, reps: 10, description: "3 × 10 reps" },
        instructions: [
          "Stand with barbell, shoulder-width grip",
          "Curl weight up keeping elbows fixed",
          "Lower with control",
        ],
        commonMistakes: ["Swinging body", "Moving elbows"],
        stopConditions: ["Wrist pain", "Elbow pain"],
        category: "Biceps",
      },
      {
        id: "gym-exercise-12",
        name: "Dumbbell Curl",
        description: "Alternating dumbbell curls",
        phase: 0,
        media: gymExerciseMediaMap["gym-dumbbell-curl"],
        prescription: { sets: 3, reps: 10, description: "3 × 10 reps per arm" },
        instructions: [
          "Stand with dumbbells at sides",
          "Curl one arm up, supinating wrist",
          "Alternate arms",
        ],
        commonMistakes: ["Rushing", "Not fully extending"],
        stopConditions: ["Elbow discomfort"],
        category: "Biceps",
      },
      {
        id: "gym-exercise-13",
        name: "Dumbbell Hammer Curl",
        description: "Hammer curls for brachialis and forearms",
        phase: 0,
        media: gymExerciseMediaMap["gym-hammer-curl"],
        prescription: { sets: 3, reps: 10, description: "3 × 10 reps" },
        instructions: [
          "Hold dumbbells with neutral grip (palms facing)",
          "Curl up keeping wrists neutral",
          "Lower with control",
        ],
        commonMistakes: ["Rotating wrists", "Swinging"],
        stopConditions: ["Forearm pain"],
        category: "Biceps",
      },
      {
        id: "gym-exercise-14",
        name: "Dumbbell Mixed Curl",
        description: "Combination curl for bicep variation",
        phase: 0,
        media: gymExerciseMediaMap["gym-mixed-curl"],
        prescription: { sets: 3, reps: 10, description: "3 × 10 reps" },
        instructions: [
          "Alternate between supinated and hammer grip",
          "Focus on contraction at top",
          "Full range of motion",
        ],
        commonMistakes: ["Inconsistent form", "Going too fast"],
        stopConditions: ["Wrist strain"],
        category: "Biceps",
      },
    ],
  },
];

// ==================== DAY C: SHOULDERS + LEGS ====================
const gymDayC: ExerciseBlock[] = [
  {
    id: "gym-c-shoulders",
    name: "🎯 Shoulders",
    description: "Shoulder exercises for deltoid development",
    estimatedMinutes: 15,
    exercises: [
      {
        id: "gym-exercise-15",
        name: "Dumbbell Overhead Press",
        description: "Seated or standing dumbbell press",
        phase: 0,
        media: gymExerciseMediaMap["gym-db-overhead-press"],
        prescription: { sets: 3, reps: 10, description: "3 × 10 reps" },
        instructions: [
          "Start with dumbbells at shoulder level",
          "Press overhead until arms extended",
          "Lower with control",
        ],
        commonMistakes: ["Arching back", "Locking out aggressively"],
        stopConditions: ["Shoulder impingement", "Neck strain"],
        category: "Shoulders",
      },
      {
        id: "gym-exercise-16",
        name: "Barbell Overhead Press",
        description: "Standing barbell press for shoulder strength",
        phase: 0,
        media: gymExerciseMediaMap["gym-bb-overhead-press"],
        prescription: { sets: 3, reps: 10, description: "3 × 10 reps" },
        instructions: [
          "Start with bar at collarbone level",
          "Press bar overhead",
          "Keep core tight throughout",
        ],
        commonMistakes: ["Leaning back too much", "Flaring ribs"],
        stopConditions: ["Lower back pain", "Shoulder pain"],
        category: "Shoulders",
      },
      {
        id: "gym-exercise-17",
        name: "Shoulder Shrugs",
        description: "Dumbbell or barbell shrugs for traps",
        phase: 0,
        media: gymExerciseMediaMap["gym-shrugs"],
        prescription: { sets: 3, reps: 12, description: "3 × 12 reps" },
        instructions: [
          "Hold weights at sides",
          "Shrug shoulders up toward ears",
          "Hold briefly at top, lower slowly",
        ],
        commonMistakes: ["Rolling shoulders", "Using too much weight"],
        stopConditions: ["Neck strain"],
        category: "Shoulders",
      },
      {
        id: "gym-exercise-18",
        name: "Dumbbell Shoulder Fly",
        description: "Lateral raises for side delts",
        phase: 0,
        media: gymExerciseMediaMap["gym-shoulder-fly"],
        prescription: { sets: 3, reps: 12, description: "3 × 12 reps" },
        instructions: [
          "Stand with dumbbells at sides",
          "Raise arms out to sides until shoulder height",
          "Lower with control",
        ],
        commonMistakes: ["Swinging weights", "Going too high"],
        stopConditions: ["Shoulder impingement"],
        category: "Shoulders",
      },
    ],
  },
  {
    id: "gym-c-legs",
    name: "🦵 Legs",
    description: "Lower body exercises for leg development",
    estimatedMinutes: 25,
    exercises: [
      {
        id: "gym-exercise-19",
        name: "Squats - Dumbbell",
        description: "Goblet or dumbbell squats for quads and glutes",
        phase: 0,
        media: gymExerciseMediaMap["gym-squats"],
        prescription: { sets: 3, reps: 12, description: "3 × 12 reps" },
        instructions: [
          "Hold dumbbell at chest or at sides",
          "Squat down keeping chest up",
          "Drive through heels to stand",
        ],
        commonMistakes: ["Knees caving in", "Rising on toes"],
        stopConditions: ["Knee pain", "Lower back pain"],
        category: "Legs",
      },
      {
        id: "gym-exercise-20",
        name: "Walking Lunges",
        description: "Dynamic lunges for legs and balance",
        phase: 0,
        media: gymExerciseMediaMap["gym-walking-lunges"],
        prescription: { sets: 3, reps: 12, description: "3 × 12 steps per leg" },
        instructions: [
          "Step forward into lunge position",
          "Lower back knee toward ground",
          "Push off and step forward with other leg",
        ],
        commonMistakes: ["Short steps", "Knee going past toes"],
        stopConditions: ["Knee instability", "Balance issues"],
        category: "Legs",
      },
      {
        id: "gym-exercise-21",
        name: "Step Up",
        description: "Step ups for unilateral leg strength",
        phase: 0,
        media: gymExerciseMediaMap["gym-step-up"],
        prescription: { sets: 3, reps: 12, description: "3 × 12 per leg" },
        instructions: [
          "Step up onto platform with one leg",
          "Drive through heel to stand",
          "Step down with control",
        ],
        commonMistakes: ["Pushing off back foot", "Leaning forward"],
        stopConditions: ["Knee pain"],
        category: "Legs",
      },
      {
        id: "gym-exercise-22",
        name: "Leg Extension",
        description: "Machine leg extension for quad isolation",
        phase: 0,
        media: gymExerciseMediaMap["gym-leg-extension"],
        prescription: { sets: 3, reps: 12, description: "3 × 12 reps" },
        instructions: [
          "Sit in machine with pad on lower shins",
          "Extend legs until straight",
          "Lower with control",
        ],
        commonMistakes: ["Swinging weight", "Locking knees hard"],
        stopConditions: ["Knee cap pain"],
        category: "Legs",
      },
      {
        id: "gym-exercise-23",
        name: "Leg Press",
        description: "Machine leg press for overall leg development",
        phase: 0,
        media: gymExerciseMediaMap["gym-leg-press"],
        prescription: { sets: 3, reps: 12, description: "3 × 12 reps" },
        instructions: [
          "Sit in machine with feet shoulder-width on platform",
          "Lower weight by bending knees",
          "Press back up without locking knees",
        ],
        commonMistakes: ["Lowering too far", "Locking knees at top"],
        stopConditions: ["Lower back lifting off pad", "Knee pain"],
        category: "Legs",
      },
    ],
  },
];

// ==================== EXPORT STRUCTURE ====================
export type GymDayRotation = "A" | "B" | "C";

export const gymProgramBlocks: Record<GymDayRotation, ExerciseBlock[]> = {
  A: gymDayA,
  B: gymDayB,
  C: gymDayC,
};

export function getGymBlocksForDay(day: GymDayRotation): ExerciseBlock[] {
  return JSON.parse(JSON.stringify(gymProgramBlocks[day])) as ExerciseBlock[];
}

export const allGymExercises: Exercise[] = [];
Object.values(gymProgramBlocks).forEach((dayBlocks) => {
  dayBlocks.forEach((block) => {
    allGymExercises.push(...block.exercises);
  });
});

export const GYM_PROGRAM_ID = "gym-ppl-v1";
