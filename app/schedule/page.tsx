"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { ProgramType, WorkoutDay } from "@/lib/types";
import { getActiveProgram, getGymWorkoutByDate, getAdhdWorkoutByDate, getCustomWorkoutByDate } from "@/lib/db";

type ScheduleDay = {
  date: string;
  workout: WorkoutDay | null;
  dayName: string;
  isToday: boolean;
  isPast: boolean;
};

function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function SchedulePage() {
  const [schedule, setSchedule] = useState<ScheduleDay[]>([]);
  const [activeProgram, setActiveProgram] = useState<ProgramType>("adhd");
  const [loading, setLoading] = useState(true);
  const [viewWeeks, setViewWeeks] = useState(4);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  useEffect(() => {
    async function loadSchedule() {
      setLoading(true);
      const program = await getActiveProgram();
      setActiveProgram(program);

      const today = toLocalDateString(new Date());
      const items: ScheduleDay[] = [];

      for (let i = 0; i < viewWeeks * 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const dateStr = toLocalDateString(date);

        const workout =
          program === "gym"
            ? await getGymWorkoutByDate(dateStr)
            : program === "custom"
              ? await getCustomWorkoutByDate(dateStr)
              : await getAdhdWorkoutByDate(dateStr);

        items.push({
          date: dateStr,
          workout,
          dayName: date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          }),
          isToday: dateStr === today,
          isPast: dateStr < today,
        });
      }

      setSchedule(items);
      setLoading(false);
    }
    loadSchedule();
  }, [viewWeeks]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500" />
      </div>
    );
  }

  const weekGroups = schedule.reduce((weeks, item, i) => {
    const weekIndex = Math.floor(i / 7);
    if (!weeks[weekIndex]) weeks[weekIndex] = [];
    weeks[weekIndex].push(item);
    return weeks;
  }, [] as ScheduleDay[][]);

  const programLabel =
    activeProgram === "gym" ? "🏋️ Gym PPL" : activeProgram === "custom" ? "🗂️ Custom Program" : "🧠 ADHD Knee + Back";

  return (
    <div className="bg-white dark:bg-black">
      <section className="bg-gradient-to-br from-[#34C759] via-[#30D158] to-[#007AFF] text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h2 className="text-2xl font-bold mb-1">📅 Your Schedule</h2>
          <p className="text-white/90 text-sm">
            {programLabel} · Next {viewWeeks} weeks
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex justify-center gap-2 mb-6">
          {[2, 4, 8].map((weeks) => (
            <button
              key={weeks}
              onClick={() => setViewWeeks(weeks)}
              className={`px-4 py-2 rounded-lg font-bold transition ${
                viewWeeks === weeks
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100"
              }`}
            >
              {weeks} Weeks
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {weekGroups.map((week, weekIdx) => {
            const firstDay = week[0];
            const weekNumber = firstDay.workout?.program?.week;

            return (
              <div key={weekIdx} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4">
                  <h3 className="text-xl font-bold">
                    Week {weekNumber ?? weekIdx + 1}
                    {firstDay.workout?.program?.phase && ` · ${firstDay.workout.program.phase}`}
                  </h3>
                  <p className="text-sm text-blue-100">
                    {activeProgram === "adhd" ? "Daily breaks · knee block Mon / Wed / Fri" : "Mon / Wed / Fri training days"}
                  </p>
                </div>

                <div className="p-4 space-y-2">
                  {week.map((item) => {
                    const isRestDay = !item.workout;
                    const totalMinutes = item.workout
                      ? item.workout.blocks.reduce((sum, b) => sum + b.estimatedMinutes, 0)
                      : 0;
                    const blockCount = item.workout?.blocks.length ?? 0;
                    const isExpanded = expandedDay === item.date;

                    return (
                      <div
                        key={item.date}
                        className={`rounded-xl border-2 overflow-hidden transition ${
                          item.isToday
                            ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-500 shadow-lg"
                            : item.isPast
                              ? "bg-gray-50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 opacity-60"
                              : "bg-white dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 hover:border-blue-400"
                        }`}
                      >
                        <button
                          onClick={() => !isRestDay && setExpandedDay(isExpanded ? null : item.date)}
                          className="w-full p-4 text-left"
                          disabled={isRestDay}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="text-3xl">{isRestDay ? "😴" : activeProgram === "gym" ? "💪" : activeProgram === "custom" ? "🗂️" : "🧠"}</div>
                              <div>
                                <div className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                  {item.dayName}
                                  {item.isToday && (
                                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                      Today
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {isRestDay
                                    ? "Rest day"
                                    : `${blockCount} blocks · ~${totalMinutes} min`}
                                </div>
                              </div>
                            </div>
                            {!isRestDay && (
                              <svg
                                className={`w-5 h-5 text-gray-400 transition-transform ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            )}
                          </div>
                        </button>

                        {isExpanded && item.workout && (
                          <div className="px-4 pb-4 space-y-2 border-t border-gray-200 dark:border-gray-700 pt-2">
                            {item.workout.blocks.map((block) => (
                              <div key={block.id} className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                                <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                                  {block.name}
                                </div>
                                {block.description && (
                                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                    {block.description}
                                  </div>
                                )}
                                <div className="text-xs text-gray-500 mt-1">
                                  {block.exercises.length} exercises · ~{block.estimatedMinutes} min
                                </div>
                              </div>
                            ))}
                            {item.isToday && (
                              <Link
                                href="/today"
                                className="block mt-3 bg-blue-600 hover:bg-blue-700 text-white text-center font-bold py-2 px-4 rounded-lg transition"
                              >
                                Start Today&apos;s Workout →
                              </Link>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {viewWeeks < 12 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setViewWeeks(Math.min(12, viewWeeks + 4))}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition"
            >
              Load More Weeks
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
