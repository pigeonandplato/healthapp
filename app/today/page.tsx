"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { WorkoutDay, ViewMode, ProgramType, ProgramMeta } from "@/lib/types";
import {
  getCompletionsByDate,
  getAllCompletions,
  getYouTubeVideo,
  getActiveProgram,
  getGymWorkoutByDate,
  getGymDayForDate,
  getChachaWorkoutByDate,
  getChachaDayForDate,
  getAdhdWorkoutByDate,
  getCustomWorkoutByDate,
  getCustomProgramName,
  saveYouTubeVideo,
  getSeenAchievements,
  setSeenAchievements,
  getLastSeenLevel,
  setLastSeenLevel,
} from "@/lib/db";
import { calculateStreak } from "@/lib/streak";
import {
  computeCommitmentStats,
  computeAchievements,
  pickNewlyEarned,
  earnedIds,
  CommitmentStats,
} from "@/lib/gamification";
import { Milestone } from "@/lib/progress";
import ChecklistView from "@/components/ChecklistView";
import CoachView from "@/components/CoachView";
import FocusView from "@/components/FocusView";
import StatsCard from "@/components/StatsCard";
import LevelBar from "@/components/LevelBar";
import WeeklyRecap from "@/components/WeeklyRecap";
import MilestoneCelebration from "@/components/MilestoneCelebration";
import StickyProgressBar from "@/components/StickyProgressBar";
import { StatsSkeleton } from "@/components/SkeletonLoader";
import DatePicker from "@/components/DatePicker";
import YouTubeVideoEditor from "@/components/YouTubeVideoEditor";
import { CHACHA_DAY_LABELS } from "@/lib/chachaSeedData";

function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

const VIEW_PREF_KEY = "preferredView";

