// Habit Coach intervention engine.
//
// This is a deterministic keyword "playbook" — no LLM needed for v1. It runs on
// the server (app/api/habit-coach) AND can run on the client as an offline
// fallback, so a user mid-urge always gets help even with no connection.
//
// Design: every "stop doing" habit is tied back to ADHD brain impact AND to
// knee/back rehab consequences, then offered a 2-minute swap and a guilt-free
// minimum win.

export type HabitKind = "break" | "build";

export interface Intervention {
  headline: string;
  brainImpact: string;
  bodyImpact: string;
  doInstead: string;
  minimumWin: string;
  youtubeSearchUrl: string;
  videoId?: string;
  videoTitle?: string;
}

// Curated YouTube IDs reused across playbook entries.
const VIDEO = {
  mcGillBig3: { id: "FmZwkgg7pqU", title: "McGill Big 3 — core rehab routine" },
  walkSnack: { id: "enYITYwvPAQ", title: "5-minute walk break" },
};

export function youtubeSearch(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

type PlaybookEntry = {
  keywords: string[];
  kind: HabitKind;
  build: (label: string) => Intervention;
};

// Ordered list; matching picks the entry whose matched keyword is LONGEST.
const PLAYBOOK: PlaybookEntry[] = [
  {
    kind: "break",
    keywords: [
      "eating out",
      "eat out",
      "takeout",
      "take out",
      "doordash",
      "uber eats",
      "ubereats",
      "delivery",
      "order food",
      "order pizza",
      "ordering",
      "fast food",
      "pizza",
      "mcdonald",
      "drive thru",
      "drive-thru",
    ],
    build: () => ({
      headline: "Pause before you order — this is the urge talking, not hunger.",
      brainImpact:
        "Ordering out is a dopamine shortcut. Your ADHD brain wants the fast hit of effort-free, hyper-palatable food. Giving in trains it to skip the 'cook → reward' loop, making cooking feel even harder next time.",
      bodyImpact:
        "Takeout is usually high in inflammatory oils and sodium and low in the protein your knee and back need to rebuild tissue. Steady protein + whole foods is what actually drives rehab recovery — one ordered meal won't ruin you, but the pattern stalls progress.",
      doInstead:
        "Walk to the fridge and set a 10-minute timer. Make the easiest protein thing you have — eggs, Greek yogurt, leftovers, a wrap. You're only committing to 10 minutes.",
      minimumWin:
        "Can't cook? Drink a full glass of water and eat ONE protein item (yogurt, cheese, a boiled egg, a scoop of cottage cheese). That still counts as a win.",
      youtubeSearchUrl: youtubeSearch("10 minute high protein meal ADHD easy"),
    }),
  },
  {
    kind: "break",
    keywords: [
      "phone",
      "scroll",
      "scrolling",
      "doomscroll",
      "doom scroll",
      "tiktok",
      "tik tok",
      "instagram",
      "insta",
      "social media",
      "reels",
      "youtube shorts",
      "shorts",
      "twitter",
      "reddit",
    ],
    build: () => ({
      headline: "Put the phone down — your rehab needs the next 5 minutes more.",
      brainImpact:
        "Infinite scroll hijacks your prefrontal cortex — the exact part of the ADHD brain that struggles with starting tasks. Each swipe is a tiny dopamine reward that makes the boring-but-important stuff (rehab) feel impossible to begin.",
      bodyImpact:
        "Scrolling = more sitting, usually hunched. That loads your lumbar discs and stiffens your hips and knees. The longer the session, the worse your back feels when you finally stand up.",
      doInstead:
        "Physically put the phone in another room. Then do ONE rehab set right where you are — a single McGill exercise or a set of your knee work. Movement breaks the scroll trance.",
      minimumWin:
        "Just stand up and do 5 slow reps of one exercise. That's the whole ask. Standing alone resets the loop.",
      youtubeSearchUrl: youtubeSearch("McGill big 3 back rehab follow along"),
      videoId: VIDEO.mcGillBig3.id,
      videoTitle: VIDEO.mcGillBig3.title,
    }),
  },
  {
    kind: "break",
    keywords: [
      "skip workout",
      "skip rehab",
      "skip break",
      "skip exercise",
      "skip my",
      "skipping",
      "miss workout",
      "miss rehab",
      "not workout",
      "avoid workout",
    ],
    build: () => ({
      headline: "The rule is simple: never miss twice. Today still counts.",
      brainImpact:
        "ADHD makes consistency feel all-or-nothing — miss once and the brain says 'the streak's broken, why bother.' That shame spiral is the real enemy, not the missed day. Showing up tiny keeps the identity 'I'm someone who does my rehab' alive.",
      bodyImpact:
        "Rehab works through frequency, not intensity. Skipping lets your stabilizers switch back off and your knee/back stiffen. A 5-minute minimum keeps the tissue adapting and the pain trending down.",
      doInstead:
        "Don't do the full session — do the minimum win. One round of the McGill Big 3, then a 5-minute walk. That's a complete, legitimate day.",
      minimumWin:
        "Lie down and do ONE McGill curl-up + ONE side plank hold (even 5 seconds). Then decide if you want more. Usually you will.",
      youtubeSearchUrl: youtubeSearch("McGill big 3 quick routine"),
      videoId: VIDEO.mcGillBig3.id,
      videoTitle: VIDEO.mcGillBig3.title,
    }),
  },
  {
    kind: "break",
    keywords: ["snack", "sugar", "junk", "soda", "chips", "sweets", "candy"],
    build: () => ({
      headline: "Ride the craving — it peaks and fades in about 10 minutes.",
      brainImpact:
        "Sugar/junk cravings are a fast dopamine grab. The ADHD brain is extra sensitive to that hit, which is why 'just one' rarely stays one. Naming the urge ('this is a craving, not a need') gives your prefrontal cortex a second to step in.",
      bodyImpact:
        "Sugar spikes drive inflammation, which directly works against joint and disc recovery. Protein and water keep you full and give your rehab the building blocks it needs.",
      doInstead:
        "Drink a big glass of water, wait 10 minutes, and grab a protein-forward snack instead (yogurt, jerky, cheese, nuts).",
      minimumWin: "Just the glass of water first. Re-check the craving after — it's usually smaller.",
      youtubeSearchUrl: youtubeSearch("beat sugar cravings ADHD tips"),
    }),
  },
  // ----- BUILD (good habit encouragement) -----
  {
    kind: "build",
    keywords: ["cook", "meal prep", "meal-prep", "make dinner", "make lunch", "make food"],
    build: () => ({
      headline: "Cooking is a win for your brain AND your recovery. Let's make it tiny.",
      brainImpact:
        "Cooking is a 'completion loop' your ADHD brain loves once started — chop, cook, eat, done. The hard part is initiation, so shrink it: one pan, three ingredients.",
      bodyImpact:
        "Home cooking lets you hit the steady protein your knee and back need to rebuild, without the inflammatory oils of takeout.",
      doInstead:
        "Set a 10-minute timer and just do the first step — get the pan out, crack the eggs, chop one thing. Momentum does the rest.",
      minimumWin: "Make the simplest possible protein (eggs, yogurt bowl, a wrap). Simple still counts.",
      youtubeSearchUrl: youtubeSearch("easy 3 ingredient high protein meal"),
    }),
  },
  {
    kind: "build",
    keywords: ["walk", "go for a walk", "steps", "outside"],
    build: () => ({
      headline: "A short walk is one of the best things for your back, knees, and focus.",
      brainImpact:
        "Walking raises dopamine and norepinephrine — the same systems ADHD meds target. Even 5–10 minutes sharpens focus for the next couple of hours.",
      bodyImpact:
        "Gentle walking pumps nutrients into your spinal discs and knee cartilage and loosens stiff hips. It's active recovery, not strain.",
      doInstead: "Put your shoes on and step outside for just 5 minutes. You can always turn around — you won't.",
      minimumWin: "One lap around the block, or 5 minutes pacing indoors. Showing up beats distance.",
      youtubeSearchUrl: youtubeSearch("benefits of walking for back pain and ADHD"),
      videoId: VIDEO.walkSnack.id,
      videoTitle: VIDEO.walkSnack.title,
    }),
  },
  {
    kind: "build",
    keywords: ["rehab break", "do rehab", "rehab", "stretch", "mobility", "exercise", "workout"],
    build: () => ({
      headline: "Take the rehab break now — future-you will feel it.",
      brainImpact:
        "Doing the break the moment you think of it beats your ADHD brain's 'I'll do it later' (which becomes never). Acting on the impulse while it's hot is your superpower here.",
      bodyImpact:
        "Frequent short rehab sessions are what retrain your stabilizers and calm knee/back pain. Consistency, not intensity, is the lever.",
      doInstead: "Start the McGill Big 3 right now — just press play and follow along for one round.",
      minimumWin: "One curl-up, one side plank, one bird-dog. A single round is a real session.",
      youtubeSearchUrl: youtubeSearch("McGill big 3 follow along"),
      videoId: VIDEO.mcGillBig3.id,
      videoTitle: VIDEO.mcGillBig3.title,
    }),
  },
  {
    kind: "build",
    keywords: ["water", "hydrate", "drink water"],
    build: () => ({
      headline: "Hydrate — it's the easiest win on the board.",
      brainImpact:
        "Even mild dehydration tanks focus and worsens ADHD brain fog. A glass of water is the lowest-effort dopamine-friendly reset there is.",
      bodyImpact:
        "Your spinal discs are mostly water — staying hydrated literally helps them stay cushioned and helps tissue recovery.",
      doInstead: "Fill a glass right now and drink it before you do anything else.",
      minimumWin: "A few sips counts. Keep the glass in sight to repeat.",
      youtubeSearchUrl: youtubeSearch("hydration and focus tips"),
    }),
  },
];

function genericIntervention(label: string, kind: HabitKind): Intervention {
  const clean = label.trim() || (kind === "break" ? "this habit" : "this habit");
  if (kind === "break") {
    return {
      headline: `Pause on "${clean}" — you caught the urge, that's the hard part.`,
      brainImpact:
        "Most habits you want to break are quick dopamine grabs your ADHD brain reaches for on autopilot. The fact that you opened this app means your prefrontal cortex is back online — use that 30-second window.",
      bodyImpact:
        "Whatever pulls you away from movement usually means more sitting and less consistency, and your knee/back recovery runs on consistency. Protecting this moment protects your progress.",
      doInstead:
        "Do a 2-minute physical swap: stand up, leave the room or put the trigger away, and do ONE small rehab move or chore instead.",
      minimumWin: "Pick the smallest possible version of the better choice and do just that. Tiny still counts.",
      youtubeSearchUrl: youtubeSearch(`how to stop ${clean} ADHD`),
    };
  }
  return {
    headline: `Let's make "${clean}" happen — shrink it until it's easy.`,
    brainImpact:
      "Your ADHD brain struggles with starting, not doing. Cut this down to a 2-minute version so initiation is almost free, then let momentum carry you.",
    bodyImpact:
      "Small, frequent reps of good habits are exactly what your knee and back recovery needs — consistency beats intensity every time.",
    doInstead: "Do the tiniest first step in the next 2 minutes. Don't aim for perfect, aim for started.",
    minimumWin: "Define the smallest version that still counts and do only that today.",
    youtubeSearchUrl: youtubeSearch(`how to build habit ${clean} ADHD`),
  };
}

export function buildIntervention(label: string, kind: HabitKind): Intervention {
  const text = (label || "").toLowerCase();

  let best: { entry: PlaybookEntry; len: number } | null = null;
  for (const entry of PLAYBOOK) {
    for (const kw of entry.keywords) {
      if (text.includes(kw)) {
        // Prefer entries matching the requested kind, then longest keyword.
        const kindBonus = entry.kind === kind ? 1000 : 0;
        const score = kw.length + kindBonus;
        if (!best || score > best.len) {
          best = { entry, len: score };
        }
      }
    }
  }

  if (best) return best.entry.build(label);
  return genericIntervention(label, kind);
}
