// 24-Week Program for 5K Running Goal
// Addresses: L4-L5 disc + old ACL knee + ulnar nerve (hand) + aerobic base
// Progressive phases P1-P5 with A/B/C day rotation

import { Exercise, ExerciseBlock, Phase, ProgramPhase, DayRotation, ProgramMeta } from "./types";
import { exerciseMediaMap } from "./exerciseMedia";

// ==================== DAILY FOUNDATION (ALL PHASES, EVERY DAY) ====================

// ==================== GLOBAL RULES (ALL PHASES, EVERY DAY) ====================
// Guidance items are excluded from progress/completion in UI (category: "Guidance").
const globalRulesBlock: ExerciseBlock = {
  id: "rules-global",
  name: "Rules (Read Once, Follow Daily)",
  description: "Auto-progression rules + safety cues (kept short on purpose)",
  estimatedMinutes: 1,
  exercises: [
    {
      id: "rules-load-management",
      name: "Load Rules (Auto-Progression)",
      description: "How to progress without flare-ups",
      phase: Phase.PHASE_0,
      media: exerciseMediaMap["generic-exercise"],
      prescription: { description: "Read (10 seconds)" },
      instructions: [
        "Pain during exercise should stay ≤ 2–3/10.",
        "24-hour rule: tomorrow should NOT be worse.",
        "If tomorrow is worse: reduce range/height first, then sets.",
        "If 2 good sessions in a row: progress ONE thing (reps OR height OR range).",
      ],
      commonMistakes: ["Progressing reps + range + load at the same time", "Pushing through sharp pain"],
      stopConditions: ["Sharp pain", "New numbness/weakness", "Symptoms worse next day"],
      category: "Guidance",
    },
    {
      id: "rules-knee-ladder",
      name: "Knee Ladder (Single-Leg Capacity)",
      description: "Build single-leg strength slowly (your knee is fine for cardio)",
      phase: Phase.PHASE_0,
      media: exerciseMediaMap["generic-exercise"],
      prescription: { description: "Read (15 seconds)" },
      instructions: [
        "Order: double-leg → supported single-leg → unsupported single-leg.",
        "Order: shallow range → deeper range → load.",
        "Don’t test deep single-leg squats daily (test weekly).",
        "Weekly check: 5 slow step-down reps/side from 4–6\" with good control.",
      ],
      commonMistakes: ["Jumping straight to deep single-leg squats", "Letting knee cave in"],
      stopConditions: ["Deep pain rising quickly", "Giving-way sensation"],
      category: "Guidance",
    },
    {
      id: "rules-spine-hygiene",
      name: "Spine Hygiene (Disc-Friendly)",
      description: "Keep your back calm while you build capacity",
      phase: Phase.PHASE_0,
      media: exerciseMediaMap["generic-exercise"],
      prescription: { description: "Read (15 seconds)" },
      instructions: [
        "Avoid repeated loaded bending (especially first thing in the morning).",
        "Use a neutral hip hinge to pick things up.",
        "Brace + exhale on sneezes/coughs (don’t bend forward).",
        "If symptoms flare: reduce range, swap to walking/elliptical that day.",
      ],
      commonMistakes: ["Stretching aggressively into pain", "High-rep spine flexion"],
      stopConditions: ["Leg symptoms increasing", "New numbness/weakness"],
      category: "Guidance",
    },
    {
      id: "rules-ulnar-ergonomics",
      name: "Ulnar Nerve Ergonomics",
      description: "Micro-breaks matter as much as the glide",
      phase: Phase.PHASE_0,
      media: exerciseMediaMap["generic-exercise"],
      prescription: { description: "Read (10 seconds)" },
      instructions: [
        "Every 30–45 min: stand up 30–60s, shake hands out, reset posture.",
        "Avoid leaning on elbows and prolonged deep elbow flexion.",
        "Nerve glides should feel gentle—stop if tingling ramps.",
      ],
      commonMistakes: ["Forcing the glide", "Ignoring workstation positioning"],
      stopConditions: ["Symptoms increase and persist >5 minutes"],
      category: "Guidance",
    },
  ],
};

const dailyHipBlock: ExerciseBlock = {
  id: "daily-hip",
  name: "🔥 Daily Hip Maintenance (EVERY DAY)",
  description: "Deep glute/piriformis work for L4-L5 health - non-negotiable!",
  estimatedMinutes: 15,
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
    {
      id: "ulnar-nerve-glide-daily",
      name: "Ulnar Nerve Glide (Gentle)",
      description: "For burning behind pinky from mouse use - DO DAILY!",
      phase: Phase.PHASE_0,
      media: exerciseMediaMap["ulnar-nerve-glide"],
      prescription: { sets: 2, reps: 10, description: "2 × 10 gentle glides per arm" },
      instructions: [
        "Arm to side at shoulder height",
        "Slowly tilt head away, then flex wrist/fingers",
        "Should feel mild stretch only",
        "Stop if symptoms increase",
      ],
      commonMistakes: ["Moving too aggressively", "Pushing into pain"],
      stopConditions: ["Increasing tingling", "Sharp pain", "Symptoms >5min after"],
      category: "Hand Care",
    },
  ],
};

// ==================== PHASE 1 (Weeks 1-4): Foundation ====================

