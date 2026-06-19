// Chacha Training — 5-day weekly split (Mon–Fri)
// Knee/back/wrist-friendly strength program with video guides + safety cues.
//
// Safety guidance synthesized from rehab/performance sources (McGill spine
// stability, knee-friendly leg training, wrist-neutral pressing patterns).

import { Exercise, ExerciseBlock, ExerciseMedia } from "./types";

export const CHACHA_PROGRAM_ID = "chacha-training-v1";

/** Shared pain rule used across the program. */
export const CHACHA_PAIN_RULE =
  "0–3/10 discomfort during = okay · 4–5/10 = reduce range/load · 6+/10 or worse next day = stop";

const DEFAULT_STOP: string[] = [
  "Sharp or shooting pain in knee, back, or wrist",
  "Pain above 5/10 that lingers or worsens the next day",
  "Numbness, tingling, or loss of strength",
];

function yt(videoId: string, alt: string): ExerciseMedia {
  return {
    type: "video",
    videoUrl: `https://www.youtube.com/embed/${videoId}`,
    alt,
  };
}

type ExInput = {
  id: string;
  name: string;
  tldr: string;
  videoId: string;
  category: string;
  prescription?: Exercise["prescription"];
  instructions: string[];
  commonMistakes: string[];
  stopConditions?: string[];
};

function ex(input: ExInput): Exercise {
  return {
    id: input.id,
    name: input.name,
    description: input.tldr,
    phase: 0,
    media: yt(input.videoId, input.name),
    prescription: input.prescription ?? { sets: 3, reps: 10, description: "3 × 10 reps" },
    instructions: input.instructions,
    commonMistakes: input.commonMistakes,
    stopConditions: input.stopConditions ?? DEFAULT_STOP,
    category: input.category,
  };
}

