"use client";

import { useState } from "react";

const SECTIONS = [
  {
    id: "grocery",
    emoji: "🛒",
    title: "Weekly grocery list (3 people)",
    body: `Shop once per week. Covers all meals for you + family.\n\n🥩 PROTEINS\n• Chicken breasts, boneless skinless — 3 lbs\n• Ground beef 93/7 lean — 2 lbs\n• Sirloin steak — 1.5 lbs\n• Eggs, large — 2 dozen\n• Greek yogurt, plain 0% — 32 oz\n• Cottage cheese — 16 oz\n• String cheese — 1 pack\n\n🌾 CARBS\n• White rice (bulk) — 3 lbs\n• Sweet potatoes — 5–6 medium\n• Whole wheat pasta — 1 box\n• Oats (rolled) — 1 large container\n• Wraps / tortillas — 1 pack\n\n🍎 FRUITS\n• Apples — 1 dozen\n• Bananas — 2–3 bunches\n• Blueberries — 1–2 containers\n• Strawberries — 1 lb\n• Mixed frozen berries — 2 bags\n• Oranges — 1 bag\n• Pineapple — 1 fresh or canned\n• Lemons — 4–5\n\n🥦 VEGETABLES\n• Broccoli — 2–3 crowns\n• Spinach, fresh — 1 bag\n• Onions (yellow) — 3 lbs\n• Asparagus — 1 bunch\n• Green beans — 1 lb\n• Frozen broccoli (backup) — 2 bags\n• Frozen mixed veg — 2 bags\n• Snap peas — 1 lb\n• Garlic — 1 bulb\n• Ginger, fresh — 1 small root\n• Tomatoes — 3–4\n• Lettuce / mixed greens — 1 bag\n\n🧀 DAIRY\n• Milk 2% — 1 gallon\n• Butter — 1 lb\n• Shredded cheese — 8 oz\n\n🫙 PANTRY\n• Honey · olive oil · sesame oil\n• Low-sodium soy sauce · rice vinegar\n• Marinara sauce — 2 jars\n• Worcestershire sauce\n• Italian seasoning, paprika, garlic powder\n\n🥐 BAKERY (fresh)\n• Chocolate croissants — 5–7\n• Whole grain bread — 1 loaf\n\n💰 Estimate: $150–200/week for 3 people`,
  },
  {
    id: "sleep",
    emoji: "⏰",
    title: "Sleep (non-negotiable)",
    body: `Every night: 9:45 PM phone away · 10:00 PM lights out · 6:00 AM wake — same time every day including weekends.\n\nThis is where muscle grows, cortisol resets, and ADHD improves.`,
  },
  {
    id: "vyvanse",
    emoji: "💊",
    title: "Vyvanse timing",
    body: `6:00 AM with breakfast. Kicks in 30–45 min (gym time). Peaks 8–10 AM. Wears off 6–7 PM. Clean by 10 PM sleep.\n\nDon't take after 8 AM — sleep interference.`,
  },
  {
    id: "macros",
    emoji: "📊",
    title: "Daily macro targets",
    body: `Target: 160–180g protein · 160–200g carbs · 60–75g fat\n\nBreakfast: 15P · 65C · 15F\nLunch: 42P · 40C · 8F\nSnack: 20P · 25C · 5F\nDinner: 42P · 40C · 8F\n\nGap? Extra shake, extra egg, or higher-protein snack. Within 10g is fine.`,
  },
  {
    id: "hydration",
    emoji: "💧",
    title: "Hydration",
    body: `3 liters per day:\n• 1L by 12 PM\n• 1L by 5 PM\n• 1L by 9 PM\n\nNo tracking app needed — empty, refill, repeat.`,
  },
  {
    id: "movement",
    emoji: "🚶",
    title: "Movement breaks",
    body: `Every hour while working — 60 seconds:\n15 squats · 10 pushups · 1-min walk · 15 glute bridges · stretching\n\nReminders: 9:30, 10:30, 12:30, 1:30, 3:30, 4:30 AM/PM`,
  },
  {
    id: "grocery",
    emoji: "🛒",
    title: "Weekly grocery (3 people)",
    body: `Proteins: 3 lb chicken · 2 lb ground beef 93/7 · 1.5 lb sirloin · 2 dozen eggs · Greek yogurt · cottage cheese\n\nCarbs: white rice · sweet potatoes · whole wheat pasta · oats · wraps\n\nFruits: apples, bananas, berries, oranges, pineapple\n\nVeggies: broccoli, spinach, asparagus, green beans, peppers, onions, garlic, ginger\n\nPantry: honey, olive oil, soy sauce, marinara, Worcestershire`,
  },
  {
    id: "eating-out",
    emoji: "🍽️",
    title: "Eating out (1×/week)",
    body: `Pick restaurant the day before. Look at menu online. Don't arrive hungry.\n\nOrder: grilled protein + carb + vegetables. Sauce on the side.\n\nThai: grilled shrimp pad thai · Chipotle: chicken bowl · Steakhouse: 6oz steak + sweet potato · Italian: grilled fish with marinara\n\nAvoid: fried, creamy sauces, sugary drinks.`,
  },
  {
    id: "rules",
    emoji: "⚠️",
    title: "What to avoid",
    body: `• Skipping breakfast\n• Fried foods & heavy sauces\n• Soda, energy drinks, sweet tea\n• Screens after 9:45 PM\n• Vyvanse after 8 AM\n• Daily alcohol · sugary cocktails\n• Heavy barbell squats/deadlifts (L4-L5 risk)`,
  },
  {
    id: "weekly",
    emoji: "🗓️",
    title: "Weekly habits",
    body: `Sunday: grocery · meal prep · boil 14 eggs · plan Friday restaurant · weigh yourself\n\nMonday: set movement break reminders · confirm gym on calendar\n\nFriday: pick restaurant · 1 drink max (beer/wine)`,
  },
  {
    id: "why",
    emoji: "🎯",
    title: "Your why",
    body: `"Look amazing for my wife and kid."\n\n12 weeks: visible abs, stronger, more energy.\n24 weeks: 6-pack, lean, strong, healthy.\n\nConsistency beats perfection. 80% for 365 days wins.`,
  },
];