const p1_dayA: ExerciseBlock[] = [
  dailyHipBlock,
  {
    id: "p1-a-core",
    name: "Core Endurance (McGill Big 3)",
    description: "Spine-sparing core for disc protection",
    estimatedMinutes: 15,
    exercises: [
      {
        id: "p1-mcgill-curlup",
        name: "McGill Curl-Up",
        description: "Anti-flexion core WITHOUT crunching disc",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["mcgill-curlup"],
        prescription: { sets: 3, reps: 8, holdSeconds: 10, description: "3 × 8, 10s holds" },
        instructions: [
          "One knee bent, one straight",
          "Hands under lower back to maintain arch",
          "Lift head/shoulders only, hold steady",
          "NO sit-up motion",
        ],
        commonMistakes: ["Crunching up too high", "Losing lumbar arch", "Holding breath"],
        stopConditions: ["Back pain", "Neck strain"],
        category: "Core",
      },
      {
        id: "p1-bird-dog",
        name: "Bird-Dog",
        description: "Core stability + hip extension control",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["bird-dog"],
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
        prescription: { minutes: 30, description: "30 min easy pace, RPE 4-5/10" },
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
    name: "Knee Capacity Building (ACL-Safe)",
    description: "Quad/glute work without running impact",
    estimatedMinutes: 18,
    exercises: [
      {
        id: "p1-quad-sets",
        name: "Quad Sets (Isometric)",
        description: "Gentle VMO activation for ACL knee",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["quad-sets"],
        prescription: { sets: 3, reps: 10, holdSeconds: 5, description: "3 × 10, 5s holds" },
        instructions: [
          "Sit with legs straight",
          "Contract quad, push knee down",
          "Kneecap should lift slightly",
        ],
        commonMistakes: ["Not holding contraction", "Flexing hip instead"],
        stopConditions: ["Knee pain >3/10"],
        category: "Lower Body",
      },
      {
        id: "p1-tke",
        name: "Terminal Knee Extension (TKE)",
        description: "VMO strengthening - CRITICAL for ACL",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["tke-band"],
        prescription: { sets: 3, reps: 12, description: "3 × 12 per leg, light band" },
        instructions: [
          "Band around knee, anchored behind",
          "Slight knee bend, then fully straighten",
          "Squeeze quad at top",
        ],
        commonMistakes: ["Too much band tension", "Not fully straightening"],
        stopConditions: ["Knee pain >3/10", "Giving-way sensation"],
        category: "Lower Body",
      },
      {
        id: "p1-glute-bridge",
        name: "Glute Bridge (Slow)",
        description: "Hip extension for glutes + back protection",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["glute-bridges"],
        prescription: { sets: 3, reps: 12, description: "3 × 12, 2s hold at top" },
        instructions: ["Feet hip-width", "Squeeze glutes at top 2s", "Lower slow"],
        commonMistakes: ["Arching back excessively", "Using back not glutes"],
        stopConditions: ["Back pain", "Hamstring cramping"],
        category: "Lower Body",
      },
      {
        id: "p1-step-up-low",
        name: "Step-Up (Low 4-6\")",
        description: "Knee-friendly quad strengthening",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["sit-to-stand"],
        prescription: { sets: 3, reps: 8, description: "3 × 8 per leg, 4-6\" step" },
        instructions: ["Use low step", "Push through heel", "Control down slowly"],
        commonMistakes: ["Step too high too soon", "Knee caving in"],
        stopConditions: ["Knee pain >3/10", "Giving-way feeling"],
        category: "Lower Body",
      },
      {
        id: "p1-split-squat-supported",
        name: "Split Squat (Supported, Small Range)",
        description: "Build single-leg strength without deep knee angles",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["split-squat"],
        prescription: { sets: 3, reps: 6, description: "3 × 6–8 per leg, hands supported, SMALL range" },
        instructions: [
          "Hold wall/rail for balance",
          "Short range only (stop before deep knee discomfort)",
          "Knee tracks over mid-foot",
          "Slow 3-second lower",
        ],
        commonMistakes: ["Dropping too deep too soon", "Knee collapsing inward"],
        stopConditions: ["Deep pain rising quickly", "Giving-way sensation"],
        category: "Lower Body",
      },
      {
        id: "p1-step-down-low",
        name: "Step-Down (Low 4-6\")",
        description: "Eccentric control for stairs + single-leg confidence",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["sit-to-stand"],
        prescription: { sets: 2, reps: 6, description: "2 × 6 per leg, slow 3–4s down (Weeks 3–4)" },
        instructions: [
          "Step down slowly and softly",
          "Light heel tap on the floor",
          "Keep knee tracking over toes (no cave-in)",
        ],
        commonMistakes: ["Dropping fast", "Hip dropping", "Knee collapsing inward"],
        stopConditions: ["Deep pain >3/10", "Instability"],
        category: "Lower Body",
      },
      {
        id: "p1-sl-squat-to-box-high",
        name: "Single-Leg Squat to Box (High)",
        description: "Re-introduce single-leg squat safely (high surface + support)",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["sit-to-stand"],
        prescription: { sets: 2, reps: 5, description: "2 × 5 per leg to HIGH box (Weeks 3–4)" },
        instructions: [
          "Use a high chair/bench behind you",
          "Light fingertip support on wall/rail",
          "Sit back under control, stand smoothly",
          "Stop before deep discomfort",
        ],
        commonMistakes: ["Going too low", "Knee collapsing inward", "Dropping into the seat"],
        stopConditions: ["Deep pain rising quickly", "Giving-way sensation"],
        category: "Lower Body",
      },
      {
        id: "p1-calf-raise",
        name: "Calf Raises (Slow Eccentric)",
        description: "Prepare calves for eventual running",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["calf-raises"],
        prescription: { sets: 2, reps: 15, description: "2 × 15, 3s lowering" },
        instructions: ["Double-leg", "Slow 3-second lower"],
        commonMistakes: ["Bouncing", "Too fast"],
        stopConditions: ["Achilles pain"],
        category: "Lower Body",
      },
    ],
  },
];

const p1_dayC: ExerciseBlock[] = [
  dailyHipBlock,
  {
    id: "p1-c-mobility",
    name: "Movement Prep + Recovery",
    description: "Hinge pattern + ankle/hip mobility",
    estimatedMinutes: 15,
    exercises: [
      {
        id: "p1-cat-cow",
        name: "Cat-Cow",
        description: "Gentle spinal mobility for disc health",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["cat-cow"],
        prescription: { sets: 2, reps: 10, description: "2 × 10, slow controlled" },
        instructions: [
          "Hands and knees",
          "Arch (cow) then round (cat) spine",
          "Move slowly, breathe",
        ],
        commonMistakes: ["Moving too fast", "Forcing end ranges"],
        stopConditions: ["Back pain increasing"],
        category: "Mobility",
      },
      {
        id: "p1-hip-hinge",
        name: "Hip Hinge Drill (Dowel)",
        description: "Learn neutral spine hinge for later deadlifts",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["hip-hinge-drill"],
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
      {
        id: "p1-side-hip-abduction",
        name: "Side-Lying Hip Abduction",
        description: "Glute med strengthening for knee stability",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["side-lying-hip-abduction"],
        prescription: { sets: 3, reps: 15, description: "3 × 15 per side" },
        instructions: [
          "Lie on side, bottom leg bent",
          "Lift top leg straight up",
          "Don't rotate hip forward",
        ],
        commonMistakes: ["Rolling back", "Swinging leg"],
        stopConditions: ["Hip or knee pain"],
        category: "Lower Body",
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

// ==================== PHASE 2 (Weeks 5-8): Build Strength + Impact Readiness ====================

const p2_dayA: ExerciseBlock[] = [
  dailyHipBlock,
  {
    id: "p2-a-core",
    name: "Core Endurance + Anti-Rotation",
    description: "Progress stability + add rotational control",
    estimatedMinutes: 18,
    exercises: [
      {
        id: "p2-mcgill-curlup",
        name: "McGill Curl-Up",
        description: "Anti-flexion core",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["mcgill-curlup"],
        prescription: { sets: 4, reps: 8, holdSeconds: 10, description: "4 × 8, 10s holds" },
        instructions: ["Same as P1, more volume"],
        commonMistakes: ["Crunching up too high"],
        stopConditions: ["Back pain"],
        category: "Core",
      },
      {
        id: "p2-bird-dog",
        name: "Bird-Dog (Longer Holds)",
        description: "Increase stability demand",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["bird-dog"],
        prescription: { sets: 4, reps: 8, holdSeconds: 8, description: "4 × 8/side, 8s holds" },
        instructions: ["Same as P1, longer holds"],
        commonMistakes: ["Arching back"],
        stopConditions: ["Back pain"],
        category: "Core",
      },
      {
        id: "p2-side-plank",
        name: "Side Plank (Knees Bent)",
        description: "Longer holds",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["side-plank"],
        prescription: { sets: 3, holdSeconds: 20, description: "3 × 20-25s per side" },
        instructions: ["Progress to 25s if able"],
        commonMistakes: ["Sagging"],
        stopConditions: ["Pain"],
        category: "Core",
      },
      {
        id: "p2-dead-bug",
        name: "Dead Bug",
        description: "Anti-extension core control",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["dead-bug"],
        prescription: { sets: 3, reps: 10, description: "3 × 10 per side" },
        instructions: [
          "On back, extend opposite arm + leg",
          "Keep lower back pressed to floor",
          "Slow and controlled",
        ],
        commonMistakes: ["Back arching", "Moving too fast"],
        stopConditions: ["Back pain"],
        category: "Core",
      },
    ],
  },
  {
    id: "p2-a-cardio",
    name: "Incline Walk or Stair Master",
    description: "Progressive aerobic capacity",
    estimatedMinutes: 35,
    exercises: [
      {
        id: "p2-incline-walk",
        name: "Incline Walk or Stair Master",
        description: "Build climbing capacity",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["incline-walk"],
        prescription: { minutes: 35, description: "35 min, 3-5% incline or stairs, RPE 5-6/10" },
        instructions: ["Slight incline", "Stay conversational", "Good posture"],
        commonMistakes: ["Too steep too soon", "Leaning forward"],
        stopConditions: ["Knee/back pain >3/10"],
        category: "Cardio",
      },
    ],
  },
];

const p2_dayB: ExerciseBlock[] = [
  dailyHipBlock,
  {
    id: "p2-b-knee",
    name: "Knee Strength (Progressed)",
    description: "Higher step, split squat prep",
    estimatedMinutes: 22,
    exercises: [
      {
        id: "p2-tke-heavier",
        name: "Terminal Knee Extension (Medium Band)",
        description: "Progress resistance",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["tke-band"],
        prescription: { sets: 3, reps: 15, description: "3 × 15 per leg, medium band" },
        instructions: ["Same as P1, heavier band"],
        commonMistakes: ["Too much resistance"],
        stopConditions: ["Knee pain >3/10"],
        category: "Lower Body",
      },
      {
        id: "p2-step-up-medium",
        name: "Step-Up (8\" Height)",
        description: "Progress step height",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["sit-to-stand"],
        prescription: { sets: 3, reps: 10, description: "3 × 10 per leg, 8\" step" },
        instructions: ["Higher step", "Control down"],
        commonMistakes: ["Knee caving"],
        stopConditions: ["Knee pain >3/10"],
        category: "Lower Body",
      },
      {
        id: "p2-split-squat-supported",
        name: "Split Squat (Hands Supported)",
        description: "Prep for single-leg strength",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["split-squat"],
        prescription: { sets: 3, reps: 8, description: "3 × 8 per leg, hold wall/chair" },
        instructions: [
          "Staggered stance",
          "Lower down gently",
          "Front knee tracks over toes",
          "Hold support for balance",
        ],
        commonMistakes: ["Dropping fast", "Knee caving"],
        stopConditions: ["Knee pain >3/10", "Giving-way"],
        category: "Lower Body",
      },
      {
        id: "p2-glute-bridge-single",
        name: "Single-Leg Glute Bridge (Assisted)",
        description: "Progress glute strength",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["glute-bridges"],
        prescription: { sets: 3, reps: 8, description: "3 × 8 per leg, opposite foot lightly down" },
        instructions: ["One leg up", "Other foot barely touching"],
        commonMistakes: ["Back arching"],
        stopConditions: ["Back pain"],
        category: "Lower Body",
      },
      {
        id: "p2-calf-raise-single",
        name: "Calf Raises (Single-Leg Prep)",
        description: "Prep for running impact",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["calf-raises"],
        prescription: { sets: 3, reps: 12, description: "3 × 12 per leg, hold wall" },
        instructions: ["Single leg", "Slow eccentric"],
        commonMistakes: ["Bouncing"],
        stopConditions: ["Achilles pain"],
        category: "Lower Body",
      },
    ],
  },
];

const p2_dayC: ExerciseBlock[] = [
  dailyHipBlock,
  {
    id: "p2-c-mobility",
    name: "Movement + Hip Strength",
    description: "Maintain mobility + add hip stability",
    estimatedMinutes: 18,
    exercises: [
      {
        id: "p2-cat-cow",
        name: "Cat-Cow",
        description: "Spinal mobility",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["cat-cow"],
        prescription: { sets: 2, reps: 10, description: "2 × 10" },
        instructions: ["Same as P1"],
        commonMistakes: ["Too fast"],
        stopConditions: ["Pain"],
        category: "Mobility",
      },
      {
        id: "p2-clamshell",
        name: "Clamshell",
        description: "Glute med for knee tracking",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["clamshell"],
        prescription: { sets: 3, reps: 15, description: "3 × 15 per side, can add light band" },
        instructions: [
          "Side-lying, knees bent",
          "Lift top knee, keep feet together",
          "Don't roll back",
        ],
        commonMistakes: ["Rolling hips back", "Too much range"],
        stopConditions: ["Hip pain"],
        category: "Lower Body",
      },
      {
        id: "p2-side-hip-abduction",
        name: "Side-Lying Hip Abduction",
        description: "Glute med strengthening",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["side-lying-hip-abduction"],
        prescription: { sets: 3, reps: 20, description: "3 × 20 per side" },
        instructions: ["Same as P1, more reps"],
        commonMistakes: ["Rolling back"],
        stopConditions: ["Pain"],
        category: "Lower Body",
      },
      {
        id: "p2-hip-hinge",
        name: "Hip Hinge (Light DB or KB)",
        description: "Progress hinge with load",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["hip-hinge-drill"],
        prescription: { sets: 3, reps: 10, description: "3 × 10, 5-10lb weight" },
        instructions: ["Hold light weight", "Hinge with neutral spine"],
        commonMistakes: ["Rounding"],
        stopConditions: ["Back pain"],
        category: "Mobility",
      },
    ],
  },
  {
    id: "p2-c-walk",
    name: "Easy Walk (Longer)",
    description: "Build aerobic endurance",
    estimatedMinutes: 30,
    exercises: [
      {
        id: "p2-walk",
        name: "Flat Walk",
        description: "30-35 min comfortable",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["flat-walk"],
        prescription: { minutes: 35, description: "30-35 min comfortable pace" },
        instructions: ["Same as P1, longer duration"],
        commonMistakes: ["Too fast"],
        stopConditions: ["Pain"],
        category: "Cardio",
      },
    ],
  },
];

// ==================== PHASE 3 (Weeks 9-12): Start Run-Walk ====================

const p3_dayA: ExerciseBlock[] = [
  dailyHipBlock,
  {
    id: "p3-a-runwalk",
    name: "Run-Walk Intervals (START RUNNING!)",
    description: "Gradual return to running if gates met",
    estimatedMinutes: 25,
    exercises: [
      {
        id: "p3-runwalk",
        name: "Run-Walk (1min run / 2min walk)",
        description: "Week 9-10: 1min run / 2min walk × 6-8 rounds",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["run-walk"],
        prescription: { minutes: 25, description: "1min run / 2min walk × 6-8 rounds (20-25 min total)" },
        instructions: [
          "Warm up 5min walk first",
          "Run EASY (can still talk in sentences)",
          "Walk fully between runs",
          "Stop if knee/back pain >3/10",
        ],
        commonMistakes: ["Running too hard", "Skipping walk breaks"],
        stopConditions: ["Pain >3/10", "Next-day knee swelling", "Back flare"],
        category: "Cardio",
      },
    ],
  },
  {
    id: "p3-a-core-maintenance",
    name: "Core Maintenance (Reduced Volume)",
    description: "Keep spine strong while adding running",
    estimatedMinutes: 12,
    exercises: [
      {
        id: "p3-mcgill-curlup",
        name: "McGill Curl-Up",
        description: "Maintain disc protection",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["mcgill-curlup"],
        prescription: { sets: 3, reps: 8, holdSeconds: 10, description: "3 × 8, 10s holds" },
        instructions: ["Same quality as before"],
        commonMistakes: ["Rushing"],
        stopConditions: ["Pain"],
        category: "Core",
      },
      {
        id: "p3-side-plank",
        name: "Side Plank",
        description: "Lateral stability",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["side-plank"],
        prescription: { sets: 3, holdSeconds: 25, description: "3 × 25s per side" },
        instructions: ["Maintain form"],
        commonMistakes: ["Sagging"],
        stopConditions: ["Pain"],
        category: "Core",
      },
    ],
  },
];

const p3_dayB: ExerciseBlock[] = [
  dailyHipBlock,
  {
    id: "p3-b-strength",
    name: "Knee + Hip Strength (Maintain)",
    description: "Keep strength to support running",
    estimatedMinutes: 20,
    exercises: [
      {
        id: "p3-tke",
        name: "Terminal Knee Extension",
        description: "VMO maintenance",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["tke-band"],
        prescription: { sets: 3, reps: 15, description: "3 × 15 per leg" },
        instructions: ["Keep doing these!"],
        commonMistakes: ["Skipping"],
        stopConditions: ["Pain >3/10"],
        category: "Lower Body",
      },
      {
        id: "p3-step-up",
        name: "Step-Up (8-10\")",
        description: "Maintain knee capacity",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["sit-to-stand"],
        prescription: { sets: 3, reps: 10, description: "3 × 10 per leg" },
        instructions: ["Maintain height or progress slightly"],
        commonMistakes: ["Knee caving"],
        stopConditions: ["Pain"],
        category: "Lower Body",
      },
      {
        id: "p3-split-squat",
        name: "Split Squat (Less Support)",
        description: "Progress balance",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["split-squat"],
        prescription: { sets: 3, reps: 10, description: "3 × 10 per leg, light fingertip support" },
        instructions: ["Reduce support as able"],
        commonMistakes: ["Rushing"],
        stopConditions: ["Pain >3/10"],
        category: "Lower Body",
      },
      {
        id: "p3-single-leg-bridge",
        name: "Single-Leg Glute Bridge",
        description: "Hip strength for running",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["glute-bridges"],
        prescription: { sets: 3, reps: 10, description: "3 × 10 per leg" },
        instructions: ["Full single leg now"],
        commonMistakes: ["Back arching"],
        stopConditions: ["Back pain"],
        category: "Lower Body",
      },
    ],
  },
];

const p3_dayC: ExerciseBlock[] = [
  dailyHipBlock,
  {
    id: "p3-c-easy-cardio",
    name: "Easy Walk or Cross-Train",
    description: "Active recovery between run days",
    estimatedMinutes: 30,
    exercises: [
      {
        id: "p3-walk-or-bike",
        name: "Walk, Elliptical, or Peloton",
        description: "Easy aerobic work",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["flat-walk"],
        prescription: { minutes: 30, description: "30 min easy, RPE 4-5/10" },
        instructions: ["Stay easy", "This is recovery"],
        commonMistakes: ["Going too hard"],
        stopConditions: ["Any pain increasing"],
        category: "Cardio",
      },
    ],
  },
  {
    id: "p3-c-mobility",
    name: "Hip + Ankle Mobility",
    description: "Keep movement quality",
    estimatedMinutes: 12,
    exercises: [
      {
        id: "p3-cat-cow",
        name: "Cat-Cow",
        description: "Spine health",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["cat-cow"],
        prescription: { sets: 2, reps: 10, description: "2 × 10" },
        instructions: ["Keep doing this"],
        commonMistakes: ["Skipping"],
        stopConditions: ["Pain"],
        category: "Mobility",
      },
      {
        id: "p3-clamshell",
        name: "Clamshell",
        description: "Glute med for knee health",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["clamshell"],
        prescription: { sets: 2, reps: 20, description: "2 × 20 per side" },
        instructions: ["Light maintenance"],
        commonMistakes: ["Rolling"],
        stopConditions: ["Pain"],
        category: "Mobility",
      },
    ],
  },
];

// ==================== PHASE 4 (Weeks 13-18): Continuous Running → 5K ====================

const p4_dayA: ExerciseBlock[] = [
  dailyHipBlock,
  {
    id: "p4-a-run",
    name: "Easy Continuous Run",
    description: "Build continuous running capacity",
    estimatedMinutes: 30,
    exercises: [
      {
        id: "p4-easy-run",
        name: "Easy Run (Continuous)",
        description: "Week 13-14: 15min, Week 15-16: 20min, Week 17-18: 25-30min",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["easy-run"],
        prescription: { minutes: 25, description: "15-30min continuous easy run (progress weekly)" },
        instructions: [
          "Warm up 5min walk",
          "Run at conversational pace",
          "Can still speak in sentences",
          "Walk breaks OK if needed",
        ],
        commonMistakes: ["Running too hard", "Increasing too fast"],
        stopConditions: ["Pain >3/10", "Next-day swelling/flare"],
        category: "Cardio",
      },
    ],
  },
  {
    id: "p4-a-core-light",
    name: "Core (Light Maintenance)",
    description: "Reduced volume, maintain quality",
    estimatedMinutes: 10,
    exercises: [
      {
        id: "p4-mcgill-curlup",
        name: "McGill Curl-Up",
        description: "Spine protection",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["mcgill-curlup"],
        prescription: { sets: 2, reps: 8, holdSeconds: 10, description: "2 × 8, 10s holds" },
        instructions: ["Quality over quantity"],
        commonMistakes: ["Rushing"],
        stopConditions: ["Pain"],
        category: "Core",
      },
      {
        id: "p4-side-plank",
        name: "Side Plank",
        description: "Lateral core",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["side-plank"],
        prescription: { sets: 2, holdSeconds: 30, description: "2 × 30s per side" },
        instructions: ["Strong holds"],
        commonMistakes: ["Sagging"],
        stopConditions: ["Pain"],
        category: "Core",
      },
    ],
  },
];

const p4_dayB: ExerciseBlock[] = [
  dailyHipBlock,
  {
    id: "p4-b-strength",
    name: "Strength (Maintain Resilience)",
    description: "Keep knee/hip strong for running load",
    estimatedMinutes: 22,
    exercises: [
      {
        id: "p4-tke",
        name: "Terminal Knee Extension",
        description: "VMO - never skip",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["tke-band"],
        prescription: { sets: 3, reps: 15, description: "3 × 15 per leg" },
        instructions: ["Critical for knee health"],
        commonMistakes: ["Skipping"],
        stopConditions: ["Pain"],
        category: "Lower Body",
      },
      {
        id: "p4-step-up-weighted",
        name: "Step-Up (Light Weight)",
        description: "Progress load",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["sit-to-stand"],
        prescription: { sets: 3, reps: 10, description: "3 × 10 per leg, 5-10lb DBs optional" },
        instructions: ["Can add light weights if no pain"],
        commonMistakes: ["Too heavy"],
        stopConditions: ["Knee pain"],
        category: "Lower Body",
      },
      {
        id: "p4-split-squat-weighted",
        name: "Split Squat (Freestanding)",
        description: "Single-leg strength",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["split-squat"],
        prescription: { sets: 3, reps: 10, description: "3 × 10 per leg, no support" },
        instructions: ["Balance on your own"],
        commonMistakes: ["Knee caving"],
        stopConditions: ["Pain"],
        category: "Lower Body",
      },
      {
        id: "p4-single-leg-rdl",
        name: "Single-Leg RDL (Light)",
        description: "Hip hinge + balance for running",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["single-leg-rdl"],
        prescription: { sets: 3, reps: 8, description: "3 × 8 per leg, light DB or bodyweight" },
        instructions: [
          "Hinge at hip, keep back neutral",
          "Slight knee bend",
          "Balance on one leg",
        ],
        commonMistakes: ["Rounding back", "Losing balance"],
        stopConditions: ["Back or knee pain"],
        category: "Lower Body",
      },
    ],
  },
];

const p4_dayC: ExerciseBlock[] = [
  dailyHipBlock,
  {
    id: "p4-c-long-run",
    name: "Long Run or Walk-Run",
    description: "Build endurance (but stay easy!)",
    estimatedMinutes: 35,
    exercises: [
      {
        id: "p4-long-run",
        name: "Long Run (Easy Pace)",
        description: "Week 13-14: 20min, Week 15-16: 25min, Week 17-18: 30-35min",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["easy-run"],
        prescription: { minutes: 30, description: "20-35min easy run (progress weekly), walk breaks OK" },
        instructions: [
          "Slower than other run days",
          "Walk breaks if needed",
          "Goal is TIME, not speed",
        ],
        commonMistakes: ["Running too fast", "No walk breaks when needed"],
        stopConditions: ["Pain >3/10"],
        category: "Cardio",
      },
    ],
  },
  {
    id: "p4-c-mobility-light",
    name: "Mobility (Quick)",
    description: "Keep joints happy",
    estimatedMinutes: 10,
    exercises: [
      {
        id: "p4-cat-cow",
        name: "Cat-Cow",
        description: "Spine health",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["cat-cow"],
        prescription: { sets: 2, reps: 10, description: "2 × 10" },
        instructions: ["Quick mobility"],
        commonMistakes: ["Skipping"],
        stopConditions: ["Pain"],
        category: "Mobility",
      },
      {
        id: "p4-ankle-mobility",
        name: "Wall Ankle Rocks",
        description: "Ankle prep",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["wall-ankle-mobility"],
        prescription: { sets: 2, reps: 10, description: "2 × 10 per leg" },
        instructions: ["Quick maintenance"],
        commonMistakes: ["Skipping"],
        stopConditions: ["Pain"],
        category: "Mobility",
      },
    ],
  },
];

// ==================== PHASE 5 (Weeks 19-24): Durability + 5K Confidence ====================

const p5_dayA: ExerciseBlock[] = [
  dailyHipBlock,
  {
    id: "p5-a-run-quality",
    name: "Easy Run with Strides",
    description: "Add short quality bursts",
    estimatedMinutes: 30,
    exercises: [
      {
        id: "p5-run-strides",
        name: "Easy Run + Strides",
        description: "20min easy run + 4-6 × 20s strides",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["easy-run"],
        prescription: { minutes: 30, description: "20min easy + 4-6 × 20s strides (walk 60s between)" },
        instructions: [
          "Warm up 10min easy",
          "Then 4-6 × 20s faster (80% effort)",
          "Walk 60s between strides",
          "Cool down 5min easy",
        ],
        commonMistakes: ["Sprinting too hard", "Not enough rest between"],
        stopConditions: ["Pain >3/10"],
        category: "Cardio",
      },
    ],
  },
  {
    id: "p5-a-core-light",
    name: "Core Maintenance",
    description: "Keep spine healthy",
    estimatedMinutes: 10,
    exercises: [
      {
        id: "p5-mcgill-curlup",
        name: "McGill Curl-Up",
        description: "Disc protection",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["mcgill-curlup"],
        prescription: { sets: 2, reps: 8, holdSeconds: 10, description: "2 × 8, 10s holds" },
        instructions: ["Never skip"],
        commonMistakes: ["Rushing"],
        stopConditions: ["Pain"],
        category: "Core",
      },
      {
        id: "p5-side-plank",
        name: "Side Plank",
        description: "Lateral stability",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["side-plank"],
        prescription: { sets: 2, holdSeconds: 30, description: "2 × 30s per side" },
        instructions: ["Strong and steady"],
        commonMistakes: ["Sagging"],
        stopConditions: ["Pain"],
        category: "Core",
      },
    ],
  },
];

const p5_dayB: ExerciseBlock[] = [
  dailyHipBlock,
  {
    id: "p5-b-strength",
    name: "Strength (Injury Prevention)",
    description: "Maintain resilience for running volume",
    estimatedMinutes: 22,
    exercises: [
      {
        id: "p5-tke",
        name: "Terminal Knee Extension",
        description: "VMO - forever!",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["tke-band"],
        prescription: { sets: 3, reps: 15, description: "3 × 15 per leg" },
        instructions: ["Keep doing these for life"],
        commonMistakes: ["Skipping"],
        stopConditions: ["Pain"],
        category: "Lower Body",
      },
      {
        id: "p5-step-up-weighted",
        name: "Step-Up (Moderate Weight)",
        description: "Knee capacity",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["sit-to-stand"],
        prescription: { sets: 3, reps: 10, description: "3 × 10 per leg, 10-15lb DBs optional" },
        instructions: ["Progress load if comfortable"],
        commonMistakes: ["Too heavy"],
        stopConditions: ["Pain"],
        category: "Lower Body",
      },
      {
        id: "p5-split-squat-weighted",
        name: "Split Squat (Light Weight)",
        description: "Single-leg strength",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["split-squat"],
        prescription: { sets: 3, reps: 10, description: "3 × 10 per leg, 5-10lb DBs optional" },
        instructions: ["Add light weight if no pain"],
        commonMistakes: ["Knee caving"],
        stopConditions: ["Pain"],
        category: "Lower Body",
      },
      {
        id: "p5-single-leg-rdl",
        name: "Single-Leg RDL",
        description: "Hip/hamstring strength",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["single-leg-rdl"],
        prescription: { sets: 3, reps: 10, description: "3 × 10 per leg, light weight" },
        instructions: ["Maintain form"],
        commonMistakes: ["Rounding back"],
        stopConditions: ["Back pain"],
        category: "Lower Body",
      },
    ],
  },
];

const p5_dayC: ExerciseBlock[] = [
  dailyHipBlock,
  {
    id: "p5-c-long-run",
    name: "Long Run (5K Distance!)",
    description: "Build to comfortable 5K",
    estimatedMinutes: 40,
    exercises: [
      {
        id: "p5-long-run-5k",
        name: "Long Run (30-40min / 5K)",
        description: "Week 19-20: 30min, Week 21-22: 35min, Week 23-24: 5K (30-40min)",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["easy-run"],
        prescription: { minutes: 35, description: "30-40min easy run, aiming for 5K distance by Week 24" },
        instructions: [
          "Stay EASY pace",
          "Walk breaks if needed",
          "By Week 24, try full 5K",
          "Focus on completion, not speed",
        ],
        commonMistakes: ["Racing", "No walk breaks"],
        stopConditions: ["Pain >3/10"],
        category: "Cardio",
      },
    ],
  },
  {
    id: "p5-c-mobility",
    name: "Recovery + Mobility",
    description: "Keep body healthy",
    estimatedMinutes: 12,
    exercises: [
      {
        id: "p5-cat-cow",
        name: "Cat-Cow",
        description: "Spine health",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["cat-cow"],
        prescription: { sets: 2, reps: 10, description: "2 × 10" },
        instructions: ["Keep doing this forever"],
        commonMistakes: ["Skipping"],
        stopConditions: ["Pain"],
        category: "Mobility",
      },
      {
        id: "p5-clamshell",
        name: "Clamshell",
        description: "Glute med for knee",
        phase: Phase.PHASE_0,
        media: exerciseMediaMap["clamshell"],
        prescription: { sets: 2, reps: 20, description: "2 × 20 per side" },
        instructions: ["Hip health"],
        commonMistakes: ["Rolling"],
        stopConditions: ["Pain"],
        category: "Mobility",
      },
    ],
  },
];

// ==================== EXPORT STRUCTURE ====================

function withRules(blocks: ExerciseBlock[]): ExerciseBlock[] {
  return [globalRulesBlock, ...blocks];
}

export const programBlocks: Record<ProgramPhase, Record<DayRotation, ExerciseBlock[]>> = {
  P1: { A: withRules(p1_dayA), B: withRules(p1_dayB), C: withRules(p1_dayC) },
  P2: { A: withRules(p2_dayA), B: withRules(p2_dayB), C: withRules(p2_dayC) },
  P3: { A: withRules(p3_dayA), B: withRules(p3_dayB), C: withRules(p3_dayC) },
  P4: { A: withRules(p4_dayA), B: withRules(p4_dayB), C: withRules(p4_dayC) },
  P5: { A: withRules(p5_dayA), B: withRules(p5_dayB), C: withRules(p5_dayC) },
};

function deepCloneBlocks(blocks: ExerciseBlock[]): ExerciseBlock[] {
  const sc = globalThis.structuredClone as unknown as ((v: unknown) => unknown) | undefined;
  if (typeof sc === "function") return sc(blocks) as ExerciseBlock[];
  return JSON.parse(JSON.stringify(blocks)) as ExerciseBlock[];
}

function findExercise(blocks: ExerciseBlock[], exerciseId: string): Exercise | undefined {
  for (const b of blocks) {
    const ex = b.exercises.find((e) => e.id === exerciseId);
    if (ex) return ex;
  }
  return undefined;
}

function removeExercise(blocks: ExerciseBlock[], exerciseId: string) {
  for (const b of blocks) {
    b.exercises = b.exercises.filter((e) => e.id !== exerciseId);
  }
}

// Day-by-day generation with progression rules (phaseWeek-aware).
export function getBlocksForProgramMeta(meta: ProgramMeta): ExerciseBlock[] {
  const base = programBlocks[meta.phase]?.[meta.day] || programBlocks.P1.A;
  const blocks = deepCloneBlocks(base);

  // P1 knee ladder (Weeks 1–4): Week 1–2 = simpler, Week 3–4 = add step-down + SL box squat and progress step-up.
  if (meta.phase === "P1" && meta.day === "B") {
    if (meta.phaseWeek <= 2) {
      removeExercise(blocks, "p1-step-down-low");
      removeExercise(blocks, "p1-sl-squat-to-box-high");
    } else {
      const stepUp = findExercise(blocks, "p1-step-up-low");
      if (stepUp) {
        stepUp.name = "Step-Up (Progressed 6–8\")";
        stepUp.prescription = { sets: 3, reps: 10, description: "3 × 10 per leg, 6–8\" step (slow down)" };
        stepUp.instructions = ["Use 6–8\" step", "Push through heel", "Control down slowly (3s)"];
      }
    }
  }

  // P3 run-walk progression (Weeks 9–12): only progress if no knee/back flare within 24–48h.
  if (meta.phase === "P3" && meta.day === "A") {
    const runwalk = findExercise(blocks, "p3-runwalk");
    if (runwalk) {
      const plan = [
        "1 min run / 2 min walk × 6–8 rounds (20–25 min total)",
        "1 min run / 1 min walk × 10 rounds (20 min total)",
        "2 min run / 1 min walk × 8 rounds (24 min total)",
        "3 min run / 1 min walk × 6 rounds (24 min total)",
      ];
      const idx = Math.max(0, Math.min(3, meta.phaseWeek - 1));
      runwalk.prescription = { minutes: 25, description: plan[idx] };
      runwalk.instructions = [
        "Warm up 5 min walk first",
        "Run EASY (conversational pace)",
        "Progress ONLY if no knee/back flare within 24–48h",
        "If flare: repeat last week or regress 1 step",
      ];
    }
  }

  // P4 continuous run minutes (Weeks 13–18).
  if (meta.phase === "P4") {
    const easyRun = findExercise(blocks, "p4-easy-run");
    const longRun = findExercise(blocks, "p4-long-run");
    if (easyRun) {
      const mins = [15, 18, 20, 22, 25, 30][Math.max(0, Math.min(5, meta.phaseWeek - 1))];
      easyRun.prescription = { minutes: mins, description: mins + " min easy continuous run (walk breaks OK)" };
    }
    if (longRun) {
      const mins = [20, 22, 25, 28, 30, 35][Math.max(0, Math.min(5, meta.phaseWeek - 1))];
      longRun.prescription = { minutes: mins, description: mins + " min easy long run (walk breaks OK)" };
    }
  }

  // P5 long run minutes (Weeks 19–24).
  if (meta.phase === "P5") {
    const long5k = findExercise(blocks, "p5-long-run-5k");
    if (long5k) {
      const mins = [30, 32, 35, 35, 38, 40][Math.max(0, Math.min(5, meta.phaseWeek - 1))];
      long5k.prescription = { minutes: mins, description: mins + " min easy long run (aiming toward comfortable 5K)" };
    }
  }

  return blocks;
}

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