// ── Monday: Legs ─────────────────────────────────────────────────────────────
const mondayBlocks: ExerciseBlock[] = [
  {
    id: "chacha-mon-legs",
    name: "🦵 Monday — Legs",
    description: `Hip/ankle mobility + knee-friendly leg strength · ${CHACHA_PAIN_RULE}`,
    estimatedMinutes: 45,
    exercises: [
      ex({
        id: "chacha-1",
        name: "Hip and ankle mobility",
        tldr: "Loosen hips/ankles so knees and back don't take all the load.",
        videoId: "R9S6uA4Y5V4",
        category: "Mobility",
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
      }),
      ex({
        id: "chacha-2",
        name: "Box squat (bodyweight or light goblet)",
        tldr: "Controlled squat depth, less stress on knees and spine than heavy barbell squats.",
        videoId: "YybyS_IeQp4",
        category: "Legs",
        instructions: [
          "Set box height so hips sit just above parallel — raise it if knees complain.",
          "Hinge hips BACK first before bending knees (think 'sit back', not 'drop down').",
          "Keep shins as vertical as possible; knees track over toes, don't cave inward.",
          "Lower with control, pause 1–2 sec on the box without collapsing or rocking.",
          "Drive up through mid-foot/heels; don't lock knees hard at the top.",
        ],
        commonMistakes: [
          "Plopping onto the box — control the descent",
          "Knees shooting forward before hips move back",
          "Knees caving inward on the way up",
          "Rocking forward off the box instead of driving vertically",
        ],
        stopConditions: [...DEFAULT_STOP, "Front-of-knee pinching that increases each rep"],
      }),
      ex({
        id: "chacha-3",
        name: "Static split squat / supported lunge",
        tldr: "Builds single-leg strength while holding on so knees/ankles feel stable.",
        videoId: "3u6yV2L7pbg",
        category: "Legs",
        prescription: { sets: 3, reps: 8, description: "3 × 8 per leg" },
        instructions: [
          "Hold a rack or wall lightly for balance — the support is intentional.",
          "Front knee stays over mid-foot; don't let it drift far past toes.",
          "Torso upright, ribs stacked over pelvis, core gently braced.",
          "Lower only to a depth where front knee and back knee feel stable.",
          "Drive through the front heel to stand; control the eccentric.",
        ],
        commonMistakes: [
          "Dropping too deep before single-leg strength is ready",
          "Leaning torso forward and loading the low back",
          "Letting the front knee wobble inward",
        ],
      }),
      ex({
        id: "chacha-4",
        name: "Dumbbell Romanian deadlift",
        tldr: "Trains hamstrings and glutes with a hip hinge, minimal knee bend, back kept neutral.",
        videoId: "9_pY7mG6eW4",
        category: "Legs",
        instructions: [
          "Soft knee bend at the top — keep that angle nearly fixed throughout.",
          "Push hips straight back; dumbbells stay close to your legs.",
          "Maintain a neutral spine — brace core like someone might poke your stomach.",
          "Stop lowering when hamstrings stretch peaks OR your back starts to round.",
          "Drive hips forward to stand; squeeze glutes at the top without hyperextending.",
        ],
        commonMistakes: [
          "Turning it into a squat (knees keep bending as you lower)",
          "Rounding the lower back to reach the floor",
          "Letting dumbbells drift forward away from the body",
          "Using weight you can't control with a flat back",
        ],
        stopConditions: [...DEFAULT_STOP, "Low-back pinch or pull during the hinge"],
      }),
      ex({
        id: "chacha-5",
        name: "Leg press (short range, moderate load)",
        tldr: "Load legs without heavy weight on your spine; limit knee depth.",
        videoId: "yZ8b9vH6w88",
        category: "Legs",
        instructions: [
          "Feet high and slightly wide on the platform — biases glutes/hamstrings over quads.",
          "Keep low back and hips pressed into the pad the entire rep.",
          "Lower to ~90° knee bend OR your pain-free limit — don't go deeper.",
          "Push through heels/mid-foot; stop just before knee lockout.",
          "Use a slow 2–3 sec lowering phase; no bouncing at the bottom.",
        ],
        commonMistakes: [
          "Letting hips lift off the seat at the bottom (butt wink / back stress)",
          "Feet too low on the platform (increases knee shear)",
          "Locking knees aggressively at the top",
          "Using momentum and bouncing the weight",
        ],
        stopConditions: [...DEFAULT_STOP, "Front-of-knee pain that builds set-over-set"],
      }),
      ex({
        id: "chacha-6",
        name: "Lateral band walks",
        tldr: "Strengthens hip stabilizers to take pressure off knees and lower back.",
        videoId: "3_eX6qD73lY",
        category: "Legs",
        prescription: { sets: 3, reps: 12, description: "3 × 12 steps each direction" },
        instructions: [
          "Band just above knees or ankles; slight squat stance, toes forward.",
          "Step sideways without letting knees cave in — keep tension on the band.",
          "Stay low and controlled; small steps beat big wobbly ones.",
          "Keep chest up and core braced; don't sway side to side.",
        ],
        commonMistakes: [
          "Standing too upright — reduces glute med engagement",
          "Letting the trailing knee collapse inward",
          "Rushing steps and losing band tension",
        ],
      }),
      ex({
        id: "chacha-7",
        name: "Standing or seated calf raises",
        tldr: "Builds calf strength for ankle stability with very low back stress.",
        videoId: "uD9HqXf8t9g",
        category: "Legs",
        prescription: { sets: 3, reps: 15, description: "3 × 15 reps" },
        instructions: [
          "Full range: lower heels below step level, rise to full calf squeeze.",
          "Pause 1 sec at the top; control the lowering — no dropping.",
          "Seated version reduces Achilles load if standing bothers the ankle.",
          "Hold a wall or rack for balance if needed.",
        ],
        commonMistakes: [
          "Bouncing at the bottom using momentum",
          "Only doing partial reps at the top",
        ],
      }),
    ],
  },
];