export default function TodayPage() {
  const [selectedDate, setSelectedDate] = useState<string>(() => toLocalDateString(new Date()));
  const [workout, setWorkout] = useState<WorkoutDay | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode | null>(null);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalExercises, setTotalExercises] = useState(0);
  const [programMeta, setProgramMeta] = useState<ProgramMeta | null>(null);
  const [youtubeVideo, setYoutubeVideo] = useState<string | null>(null);
  const [isEditingVideo, setIsEditingVideo] = useState(false);
  const [showVideoCard, setShowVideoCard] = useState(false);
  const [activeProgram, setActiveProgramState] = useState<ProgramType>("adhd");
  const [customName, setCustomName] = useState("My Custom Program");
  const [isRestDay, setIsRestDay] = useState(false);
  const [commitment, setCommitment] = useState<CommitmentStats | null>(null);
  const [celebrations, setCelebrations] = useState<Milestone[]>([]);

  const allowedViews: ViewMode[] = activeProgram === "adhd" ? ["focus", "checklist", "coach"] : ["checklist", "coach"];
  const defaultView: ViewMode = activeProgram === "adhd" ? "focus" : "checklist";

  useEffect(() => {
    let cancelled = false;
    const loadId = selectedDate;

    async function loadWorkout() {
      setLoading(true);
      try {
        const currentProgram = await getActiveProgram();
        if (cancelled) return;
        setActiveProgramState(currentProgram);

        if (currentProgram === "custom") {
          getCustomProgramName().then((n) => !cancelled && setCustomName(n));
        }

        const allowed: ViewMode[] = currentProgram === "adhd" ? ["focus", "checklist", "coach"] : ["checklist", "coach"];
        const saved = (typeof window !== "undefined" ? localStorage.getItem(VIEW_PREF_KEY) : null) as ViewMode | null;
        setViewMode(saved && allowed.includes(saved) ? saved : currentProgram === "adhd" ? "focus" : "checklist");

        let selectedWorkout: WorkoutDay | null | undefined;
        if (currentProgram === "gym") {
          const gymInfo = getGymDayForDate(loadId);
          if (cancelled) return;
          setIsRestDay(!gymInfo.isGymDay);
          selectedWorkout = await getGymWorkoutByDate(loadId);
        } else if (currentProgram === "custom") {
          const gymInfo = getGymDayForDate(loadId);
          if (cancelled) return;
          setIsRestDay(!gymInfo.isGymDay);
          selectedWorkout = await getCustomWorkoutByDate(loadId);
        } else if (currentProgram === "chacha") {
          const chachaInfo = getChachaDayForDate(loadId);
          if (cancelled) return;
          setIsRestDay(!chachaInfo.isTrainingDay);
          selectedWorkout = await getChachaWorkoutByDate(loadId);
        } else {
          if (cancelled) return;
          setIsRestDay(false);
          selectedWorkout = await getAdhdWorkoutByDate(loadId);
        }
        if (cancelled) return;
        setWorkout(selectedWorkout || null);

        if (selectedWorkout) {
          const trackableIds = selectedWorkout.blocks.flatMap((b) =>
            b.exercises.filter((ex) => ex.category !== "Guidance").map((ex) => ex.id)
          );
          const trackableSet = new Set(trackableIds);
          setTotalExercises(trackableIds.length);

          const completions = await getCompletionsByDate(loadId);
          if (cancelled) return;
          const completed = completions.filter((c) => c.completed && trackableSet.has(c.exerciseId)).length;
          setCompletedCount(completed);
        } else {
          setTotalExercises(0);
          setCompletedCount(0);
        }

        const currentStreak = await calculateStreak();
        if (cancelled) return;
        setStreak(currentStreak);

        refreshCommitment();

        setProgramMeta(selectedWorkout?.program ?? null);

        const videoUrl = await getYouTubeVideo();
        if (cancelled) return;
        setYoutubeVideo(videoUrl);
      } catch (error) {
        console.error("Failed to load workout:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadWorkout();
    return () => {
      cancelled = true;
    };
  }, [selectedDate]);

  const refreshCommitment = useCallback(async () => {
    try {
      const all = await getAllCompletions();
      const stats = computeCommitmentStats(all);
      setCommitment(stats);

      const pending: Milestone[] = [];

      // Level-up celebration (only when level actually increases). State is
      // synced to Supabase so it celebrates once across all devices.
      const prevLevel = await getLastSeenLevel();
      if (prevLevel === null) {
        await setLastSeenLevel(stats.level.level);
      } else if (stats.level.level > prevLevel) {
        pending.push({
          type: "workouts",
          value: stats.level.level,
          title: `Level ${stats.level.level}!`,
          description: `You're now "${stats.level.title}". Keep stacking wins.`,
          emoji: "⭐️",
          achieved: true,
        });
        await setLastSeenLevel(stats.level.level);
      }

      // Newly earned achievements (each celebrated once, synced to Supabase).
      const achievements = computeAchievements(stats);
      const seen = await getSeenAchievements();
      if (seen === null) {
        // First run: seed without dumping every past achievement at once.
        await setSeenAchievements(earnedIds(achievements));
      } else {
        const fresh = pickNewlyEarned(achievements, seen);
        if (fresh.length > 0) {
          await setSeenAchievements([...seen, ...fresh.map((a) => a.id)]);
          fresh.forEach((a) => {
            pending.push({
              type: "workouts",
              value: 0,
              title: a.title,
              description: a.description,
              emoji: a.emoji,
              achieved: true,
            });
          });
        }
      }

      if (pending.length > 0) setCelebrations((c) => [...c, ...pending]);
    } catch (e) {
      console.error("Failed to refresh commitment stats:", e);
    }
  }, []);

  const handleProgressChange = useCallback(
    (completed: number, total: number) => {
      setCompletedCount(completed);
      setTotalExercises(total);
      refreshCommitment();
    },
    [refreshCommitment]
  );

  const handleViewChange = (view: ViewMode) => {
    setViewMode(view);
    localStorage.setItem(VIEW_PREF_KEY, view);
  };

  const todayProgress = totalExercises > 0 ? Math.round((completedCount / totalExercises) * 100) : 0;

  // Find the next training day for schedule-based programs.
  const getNextScheduledDay = (fromDate: Date, program: ProgramType): { date: Date; day: string } => {
    const d = new Date(fromDate);
    for (let i = 1; i <= 7; i++) {
      d.setDate(d.getDate() + 1);
      const dow = d.getDay();
      if (program === "chacha") {
        if (dow >= 1 && dow <= 5) {
          return {
            date: new Date(d),
            day: d.toLocaleDateString("en-US", { weekday: "long" }),
          };
        }
      } else {
        if (dow === 1) return { date: new Date(d), day: "Monday" };
        if (dow === 3) return { date: new Date(d), day: "Wednesday" };
        if (dow === 5) return { date: new Date(d), day: "Friday" };
      }
    }
    return { date: d, day: "Monday" };
  };

  const jumpToWeekday = (targetDay: number) => {
    const today = new Date();
    const currentDay = today.getDay();
    let daysToAdd = targetDay - currentDay;
    if (daysToAdd <= 0) daysToAdd += 7;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysToAdd);
    setSelectedDate(toLocalDateString(targetDate));
  };

  if (loading || viewMode === null) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <section className="bg-white dark:bg-black border-b border-[#E5E5EA] dark:border-[#38383A]">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <StatsSkeleton />
          </div>
        </section>
        <main className="max-w-4xl mx-auto px-4 py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-3xl" />
            <div className="h-28 bg-gray-200 dark:bg-gray-800 rounded-3xl" />
            <div className="h-28 bg-gray-200 dark:bg-gray-800 rounded-3xl" />
          </div>
        </main>
      </div>
    );
  }

  // Rest-day screen for schedule-based programs (gym / custom).
  if (!workout) {
    if ((activeProgram === "gym" || activeProgram === "custom" || activeProgram === "chacha") && isRestDay) {
      const selectedDateObj = parseLocalDate(selectedDate);
      const dayName = selectedDateObj.toLocaleDateString("en-US", { weekday: "long" });
      const nextDay = getNextScheduledDay(selectedDateObj, activeProgram);
      const nextDateStr = toLocalDateString(nextDay.date);

      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
          <div className="max-w-md mx-auto pt-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg mb-4">
              <div className="text-5xl mb-3">😴</div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Rest Day · {dayName}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Recovery is part of the program</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg mb-4">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">NEXT WORKOUT</h3>
              <button
                onClick={() => setSelectedDate(nextDateStr)}
                className="w-full bg-gradient-to-r from-[#FF2D55] to-[#FF6482] rounded-xl p-4 text-left text-white hover:opacity-90 transition-opacity"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-lg">{nextDay.day}</div>
                  <div className="text-2xl">→</div>
                </div>
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">JUMP TO WORKOUT</h3>
              <div className={`grid gap-2 ${activeProgram === "chacha" ? "grid-cols-5" : "grid-cols-3"}`}>
                {(activeProgram === "chacha"
                  ? [
                      { d: 1, label: "Mon", emoji: "🦵" },
                      { d: 2, label: "Tue", emoji: "❤️" },
                      { d: 3, label: "Wed", emoji: "💪" },
                      { d: 4, label: "Thu", emoji: "🔙" },
                      { d: 5, label: "Fri", emoji: "🏋️" },
                    ]
                  : [
                      { d: 1, label: "Mon", emoji: "💪" },
                      { d: 3, label: "Wed", emoji: "🔙" },
                      { d: 5, label: "Fri", emoji: "🦵" },
                    ]
                ).map((b) => (
                  <button
                    key={b.d}
                    onClick={() => jumpToWeekday(b.d)}
                    className="bg-gray-50 dark:bg-gray-700/40 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-3 text-center hover:border-[#FF2D55] transition-colors"
                  >
                    <div className="text-xl mb-1">{b.emoji}</div>
                    <div className="text-xs font-bold text-gray-700 dark:text-gray-300">{b.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full text-center shadow-lg">
          <div className="text-5xl mb-4">🤔</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Workout Found</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Unable to load this day&apos;s workout. Try refreshing or picking another date.
          </p>
        </div>
      </div>
    );
  }

  const selectedDateObj = parseLocalDate(selectedDate);
  const todayDate = selectedDateObj.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const isToday = selectedDate === toLocalDateString(new Date());
  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);
  const isPastDay = selectedDateObj < todayMidnight;
  const isFutureDay = selectedDateObj > todayMidnight;

  const totalMinutes = workout.blocks
    .filter((b) => b.exercises.some((ex) => ex.category !== "Guidance"))
    .reduce((sum, b) => sum + b.estimatedMinutes, 0);

  const programBadge =
    activeProgram === "gym"
      ? "🏋️ Gym PPL"
      : activeProgram === "chacha"
        ? "💪 Chacha Training"
        : activeProgram === "custom"
          ? `🗂️ ${customName}`
          : "🧠 ADHD Knee + Back";

  const viewLabels: Record<ViewMode, string> = { focus: "Focus", checklist: "List", coach: "Detail" };

  return (
    <div className="bg-white dark:bg-black">
      {celebrations.length > 0 && (
        <MilestoneCelebration milestones={celebrations} onClose={() => setCelebrations([])} />
      )}
      <StickyProgressBar progress={todayProgress} />

      {/* Stats Section */}
      <section className="bg-white dark:bg-black border-b border-[#E5E5EA] dark:border-[#38383A]">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="mb-3">
            <Link
              href="/program"
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FF2D55]/10 dark:bg-[#FF2D55]/20 rounded-full text-sm font-medium text-[#FF2D55] hover:bg-[#FF2D55]/20 transition-colors max-w-full"
            >
              <span className="truncate">{programBadge}</span>
              <span className="text-xs opacity-70 flex-shrink-0">Change →</span>
            </Link>
          </div>

          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-base text-[#8E8E93] font-medium">{todayDate}</p>
                {!isToday && (
                  <span className="text-xs bg-[#FF9500] text-white px-2 py-0.5 rounded-full font-medium">
                    {isPastDay ? "Past" : isFutureDay ? "Future" : ""}
                  </span>
                )}
              </div>
              {programMeta && (
                <p className="text-sm text-[#8E8E93]">
                  {(activeProgram === "adhd" || activeProgram === "custom" || activeProgram === "chacha") &&
                    `Week ${programMeta.week} · `}
                  {activeProgram === "gym" && (
                    <span>
                      Day {programMeta.day}{" "}
                      {programMeta.day === "A" ? "💪 Chest" : programMeta.day === "B" ? "🔙 Back + Biceps" : "🦵 Shoulders + Legs"}
                    </span>
                  )}
                  {activeProgram === "chacha" && programMeta.day in CHACHA_DAY_LABELS && (
                    <span>{CHACHA_DAY_LABELS[programMeta.day as keyof typeof CHACHA_DAY_LABELS]}</span>
                  )}
                  {activeProgram === "adhd" && (
                    <span>
                      🧠{" "}
                      {getGymDayForDate(selectedDate).isGymDay
                        ? "3 breaks today (incl. knee)"
                        : "Break 1 + 3 today · knee block Mon/Wed/Fri"}
                    </span>
                  )}
                  {activeProgram === "custom" && <span>Day {programMeta.day}</span>}
                </p>
              )}
            </div>
            <DatePicker
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              showKneeDayHints={activeProgram === "adhd"}
            />
          </div>

          {commitment && (
            <Link
              href="/progress"
              className="block mb-3 rounded-2xl p-4 bg-gradient-to-r from-[#5856D6] to-[#7B7AE8] shadow-sm active:scale-[0.99] transition-transform"
            >
              <LevelBar level={commitment.level} />
            </Link>
          )}

          <div className="grid grid-cols-3 gap-3">
            <StatsCard value={streak} label="Streak" icon="🔥" color="orange" />
            <StatsCard value={`${todayProgress}%`} label="Progress" icon="✓" color="green" />
            <StatsCard value={totalMinutes} label="Minutes" icon="⏱" color="pink" />
          </div>

          {commitment && (
            <div className="mt-3">
              <WeeklyRecap completedDates={commitment.completedDates} streak={streak} />
            </div>
          )}
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 py-5">
        {/* View switcher */}
        <div className="inline-flex w-full sm:w-auto rounded-2xl bg-[#F2F2F7] dark:bg-[#1C1C1E] p-1 mb-5">
          {allowedViews.map((v) => (
            <button
              key={v}
              onClick={() => handleViewChange(v)}
              className={`flex-1 sm:flex-none sm:px-6 py-2 rounded-xl text-sm font-semibold transition-all ${
                viewMode === v
                  ? "bg-white dark:bg-[#2C2C2E] text-[#1C1C1E] dark:text-white shadow-sm"
                  : "text-[#8E8E93]"
              }`}
              aria-pressed={viewMode === v}
            >
              {viewLabels[v]}
            </button>
          ))}
        </div>

        {/* Active view — key forces remount when the date changes */}
        <div className="animate-fade-in">
          {viewMode === "focus" ? (
            <FocusView key={selectedDate} workout={workout} onProgressChange={handleProgressChange} />
          ) : viewMode === "checklist" ? (
            <ChecklistView key={selectedDate} workout={workout} onProgressChange={handleProgressChange} />
          ) : (
            <CoachView key={selectedDate} workout={workout} onProgressChange={handleProgressChange} />
          )}
        </div>

        {/* Habit Coach prompt (ADHD) */}
        {activeProgram === "adhd" && (
          <Link
            href="/habits"
            className="mt-6 flex items-center gap-3 bg-[#5856D6]/10 hover:bg-[#5856D6]/15 rounded-2xl p-4 transition-colors"
          >
            <span className="text-2xl">💡</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#1C1C1E] dark:text-white">Fighting an urge right now?</p>
              <p className="text-xs text-[#8E8E93]">
                Eating out, scrolling, skipping rehab? Get an instant intervention in Habit Coach.
              </p>
            </div>
            <span className="text-[#5856D6]">→</span>
          </Link>
        )}

        {/* Reminder nudge (ADHD) */}
        {activeProgram === "adhd" && (
          <Link
            href="/settings"
            className="mt-3 flex items-center gap-3 bg-[#007AFF]/10 hover:bg-[#007AFF]/15 rounded-2xl p-4 transition-colors"
          >
            <span className="text-2xl">⏰</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#1C1C1E] dark:text-white">Set break reminders</p>
              <p className="text-xs text-[#8E8E93]">Get nudged for each break so you never forget · in Settings</p>
            </div>
            <span className="text-[#007AFF]">→</span>
          </Link>
        )}

        {/* Motivation video */}
        <div className="mt-6">
          {!showVideoCard && !youtubeVideo && !isEditingVideo ? (
            <button
              onClick={() => setShowVideoCard(true)}
              className="text-sm text-[#8E8E93] hover:text-[#FF2D55] transition-colors"
            >
              + Add a motivation video
            </button>
          ) : (
            <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-4 shadow-sm border border-[#E5E5EA] dark:border-[#38383A]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[#1C1C1E] dark:text-white">💪 Stay Motivated</h3>
                {youtubeVideo && !isEditingVideo && (
                  <button
                    onClick={() => setIsEditingVideo(true)}
                    className="text-xs text-[#FF2D55] font-medium px-3 py-1 rounded-lg hover:bg-[#FF2D55]/10 transition-all"
                  >
                    Edit
                  </button>
                )}
              </div>
              {isEditingVideo || !youtubeVideo ? (
                <YouTubeVideoEditor
                  initialUrl={youtubeVideo || ""}
                  onSave={async (url) => {
                    await saveYouTubeVideo(url);
                    setYoutubeVideo(url);
                    setIsEditingVideo(false);
                  }}
                />
              ) : (
                <div className="aspect-video rounded-xl overflow-hidden bg-[#E5E5EA] dark:bg-[#38383A]">
                  <iframe
                    src={youtubeVideo}
                    title="Motivation Video"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