export default function FullBlueprintView() {
  const [expanded, setExpanded] = useState<string | null>("grocery");
  const [query, setQuery] = useState("");

  const filtered = SECTIONS.filter(
    (s) =>
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.body.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <input
        type="search"
        placeholder="Search blueprint..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full text-sm px-4 py-3 rounded-xl bg-[#F6F3E9] dark:bg-[#2C2622] border-0 text-[#1B1714] dark:text-white placeholder:text-[#8A7F78]"
      />

      {filtered.map((section) => {
        const open = expanded === section.id;
        return (
          <section
            key={section.id}
            className="bg-white dark:bg-[#1B1714] rounded-2xl border border-[#F0E9CE] dark:border-[#3D3730] overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setExpanded(open ? null : section.id)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <span className="font-semibold text-[#1B1714] dark:text-white flex items-center gap-2">
                <span className="text-xl">{section.emoji}</span>
                {section.title}
              </span>
              <span className="text-[#8A7F78] text-lg">{open ? "−" : "+"}</span>
            </button>
            {open && (
              <div className="px-4 pb-4 border-t border-[#F0E9CE] dark:border-[#3D3730] pt-3">
                <p className="text-sm text-[#1B1714] dark:text-[#F0E9CE] whitespace-pre-wrap leading-relaxed">
                  {section.body}
                </p>
              </div>
            )}
          </section>
        );
      })}

      <p className="text-xs text-[#8A7F78] text-center pt-2">
        Gilly&apos;s Complete Lifestyle Blueprint · Updated June 27, 2026
      </p>
    </div>
  );
}