// ── Tuesday: Cardio / Grip / Core ───────────────────────────────────────────
const tuesdayBlocks: ExerciseBlock[] = [
  {
    id: "chacha-tue-cardio",
    name: "❤️ Cardio",
    description: `Low-impact conditioning · ${CHACHA_PAIN_RULE}`,
    estimatedMinutes: 20,
    exercises: [
      ex({
        id: "chacha-8",
        name: "Cross-trainer / elliptical",
        tldr: "Low-impact cardio that's easier on knees and ankles than running.",
        videoId: "vVjH2nK1WqQ",
        category: "Cardio",
        prescription: { minutes: 15, description: "15–20 min moderate pace" },
        instructions: [
          "Upright posture — don't lean on the handles.",
          "Light grip on handles; let legs do the work.",
          "Moderate effort: you can speak in short sentences.",
          "If knees ache, reduce resistance and shorten stride length.",
        ],
        commonMistakes: [
          "Slouching forward and loading the low back",
          "Gripping handles too hard (wrist strain)",
          "Starting too fast — build pace over 2–3 minutes",
        ],
      }),
    ],
  },
  {
    id: "chacha-tue-grip",
    name: "✊ Grip / hanging",
    description: "Grip strength + gentle spinal decompression",
    estimatedMinutes: 15,
    exercises: [
      ex({
        id: "chacha-9",
        name: "Farmer carry (moderate dumbbells)",
        tldr: "Improves grip and core tension while walking upright, back stays neutral.",
        videoId: "p5M6L6f3hjg",
        category: "Grip",
        prescription: { sets: 3, description: "3 × 30–40 sec walk" },
        instructions: [
          "Stand tall, shoulders down and back, ribs over pelvis.",
          "Walk slow and controlled — no leaning or side-bending.",
          "Grip firm but not crushing; breathe steadily.",
          "Use weight you can carry with perfect posture the full distance.",
        ],
        commonMistakes: [
          "Leaning to one side under load",
          "Shrugging shoulders up to ears",
          "Going too heavy and losing neutral spine",
        ],
      }),
      ex({
        id: "chacha-10",
        name: "Pinch holds",
        tldr: "Pure grip strength work without loading the spine or knees much.",
        videoId: "8XW6uO4x9_E",
        category: "Grip",
        prescription: { sets: 3, description: "3 × 20–30 sec holds" },
        instructions: [
          "Pinch two weight plates (smooth sides out) or a block between fingers and thumb.",
          "Stand or sit upright; arm at your side, shoulder relaxed.",
          "Hold until grip fatigues — don't drop plates from height.",
        ],
        commonMistakes: [
          "Using plates too heavy to hold safely",
          "Shrugging the shoulder during the hold",
        ],
        stopConditions: [...DEFAULT_STOP, "Thumb or finger joint sharp pain"],
      }),
      ex({
        id: "chacha-11",
        name: "Supported dead hang (feet touching box)",
        tldr: "Gentle decompression for the spine with less strain than a full bodyweight hang.",
        videoId: "b4O6uO_3H5Y",
        category: "Grip",
        prescription: { sets: 3, description: "3 × 15–30 sec hangs" },
        instructions: [
          "Use a box so feet lightly touch — you unload ~30–50% of bodyweight.",
          "Shoulders relaxed down (not shrugged to ears); breathe normally.",
          "Neutral grip; stop if shoulders or elbows feel pinchy.",
          "Step down controlled — don't drop from the bar.",
        ],
        commonMistakes: [
          "Full bodyweight hang before shoulders are ready",
          "Shrugging shoulders up toward ears",
          "Holding breath and tensing the whole body",
        ],
        stopConditions: [...DEFAULT_STOP, "Shoulder impingement pinching", "Elbow or wrist sharp pain on grip"],
      }),
    ],
  },
  {
    id: "chacha-tue-core",
    name: "🧱 Core",
    description: `McGill-style spine-sparing core · ${CHACHA_PAIN_RULE}`,
    estimatedMinutes: 15,
    exercises: [
      ex({
        id: "chacha-12",
        name: "Dead bug",
        tldr: "Core stability exercise that trains abs without bending the spine a lot.",
        videoId: "4XLEnwUr_V4",
        category: "Core",
        prescription: { sets: 3, reps: 8, description: "3 × 8 per side" },
        instructions: [
          "Lie on back, arms up, knees bent 90°; press low back gently into floor.",
          "Exhale and brace core BEFORE moving any limb.",
          "Extend opposite arm and leg slowly; only as far as back stays flat.",
          "Return with control; alternate sides. Move slow — this is not a race.",
        ],
        commonMistakes: [
          "Low back arching off the floor as leg extends",
          "Moving too fast and losing core tension",
          "Holding breath the entire rep",
        ],
        stopConditions: [...DEFAULT_STOP, "Low-back arching you can't control"],
      }),
      ex({
        id: "chacha-13",
        name: "Bird dog",
        tldr: "Teaches back and core to stay stable while arms/legs move, great for low-back control.",
        videoId: "wiF9KrmGAOg",
        category: "Core",
        prescription: { sets: 3, reps: 8, description: "3 × 8 per side" },
        instructions: [
          "Hands under shoulders, knees under hips (or fists if wrists prefer neutral).",
          "Brace core; imagine balancing a cup of water on your low back.",
          "Reach arm and opposite leg LONG — not HIGH. Stop before pelvis rotates.",
          "Hold 2–3 sec, return with control. Quality beats range.",
        ],
        commonMistakes: [
          "Lifting leg so high the low back arches",
          "Rotating hips or shoulders open",
          "Rushing reps instead of short holds",
        ],
      }),
      ex({
        id: "chacha-14",
        name: "Side plank",
        tldr: "Builds side core strength without loaded twisting that could irritate the spine.",
        videoId: "K3HEn8V_9M4",
        category: "Core",
        prescription: { sets: 3, holdSeconds: 20, description: "3 × 20 sec each side" },
        instructions: [
          "Start on forearm — elbow directly under shoulder, forearm pointing forward.",
          "Knees bent (easier) or legs straight; hips lifted to a straight line.",
          "Brace obliques; don't let hips sag or pike up.",
          "Breathe steadily during the hold; build time gradually.",
        ],
        commonMistakes: [
          "Elbow too far forward or behind shoulder",
          "Hips sagging toward the floor",
          "Holding breath and turning red — breathe!",
        ],
        stopConditions: [...DEFAULT_STOP, "Shoulder pain on the bottom arm"],
      }),
      ex({
        id: "chacha-15",
        name: "Front plank",
        tldr: "Simple full-core brace drill, no crunching so it's easier on the back.",
        videoId: "pSHjTRCQxIw",
        category: "Core",
        prescription: { sets: 3, holdSeconds: 30, description: "3 × 30 sec" },
        instructions: [
          "Forearms or hands on floor; body in one straight line head to heels.",
          "Ribs down, glutes on, core braced — squeeze like bracing for a poke.",
          "If wrists hurt: use forearm plank or push-up handles for neutral wrists.",
          "Stop the hold when form breaks, not when you hit a time target.",
        ],
        commonMistakes: [
          "Hips sagging (low back overload) or piking hips up",
          "Holding breath the entire time",
          "Hands too far forward, bending wrists back sharply",
        ],
        stopConditions: [...DEFAULT_STOP, "Wrist extension pain — switch to forearm plank"],
      }),
    ],
  },
];

