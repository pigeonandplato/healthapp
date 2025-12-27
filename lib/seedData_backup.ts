// Seed data with 3-Day Rotation (A/B/C) + Daily Hip Maintenance
// Designed to spread workouts across 3 days while maintaining daily hip health

import { Exercise, ExerciseBlock, Phase } from "./types";
import { exerciseMediaMap } from "./exerciseMedia";

// ==================== DAILY HIP MAINTENANCE (EVERY DAY) ====================
// Specific exercises for deep glute/piriformis tightness - done EVERY day

const piriformisStretch90_90: Exercise = {
  id: "piriformis-stretch-90-90",
  name: "90/90 Hip Stretch (Deep Piriformis)",
  description: "Advanced seated stretch targeting piriformis and deep glute rotators",
  phase: Phase.PHASE_0,
  media: exerciseMediaMap["piriformis-stretch-90-90"],
  prescription: {
    sets: 2,
    holdSeconds: 60,
    description: "2 sets × 60-second holds per side",
  },
  instructions: [
    "Sit on floor with both legs bent at 90 degrees",
    "Front leg: Shin parallel to body, knee pointing forward",
    "Back leg: Shin pointing behind you",
    "Keep back straight and tall",
    "Lean forward over front leg, feeling deep stretch in glute",
    "You should feel it deep in buttock and hip",
    "Breathe deeply and relax into the stretch",
    "Switch legs after 60 seconds",
  ],
  commonMistakes: [
    "Rounding back instead of hinging at hips",
    "Forcing the stretch too aggressively",
    "Not keeping front shin parallel to body",
    "Holding breath",
  ],
  stopConditions: [
    "Sharp pain in hip or knee",
    "Pinching sensation in front of hip",
    "Pain that increases during stretch",
  ],
  category: "Daily Hip Maintenance",
};

const figure4Stretch: Exercise = {
  id: "figure-4-stretch",
  name: "Figure-4 Glute Stretch (Supine)",
  description: "Supine piriformis and deep glute stretch",
  phase: Phase.PHASE_0,
  media: exerciseMediaMap["figure-4-stretch"],
  prescription: {
    sets: 2,
    holdSeconds: 60,
    description: "2 sets × 60-second holds per side",
  },
  instructions: [
    "Lie on your back with both knees bent",
    "Cross right ankle over left thigh (figure-4 position)",
    "Thread hands through and clasp behind left thigh",
    "Gently pull left leg toward chest",
    "Keep right foot flexed to protect knee",
    "You should feel deep stretch in right glute/piriformis",
    "Relax shoulders and breathe deeply",
    "Switch sides after 60 seconds",
  ],
  commonMistakes: [
    "Pulling too aggressively",
    "Lifting head or shoulders off ground",
    "Allowing crossed foot to go limp",
    "Not breathing deeply",
  ],
  stopConditions: [
    "Sharp pain in hip or knee",
    "Pinching in hip joint",
    "Pain that worsens during stretch",
  ],
  category: "Daily Hip Maintenance",
};

const deepGluteMassage: Exercise = {
  id: "deep-glute-massage",
  name: "Deep Glute Self-Massage (Lacrosse Ball)",
  description: "Self-myofascial release for deep glutes, piriformis, and hip rotators",
  phase: Phase.PHASE_0,
  media: exerciseMediaMap["deep-glute-massage"],
  prescription: {
    minutes: 3,
    description: "3 minutes per side (6 minutes total)",
  },
  instructions: [
    "Sit on firm surface with lacrosse ball under one glute",
    "Position ball on outer/back part of buttock (piriformis area)",
    "Cross ankle of side you're working over opposite knee",
    "Lean into the ball, controlling pressure with hands behind you",
    "Find tender spots and hold for 30-60 seconds",
    "Breathe deeply and allow muscle to release",
    "Slowly roll to find other tight spots",
    "Spend 3 minutes on each side",
  ],
  commonMistakes: [
    "Using too much pressure (should be 6-7/10 discomfort)",
    "Rolling too quickly without holding pressure points",
    "Positioning ball on tailbone or bones (should be on muscle)",
    "Holding breath or tensing up",
  ],
  stopConditions: [
    "Sharp, shooting pain down leg (nerve irritation)",
    "Increased numbness or tingling",
    "Pain that doesn't decrease with breathing",
  ],
  category: "Daily Hip Maintenance",
};

