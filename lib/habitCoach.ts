// Habit Coach intervention engine.
//
// This is a deterministic keyword "playbook" — no LLM needed for v1. It runs on
// the server (app/api/habit-coach) AND can run on the client as an offline
// fallback, so a user mid-urge always gets help even with no connection.
//
// Design: every "stop doing" habit explains WHY the ADHD brain reaches for it,
// what it does to the brain, how it harms the user over time, and how it sets
// back knee/back rehab — then offers a 2-minute swap and a guilt-free minimum
// win.

export type HabitKind = "break" | "build";

export interface Intervention {
  headline: string;
  whyBrain: string; // why the ADHD brain is driven to do this (the trigger/mechanism)
  brainImpact: string; // how it weakens ADHD brain / dopamine / executive function
  harm: string; // how it harms you over time if the pattern continues
  bodyImpact: string; // tie to knee/back rehab, sitting, inflammation, consistency
  doInstead: string; // 2-minute swap action
  minimumWin: string; // smallest action that counts
  youtubeSearchUrl: string;
  videoId?: string; // optional curated YouTube ID
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
      whyBrain:
        "Your ADHD brain runs a little low on dopamine, so it's always hunting for the fastest, biggest reward. Ordering food is effortless and hyper-rewarding (salt, fat, sugar, novelty) — a near-perfect dopamine shortcut. Add end-of-day decision fatigue and 'just order it' becomes the path of least resistance.",
      brainImpact:
        "Giving in trains your brain to expect effort-free rewards, which makes the slower 'cook → eat' loop feel even harder to start next time. You're reinforcing the exact avoidance pattern you're trying to break.",
      harm:
        "Repeated, this quietly drains your money, spikes inflammatory fat and sodium, and leaves protein gaps — so your energy dips and your knee/back recovery stalls. The bigger cost is habit: the shortcut gets more automatic every time you take it.",
      bodyImpact:
        "Takeout is usually high in inflammatory oils and low in the protein your knee and back need to rebuild tissue. Steady protein + whole foods is what actually drives rehab recovery — one ordered meal won't ruin you, but the pattern stalls progress.",
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
      whyBrain:
        "Infinite feeds are built like a slot machine: unpredictable 'maybe the next post is great' rewards spike dopamine. An understimulated ADHD brain is especially pulled to that variable reward, so the moment a task feels boring or hard to start, your hand reaches for the phone on autopilot.",
      brainImpact:
        "Each swipe is a tiny dopamine hit that hijacks your prefrontal cortex — the exact part of the ADHD brain that struggles to initiate tasks. The more you feed it, the harder the boring-but-important stuff (rehab) becomes.",
      harm:
        "Over time this shrinks your tolerance for slow tasks, so focus and follow-through get worse — not just today. Hours disappear, sleep gets pushed later (wrecking next-day attention), and the habit compounds.",
      bodyImpact:
        "Scrolling = more sitting, usually hunched. That loads your lumbar discs and stiffens your hips and knees, so your back feels worse the moment you finally stand up.",
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
      whyBrain:
        "ADHD brains heavily discount future rewards — 'pain-free in 3 months' barely registers next to 'comfort right now.' Rehab is low-stimulation with a delayed payoff, so your brain quietly files it under 'optional' and avoids the discomfort of starting.",
      brainImpact:
        "Skipping feeds the all-or-nothing trap: miss once and the brain says 'the streak's broken, why bother.' That shame spiral — not the missed day — is what actually derails people with ADHD.",
      harm:
        "Each skip makes the next skip easier and chips away at the identity 'I'm someone who does my rehab.' Miss enough and you lose the momentum and gains you already earned, then have to rebuild from a harder starting point.",
      bodyImpact:
        "Rehab works through frequency, not intensity. Skipping lets your stabilizers switch back off and your knee/back stiffen, so pain creeps back. A 5-minute minimum keeps the tissue adapting and the pain trending down.",
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
      whyBrain:
        "Sugar delivers an instant dopamine spike, and a dopamine-hungry ADHD brain craves it most when you're stressed, bored, or tired. The 'just one' pull is your brain chasing a quick lift — it's emotional regulation, not real hunger.",
      brainImpact:
        "The spike is followed by a crash that worsens focus and mood, which drives the next craving. That's a self-feeding loop your brain learns to lean on instead of steadier coping.",
      harm:
        "Long term, repeated sugar spikes drive inflammation and energy crashes, and the loop strengthens — so 'just one' keeps winning. The inflammation works directly against the joint and disc recovery you're putting in the work for.",
      bodyImpact:
        "Sugar spikes drive inflammation, which fights against joint and disc recovery. Protein and water keep you full and give your rehab the building blocks it needs.",
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
      whyBrain:
        "The block isn't laziness — it's task-initiation. Your ADHD brain sees 'cook' as a fuzzy, multi-step project and stalls before step one. The good news: cooking is a 'completion loop' (chop → cook → eat → done) that actually feels rewarding once you start.",
      brainImpact:
        "Shrinking the task to one pan and three ingredients lowers the initiation barrier so your brain will actually begin — and momentum carries the rest.",
      harm:
        "Skip it and you stay dependent on the takeout dopamine-shortcut, which drains money and starves your recovery of the steady protein it needs. Every skipped cook makes ordering the default again.",
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
      whyBrain:
        "Starting feels harder than it is — your ADHD brain over-weighs the friction of shoes-and-door and under-weighs how good you'll feel after. That initiation gap is classic ADHD, not weakness.",
      brainImpact:
        "Walking raises dopamine and norepinephrine — the same systems ADHD meds target — so even 5–10 minutes sharpens focus for the next couple of hours.",
      harm:
        "Skip it and you miss an easy, drug-free focus boost, and your discs and knees lose the gentle movement that keeps them supplied with nutrients and loose.",
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
      whyBrain:
        "'I'll do it later' is your ADHD brain dodging a low-stimulation task with a delayed payoff — and 'later' easily becomes never. Acting on the impulse the moment you think of it is your superpower here.",
      brainImpact:
        "Doing it while the thought is hot beats the deferral loop. Press play before your brain has time to renegotiate.",
      harm:
        "Putting it off lets stiffness and pain quietly rebuild and breaks the consistency that's actually doing the healing — so progress slips backward.",
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
      whyBrain:
        "This one is pure low-salience: water is boring, so an ADHD brain busy chasing more stimulating things simply forgets it. It's not discipline — it's attention.",
      brainImpact:
        "A glass of water is the lowest-effort, dopamine-friendly reset there is — and even mild dehydration tanks focus and worsens brain fog.",
      harm:
        "Stay under-hydrated and you get more fog, fatigue, and headaches — and your discs (which are mostly water) lose a bit of their cushioning over time.",
      bodyImpact:
        "Your spinal discs are mostly water — staying hydrated literally helps them stay cushioned and supports tissue recovery.",
      doInstead: "Fill a glass right now and drink it before you do anything else.",
      minimumWin: "A few sips counts. Keep the glass in sight to repeat.",
      youtubeSearchUrl: youtubeSearch("hydration and focus tips"),
    }),
  },
];