// ── Wednesday: Chest ─────────────────────────────────────────────────────────
const wednesdayBlocks: ExerciseBlock[] = [
  {
    id: "chacha-wed-chest",
    name: "💪 Wednesday — Chest",
    description: `Joint-friendly pressing · wrist-neutral options · ${CHACHA_PAIN_RULE}`,
    estimatedMinutes: 40,
    exercises: [
      ex({
        id: "chacha-16",
        name: "Push-ups (hands elevated if needed)",
        tldr: "Chest and triceps work with a natural position for wrists and shoulders.",
        videoId: "Mo07RIm_Zfs",
        category: "Chest",
        instructions: [
          "Hands under shoulders, fingers spread, slight external rotation (fingers point slightly out).",
          "Body straight line — brace core, squeeze glutes; don't sag hips.",
          "Lower with elbows ~45° from torso (not flared 90°).",
          "Use a bench/box to elevate hands if floor push-ups stress wrists or shoulders.",
          "Push-up bars or dumbbells keep wrists neutral if flat palms hurt.",
        ],
        commonMistakes: [
          "Hands too far forward, crushing wrists at extension",
          "Elbows flaring straight out (shoulder impingement risk)",
          "Hips sagging or piking — breaks spinal alignment",
          "Partial reps with head jutting forward",
        ],
        stopConditions: [...DEFAULT_STOP, "Wrist extension pain — elevate hands or use handles"],
      }),
      ex({
        id: "chacha-17",
        name: "Flat bench press (barbell or dumbbell)",
        tldr: "Main chest strength move while lying supported, minimal stress on knees/ankles.",
        videoId: "rT7DgCr-3ps",
        category: "Chest",
        instructions: [
          "Retract and depress shoulder blades into the bench before unracking.",
          "Grip ~1.3× shoulder width; bar path to lower sternum, not upper chest.",
          "Elbows ~45–75° from torso; wrists stacked over elbows.",
          "Feet flat on floor; slight arch is fine but don't bridge hips off bench.",
          "Control the descent (2–3 sec); no bouncing off the chest.",
        ],
        commonMistakes: [
          "Flaring elbows to 90° (shoulder stress)",
          "Bouncing the bar off the chest",
          "Losing shoulder blade retraction during the press",
          "Wrists bent back under the bar — keep them neutral/stacked",
        ],
      }),
      ex({
        id: "chacha-18",
        name: "Incline dumbbell press",
        tldr: "Hits upper chest and shoulders in a joint-friendly angle.",
        videoId: "8iPvZ69Y19A",
        category: "Chest",
        instructions: [
          "Bench 30–45° incline; shoulder blades pinned to bench.",
          "Neutral or slight angled grip reduces shoulder stress vs barbell.",
          "Lower dumbbells to upper chest level with elbows tucked.",
          "Press up without clanking weights at the top.",
        ],
        commonMistakes: [
          "Incline too steep (becomes shoulder press, not chest)",
          "Letting shoulders roll forward off the bench",
          "Dropping dumbbells too deep behind shoulder line",
        ],
      }),
      ex({
        id: "chacha-19",
        name: "Machine or cable chest press",
        tldr: "Back is supported so you can press without worrying about spine position.",
        videoId: "W79v21_M6hY",
        category: "Chest",
        instructions: [
          "Adjust seat so handles align with mid-chest; back flat against pad.",
          "Press without locking elbows hard at the top.",
          "Control the return — 2 sec eccentric.",
          "Keep wrists neutral; don't hyperextend them backward on the press.",
        ],
        commonMistakes: [
          "Seat too low or high — puts shoulders in a bad angle",
          "Lifting hips off the seat to cheat weight up",
        ],
      }),
      ex({
        id: "chacha-20",
        name: "Chest fly (cable or light DB)",
        tldr: "Adds chest stretch and squeeze with light load so shoulders stay safe.",
        videoId: "eGjt4lk66zo",
        category: "Chest",
        instructions: [
          "Slight bend in elbows stays fixed — this is an arc, not a press.",
          "Stop when upper arms reach torso line; don't stretch past comfort.",
          "Squeeze chest at the top; control the opening phase.",
          "Use light weight — flyes punish ego lifting.",
        ],
        commonMistakes: [
          "Turning flyes into a press by bending elbows more at the bottom",
          "Going too heavy and overstretching the shoulder",
          "Jerking the weight up with momentum",
        ],
        stopConditions: [...DEFAULT_STOP, "Front-of-shoulder pinching at the bottom"],
      }),
      ex({
        id: "chacha-21",
        name: "Optional assisted/band dips",
        tldr: "Extra chest/triceps work only if shoulders and back feel 100% okay.",
        videoId: "J32Ym7qXz3c",
        category: "Chest",
        prescription: { description: "Optional · 2 × 8–10 if feeling good" },
        instructions: [
          "Skip entirely if shoulders or sternum feel off — this is optional.",
          "Use band assist or machine until you can control full bodyweight.",
          "Slight forward lean for chest; keep shoulders down, not shrugged.",
          "Lower only to a depth with zero shoulder pinch.",
        ],
        commonMistakes: [
          "Dipping too deep with shoulders rolling forward",
          "Doing these when fatigued from pressing (injury risk)",
          "Shrugging shoulders to ears at the bottom",
        ],
        stopConditions: [...DEFAULT_STOP, "Any shoulder pinch — skip this exercise entirely"],
      }),
    ],
  },
];