const childsPose: Exercise = {
  id: "childs-pose",
  name: "Child's Pose with Hip Circles",
  description: "Restorative pose with gentle hip mobilization",
  phase: Phase.PHASE_0,
  media: exerciseMediaMap["childs-pose"],
  prescription: {
    minutes: 2,
    description: "2 minutes with gentle hip circles",
  },
  instructions: [
    "Kneel with knees wide, big toes touching",
    "Sit hips back toward heels",
    "Walk hands forward and lower torso between thighs",
    "Rest forehead on ground (use pillow if needed)",
    "Make slow, gentle circles with hips",
    "5 circles in each direction",
    "Then rest and breathe deeply for remaining time",
    "Focus on relaxation and letting go of tension",
  ],
  commonMistakes: [
    "Forcing hips to heels if too tight",
    "Holding tension in shoulders",
    "Making circles too large or aggressive",
    "Shallow breathing",
  ],
  stopConditions: [
    "Knee pain that doesn't resolve with adjustment",
    "Hip pain in the position",
    "Difficulty breathing",
  ],
  category: "Daily Hip Maintenance",
};

const dailyHipBlock: ExerciseBlock = {
  id: "daily-hip-maintenance",
  name: "🔥 Daily Hip Maintenance (DO EVERY DAY)",
  description: "Essential deep glute/piriformis work for L4-L5 health and sitting recovery",
  estimatedMinutes: 12,
  exercises: [piriformisStretch90_90, figure4Stretch, deepGluteMassage, childsPose],
};

// ==================== DAY A: LOWER BODY FOCUS ====================

const diaphragmaticBreathing: Exercise = {
  id: "diaphragmatic-breathing",
  name: "Diaphragmatic Breathing",
  description: "Foundational breathing to activate diaphragm and reduce stress",
  phase: Phase.PHASE_0,
  media: exerciseMediaMap["diaphragmatic-breathing"],
  prescription: {
    sets: 2,
    reps: 10,
    description: "2 sets × 10 breaths",
  },
  instructions: [
    "Lie on back with knees bent, feet flat",
    "One hand on chest, one on belly",
    "Breathe in through nose for 4 counts - belly rises",
    "Chest stays relatively still",
    "Exhale through mouth for 6 counts - belly falls",
    "Pause briefly before next breath",
  ],
  commonMistakes: [
    "Chest breathing instead of belly breathing",
    "Breathing too quickly",
    "Tensing shoulders or neck",
    "Holding breath",
  ],
  stopConditions: [
    "Dizziness or lightheadedness",
    "Increased pain anywhere",
    "Difficulty breathing",
  ],
  category: "Warm-Up",
};

const catCow: Exercise = {
  id: "cat-cow",
  name: "Cat-Cow",
  description: "Gentle spinal mobility exercise",
  phase: Phase.PHASE_0,
  media: exerciseMediaMap["cat-cow"],
  prescription: {
    sets: 2,
    reps: 10,
    description: "2 sets × 10 reps",
  },
  instructions: [
    "Start on hands and knees, wrists under shoulders",
    "Begin in neutral spine",
    "COW: Inhale, drop belly, lift chest and tailbone",
    "Hold 2 seconds",
    "CAT: Exhale, round spine, tuck chin and tailbone",
    "Hold 2 seconds",
    "Move slowly and smoothly",
  ],
  commonMistakes: [
    "Moving too quickly",
    "Overarching low back",
    "Locking elbows",
    "Not coordinating with breath",
  ],
  stopConditions: [
    "Sharp pain in spine, wrists, or knees",
    "Increased stiffness after 3-4 reps",
    "Shooting pain down arms or legs",
  ],
  category: "Warm-Up",
};

