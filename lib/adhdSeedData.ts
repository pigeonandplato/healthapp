// ADHD-friendly knee + back progressive plan (3 × ~15 min WFH breaks)
// Phases: 1 (wk 1-4), 2 (wk 5-8), 3 (wk 9+). Knee block Mon/Wed/Fri only.

import { Exercise, ExerciseBlock, ExerciseMedia, Phase, ProgramPhase } from "./types";
import { exerciseMediaMap } from "./exerciseMedia";

const genericMedia = exerciseMediaMap["generic-exercise"];

function embedFromYoutubeInput(url: string): string {
  const u = url.trim();
  const shortsMatch = u.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}`;
  const vMatch = u.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (vMatch) return `https://www.youtube.com/embed/${vMatch[1]}`;
  const beMatch = u.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (beMatch) return `https://www.youtube.com/embed/${beMatch[1]}`;
  if (u.includes("/embed/")) return u;
  return u;
}

function adhdVideo(watchOrEmbedUrl: string, alt: string): ExerciseMedia {
  return { type: "video", videoUrl: embedFromYoutubeInput(watchOrEmbedUrl), alt };
}

function mediaFromKey(key: keyof typeof exerciseMediaMap): ExerciseMedia {
  return exerciseMediaMap[key] ?? genericMedia;
}

type AdhdExerciseDef = {
  id: string;
  name: string;
  sets?: number;
  reps?: number;
  holdSeconds?: number;
  minutes?: number;
  prescriptionDesc: string;
  notes: string[];
  media: ExerciseMedia;
  category: string;
};

function defToExercise(d: AdhdExerciseDef): Exercise {
  return {
    id: d.id,
    name: d.name,
    description: d.notes.join(" "),
    phase: Phase.PHASE_0,
    media: d.media,
    prescription: {
      sets: d.sets,
      reps: d.reps,
      holdSeconds: d.holdSeconds,
      minutes: d.minutes,
      description: d.prescriptionDesc,
    },
    instructions: d.notes,
    commonMistakes: ["Rushing reps", "Chasing range over control"],
    stopConditions: ["Pain 6+/10", "Symptoms worse the next day"],
    category: d.category,
  };
}

const V = {
  mcgillPlan: adhdVideo("https://www.youtube.com/watch?v=FmZwkgg7pqU", "McGill Big 3"),
  mcgillAlt: adhdVideo("https://www.youtube.com/watch?v=2aGunzN5YWA", "McGill alternate"),
  sidePlankKnees: adhdVideo("https://www.youtube.com/watch?v=FmZwkgg7pqU", "Side plank from knees"),
  birdDog: adhdVideo("https://www.youtube.com/watch?v=FmZwkgg7pqU", "Bird dog"),
  quadSets: mediaFromKey("quad-sets"),
  slr: adhdVideo("https://www.youtube.com/watch?v=j8Al01B3E6I", "Straight-leg raise"),
  sitToStand: mediaFromKey("eccentric-sit-to-stand"),
  wallSit: adhdVideo("https://www.youtube.com/watch?v=ywctoLY2RJE", "Wall sit"),
  walk: mediaFromKey("flat-walk"),
  stepUp: adhdVideo("https://www.youtube.com/watch?v=WCFCdxzFBa4", "Low step-up"),
  hipHingeWall: mediaFromKey("hip-hinge-drill"),
  stepDown: adhdVideo("https://www.youtube.com/watch?v=RgTKgtV1ltk", "Step-down"),
  boxSquat: adhdVideo("https://www.youtube.com/watch?v=gyqon2-RVEg", "Box squat to chair"),
  balance: adhdVideo("https://www.youtube.com/watch?v=UcT6Pk42Jtw", "Single-leg balance"),
  hamstringChair: adhdVideo("https://www.youtube.com/watch?v=9e3YjM17m1U", "Chair hamstring stretch"),
  slBoxSquat: adhdVideo("https://www.youtube.com/watch?v=gyqon2-RVEg", "Single-leg box squat"),
  hingeLift: mediaFromKey("single-leg-rdl"),
};

