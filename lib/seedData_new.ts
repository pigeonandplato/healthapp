// 24-Week Program for 5K Running Goal
// Addresses: L4-L5 disc + old ACL knee + ulnar nerve (hand) + aerobic base
// Progressive phases P1-P5 with A/B/C day rotation

import { Exercise, ExerciseBlock, Phase, ProgramPhase, DayRotation } from "./types";
import { exerciseMediaMap } from "./exerciseMedia";

// ==================== DAILY HIP MAINTENANCE (ALL PHASES, EVERY DAY) ====================

const dailyHipBlock: ExerciseBlock = {
  id: "daily-hip",
  name: "🔥 Daily Hip Maintenance (EVERY DAY)",
  description: "Deep glute/piriformis work for L4-L5 health - non-negotiable!",
  estimatedMinutes: 12,
  exercises: [
    {
      id: "piriformis-90-90",
      name: "90/90 Hip Stretch",
      description: "Deep piriformis and posterior hip stretch",
      phase: Phase.PHASE_0,
      media: exerciseMediaMap["piriformis-stretch-90-90"] || exerciseMediaMap["figure-4-stretch"],
      prescription: { sets: 2, holdSeconds: 60, description: "2 × 60s per side" },
      instructions: [
        "Sit with both legs bent 90°, front shin parallel to body",
        "Keep back tall, lean forward over front leg",
        "Feel deep stretch in glute/hip",
      ],
      commonMistakes: ["Rounding back", "Forcing too hard"],
      stopConditions: ["Sharp hip/knee pain", "Pinching in front of hip"],
      category: "Hip Maintenance",
    },
    {
      id: "figure-4-daily",
      name: "Figure-4 Stretch",
      description: "Supine deep glute stretch",
      phase: Phase.PHASE_0,
      media: exerciseMediaMap["figure-4-stretch"],
      prescription: { sets: 2, holdSeconds: 60, description: "2 × 60s per side" },
      instructions: [
        "Lie on back, cross ankle over opposite thigh",
        "Pull supporting leg toward chest",
        "Keep crossed foot flexed",
      ],
      commonMistakes: ["Pulling too hard", "Lifting shoulders"],
      stopConditions: ["Sharp pain", "Increased symptoms"],
      category: "Hip Maintenance",
    },
    {
      id: "glute-massage-daily",
      name: "Lacrosse Ball Glute Massage",
      description: "Self-myofascial release for deep glutes",
      phase: Phase.PHASE_0,
      media: exerciseMediaMap["deep-glute-massage"] || exerciseMediaMap["figure-4-stretch"],
      prescription: { minutes: 6, description: "3 min per side" },
      instructions: [
        "Sit on ball positioned on outer/back glute",
        "Cross ankle over opposite knee",
        "Find tender spots, hold 30-60s",
        "Breathe and let tissue release",
      ],
      commonMistakes: ["Too much pressure", "On bone instead of muscle"],
      stopConditions: ["Shooting pain down leg", "Increased numbness"],
      category: "Hip Maintenance",
    },
    {
      id: "childs-pose-daily",
      name: "Child's Pose + Hip Circles",
      description: "Restorative with gentle mobilization",
      phase: Phase.PHASE_0,
      media: exerciseMediaMap["childs-pose"],
      prescription: { minutes: 2, description: "2 min with circles" },
      instructions: [
        "Knees wide, sit back toward heels",
        "Gentle circles with hips 5 each direction",
        "Then rest and breathe",
      ],
      commonMistakes: ["Forcing hips to heels", "Shallow breathing"],
      stopConditions: ["Knee pain", "Difficulty breathing"],
      category: "Hip Maintenance",
    },
  ],
};

// ==================== ULNAR NERVE CARE (ALL PHASES, DAILY) ====================

const ulnarNerveCare: Exercise = {
  id: "ulnar-nerve-glide",
  name: "Ulnar Nerve Glide (Gentle)",
  description: "For burning behind pinky from mouse use",
  phase: Phase.PHASE_0,
  media: exerciseMediaMap["ulnar-nerve-glide"],
  prescription: { sets: 2, reps: 10, description: "2 × 10 gentle glides" },
  instructions: [
    "Arm to side at shoulder height",
    "Slowly tilt head away, then flex wrist/fingers",
    "Should feel mild stretch only",
    "Stop if symptoms increase",
  ],
  commonMistakes: ["Moving too aggressively", "Pushing into pain"],
  stopConditions: ["Increasing tingling", "Sharp pain", "Symptoms >5min after"],
  category: "Hand Care",
};

// ==================== PHASE 1 (Weeks 1-4): Foundation ====================

const p1_dayA: ExerciseBlock[] = [
  dailyHipBlock,
  {
    id: "p1-a-core",
    name: "Core Endurance (McGill-style)",
    description: "Spine-sparing core for disc protection",
    estimatedMinutes: 12,
    exercises: [
      {
        id: "p1-bird-dog",
        name: "Bird-Dog",
        description: "Core stability + hip extension control",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["dead-bug"], // placeholder
        prescription: { sets: 3, reps: 8, holdSeconds: 5, description: "3 × 8/side, 5s holds" },
        instructions: ["On hands/knees", "Extend opposite arm + leg", "Keep back neutral"],
        commonMistakes: ["Arching back", "Moving too fast"],
        stopConditions: ["Back pain increasing", "Unable to keep neutral spine"],
        category: "Core",
      },
      {
        id: "p1-side-plank-short",
        name: "Short-Lever Side Plank",
        description: "Lateral core stability",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["side-plank"],
        prescription: { sets: 3, holdSeconds: 15, description: "3 × 15s per side" },
        instructions: ["On side, knees bent 90°", "Lift hips, form straight line"],
        commonMistakes: ["Hips sagging", "Holding breath"],
        stopConditions: ["Sharp back/shoulder pain"],
        category: "Core",
      },
    ],
  },
  {
    id: "p1-a-cardio",
    name: "Aerobic Base (NO RUNNING)",
    description: "Build fitness without knee/back aggravation",
    estimatedMinutes: 30,
    exercises: [
      {
        id: "p1-elliptical",
        name: "Elliptical or Peloton",
        description: "Low-impact cardio",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["peloton"],
        prescription: { minutes: 30, description: "30 min easy pace" },
        instructions: ["Keep pace conversational", "Smooth motion", "No pain >3/10"],
        commonMistakes: ["Going too hard too soon"],
        stopConditions: ["Knee/back pain >3/10", "Next-day flare"],
        category: "Cardio",
      },
    ],
  },
];