const gluteBridges: Exercise = {
  id: "glute-bridges",
  name: "Glute Bridges",
  description: "Hip extension for glute strength",
  phase: Phase.PHASE_0,
  media: exerciseMediaMap["glute-bridges"],
  prescription: {
    sets: 3,
    reps: 15,
    description: "3 sets × 15 reps",
  },
  instructions: [
    "Lie on back, knees bent, feet hip-width apart",
    "Feet close enough to brush heels with fingers",
    "Engage core and squeeze glutes",
    "Press through heels to lift hips",
    "Form straight line from shoulders to knees",
    "Hold at top for 2 seconds",
    "Lower slowly with control",
  ],
  commonMistakes: [
    "Lifting too high and arching low back",
    "Pushing through toes instead of heels",
    "Letting knees cave inward",
    "Using low back instead of glutes",
  ],
  stopConditions: [
    "Sharp pain in low back or SI joints",
    "Hamstring cramping",
    "Knee pain during movement",
  ],
  category: "Lower Body Strength",
};

const sitToStand: Exercise = {
  id: "sit-to-stand",
  name: "Sit-to-Stand",
  description: "Functional lower body strengthening",
  phase: Phase.PHASE_0,
  media: exerciseMediaMap["sit-to-stand"],
  prescription: {
    sets: 3,
    reps: 12,
    description: "3 sets × 12 reps",
  },
  instructions: [
    "Sit at edge of chair, feet flat, hip-width apart",
    "Position feet slightly behind knees",
    "Lean forward - nose over toes",
    "Push through heels to stand, use hands lightly if needed",
    "Stand fully upright, squeeze glutes at top",
    "Slowly lower back down with control",
    "Tap seat lightly and repeat",
  ],
  commonMistakes: [
    "Not leaning forward enough",
    "Pushing through toes instead of heels",
    "Standing too quickly using momentum",
    "Knees caving inward",
  ],
  stopConditions: [
    "Sharp pain in knees or hips",
    "Loss of balance or dizziness",
    "Persistent joint pain",
  ],
  category: "Lower Body Strength",
};

const wallAnkleMobility: Exercise = {
  id: "wall-ankle-mobility",
  name: "Wall Ankle Mobility",
  description: "Ankle dorsiflexion mobility for squat depth",
  phase: Phase.PHASE_0,
  media: exerciseMediaMap["wall-ankle-mobility"],
  prescription: {
    sets: 2,
    reps: 12,
    description: "2 sets × 12 reps per leg",
  },
  instructions: [
    "Face wall in staggered stance, front foot few inches from wall",
    "Keep both heels flat",
    "Hands on wall for balance",
    "Bend front knee forward to touch wall",
    "Keep heel planted - feel stretch in calf",
    "Hold end position 2 seconds",
    "Return and repeat",
    "Progress by moving foot farther from wall",
  ],
  commonMistakes: [
    "Lifting heel off ground",
    "Foot rolling inward or outward",
    "Bending at hip instead of ankle",
    "Starting too far from wall",
  ],
  stopConditions: [
    "Sharp pain in ankle or Achilles",
    "Pinching in front of ankle",
    "Pain that increases with each rep",
  ],
  category: "Mobility",
};

