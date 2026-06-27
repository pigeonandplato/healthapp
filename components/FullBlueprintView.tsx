"use client";

import { useState } from "react";

const SECTIONS = [
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
  const [expanded, setExpanded] = useState<string | null>("sleep");
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
        className="w-full text-sm px-4 py-3 rounded-xl bg-[#F2F2F7] dark:bg-[#2C2C2E] border-0 text-[#1C1C1E] dark:text-white placeholder:text-[#8E8E93]"
      />

      {filtered.map((section) => {
        const open = expanded === section.id;
        return (
          <section
            key={section.id}
            className="bg-white dark:bg-[#1C1C1E] rounded-2xl border border-[#E5E5EA] dark:border-[#38383A] overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setExpanded(open ? null : section.id)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <span className="font-semibold text-[#1C1C1E] dark:text-white flex items-center gap-2">
                <span className="text-xl">{section.emoji}</span>
                {section.title}
              </span>
              <span className="text-[#8E8E93] text-lg">{open ? "−" : "+"}</span>
            </button>
            {open && (
              <div className="px-4 pb-4 border-t border-[#E5E5EA] dark:border-[#38383A] pt-3">
                <p className="text-sm text-[#1C1C1E] dark:text-[#E5E5EA] whitespace-pre-wrap leading-relaxed">
                  {section.body}
                </p>
              </div>
            )}
          </section>
        );
      })}

      <p className="text-xs text-[#8E8E93] text-center pt-2">
        Gilly&apos;s Complete Lifestyle Blueprint · Updated June 27, 2026
      </p>
    </div>
  );
}
