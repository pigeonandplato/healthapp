"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { ProgramType, WorkoutDay } from "@/lib/types";
import {
  getActiveProgram,
  getGymWorkoutByDate,
  getAdhdWorkoutByDate,
  getCustomWorkoutByDate,
  getChachaWorkoutByDate,
} from "@/lib/db";
import { toLocalDateString, parseLocalDate } from "@/lib/dates";
import DayNavigator from "@/components/DayNavigator";
import CoachView from "@/components/CoachView";
import { CHACHA_DAY_LABELS } from "@/lib/chachaSeedData";

type ScheduleDay = {
  date: string;
  workout: WorkoutDay | null;
  dayName: string;
  isToday: boolean;
  isPast: boolean;
};

function formatPrescription(exercise: WorkoutDay["blocks"][number]["exercises"][number]): string {
  const p = exercise.prescription;
  if (p.description) return p.description;
  const parts: string[] = [];
  if (p.sets) parts.push(`${p.sets}×`);
  if (p.reps) parts.push(`${p.reps}`);
  if (p.holdSeconds) parts.push(`${p.holdSeconds}s`);
  if (p.minutes) parts.push(`${p.minutes}m`);
  return parts.join(" ");
}

export default function SchedulePage() {
  const [schedule, setSchedule] = useState<ScheduleDay[]>([]);
  const [activeProgram, setActiveProgram] = useState<ProgramType>("adhd");
  const [loading, setLoading] = useState(true);
  const [viewWeeks, setViewWeeks] = useState(4);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [browseDate, setBrowseDate] = useState<string>(() => toLocalDateString(new Date()));
  const [browseWorkout, setBrowseWorkout] = useState<WorkoutDay | null>(null);
  const [browseLoading, setBrowseLoading] = useState(true);

  const loadWorkoutForDate = useCallback(async (dateStr: string, program: ProgramType) => {
    if (program === "gym") return getGymWorkoutByDate(dateStr);
    if (program === "chacha") return getChachaWorkoutByDate(dateStr);
    if (program === "custom") return getCustomWorkoutByDate(dateStr);
    return getAdhdWorkoutByDate(dateStr);
  }, []);

  useEffect(() => {
    async function loadSchedule() {
      setLoading(true);
      const program = await getActiveProgram();
      setActiveProgram(program);

      const today = toLocalDateString(new Date());
      const anchor = parseLocalDate(browseDate);
      anchor.setDate(anchor.getDate() - 7);
      const items: ScheduleDay[] = [];

      for (let i = 0; i < viewWeeks * 7; i++) {
        const date = new Date(anchor);
        date.setDate(anchor.getDate() + i);
        const dateStr = toLocalDateString(date);

        const workout = await loadWorkoutForDate(dateStr, program);

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
  }, [viewWeeks, browseDate, loadWorkoutForDate]);

  useEffect(() => {
    let cancelled = false;
    async function loadBrowse() {
      setBrowseLoading(true);
      const program = await getActiveProgram();
      const workout = await loadWorkoutForDate(browseDate, program);
      if (!cancelled) {
        setBrowseWorkout(workout);
        setBrowseLoading(false);
      }
    }
    loadBrowse();
    return () => {
      cancelled = true;
    };
  }, [browseDate, loadWorkoutForDate]);

  const getBrowseSubtitle = (): string | undefined => {
    if (!browseWorkout?.program) return undefined;
    if (activeProgram === "chacha" && browseWorkout.program.day in CHACHA_DAY_LABELS) {
      return CHACHA_DAY_LABELS[browseWorkout.program.day as keyof typeof CHACHA_DAY_LABELS];
    }
    if (activeProgram === "gym") return `Day ${browseWorkout.program.day}`;
    if (activeProgram === "adhd" || activeProgram === "custom") {
      return `Week ${browseWorkout.program.week}`;
    }
    return undefined;
  };

  const scrollToPreview = () => {
    document.getElementById("schedule-workout-preview")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const selectDay = (date: string) => {
    setBrowseDate(date);
    setExpandedDay(date);
    scrollToPreview();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F3E9] dark:bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#79A98C]" />
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
    activeProgram === "gym"
      ? "🏋️ Gym PPL"
      : activeProgram === "chacha"
        ? "💪 Chacha Training"
        : activeProgram === "custom"
          ? "🗂️ Custom Program"
          : "🧠 ADHD Knee + Back";

  const browseDayName = parseLocalDate(browseDate).toLocaleDateString("en-US", { weekday: "long" });

  return (
    <div className="bg-[#F6F3E9] dark:bg-black">
      <section className="bg-gradient-to-br from-[#9DC1A5] to-[#79A98C] text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h2 className="text-2xl font-bold mb-1">📅 Your Schedule</h2>
          <p className="text-white/90 text-sm">
            {programLabel} · Browse any day with full exercise details
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <DayNavigator
          selectedDate={browseDate}
          onDateChange={(date) => {
            setBrowseDate(date);
            scrollToPreview();
          }}
          program={activeProgram}
          subtitle={getBrowseSubtitle()}
          className="mb-6"
        />

        <section id="schedule-workout-preview" className="mb-8 scroll-mt-4">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h3 className="text-lg font-bold text-[#1B1714] dark:text-white">
              {browseDayName}&apos;s workout
            </h3>
            <Link
              href={`/today?date=${browseDate}&view=coach`}
              className="text-sm font-semibold text-[#79A98C] whitespace-nowrap"
            >
              Open in Today →
            </Link>
          </div>

          {browseLoading ? (
            <div className="h-40 rounded-2xl bg-[#F0E9CE] dark:bg-[#2C2622] animate-pulse" />
          ) : !browseWorkout ? (
            <div className="rounded-2xl border-2 border-dashed border-[#F0E9CE] dark:border-[#3D3730] p-8 text-center">
              <div className="text-4xl mb-2">😴</div>
              <p className="font-semibold text-[#1B1714] dark:text-white">Rest day</p>
              <p className="text-sm text-[#8A7F78] dark:text-[#8A7F78] mt-1">No exercises scheduled for this date.</p>
            </div>
          ) : (
            <CoachView key={browseDate} workout={browseWorkout} />
          )}
        </section>

        <div className="flex justify-center gap-2 mb-6">
          {[2, 4, 8].map((weeks) => (
            <button
              key={weeks}
              onClick={() => setViewWeeks(weeks)}
              className={`px-4 py-2 rounded-lg font-bold transition ${
                viewWeeks === weeks
                  ? "bg-[#79A98C] text-white"
                  : "bg-white dark:bg-[#2C2622] text-[#3D3730] dark:text-[#D4CFC9] hover:bg-[#F0E9CE]"
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
              <div key={weekIdx} className="bg-white dark:bg-[#2C2622] rounded-2xl  overflow-hidden">
                <div className="bg-gradient-to-r from-[#5E8C6E] to-[#79A98C] text-white p-4">
                  <h3 className="text-xl font-bold">
                    Week {weekNumber ?? weekIdx + 1}
                    {firstDay.workout?.program?.phase && ` · ${firstDay.workout.program.phase}`}
                  </h3>
                  <p className="text-sm text-white/80">
                    Tap a day to jump to its full workout above
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
                    const isSelected = browseDate === item.date;

                    return (
                      <div
                        key={item.date}
                        className={`rounded-xl border-2 overflow-hidden transition ${
                          isSelected
                            ? "border-[#79A98C] shadow-md"
                            : item.isToday
                              ? "bg-[#79A98C]/5 border-[#79A98C]"
                              : item.isPast
                                ? "bg-[#F6F3E9] dark:bg-[#2C2622]/50 border-[#F0E9CE] dark:border-[#3D3730] opacity-60"
                                : "bg-white dark:bg-[#2C2622]/80 border-[#F0E9CE] dark:border-[#3D3730] hover:border-[#79A98C]"
                        }`}
                      >
                        <button
                          onClick={() => {
                            if (isRestDay) {
                              selectDay(item.date);
                            } else {
                              setExpandedDay(isExpanded ? null : item.date);
                              selectDay(item.date);
                            }
                          }}
                          className="w-full p-4 text-left"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="text-3xl">
                                {isRestDay
                                  ? "😴"
                                  : activeProgram === "gym"
                                    ? "💪"
                                    : activeProgram === "chacha"
                                      ? "💪"
                                      : activeProgram === "custom"
                                        ? "🗂️"
                                        : "🧠"}
                              </div>
                              <div>
                                <div className="font-bold text-[#1B1714] dark:text-white flex items-center gap-2">
                                  {item.dayName}
                                  {item.isToday && (
                                    <span className="bg-[#79A98C] text-white text-xs font-bold px-2 py-1 rounded-full">
                                      Today
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-[#8A7F78] dark:text-[#8A7F78]">
                                  {isRestDay
                                    ? "Rest day"
                                    : `${blockCount} blocks · ~${totalMinutes} min`}
                                </div>
                              </div>
                            </div>
                            {!isRestDay && (
                              <svg
                                className={`w-5 h-5 text-[#8A7F78] transition-transform ${
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
                          <div className="px-4 pb-4 space-y-3 border-t border-[#F0E9CE] dark:border-[#3D3730] pt-3">
                            {item.workout.blocks.map((block) => (
                              <div key={block.id} className="bg-[#F6F3E9] dark:bg-black/50 rounded-lg p-3">
                                <div className="font-semibold text-sm text-[#1B1714] dark:text-white">
                                  {block.name}
                                </div>
                                {block.description && (
                                  <div className="text-xs text-[#8A7F78] dark:text-[#8A7F78] mt-1">
                                    {block.description}
                                  </div>
                                )}
                                <ul className="mt-2 space-y-1">
                                  {block.exercises
                                    .filter((ex) => ex.category !== "Guidance")
                                    .map((ex) => (
                                      <li
                                        key={ex.id}
                                        className="text-xs text-[#3D3730] dark:text-[#D4CFC9] flex justify-between gap-2"
                                      >
                                        <span>{ex.name}</span>
                                        <span className="text-[#8A7F78] flex-shrink-0">
                                          {formatPrescription(ex)}
                                        </span>
                                      </li>
                                    ))}
                                </ul>
                              </div>
                            ))}
                            <div className="flex flex-wrap gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => selectDay(item.date)}
                                className="flex-1 min-w-[140px] bg-[#79A98C] hover:bg-[#5E8C6E] text-white text-center font-bold py-2 px-4 rounded-lg transition text-sm"
                              >
                                View full details ↑
                              </button>
                              <Link
                                href={`/today?date=${item.date}&view=coach`}
                                className="flex-1 min-w-[140px] border-2 border-[#79A98C] text-[#79A98C] text-center font-bold py-2 px-4 rounded-lg transition text-sm"
                              >
                                Track in Today →
                              </Link>
                            </div>
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
              className="bg-gradient-to-r from-[#9DC1A5] to-[#79A98C] hover:from-[#9DC1A5] hover:to-[#5E8C6E] text-white font-bold py-3 px-8 rounded-xl transition"
            >
              Load More Weeks
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