const halfKneelingHipFlexor: Exercise = {
  id: "half-kneeling-hip-flexor",
  name: "Half-Kneeling Hip Flexor Stretch",
  description: "Hip flexor and anterior hip capsule stretch",
  phase: Phase.PHASE_0,
  media: exerciseMediaMap["half-kneeling-hip-flexor"],
  prescription: {
    sets: 2,
    holdSeconds: 45,
    description: "2 sets × 45-second holds per side",
  },
  instructions: [
    "Kneel on one knee (use pad), other foot forward in lunge",
    "Front shin vertical, knee over ankle",
    "Upright posture, tall torso",
    "Posteriorly tilt pelvis (tuck tailbone)",
    "Gently shift weight forward, keep pelvis tucked",
    "Feel stretch in front of back hip",
    "Don't arch low back - maintain pelvic tilt",
    "Breathe deeply",
  ],
  commonMistakes: [
    "Arching low back instead of tucking pelvis",
    "Leaning forward too much",
    "Front knee drifting past toes",
    "Holding breath",
  ],
  stopConditions: [
    "Sharp pain in hip or groin",
    "Knee pain in kneeling leg",
    "Increased low back pain",
  ],
  category: "Mobility",
};

const dayABlock1: ExerciseBlock = {
  id: "day-a-warmup",
  name: "Warm-Up",
  description: "Breathing and mobility prep",
  estimatedMinutes: 6,
  exercises: [diaphragmaticBreathing, catCow],
};

const dayABlock2: ExerciseBlock = {
  id: "day-a-lower",
  name: "Lower Body Strength",
  description: "Glutes, legs, and functional movements",
  estimatedMinutes: 12,
  exercises: [gluteBridges, sitToStand],
};

const dayABlock3: ExerciseBlock = {
  id: "day-a-mobility",
  name: "Mobility Work",
  description: "Ankle and hip mobility",
  estimatedMinutes: 8,
  exercises: [wallAnkleMobility, halfKneelingHipFlexor],
};

// ==================== DAY B: CORE & UPPER BODY FOCUS ====================

const pelvicTilts: Exercise = {
  id: "pelvic-tilts",
  name: "Pelvic Tilts",
  description: "Isolated pelvic movement for lumbar mobility",
  phase: Phase.PHASE_0,
  media: exerciseMediaMap["pelvic-tilts"],
  prescription: {
    sets: 2,
    reps: 12,
    description: "2 sets × 12 reps",
  },
  instructions: [
    "Lie on back, knees bent, feet flat",
    "Start in neutral spine",
    "POSTERIOR tilt: Flatten low back, tailbone up",
    "Hold 3 seconds, engage lower abs",
    "Return to neutral",
    "ANTERIOR tilt: Arch low back slightly, tailbone down",
    "Hold 3 seconds",
    "Move slowly with control",
  ],
  commonMistakes: [
    "Using glutes or legs instead of pelvis",
    "Lifting hips off ground (bridge motion)",
    "Moving too fast",
    "Holding breath",
  ],
  stopConditions: [
    "Sharp pain in low back",
    "Muscle cramping",
    "Pain radiating into legs",
  ],
  category: "Core Prep",
};

const deadBug: Exercise = {
  id: "dead-bug",
  name: "Dead Bug",
  description: "Anti-extension core exercise for spinal protection",
  phase: Phase.PHASE_0,
  media: exerciseMediaMap["dead-bug"],
  prescription: {
    sets: 3,
    reps: 12,
    description: "3 sets × 12 reps (6 each side)",
  },
  instructions: [
    "Lie on back, knees bent 90 degrees, feet off ground",
    "Arms straight up toward ceiling",
    "Press low back into floor (posterior pelvic tilt)",
    "Lower opposite arm and leg simultaneously",
    "Keep back flat - don't let it arch",
    "Return to start",
    "Alternate sides",
    "Maintain flat back throughout",
  ],
  commonMistakes: [
    "Allowing low back to arch",
    "Holding breath",
    "Moving too quickly",
    "Bending extended leg",
  ],
  stopConditions: [
    "Inability to keep back flat",
    "Sharp pain in low back",
    "Hip or groin pain",
  ],
  category: "Core Strength",
};