function break1Exercises(phase: ProgramPhase): AdhdExerciseDef[] {
  const maint = phase === "P3";
  return [
    {
      id: "adhd-b1-mcgill",
      name: "McGill Curl-Up",
      sets: maint ? 2 : 3,
      reps: 5,
      holdSeconds: 7,
      prescriptionDesc: maint ? "1–2×5 · 5–10s hold (maintenance OK)" : "3×5 · 5–10 sec hold each",
      notes: [
        "One knee bent, one straight.",
        "Hands under low back to keep natural curve.",
        "Lift head/shoulders slightly as one unit; do NOT crunch.",
        "Alternate video: McGill Big 3 overview in plan.",
      ],
      media: V.mcgillPlan,
      category: "Back Armor",
    },
    {
      id: "adhd-b1-side-plank",
      name: "Side Plank from Knees",
      sets: maint ? 2 : 3,
      holdSeconds: 10,
      prescriptionDesc: maint ? "1–2×10s each side" : "3×10 sec each side",
      notes: [
        "Elbow under shoulder.",
        "Lift hips; straight line head to knees.",
        "Short holds are fine.",
      ],
      media: V.sidePlankKnees,
      category: "Back Armor",
    },
    {
      id: "adhd-b1-bird-dog",
      name: "Bird Dog",
      sets: maint ? 2 : 3,
      reps: 5,
      holdSeconds: 7,
      prescriptionDesc: maint ? "1–2×5 each side · 5–10s hold" : "3×5 each side · 5–10 sec hold",
      notes: [
        "On hands/knees.",
        "Reach opposite arm and leg.",
        "Keep hips level; don't arch back.",
      ],
      media: V.birdDog,
      category: "Back Armor",
    },
  ];
}

function break2Exercises(phase: ProgramPhase): AdhdExerciseDef[] {
  if (phase === "P1") {
    return [
      {
        id: "adhd-p1-b2-quad-sets",
        name: "Quad Sets",
        sets: 2,
        reps: 10,
        holdSeconds: 5,
        prescriptionDesc: "2×10 · 5 sec hold",
        notes: ["Leg straight, tighten quad, press knee gently down."],
        media: V.quadSets,
        category: "Knee Strength",
      },
      {
        id: "adhd-p1-b2-slr",
        name: "Straight-Leg Raise",
        sets: 2,
        reps: 10,
        prescriptionDesc: "2×10",
        notes: ["Other knee bent, working leg straight.", "Tighten quad first, then lift."],
        media: V.slr,
        category: "Knee Strength",
      },
      {
        id: "adhd-p1-b2-sit-stand",
        name: "Sit-to-Stand",
        sets: 3,
        reps: 9,
        prescriptionDesc: "3×8–10",
        notes: [
          "Use a chair.",
          "Stand and sit slowly.",
          "Bias weight toward ACL leg if tolerated.",
        ],
        media: V.sitToStand,
        category: "Knee Strength",
      },
      {
        id: "adhd-p1-b2-wall-sit",
        name: "Wall Sit",
        sets: 2,
        holdSeconds: 25,
        prescriptionDesc: "2×20–30 sec",
        notes: ["Mini squat only.", "Knees track over mid-foot."],
        media: V.wallSit,
        category: "Knee Strength",
      },
    ];
  }
  if (phase === "P2") {
    return [
      {
        id: "adhd-p2-b2-step-down",
        name: "Forward Step-Downs",
        sets: 3,
        reps: 8,
        prescriptionDesc: "3×8 · 3–4 sec down",
        notes: [
          "ACL leg on low step.",
          "Slowly lower opposite heel to floor.",
        ],
        media: V.stepDown,
        category: "Knee Strength",
      },
      {
        id: "adhd-p2-b2-sit-stand",
        name: "Sit-to-Stand or Box Squat to Chair",
        sets: 3,
        reps: 9,
        prescriptionDesc: "3×8–10",
        notes: ["Comfortable depth only.", "Control on the way down."],
        media: V.boxSquat,
        category: "Knee Strength",
      },
      {
        id: "adhd-p2-b2-balance",
        name: "Single-Leg Balance",
        sets: 3,
        holdSeconds: 25,
        prescriptionDesc: "3×20–30 sec on ACL leg",
        notes: ["Hand on wall OK.", "Eyes open first; eyes closed only if safe."],
        media: V.balance,
        category: "Knee Strength",
      },
      {
        id: "adhd-p2-b2-wall-sit",
        name: "Wall Sit",
        sets: 2,
        holdSeconds: 37,
        prescriptionDesc: "2×30–45 sec",
        notes: ["Mini squat.", "Knees over mid-foot."],
        media: V.wallSit,
        category: "Knee Strength",
      },
    ];
  }
  return [
    {
      id: "adhd-p3-b2-sl-box-squat",
      name: "Single-Leg Box Squat to Chair",
      sets: 3,
      reps: 7,
      prescriptionDesc: "3×6–8",
      notes: ["ACL leg working.", "Use chair/box behind you for safety."],
      media: V.slBoxSquat,
      category: "Knee Strength",
    },
    {
      id: "adhd-p3-b2-step-down",
      name: "Step-Downs",
      sets: 3,
      reps: 9,
      prescriptionDesc: "3×8–10",
      notes: ["Eccentric control.", "Pain ≤3/10 only."],
      media: V.stepDown,
      category: "Knee Strength",
    },
    {
      id: "adhd-p3-b2-hinge-lift",
      name: "Hip Hinge with Light Object from Stool",
      sets: 2,
      reps: 7,
      prescriptionDesc: "2×6–8",
      notes: ["Neutral spine.", "Light load only.", "Hinge from hips, not back."],
      media: V.hingeLift,
      category: "Knee Strength",
    },
  ];
}