function genericIntervention(label: string, kind: HabitKind): Intervention {
  const clean = label.trim() || "this habit";
  if (kind === "break") {
    return {
      headline: `Pause on "${clean}" — you caught the urge, that's the hard part.`,
      whyBrain:
        "Most urges like this are your ADHD brain reaching for a fast, easy dopamine hit to escape boredom, stress, or a task that feels hard to start. It's automatic and chemical — not a character flaw.",
      brainImpact:
        "The fact that you opened this app means your prefrontal cortex is back online. Each time you give in instead, the autopilot gets stronger and the better choice feels harder.",
      harm:
        "Left unchecked, the pattern compounds — the shortcut becomes your default, and anything that pulls you into more sitting and less consistency quietly slows your knee/back recovery.",
      bodyImpact:
        "Whatever pulls you away from movement usually means more sitting and less consistency, and your recovery runs on consistency. Protecting this moment protects your progress.",
      doInstead:
        "Do a 2-minute physical swap: stand up, leave the room or put the trigger away, and do ONE small rehab move or chore instead.",
      minimumWin: "Pick the smallest possible version of the better choice and do just that. Tiny still counts.",
      youtubeSearchUrl: youtubeSearch(`how to stop ${clean} ADHD`),
    };
  }
  return {
    headline: `Let's make "${clean}" happen — shrink it until it's easy.`,
    whyBrain:
      "The hard part is starting, not doing. Your ADHD brain stalls on tasks with delayed or fuzzy rewards, so it quietly avoids beginning — even when you genuinely want to do them.",
    brainImpact:
      "Cut this down to a 2-minute version so initiation is almost free, then let momentum carry you. Starting tiny is the cheat code.",
    harm:
      "Every skipped rep is a small loss of momentum, and your knee/back recovery depends on exactly the consistency you're trying to build.",
    bodyImpact:
      "Small, frequent reps of good habits are exactly what your recovery needs — consistency beats intensity every time.",
    doInstead: "Do the tiniest first step in the next 2 minutes. Don't aim for perfect, aim for started.",
    minimumWin: "Define the smallest version that still counts and do only that today.",
    youtubeSearchUrl: youtubeSearch(`how to build habit ${clean} ADHD`),
  };
}

export function buildIntervention(label: string, kind: HabitKind): Intervention {
  const text = (label || "").toLowerCase();

  let best: { entry: PlaybookEntry; score: number } | null = null;
  for (const entry of PLAYBOOK) {
    for (const kw of entry.keywords) {
      if (text.includes(kw)) {
        // Prefer entries matching the requested kind, then longest keyword.
        const kindBonus = entry.kind === kind ? 1000 : 0;
        const score = kw.length + kindBonus;
        if (!best || score > best.score) {
          best = { entry, score };
        }
      }
    }
  }

  if (best) return best.entry.build(label);
  return genericIntervention(label, kind);
}