const sidePlank: Exercise = {
  id: "side-plank",
  name: "Short-Lever Side Plank",
  description: "Lateral core stability with bent knees",
  phase: Phase.PHASE_0,
  media: exerciseMediaMap["side-plank"],
  prescription: {
    sets: 3,
    holdSeconds: 20,
    description: "3 sets × 20-second holds per side",
  },
  instructions: [
    "Lie on side with knees bent 90 degrees",
    "Prop on forearm, elbow under shoulder",
    "Stack knees and hips",
    "Lift hips until body forms straight line from head to knees",
    "Top arm on hip or extended toward ceiling",
    "Hold position, breathe normally",
    "Don't let hips sag or pike up",
    "Focus on stability",
  ],
  commonMistakes: [
    "Hips sagging toward ground",
    "Rolling shoulders forward or back",
    "Holding breath",
    "Collapsing into supporting shoulder",
  ],
  stopConditions: [
    "Sharp pain in shoulder or low back",
    "Inability to maintain neutral spine",
    "Excessive shaking preventing control",
  ],
  category: "Core Strength",
};

const wristCircles: Exercise = {
  id: "wrist-circles",
  name: "Wrist Circles",
  description: "Gentle wrist mobility",
  phase: Phase.PHASE_0,
  media: exerciseMediaMap["wrist-circles"],
  prescription: {
    sets: 2,
    reps: 10,
    description: "2 sets × 10 circles each direction",
  },
  instructions: [
    "Sit or stand with arms relaxed",
    "Make gentle fists",
    "Slowly circle wrists in one direction",
    "Make circles as large as comfortable",
    "Move smoothly without pain",
    "Complete 10 circles, then reverse",
    "Keep movement gentle and controlled",
  ],
  commonMistakes: [
    "Moving too quickly",
    "Forcing through pain",
    "Making too small circles",
    "Gripping too tightly",
  ],
  stopConditions: [
    "Sharp pain in wrist",
    "Clicking with pain",
    "Increased swelling",
  ],
  category: "Upper Body",
};

const isometricWristExtension: Exercise = {
  id: "isometric-wrist-extension",
  name: "Isometric Wrist Extension",
  description: "Static wrist strengthening to prevent tendonitis",
  phase: Phase.PHASE_0,
  media: exerciseMediaMap["isometric-wrist-extension"],
  prescription: {
    sets: 3,
    reps: 10,
    holdSeconds: 5,
    description: "3 sets × 10 reps, 5-second holds",
  },
  instructions: [
    "Sit with forearm on table, wrist neutral",
    "Press back of hand against wall or other hand",
    "Apply gentle pressure as if extending wrist, but don't move",
    "Hold 5 seconds at 50% effort",
    "Relax completely between reps",
    "Feel muscles in back of forearm",
    "Pure isometric - no movement",
  ],
  commonMistakes: [
    "Using too much force",
    "Allowing wrist to move",
    "Holding breath",
    "Gripping fingers tightly",
  ],
  stopConditions: [
    "Sharp pain in wrist or forearm",
    "Increased tendonitis symptoms",
    "Numbness or tingling",
  ],
  category: "Upper Body",
};

const dayBBlock1: ExerciseBlock = {
  id: "day-b-core-prep",
  name: "Core Preparation",
  description: "Pelvic control and activation",
  estimatedMinutes: 4,
  exercises: [pelvicTilts],
};

const dayBBlock2: ExerciseBlock = {
  id: "day-b-core",
  name: "Core Strength",
  description: "Anti-extension and lateral stability",
  estimatedMinutes: 12,
  exercises: [deadBug, sidePlank],
};

const dayBBlock3: ExerciseBlock = {
  id: "day-b-upper",
  name: "Upper Body Care",
  description: "Wrist and forearm work",
  estimatedMinutes: 8,
  exercises: [wristCircles, isometricWristExtension],
};

// ==================== DAY C: RECOVERY & CARDIO ====================

