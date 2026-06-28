"use client";

import { useEffect, useMemo, useState } from "react";
import { DEFAULT_DAILY_HABITS } from "@/lib/defaultDailyHabits";
import { HabitCategory } from "@/lib/lifestyleBlueprintTypes";
import {
  getBlueprintHabits,
  getHabitCompletionsForDate,
  setHabitComplete,
} from "@/lib/lifestyleStorage";
import { triggerHaptic } from "@/utils/haptics";

const CATEGORY_LABELS: Record<HabitCategory, string> = {
  sleep: "Sleep",
  nutrition: "Nutrition",
  exercise: "Movement",
  hydration: "Hydration",
  supplements: "Meds",
  general: "Daily",
};

function todayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function DailyHabitsTab() {
  const [selectedDate, setSelectedDate] = useState(todayString);
  const [completions, setCompletions] = useState<Map<string, boolean>>(new Map());
  const [category, setCategory] = useState<HabitCategory | "all">("all");

  const habits = useMemo(() => {
    const toMinutes = (t?: string) => {
      if (!t) return 24 * 60; // no time → end of list
      const match = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!match) return 24 * 60;
      let h = parseInt(match[1]);
      const m = parseInt(match[2]);
      const pm = match[3].toUpperCase() === "PM";
      if (pm && h !== 12) h += 12;
      if (!pm && h === 12) h = 0;
      return h * 60 + m;
    };
    return getBlueprintHabits()
      .filter((h) => h.frequency === "daily")
      .sort((a, b) => toMinutes(a.target_time) - toMinutes(b.target_time));
  }, []);

  useEffect(() => {
    setCompletions(getHabitCompletionsForDate(selectedDate));
  }, [selectedDate]);

  const filtered =
    category === "all" ? habits : habits.filter((h) => h.category === category);

  const done = habits.filter((h) => completions.get(h.id)).length;
  const pct = habits.length ? Math.round((done / habits.length) * 100) : 0;

  const toggle = (habitId: string) => {
    const next = !completions.get(habitId);
    setHabitComplete(habitId, selectedDate, next);
    setCompletions((prev) => new Map(prev).set(habitId, next));
    if (next) triggerHaptic("light");
  };

  return (
    <div className="space-y-5">
        <div className="bg-white dark:bg-[#1B1714] rounded-2xl p-5 border border-[#F0E9CE] dark:border-[#3D3730]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-[#8A7F78]">Today&apos;s habits</p>
            <p className="text-3xl font-bold text-[#1B1714] dark:text-white">{pct}%</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-[#3E7E57]">
              {done}/{habits.length}
            </p>
            <p className="text-xs text-[#8A7F78]">completed</p>
          </div>
        </div>
        <div className="h-2 bg-[#F0E9CE] dark:bg-[#3D3730] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#3E7E57] rounded-full transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="mt-4 w-full text-sm px-3 py-2 rounded-xl bg-[#F0E9CE] dark:bg-[#2C2622] border-0 text-[#1B1714] dark:text-white"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterChip active={category === "all"} onClick={() => setCategory("all")} label="All" />
        {(Object.keys(CATEGORY_LABELS) as HabitCategory[]).map((cat) => (
          <FilterChip
            key={cat}
            active={category === cat}
            onClick={() => setCategory(cat)}
            label={CATEGORY_LABELS[cat]}
          />
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((habit) => {
          const checked = completions.get(habit.id) ?? false;
          return (
            <button
              key={habit.id}
              type="button"
              onClick={() => toggle(habit.id)}
              className={`w-full flex items-start gap-3 p-4 rounded-2xl border text-left transition-all active:scale-[0.99] ${
                checked
                  ? "bg-[#3E7E57]/8 border-[#3E7E57]/25"
                  : "bg-white dark:bg-[#1B1714] border-[#F0E9CE] dark:border-[#3D3730]"
              }`}
            >
              <span
                className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  checked ? "bg-[#3E7E57] border-[#3E7E57] text-white" : "border-[#C5BDB6]"
                }`}
              >
                {checked && (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium ${
                    checked ? "text-[#8A7F78] line-through" : "text-[#1B1714] dark:text-white"
                  }`}
                >
                  {habit.habit_name}
                </p>
              </div>
              {habit.target_time && (
                <span
                  className={`flex-shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    checked
                      ? "bg-[#3E7E57]/15 text-[#3E7E57]"
                      : "bg-[#79A98C]/10 text-[#79A98C]"
                  }`}
                >
                  {habit.target_time}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-[#8A7F78] text-center px-4">
        Stack habits weekly — don&apos;t try everything at once. Week 1: sleep only. Build from there.
      </p>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
        active
          ? "bg-[#3E7E57] text-white"
          : "bg-[#F0E9CE] dark:bg-[#2C2622] text-[#8A7F78]"
      }`}
    >
      {label}
    </button>
  );
}