// ── Thursday: Back ─────────────────────────────────────────────────────────
const thursdayBlocks: ExerciseBlock[] = [
  {
    id: "chacha-thu-back",
    name: "🔙 Thursday — Back",
    description: `Supported pulling + glute work · ${CHACHA_PAIN_RULE}`,
    estimatedMinutes: 45,
    exercises: [
      ex({
        id: "chacha-22",
        name: "Cat-camel / light back mobility",
        tldr: "Gently moves the spine to reduce stiffness without loading it.",
        videoId: "CXD020DbeBM",
        category: "Mobility",
        prescription: { description: "5 min gentle flow" },
        instructions: [
          "On all fours; slow alternating cat (round) and camel (arch) positions.",
          "Small range — this is NOT a deep backbend or crunch.",
          "Move with breath: exhale on round, inhale on arch.",
          "Stop if any segment feels sharp — stay in pain-free range.",
        ],
        commonMistakes: [
          "Moving too fast through end ranges",
          "Collapsing into the low back on the camel phase",
        ],
      }),
      ex({
        id: "chacha-23",
        name: "Lat pulldown (neutral or shoulder-width grip)",
        tldr: "Trains lats and upper back while seated and supported.",
        videoId: "CAwf7n6Luuc",
        category: "Back",
        instructions: [
          "Neutral or slightly wider than shoulder grip; thighs secured under pad.",
          "Pull elbows down toward ribs — think 'elbows to back pockets'.",
          "Squeeze shoulder blades together at the bottom; control the return.",
          "Don't lean back excessively or use body momentum.",
        ],
        commonMistakes: [
          "Pulling behind the neck (skip — use front pulldown only)",
          "Yanking with body English instead of lats",
          "Shrugging shoulders up during the pull",
        ],
      }),
      ex({
        id: "chacha-24",
        name: "One-arm dumbbell row (bench-supported)",
        tldr: "Rowing strength with support so your low back doesn't work as hard as a stabilizer.",
        videoId: "pYcpY20QaFM",
        category: "Back",
        prescription: { sets: 3, reps: 10, description: "3 × 10 per arm" },
        instructions: [
          "One hand and same-side knee on bench; back flat like a tabletop.",
          "Row dumbbell to hip pocket — elbow close to body.",
          "Lower with control; don't twist the torso to heave weight up.",
          "Keep neck neutral — look at the floor, not up.",
        ],
        commonMistakes: [
          "Rotating torso to cheat the weight up",
          "Rounding the supported-side low back",
          "Pulling elbow flared out to 90° (shoulder stress)",
        ],
      }),
      ex({
        id: "chacha-25",
        name: "Chest-supported row",
        tldr: "Upper-back strength without loading the lower back at all.",
        videoId: "H75im9fA1G8",
        category: "Back",
        instructions: [
          "Chest fully against pad; feet flat, core lightly braced.",
          "Pull handles to lower ribs; squeeze shoulder blades 1 sec at top.",
          "Control the eccentric — don't let weight yank arms forward.",
          "Keep wrists neutral; don't curl the weight with wrists.",
        ],
        commonMistakes: [
          "Lifting chest off pad to shorten range",
          "Using momentum at the start of each rep",
        ],
      }),
      ex({
        id: "chacha-26",
        name: "Hip thrust or glute bridge",
        tldr: "Glute strength for hip and back support, very little knee or spine movement.",
        videoId: "LM8LGhm76N4",
        category: "Back/Glutes",
        instructions: [
          "Upper back on bench (hip thrust) or floor (bridge); feet hip-width.",
          "Drive through heels; squeeze glutes hard at the top.",
          "Stop at full hip extension — don't hyperextend the low back.",
          "Chin tucked; look forward, not at the ceiling.",
        ],
        commonMistakes: [
          "Hyperextending lumbar spine at the top instead of using glutes",
          "Pushing through toes instead of heels",
          "Rushing reps without a pause at the top",
        ],
      }),
      ex({
        id: "chacha-27",
        name: "Superman / alternate Superman (small range, optional)",
        tldr: "Light lower-back endurance work; keep the range tiny to avoid irritation.",
        videoId: "z6PJMT2y8GQ",
        category: "Back",
        prescription: { description: "Optional · 2 × 8–10 small range" },
        instructions: [
          "Lie face down; lift opposite arm and leg just 2–3 inches off floor.",
          "Hold 2–3 sec; keep neck neutral (look at floor).",
          "Tiny range only — you're building endurance, not max extension.",
          "Skip if any low-back pinch; bird dog is the safer alternative.",
        ],
        commonMistakes: [
          "Lifting arm and leg too high (compresses lumbar spine)",
          "Holding breath and straining",
          "Doing these when back is already irritated",
        ],
        stopConditions: [...DEFAULT_STOP, "Any low-back pinch — skip and use bird dog instead"],
      }),
      ex({
        id: "chacha-28",
        name: "Shrugs",
        tldr: "Builds traps to help posture without stressing knees or ankles.",
        videoId: "MInyXw9w_zE",
        category: "Back",
        instructions: [
          "Dumbbells at sides; stand tall, core braced.",
          "Shrug straight UP toward ears — no rolling shoulders forward/back.",
          "Hold 1 sec at top; lower with control.",
          "Keep arms straight; don't bend elbows to cheat.",
        ],
        commonMistakes: [
          "Rolling shoulders in a circle (outdated cue, adds no benefit)",
          "Using too much weight and jerking",
        ],
      }),
    ],
  },
];