const quadSets: Exercise = {
  id: "quad-sets",
  name: "Quad Sets",
  description: "Isometric quad strengthening for knee stability",
  phase: Phase.PHASE_0,
  media: exerciseMediaMap["quad-sets"],
  prescription: {
    sets: 3,
    reps: 15,
    holdSeconds: 5,
    description: "3 sets × 15 reps, 5-second holds",
  },
  instructions: [
    "Sit or lie with leg extended",
    "Place small rolled towel under knee",
    "Tighten quadriceps (front thigh muscle)",
    "Push back of knee into towel",
    "Kneecap should move up slightly",
    "Hold 5 seconds",
    "Relax completely between reps",
  ],
  commonMistakes: [
    "Pointing toes or flexing ankle",
    "Not holding long enough",
    "Tensing shoulders or jaw",
    "Only partial contraction",
  ],
  stopConditions: [
    "Sharp pain in knee joint",
    "Increased knee swelling",
    "Cramping that doesn't resolve",
  ],
  category: "Light Strengthening",
};

const sideLyingHipAbduction: Exercise = {
  id: "side-lying-hip-abduction",
  name: "Side-Lying Hip Abduction",
  description: "Glute medius strengthening for hip stability",
  phase: Phase.PHASE_0,
  media: exerciseMediaMap["side-lying-hip-abduction"],
  prescription: {
    sets: 3,
    reps: 15,
    description: "3 sets × 15 reps per side",
  },
  instructions: [
    "Lie on side, bottom arm supporting head",
    "Stack hips and shoulders vertically",
    "Keep legs straight or bend bottom leg",
    "Lift top leg toward ceiling, lead with heel",
    "Lift only to hip height - don't go higher",
    "Toes pointing forward, don't rotate leg out",
    "Lower with control",
    "Feel it in outside of hip",
  ],
  commonMistakes: [
    "Rolling hips backward while lifting",
    "Rotating leg outward",
    "Lifting leg too high",
    "Using momentum instead of control",
  ],
  stopConditions: [
    "Sharp pain in hip joint",
    "Low back or SI joint pain",
    "Cramping that doesn't resolve",
  ],
  category: "Light Strengthening",
};

const flatWalk: Exercise = {
  id: "flat-walk",
  name: "Flat Walk (Easy Cardio)",
  description: "Low-impact walking for cardiovascular health",
  phase: Phase.PHASE_0,
  media: exerciseMediaMap["flat-walk"],
  prescription: {
    minutes: 20,
    description: "20 minutes at comfortable pace",
  },
  instructions: [
    "Choose flat, even surface",
    "Start at easy pace for 5 minutes",
    "Walk at pace where you can hold conversation",
    "Maintain upright posture, eyes forward",
    "Let arms swing naturally",
    "Land heel first, roll through foot, push off toes",
    "Take full, comfortable breaths",
    "Last 5 minutes: gradually slow to cool down",
  ],
  commonMistakes: [
    "Walking too fast too soon",
    "Looking down at feet",
    "Taking too long strides",
    "Holding tension in shoulders",
  ],
  stopConditions: [
    "Joint pain that increases",
    "Shortness of breath that doesn't resolve",
    "Chest pain",
    "Dizziness",
  ],
  category: "Cardio",
};

const dayCBlock1: ExerciseBlock = {
  id: "day-c-light",
  name: "Light Strengthening",
  description: "Easy resistance work",
  estimatedMinutes: 10,
  exercises: [quadSets, sideLyingHipAbduction],
};

const dayCBlock2: ExerciseBlock = {
  id: "day-c-cardio",
  name: "Easy Cardio",
  description: "Low-impact cardiovascular work",
  estimatedMinutes: 20,
  exercises: [flatWalk],
};

// ==================== EXPORTS ====================

// Day A: Lower Body Focus (~26 min + 12 min daily = 38 min total)
const dayABlocks: ExerciseBlock[] = [
  dailyHipBlock,
  dayABlock1,
  dayABlock2,
  dayABlock3,
];