function break3Exercises(phase: ProgramPhase): AdhdExerciseDef[] {
  if (phase === "P1") {
    return [
      {
        id: "adhd-p1-b3-walk",
        name: "10-Minute Walk",
        minutes: 10,
        prescriptionDesc: "10 min easy walk",
        notes: [
          "Medicine for your back.",
          "Break up sitting every 20–30 min when possible.",
        ],
        media: V.walk,
        category: "Cardio",
      },
      {
        id: "adhd-p1-b3-step-up",
        name: "Step-Ups (Low Step)",
        sets: 2,
        reps: 8,
        prescriptionDesc: "2×8 each side",
        notes: [
          "Step up with ACL leg, stand tall, step down with control.",
        ],
        media: V.stepUp,
        category: "Control",
      },
      {
        id: "adhd-p1-b3-hip-hinge",
        name: "Hip Hinge to Wall",
        sets: 2,
        reps: 8,
        prescriptionDesc: "2×8",
        notes: [
          "Heels 6–8 inches from wall.",
          "Slight knee bend, push hips back to tap wall.",
          "No spinal rounding.",
        ],
        media: V.hipHingeWall,
        category: "Control",
      },
    ];
  }
  if (phase === "P2") {
    return [
      {
        id: "adhd-p2-b3-walk",
        name: "10-Minute Walk",
        minutes: 10,
        prescriptionDesc: "10 min easy walk",
        notes: ["Daily walk for back health."],
        media: V.walk,
        category: "Cardio",
      },
      {
        id: "adhd-p2-b3-hip-hinge",
        name: "Hip Hinge to Wall",
        sets: 3,
        reps: 9,
        prescriptionDesc: "3×8–10",
        notes: ["Heels near wall.", "Hinge from hips, neutral spine."],
        media: V.hipHingeWall,
        category: "Control",
      },
      {
        id: "adhd-p2-b3-hamstring",
        name: "Chair Hamstring Stretch",
        sets: 2,
        holdSeconds: 17,
        prescriptionDesc: "2×15–20 sec each side",
        notes: [
          "Sit tall, one heel out, hinge from hips.",
          "Skip if this flares back pain.",
        ],
        media: V.hamstringChair,
        category: "Mobility",
      },
    ];
  }
  return [
    {
      id: "adhd-p3-b3-walk",
      name: "10–15 Minute Walk",
      minutes: 12,
      prescriptionDesc: "10–15 min easy walk",
      notes: ["Daily walk."],
      media: V.walk,
      category: "Cardio",
    },
    {
      id: "adhd-p3-b3-balance",
      name: "Single-Leg Balance",
      sets: 3,
      holdSeconds: 30,
      prescriptionDesc: "3×30 sec on ACL leg",
      notes: ["Hand on wall OK."],
      media: V.balance,
      category: "Control",
    },
    {
      id: "adhd-p3-b3-mini-bend",
      name: "Optional Supported Mini Forward Bend",
      sets: 2,
      reps: 5,
      prescriptionDesc: "1–2×5 (optional)",
      notes: [
        "Hands on thighs, tiny range only.",
        "Only if it does NOT flare your back.",
      ],
      media: V.hipHingeWall,
      category: "Mobility",
    },
  ];
}