const p1_dayB: ExerciseBlock[] = [
  dailyHipBlock,
  {
    id: "p1-b-knee",
    name: "Knee Capacity Building",
    description: "Quad/glute work without running impact",
    estimatedMinutes: 15,
    exercises: [
      {
        id: "p1-glute-bridge",
        name: "Glute Bridge (Slow)",
        description: "Hip extension for glutes + back protection",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["glute-bridges"],
        prescription: { sets: 3, reps: 12, description: "3 × 12, slow tempo" },
        instructions: ["Feet hip-width", "Squeeze glutes at top 2s", "Lower slow"],
        commonMistakes: ["Arching back excessively", "Using back not glutes"],
        stopConditions: ["Back pain", "Hamstring cramping"],
        category: "Lower Body",
      },
      {
        id: "p1-step-up-low",
        name: "Step-Up (Low Step)",
        description: "Knee-friendly quad strengthening",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["sit-to-stand"],
        prescription: { sets: 3, reps: 8, description: "3 × 8 per leg, 4-6 inch step" },
        instructions: ["Use low step", "Push through heel", "Control down slowly"],
        commonMistakes: ["Step too high too soon", "Knee caving in"],
        stopConditions: ["Knee pain >3/10", "Giving-way feeling"],
        category: "Lower Body",
      },
      {
        id: "p1-calf-raise",
        name: "Calf Raises (Slow Eccentric)",
        description: "Prepare calves for eventual running",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["wall-ankle-mobility"], // placeholder
        prescription: { sets: 2, reps: 15, description: "2 × 15, 3s lowering" },
        instructions: ["Double-leg", "Slow 3-second lower"],
        commonMistakes: ["Bouncing", "Too fast"],
        stopConditions: ["Achilles pain"],
        category: "Lower Body",
      },
    ],
  },
  {
    id: "p1-b-hand",
    name: "Hand/Nerve Care",
    description: "Address ulnar nerve irritation",
    estimatedMinutes: 5,
    exercises: [ulnarNerveCare],
  },
];

const p1_dayC: ExerciseBlock[] = [
  dailyHipBlock,
  {
    id: "p1-c-mobility",
    name: "Movement Prep",
    description: "Hinge pattern + ankle mobility",
    estimatedMinutes: 12,
    exercises: [
      {
        id: "p1-hip-hinge",
        name: "Hip Hinge Drill (Dowel)",
        description: "Learn neutral spine hinge for later deadlifts",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["half-kneeling-hip-flexor"], // placeholder
        prescription: { sets: 3, reps: 10, description: "3 × 10 with dowel on back" },
        instructions: ["Dowel touches head/mid-back/tailbone", "Hinge at hips", "Knees soft"],
        commonMistakes: ["Rounding back", "Squatting instead of hinging"],
        stopConditions: ["Back pain"],
        category: "Mobility",
      },
      {
        id: "p1-ankle-mobility",
        name: "Wall Ankle Rocks",
        description: "Dorsiflexion for eventual running",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["wall-ankle-mobility"],
        prescription: { sets: 2, reps: 10, description: "2 × 10 per leg" },
        instructions: ["Knee to wall, heel down"],
        commonMistakes: ["Heel lifting"],
        stopConditions: ["Ankle pinching"],
        category: "Mobility",
      },
    ],
  },
  {
    id: "p1-c-walk",
    name: "Easy Walk",
    description: "Active recovery cardio",
    estimatedMinutes: 25,
    exercises: [
      {
        id: "p1-walk",
        name: "Flat Walk (Easy)",
        description: "Build aerobic base",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["flat-walk"],
        prescription: { minutes: 25, description: "25 min comfortable pace" },
        instructions: ["Conversational pace", "Upright posture"],
        commonMistakes: ["Too fast"],
        stopConditions: ["Pain that worsens"],
        category: "Cardio",
      },
    ],
  },
];

// ==================== EXPORT STRUCTURE ====================

export const programBlocks: Record<ProgramPhase, Record<DayRotation, ExerciseBlock[]>> = {
  P1: { A: p1_dayA, B: p1_dayB, C: p1_dayC },
  P2: { A: p1_dayA, B: p1_dayB, C: p1_dayC }, // TODO: Add P2-P5 variations
  P3: { A: p1_dayA, B: p1_dayB, C: p1_dayC },
  P4: { A: p1_dayA, B: p1_dayB, C: p1_dayC },
  P5: { A: p1_dayA, B: p1_dayB, C: p1_dayC },
};

export const allExercises: Exercise[] = [];
Object.values(programBlocks).forEach((phaseBlocks) => {
  Object.values(phaseBlocks).forEach((dayBlocks) => {
    dayBlocks.forEach((block) => {
      allExercises.push(...block.exercises);
    });
  });
});

// Legacy export for compatibility
export const phase0Blocks = programBlocks.P1;
export const allBlocks: any = { [Phase.PHASE_0]: programBlocks.P1 };