// Day B: Core & Upper Body Focus (~24 min + 12 min daily = 36 min total)
const dayBBlocks: ExerciseBlock[] = [
  dailyHipBlock,
  dayBBlock1,
  dayBBlock2,
  dayBBlock3,
];

// Day C: Recovery & Cardio (~30 min + 12 min daily = 42 min total)
const dayCBlocks: ExerciseBlock[] = [
  dailyHipBlock,
  dayCBlock1,
  dayCBlock2,
];

// Phase 0 now has A/B/C day rotation
export const phase0Blocks: { A: ExerciseBlock[]; B: ExerciseBlock[]; C: ExerciseBlock[] } = {
  A: dayABlocks,
  B: dayBBlocks,
  C: dayCBlocks,
};

// Placeholder for other phases
const createPlaceholderExercise = (phase: Phase, index: number): Exercise => ({
  id: `phase${phase}-exercise${index}`,
  name: `Phase ${phase} Exercise ${index}`,
  description: `Placeholder for Phase ${phase}`,
  phase,
  media: exerciseMediaMap["generic-exercise"] || {
    type: "image",
    src: "/exercises/generic.jpg",
    alt: "Exercise placeholder",
  },
  prescription: {
    sets: 3,
    reps: 10,
    description: "3 sets × 10 reps",
  },
  instructions: ["Placeholder exercise", "Instructions will be added"],
  commonMistakes: ["Placeholder"],
  stopConditions: ["Any pain or discomfort"],
  category: `Phase ${phase}`,
});

const createPlaceholderBlock = (phase: Phase, blockNum: number): ExerciseBlock => {
  const exercises = Array.from({ length: 3 }, (_, i) =>
    createPlaceholderExercise(phase, blockNum * 3 + i + 1)
  );
  
  return {
    id: `phase${phase}-block${blockNum}`,
    name: `Phase ${phase} Block ${blockNum}`,
    description: `Placeholder for Phase ${phase}`,
    estimatedMinutes: 15,
    exercises,
  };
};

export const allBlocks: Record<Phase, any> = {
  [Phase.PHASE_0]: phase0Blocks,
  [Phase.PHASE_1]: {
    A: [createPlaceholderBlock(Phase.PHASE_1, 1)],
    B: [createPlaceholderBlock(Phase.PHASE_1, 2)],
    C: [createPlaceholderBlock(Phase.PHASE_1, 3)],
  },
  [Phase.PHASE_2]: {
    A: [createPlaceholderBlock(Phase.PHASE_2, 1)],
    B: [createPlaceholderBlock(Phase.PHASE_2, 2)],
    C: [createPlaceholderBlock(Phase.PHASE_2, 3)],
  },
  [Phase.PHASE_3]: {
    A: [createPlaceholderBlock(Phase.PHASE_3, 1)],
    B: [createPlaceholderBlock(Phase.PHASE_3, 2)],
    C: [createPlaceholderBlock(Phase.PHASE_3, 3)],
  },
  [Phase.PHASE_4]: {
    A: [createPlaceholderBlock(Phase.PHASE_4, 1)],
    B: [createPlaceholderBlock(Phase.PHASE_4, 2)],
    C: [createPlaceholderBlock(Phase.PHASE_4, 3)],
  },
  [Phase.PHASE_5]: {
    A: [createPlaceholderBlock(Phase.PHASE_5, 1)],
    B: [createPlaceholderBlock(Phase.PHASE_5, 2)],
    C: [createPlaceholderBlock(Phase.PHASE_5, 3)],
  },
};

export const allExercises: Exercise[] = [
  ...dayABlocks.flatMap(block => block.exercises),
  ...dayBBlocks.flatMap(block => block.exercises),
  ...dayCBlocks.flatMap(block => block.exercises),
];
