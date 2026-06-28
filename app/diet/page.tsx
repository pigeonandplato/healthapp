"use client";

import { useState } from "react";
import DailyHabitsTab from "@/components/DailyHabitsTab";
import MealPlanTab from "@/components/MealPlanTab";
import FullBlueprintView from "@/components/FullBlueprintView";

type BlueprintTab = "today" | "meals" | "plan";

const TABS: { id: BlueprintTab; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "meals", label: "Meals" },
  { id: "plan", label: "Plan" },
];

export default function DietPage() {
  const [tab, setTab] = useState<BlueprintTab>("today");

  return (
    <div className="min-h-screen bg-[#FDFAF6] dark:bg-black pb-28">
      <section className="bg-gradient-to-br from-[#9DBFD0] to-[#4A8FA8] text-white">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <p className="text-sm font-medium text-white/90 uppercase tracking-wide mb-1">Lifestyle blueprint</p>
          <h1 className="text-2xl font-bold leading-tight mb-2">Get shredded for your family</h1>
          <p className="text-white/90 text-sm leading-relaxed">
            Sleep · meals · movement · macros — novelty within structure
          </p>
        </div>
      </section>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        <div className="inline-flex w-full rounded-2xl bg-[#EDE8DC] dark:bg-[#1C1C1E] p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === t.id
                  ? "bg-white dark:bg-[#2C2C2E] text-[#4A8FA8] shadow-sm"
                  : "text-[#8E8E93]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "today" && <DailyHabitsTab />}
        {tab === "meals" && <MealPlanTab />}
        {tab === "plan" && <FullBlueprintView />}
      </main>
    </div>
  );
}
