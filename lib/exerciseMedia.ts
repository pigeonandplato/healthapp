// Exercise media - Using most reliable YouTube sources
// Bodybuilding.com, HASfit, and major fitness channels

import { ExerciseMedia } from "./types";

export const exerciseMediaMap: Record<string, ExerciseMedia> = {
  // DAILY HIP MAINTENANCE
  "piriformis-stretch-90-90": {
    type: "video",
    videoUrl: "https://www.youtube.com/embed/P4GfbdNvOT8", // 90/90 Hip Stretch
    src: "/exercises/figure-4-stretch.jpg",
    alt: "90/90 hip stretch demonstration",
  },
  "deep-glute-massage": {
    type: "video",
    videoUrl: "https://www.youtube.com/embed/bEqjBDiSe4M", // Lacrosse Ball Glute Massage
    src: "/exercises/figure-4-stretch.jpg",
    alt: "Deep glute self-massage with ball",
  },
  
  // DAY A: LOWER BODY
  "diaphragmatic-breathing": {
    type: "video",
    videoUrl: "https://www.youtube.com/embed/1Pdvf5KhnFI", // Bodybuilding.com - Diaphragmatic Breathing
    src: "/exercises/diaphragmatic-breathing.jpg",
    alt: "Diaphragmatic breathing technique",
  },
  "cat-cow": {
    type: "video",
    videoUrl: "https://www.youtube.com/embed/kqnua4rHVVA", // Yoga With Adriene - Cat Cow
    src: "/exercises/cat-cow.jpg",
    alt: "Cat-cow yoga pose",
  },
  "glute-bridges": {
    type: "video",
    videoUrl: "https://www.youtube.com/embed/zezFGgSbj3I", // Glute Bridge (Slow)
    src: "/exercises/glute-bridges.jpg",
    alt: "Glute bridge exercise",
  },
  "sit-to-stand": {
    type: "video",
    videoUrl: "https://www.youtube.com/embed/dQqApCGd5Ss", // Step-Up (Low Step)
    src: "/exercises/sit-to-stand.jpg",
    alt: "Sit to stand exercise",
  },
  "wall-ankle-mobility": {
    type: "video",
    videoUrl: "https://www.youtube.com/embed/Lcw4HXnH-8E", // Wall Ankle Rocks
    src: "/exercises/wall-ankle-mobility.jpg",
    alt: "Wall ankle mobility drill",
  },
  "calf-raises": {
    type: "video",
    videoUrl: "https://www.youtube.com/embed/r1YBXgc0bdE", // Calf Raises (Slow Eccentric)
    src: "/exercises/wall-ankle-mobility.jpg",
    alt: "Calf raise exercise",
  },
  "half-kneeling-hip-flexor": {
    type: "video",
    videoUrl: "https://www.youtube.com/embed/ctMrDzw8LYQ", // Hip Hinge Drill (Dowel)
    src: "/exercises/half-kneeling-hip-flexor.jpg",
    alt: "Half-kneeling hip flexor stretch",
  },
  
  // DAY B: CORE & UPPER
  "pelvic-tilts": {
    type: "video",
    videoUrl: "https://www.youtube.com/embed/xmVJJCmlRSM", // Ask Doctor Jo - Pelvic Tilt
    src: "/exercises/pelvic-tilts.jpg",
    alt: "Pelvic tilt exercise",
  },
  "dead-bug": {
    type: "video",
    videoUrl: "https://www.youtube.com/embed/sYFpcWgnF7Y", // Bird-Dog (McGill Style)
    src: "/exercises/dead-bug.jpg",
    alt: "Dead bug core exercise",
  },
  "side-plank": {
    type: "video",
    videoUrl: "https://www.youtube.com/embed/i-kqDaOsvDk", // Short-Lever Side Plank
    src: "/exercises/side-plank.jpg",
    alt: "Modified side plank",
  },
  "wrist-circles": {
    type: "video",
    videoUrl: "https://www.youtube.com/embed/UrhH2YeQ90A", // Ask Doctor Jo - Wrist Exercises
    src: "/exercises/wrist-circles.jpg",
    alt: "Wrist circles and mobility",
  },
  "isometric-wrist-extension": {
    type: "video",
    videoUrl: "https://www.youtube.com/embed/fdCTEqnQcFg", // Bob & Brad - Wrist Strengthening
    src: "/exercises/isometric-wrist-extension.jpg",
    alt: "Isometric wrist extension",
  },
  
  // DAY C: RECOVERY
  "quad-sets": {
    type: "video",
    videoUrl: "https://www.youtube.com/embed/LqE0VQeVoeg", // Ask Doctor Jo - Quad Sets
    src: "/exercises/quad-sets.jpg",
    alt: "Quadriceps setting exercise",
  },
  "side-lying-hip-abduction": {
    type: "video",
    videoUrl: "https://www.youtube.com/embed/16d0Oh92SbU", // Ask Doctor Jo - Hip Abduction
    src: "/exercises/side-lying-hip-abduction.jpg",
    alt: "Side-lying hip abduction",
  },
  "flat-walk": {
    type: "video",
    videoUrl: "https://www.youtube.com/embed/3V9YV5_6Y58", // Flat Walk (Easy)
    src: "/exercises/flat-walk.jpg",
    alt: "Proper walking technique",
  },
  
  // SHARED EXERCISES
  "figure-4-stretch": {
    type: "video",
    videoUrl: "https://www.youtube.com/embed/KabcM5Vokk8", // Figure-4 Stretch
    src: "/exercises/figure-4-stretch.jpg",
    alt: "Figure-4 piriformis stretch",
  },
  "childs-pose": {
    type: "video",
    videoUrl: "https://www.youtube.com/embed/-wSVvUX5qAA", // Child's Pose + Hip Circles
    src: "/exercises/childs-pose.jpg",
    alt: "Child's pose yoga",
  },
  
  // LEGACY EXERCISES (kept for compatibility)
  "tke-band": {
    type: "video",
    videoUrl: "https://www.youtube.com/embed/yI-36ty2GDY", // Ask Doctor Jo - TKE
    src: "/exercises/tke-band.jpg",
    alt: "Terminal knee extension with band",
  },
  "eccentric-sit-to-stand": {
    type: "video",
    videoUrl: "https://www.youtube.com/embed/FBP0wljkXu4", // Bob & Brad
    src: "/exercises/eccentric-sit-to-stand.jpg",
    alt: "Eccentric sit to stand",
  },
  "wrist-neutral-isometrics": {
    type: "video",
    videoUrl: "https://www.youtube.com/embed/fdCTEqnQcFg", // Bob & Brad
    src: "/exercises/wrist-neutral-isometrics.jpg",
    alt: "Wrist isometric strengthening",
  },
  "towel-squeeze": {
    type: "video",
    videoUrl: "https://www.youtube.com/embed/St5P5i6L1NY", // Ask Doctor Jo
    src: "/exercises/towel-squeeze.jpg",
    alt: "Grip strengthening",
  },
  "ulnar-nerve-glide": {
    type: "video",
    videoUrl: "https://www.youtube.com/embed/KQIEuMuHq88", // Ulnar Nerve Glide (Gentle)
    src: "/exercises/ulnar-nerve-glide.jpg",
    alt: "Ulnar nerve gliding exercise",
  },
  "peloton": {
    type: "video",
    videoUrl: "https://www.youtube.com/embed/3O_e1jA0q_E", // Elliptical/Peloton (Form)
    src: "/exercises/peloton.jpg",
    alt: "Low impact cycling workout",
  },
  "supine-breathing": {
    type: "video",
    videoUrl: "https://www.youtube.com/embed/1Pdvf5KhnFI", // Bodybuilding.com
    src: "/exercises/supine-breathing.jpg",
    alt: "Supine breathing and relaxation",
  },
  
  
  // NEW EXERCISES - ALL UPDATED!
  "mcgill-curlup": {
    type: "video",
    videoUrl: "https://www.youtube.com/embed/A7HH8DivGB0", // McGill Curl-Up
    src: "/exercises/generic.jpg",
    alt: "McGill curl-up exercise",
  },
  "bird-dog": {
    type: "video",
    videoUrl: "https://www.youtube.com/embed/sYFpcWgnF7Y", // Bird-Dog
    src: "/exercises/generic.jpg",
    alt: "Bird-dog exercise",
  },
  "hip-hinge-drill": {
    type: "video",
    videoUrl: "https://www.youtube.com/embed/ctMrDzw8LYQ", // Hip Hinge Drill
    src: "/exercises/generic.jpg",
    alt: "Hip hinge drill with dowel",
  },
  "clamshell": {
    type: "video",
    videoUrl: "https://www.youtube.com/embed/73Lrrw5wBgk", // Clamshell
    src: "/exercises/generic.jpg",
    alt: "Clamshell exercise",
  },
  "split-squat": {
    type: "video",
    videoUrl: "https://www.youtube.com/embed/SGHnCftrZkA", // Split Squat
    src: "/exercises/generic.jpg",
    alt: "Split squat exercise",
  },
  "incline-walk": {
    type: "video",
    videoUrl: "https://www.youtube.com/embed/Gf-6DqN_Mog", // Incline Walk / Stair Master
    src: "/exercises/generic.jpg",
    alt: "Incline walking",
  },
  "run-walk": {
    type: "video",
    videoUrl: "https://www.youtube.com/embed/M5F88v-u7s8", // Run-Walk Intervals
    src: "/exercises/generic.jpg",
    alt: "Run-walk intervals",
  },
  "easy-run": {
    type: "video",
    videoUrl: "https://www.youtube.com/embed/L6_fR3K7l3E", // Easy Running Form
    src: "/exercises/generic.jpg",
    alt: "Easy running technique",
  },
  "single-leg-rdl": {
    type: "video",
    videoUrl: "https://www.youtube.com/embed/MsE_T9nAsSE", // Single-Leg RDL
    src: "/exercises/generic.jpg",
    alt: "Single-leg Romanian deadlift",
  },
  
  // Generic placeholder
  "generic-exercise": {
    type: "image",
    src: "/exercises/generic.jpg",
    alt: "Exercise placeholder",
  },
};