const guidanceBlock: ExerciseBlock = {
  id: "adhd-guidance",
  name: "📋 Plan Rules & ADHD Minimum Day",
  description: "Read once — use on overwhelmed days",
  estimatedMinutes: 2,
  exercises: [
    {
      id: "adhd-rules-pain",
      name: "Pain & Progress Rules",
      description: "When to push vs back off",
      phase: Phase.PHASE_0,
      media: genericMedia,
      prescription: { description: "Read (30 sec)" },
      instructions: [
        "Pain during exercise: 0–3/10 = okay; 4–5/10 = reduce range/reps; 6+/10 or worse next day = stop/regress.",
        "Goal is consistency, not hero workouts.",
        "Minimum-win: 1 set of each main move still counts.",
      ],
      commonMistakes: [],
      stopConditions: [],
      category: "Guidance",
    },
    {
      id: "adhd-minimum-day",
      name: "Minimum Version (Bad ADHD Days)",
      description: "You WIN the day if you do this",
      phase: Phase.PHASE_0,
      media: genericMedia,
      prescription: { description: "Minimum checklist" },
      instructions: [
        "McGill curl-up: 1 set",
        "Side plank: 1 set each side",
        "Bird dog: 1 set each side",
        "Sit-to-stand OR step-down: 1 set",
        "5-minute walk",
        "Never miss twice: after a miss, next day only needs this minimum.",
      ],
      commonMistakes: [],
      stopConditions: [],
      category: "Guidance",
    },
  ],
};

function blockFromDefs(
  id: string,
  name: string,
  description: string,
  defs: AdhdExerciseDef[]
): ExerciseBlock {
  return {
    id,
    name,
    description,
    estimatedMinutes: 15,
    exercises: defs.map((d) => JSON.parse(JSON.stringify(defToExercise(d))) as Exercise),
  };
}

export function adhdPhaseForWeek(week: number): ProgramPhase {
  if (week >= 9) return "P3";
  if (week >= 5) return "P2";
  return "P1";
}

export function getAdhdBlocksForWeekAndKneeDay(
  programWeek: number,
  includeKneeBlock: boolean
): ExerciseBlock[] {
  const week = Math.max(1, programWeek);
  const phase = adhdPhaseForWeek(week);
  const blocks: ExerciseBlock[] = [
    blockFromDefs(
      `adhd-wk${week}-break1`,
      "☀️ Break 1 — Back Armor (~10–15 min)",
      "Morning · daily · after coffee",
      break1Exercises(phase)
    ),
  ];

  if (includeKneeBlock) {
    blocks.push(
      blockFromDefs(
        `adhd-wk${week}-break2`,
        "🦵 Break 2 — Knee Strength (~10–15 min)",
        "Midday · Mon / Wed / Fri · after lunch",
        break2Exercises(phase)
      )
    );
  }

  blocks.push(
    blockFromDefs(
      `adhd-wk${week}-break3`,
      "🚶 Break 3 — Walk + Control (~10–15 min)",
      "Late afternoon · daily · before shutdown",
      break3Exercises(phase)
    ),
    JSON.parse(JSON.stringify(guidanceBlock)) as ExerciseBlock
  );

  return blocks;
}

export const ADHD_PROGRAM_ID = "adhd-knee-back-v1";

const allDefs: AdhdExerciseDef[] = [
  ...break1Exercises("P1"),
  ...break1Exercises("P3"),
  ...break2Exercises("P1"),
  ...break2Exercises("P2"),
  ...break2Exercises("P3"),
  ...break3Exercises("P1"),
  ...break3Exercises("P2"),
  ...break3Exercises("P3"),
];

const byId = new Map<string, Exercise>();
for (const d of allDefs) {
  if (!byId.has(d.id)) byId.set(d.id, defToExercise(d));
}
for (const ex of guidanceBlock.exercises) {
  byId.set(ex.id, ex);
}

export const allAdhdExercises = [...byId.values()];