// ── Friday: Arms & Shoulders ─────────────────────────────────────────────────
const fridayBlocks: ExerciseBlock[] = [
  {
    id: "chacha-fri-biceps",
    name: "💪 Biceps",
    description: `Wrist-friendly arm work · ${CHACHA_PAIN_RULE}`,
    estimatedMinutes: 12,
    exercises: [
      ex({
        id: "chacha-29",
        name: "Dumbbell curl",
        tldr: "Simple biceps work with neutral, controllable wrist position.",
        videoId: "ykJmrZ5v0M0",
        category: "Biceps",
        instructions: [
          "Stand tall, elbows pinned to your sides (don't swing).",
          "Supinate as you curl; wrists stay straight — don't curl with wrists.",
          "Lower under control to full extension without hyperextending elbows.",
          "Use weight you can curl with zero torso swing.",
        ],
        commonMistakes: [
          "Swinging hips and back to start the weight",
          "Elbows drifting forward",
          "Wrist curling under the weight at the top",
        ],
        stopConditions: [...DEFAULT_STOP, "Elbow or wrist pain at full extension"],
      }),
      ex({
        id: "chacha-30",
        name: "Hammer curl",
        tldr: "Biceps and forearms with a neutral grip that's easier on the wrist.",
        videoId: "TwD-YGOY5kE",
        category: "Biceps",
        instructions: [
          "Palms face each other (neutral grip) the entire rep.",
          "Elbows stay at sides; no swinging.",
          "This grip is often the most wrist-friendly curl variation.",
          "Control the lowering phase.",
        ],
        commonMistakes: [
          "Rotating into supination mid-rep (defeats the purpose)",
          "Using momentum from the hips",
        ],
      }),
      ex({
        id: "chacha-31",
        name: "Reverse curl",
        tldr: "Hits forearms and biceps; keep weight light for wrist comfort.",
        videoId: "4K9E_DclpYg",
        category: "Biceps",
        instructions: [
          "Palms face DOWN (pronated grip); use lighter weight than regular curls.",
          "Elbows pinned; curl without wrist flexion — forearms do the work.",
          "Stop if top-of-forearm or wrist feels pinchy.",
        ],
        commonMistakes: [
          "Going too heavy — reverse curls punish the wrists",
          "Using wrist movement instead of elbow flexion",
        ],
        stopConditions: [...DEFAULT_STOP, "Top-of-forearm or wrist pinching — reduce weight or skip"],
      }),
    ],
  },
  {
    id: "chacha-fri-shoulders",
    name: "🏋️ Shoulders",
    description: `Supported overhead + rear-delt work · ${CHACHA_PAIN_RULE}`,
    estimatedMinutes: 15,
    exercises: [
      ex({
        id: "chacha-32",
        name: "Seated DB or machine shoulder press (back supported)",
        tldr: "Overhead strength with back support so you don't arch and stress your spine.",
        videoId: "qEwKCR5JCog",
        category: "Shoulders",
        instructions: [
          "Back fully against pad; feet flat.",
          "Press overhead without arching low back off the pad.",
          "Stop just before elbow lockout if shoulders feel pinchy.",
          "Ribs stay down; don't flare them up as you press.",
        ],
        commonMistakes: [
          "Low back arching off the pad (spine stress)",
          "Pressing behind the head — always press in front",
          "Shrugging shoulders to ears at the top",
        ],
        stopConditions: [...DEFAULT_STOP, "Shoulder impingement pinching at top of press"],
      }),
      ex({
        id: "chacha-33",
        name: "Lateral raise",
        tldr: "Builds side delts with light weight and minimal joint loading.",
        videoId: "3VcKaXpzqRo",
        category: "Shoulders",
        prescription: { sets: 3, reps: 12, description: "3 × 12 reps" },
        instructions: [
          "Light weight — this is NOT a heavy lift.",
          "Lead with elbows, not hands; raise to shoulder height max.",
          "Soft elbow bend; pinkies slightly up (optional cue).",
          "Lower slowly — the eccentric matters here.",
        ],
        commonMistakes: [
          "Using too much weight and shrugging traps instead of delts",
          "Raising above shoulder height (impingement risk)",
          "Swinging torso to start the weight",
        ],
      }),
      ex({
        id: "chacha-34",
        name: "Face pull",
        tldr: "Great for upper-back and rear-shoulder posture, helps protect shoulders long-term.",
        videoId: "V8dZ39E_u38",
        category: "Shoulders",
        prescription: { sets: 3, reps: 15, description: "3 × 15 reps" },
        instructions: [
          "Cable at face height; rope attachment.",
          "Pull toward forehead/nose; elbows HIGH and flared out.",
          "Externally rotate at end — thumbs point back.",
          "Squeeze shoulder blades; hold 1 sec. Light weight, high reps.",
        ],
        commonMistakes: [
          "Pulling to the chest instead of face (wrong angle)",
          "Using too much weight and losing the external rotation",
          "Shrugging instead of retracting shoulder blades",
        ],
      }),
      ex({
        id: "chacha-35",
        name: "Reverse fly (cable/band or incline bench)",
        tldr: "Targets rear delts and upper back without heavy spinal loading.",
        videoId: "KzL_n_zizv8",
        category: "Shoulders",
        prescription: { sets: 3, reps: 12, description: "3 × 12 reps" },
        instructions: [
          "Hinge slightly at hips or lie chest-down on incline bench.",
          "Lead with elbows; squeeze shoulder blades at the top.",
          "Control the return — don't let gravity drop the weight.",
          "Keep neck neutral.",
        ],
        commonMistakes: [
          "Using momentum from the hips",
          "Shrugging traps instead of using rear delts",
          "Going too heavy and losing form",
        ],
      }),
    ],
  },
  {
    id: "chacha-fri-triceps",
    name: "🔱 Triceps",
    description: `Stable-elbow triceps isolation · ${CHACHA_PAIN_RULE}`,
    estimatedMinutes: 12,
    exercises: [
      ex({
        id: "chacha-36",
        name: "Cable pushdown",
        tldr: "Triceps work with very stable elbow/wrist position and no back stress.",
        videoId: "2-LAMcpzODU",
        category: "Triceps",
        instructions: [
          "Elbows pinned to your sides — they shouldn't move forward/back.",
          "Push down to full extension without snapping elbows locked.",
          "Wrists stay neutral; don't curl wrists at the bottom.",
          "Control the return — don't let the stack pull your arms up.",
        ],
        commonMistakes: [
          "Elbows drifting forward (turns into a press)",
          "Leaning over the cable and using bodyweight",
          "Using too much weight and partial reps",
        ],
      }),
      ex({
        id: "chacha-37",
        name: "Overhead rope extension (light)",
        tldr: "Extra triceps work; keep load light and core tight to protect your back.",
        videoId: "ns-VnF9q9pM",
        category: "Triceps",
        instructions: [
          "Light weight only; stand tall, core braced, ribs down.",
          "Elbows point forward/up — don't let them flare wide.",
          "Extend fully without low back arching.",
          "Slow eccentric — feel the triceps stretch at the top.",
        ],
        commonMistakes: [
          "Arching low back to get the weight overhead",
          "Elbows flaring wide (shoulder stress)",
          "Going too heavy and turning it into a pullover",
        ],
        stopConditions: [...DEFAULT_STOP, "Low-back arching you can't control"],
      }),
      ex({
        id: "chacha-38",
        name: "Kickbacks",
        tldr: "Isolation for triceps with small weights and controlled motion so joints stay happy.",
        videoId: "6SS6K3lAwWI",
        category: "Triceps",
        prescription: { sets: 3, reps: 12, description: "3 × 12 per arm" },
        instructions: [
          "Hinge forward; upper arm parallel to floor and locked in place.",
          "Extend forearm back until arm is straight; squeeze triceps 1 sec.",
          "Use very light weight — momentum ruins this exercise.",
          "Keep shoulder down; don't shrug as you extend.",
        ],
        commonMistakes: [
          "Swinging the dumbbell with shoulder movement",
          "Using too much weight (most common mistake)",
          "Dropping the weight on the eccentric",
        ],
      }),
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
