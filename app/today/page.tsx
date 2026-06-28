"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  maybeMigrateChachaVideoSeedVersion,
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
// Core view — loaded eagerly (always needed above the fold)
import ChecklistView from "@/components/ChecklistView";
import StickyProgressBar from "@/components/StickyProgressBar";
import DayNavigator from "@/components/DayNavigator";
import { StatsSkeleton } from "@/components/SkeletonLoader";
import { isValidIsoDate, parseLocalDate as parseIsoDate } from "@/lib/dates";
import { CHACHA_DAY_LABELS } from "@/lib/chachaSeedData";

// Heavy components deferred until after first paint
const CoachView = dynamic(() => import("@/components/CoachView"), { ssr: false });
const FocusView = dynamic(() => import("@/components/FocusView"), { ssr: false });
const StatsCard = dynamic(() => import("@/components/StatsCard"), { ssr: false });
const WeeklyRecap = dynamic(() => import("@/components/WeeklyRecap"), { ssr: false });
const MilestoneCelebration = dynamic(() => import("@/components/MilestoneCelebration"), { ssr: false });
const DatePicker = dynamic(() => import("@/components/DatePicker"), { ssr: false });
const YouTubeVideoEditor = dynamic(() => import("@/components/YouTubeVideoEditor"), { ssr: false });

function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseLocalDate(dateStr: string): Date {
  return parseIsoDate(dateStr);
}

const VIEW_PREF_KEY = "preferredView";

function TodayPageLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <section className="bg-white dark:bg-black border-b border-[#F0E9CE] dark:border-[#3D3730]">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <StatsSkeleton />
        </div>
      </section>
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-40 bg-[#F0E9CE] dark:bg-[#2C2622] rounded-3xl" />
          <div className="h-28 bg-[#F0E9CE] dark:bg-[#2C2622] rounded-3xl" />
          <div className="h-28 bg-[#F0E9CE] dark:bg-[#2C2622] rounded-3xl" />
        </div>
      </main>
    </div>
  );
}

export default function TodayPage() {
  return (
    <Suspense fallback={<TodayPageLoading />}>
      <TodayPageContent />
    </Suspense>
  );
}

function TodayPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialDateParam = searchParams.get("date");
  const initialViewParam = searchParams.get("view") as ViewMode | null;

  const [selectedDate, setSelectedDateState] = useState<string>(() => {
    if (initialDateParam && isValidIsoDate(initialDateParam)) return initialDateParam;
    return toLocalDateString(new Date());
  });
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

  const syncUrl = useCallback(
    (date: string, view: ViewMode | null) => {
      const params = new URLSearchParams();
      const today = toLocalDateString(new Date());
      if (date !== today) params.set("date", date);
      if (view === "coach") params.set("view", "coach");
      const qs = params.toString();
      router.replace(qs ? `/today?${qs}` : "/today", { scroll: false });
    },
    [router]
  );

  const setSelectedDate = useCallback(
    (date: string) => {
      setSelectedDateState(date);
      syncUrl(date, viewMode);
    },
    [syncUrl, viewMode]
  );

  useEffect(() => {
    if (initialDateParam && isValidIsoDate(initialDateParam) && initialDateParam !== selectedDate) {
      setSelectedDateState(initialDateParam);
    }
  }, [initialDateParam]);
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

        if (currentProgram === "chacha") {
          await maybeMigrateChachaVideoSeedVersion();
        }

        if (currentProgram === "custom") {
          getCustomProgramName().then((n) => !cancelled && setCustomName(n));
        }

        const allowed: ViewMode[] = currentProgram === "adhd" ? ["focus", "checklist", "coach"] : ["checklist", "coach"];
        const saved = (typeof window !== "undefined" ? localStorage.getItem(VIEW_PREF_KEY) : null) as ViewMode | null;
        const fromUrl = initialViewParam && allowed.includes(initialViewParam) ? initialViewParam : null;
        setViewMode(fromUrl ?? (saved && allowed.includes(saved) ? saved : currentProgram === "adhd" ? "focus" : "checklist"));

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

      const achievements = computeAchievements(stats);
      const seen = await getSeenAchievements();
      if (seen === null) {
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
    syncUrl(selectedDate, view);
  };

  const getDaySubtitle = (): string | undefined => {
    if (!programMeta) return undefined;
    if (activeProgram === "gym") {
      return programMeta.day === "A"
        ? "Chest day"
        : programMeta.day === "B"
          ? "Back + biceps"
          : "Shoulders + legs";
    }
    if (activeProgram === "chacha" && programMeta.day in CHACHA_DAY_LABELS) {
      return CHACHA_DAY_LABELS[programMeta.day as keyof typeof CHACHA_DAY_LABELS];
    }
    if (activeProgram === "adhd" || activeProgram === "custom") {
      return `Week ${programMeta.week}`;
    }
    return undefined;
  };

  const todayProgress = totalExercises > 0 ? Math.round((completedCount / totalExercises) * 100) : 0;

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
    return <TodayPageLoading />;
  }

  if (!workout) {
    if ((activeProgram === "gym" || activeProgram === "custom" || activeProgram === "chacha") && isRestDay) {
      const selectedDateObj = parseLocalDate(selectedDate);
      const dayName = selectedDateObj.toLocaleDateString("en-US", { weekday: "long" });
      const nextDay = getNextScheduledDay(selectedDateObj, activeProgram);
      const nextDateStr = toLocalDateString(nextDay.date);

      return (
        <div className="min-h-screen bg-[#F6F3E9] dark:bg-black p-4">
          <div className="max-w-md mx-auto pt-4 space-y-4">
            <DayNavigator
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              program={activeProgram}
            />

            <div className="bg-white dark:bg-[#2C2622] rounded-2xl p-6 text-center">
              <div className="text-5xl mb-3">😴</div>
              <h2 className="text-xl font-bold text-[#1B1714] dark:text-white mb-1">Rest Day · {dayName}</h2>
              <p className="text-sm text-[#8A7F78] dark:text-[#8A7F78]">Recovery is part of the program</p>
            </div>

            <div className="bg-white dark:bg-[#2C2622] rounded-2xl p-5 mb-4">
              <h3 className="text-sm font-semibold text-[#8A7F78] dark:text-[#8A7F78] mb-3">NEXT WORKOUT</h3>
              <button
                onClick={() => setSelectedDate(nextDateStr)}
                className="w-full bg-gradient-to-r from-[#5E8C6E] to-[#79A98C] rounded-xl p-4 text-left text-white hover:opacity-90 transition-opacity"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-lg">{nextDay.day}</div>
                  <div className="text-2xl">→</div>
                </div>
              </button>
            </div>

            <div className="bg-white dark:bg-[#2C2622] rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-[#8A7F78] dark:text-[#8A7F78] mb-3">JUMP TO WORKOUT</h3>
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
                    className="bg-[#F0E9CE] dark:bg-[#2C2622] border-2 border-[#F0E9CE] dark:border-[#3D3730] rounded-xl p-3 text-center hover:border-[#79A98C] transition-colors"
                  >
                    <div className="text-xl mb-1">{b.emoji}</div>
                    <div className="text-xs font-bold text-[#3D3730] dark:text-[#D4CFC9]">{b.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-white dark:bg-black p-4 pb-24">
        <div className="max-w-md mx-auto pt-12 space-y-4">
          <div className="bg-white dark:bg-[#1B1714] rounded-2xl p-8 text-center border border-[#F0E9CE] dark:border-[#3D3730]">
            <div className="text-6xl mb-4">👋</div>
            <h2 className="text-2xl font-bold text-[#1B1714] dark:text-white mb-3">Welcome to Health Tracker</h2>
            <p className="text-sm text-[#8A7F78] mb-6">
              No program set up yet. Choose one of our built-in programs or create your own.
            </p>

            <div className="space-y-3">
              <Link
                href="/program"
                className="block w-full bg-[#79A98C] hover:bg-[#5E8C6E] text-white font-semibold py-3 rounded-xl transition-all active:scale-95"
              >
                Choose a Program
              </Link>
              <Link
                href="/settings#generate-with-ai"
                className="block w-full bg-[#F6F3E9] dark:bg-[#2C2622] hover:bg-[#F0E9CE] dark:hover:bg-[#3D3730] text-[#1B1714] dark:text-white font-medium py-3 rounded-xl transition-all"
              >
                Create Custom Program
              </Link>
            </div>

            <div className="mt-6 pt-4 border-t border-[#F0E9CE] dark:border-[#3D3730]">
              <p className="text-xs text-[#8A7F78]">
                First time? Check out the <Link href="/help" className="text-[#79A98C] hover:underline font-medium">Help guide</Link>
              </p>
            </div>
          </div>
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

  const viewLabels: Record<ViewMode, string> = {
    focus: "Focus",
    checklist: "List",
    coach: "Detail + video",
  };

  return (
    <div className="bg-[#F6F3E9] dark:bg-black">
      {celebrations.length > 0 && (
        <MilestoneCelebration milestones={celebrations} onClose={() => setCelebrations([])} />
      )}
      <StickyProgressBar progress={todayProgress} />

      <section className="bg-[#F6F3E9] dark:bg-black border-b border-[#F0E9CE] dark:border-[#3D3730]">
        <div className="max-w-4xl mx-auto px-4 pt-4 pb-3">

          {/* Big page heading */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-[#1B1714] dark:text-white leading-none">
                {isToday ? "Today" : parseLocalDate(selectedDate).toLocaleDateString("en-US", { weekday: "long" })}
              </h1>
              <p className="text-sm text-[#8A7F78] mt-1">
                {todayDate}
                {programMeta && (
                  <>
                    {(activeProgram === "adhd" || activeProgram === "custom" || activeProgram === "chacha") &&
                      ` · Week ${programMeta.week}`}
                    {activeProgram === "gym" &&
                      ` · Day ${programMeta.day}`}
                    {activeProgram === "chacha" && programMeta.day in CHACHA_DAY_LABELS &&
                      ` · Day ${programMeta.day} of 5`}
                  </>
                )}
                {!isToday && (
                  <span className="ml-2 text-xs bg-[#79A98C]/20 text-[#79A98C] px-2 py-0.5 rounded-full font-medium">
                    {isPastDay ? "Past" : isFutureDay ? "Future" : ""}
                  </span>
                )}
              </p>
            </div>
            <DatePicker
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              showKneeDayHints={activeProgram === "adhd"}
            />
          </div>

          {/* Program pill */}
          <div className="mb-3">
            <Link
              href="/program"
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#79A98C]/10 dark:bg-[#79A98C]/20 rounded-full text-sm font-medium text-[#79A98C] hover:bg-[#79A98C]/20 transition-colors max-w-full"
            >
              <span className="w-2 h-2 rounded-full bg-[#79A98C] flex-shrink-0" />
              <span className="truncate">{programBadge}</span>
              <svg className="w-3 h-3 opacity-60 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
          </div>

          <DayNavigator
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            program={activeProgram}
            subtitle={getDaySubtitle()}
            className="mb-4"
          />

          {commitment && (
            <Link
              href="/progress"
              className="block mb-3 bg-white dark:bg-[#1B1714] rounded-2xl border border-[#F0E9CE] dark:border-[#3D3730] px-4 py-3 active:scale-[0.99] transition-transform"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-[#79A98C]/10 flex items-center justify-center text-sm font-black text-[#79A98C]">
                    {commitment.level.level}
                  </span>
                  <div className="leading-tight">
                    <p className="text-sm font-bold text-[#1B1714] dark:text-white">Level {commitment.level.level}</p>
                    <p className="text-[11px] text-[#8A7F78] -mt-0.5">{commitment.level.title}</p>
                  </div>
                </div>
                <span className="text-[11px] text-[#8A7F78]">{commitment.level.xpToNextLevel} XP to next</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#F0E9CE] dark:bg-[#3D3730] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#79A98C] transition-all duration-700"
                  style={{ width: `${commitment.level.progressPct}%` }}
                />
              </div>
            </Link>
          )}

          <div className="bg-white dark:bg-[#1B1714] rounded-2xl border border-[#F0E9CE] dark:border-[#3D3730]">
            <div className="grid grid-cols-3 divide-x divide-[#F0E9CE] dark:divide-[#3D3730]">
              <div className="py-3 text-center">
                <p className="text-xl font-bold text-[#79A98C]">{streak}</p>
                <p className="text-[10px] font-medium text-[#8A7F78] uppercase tracking-wide mt-0.5">Streak</p>
              </div>
              <div className="py-3 text-center">
                <p className="text-xl font-bold text-[#3E7E57]">{todayProgress}%</p>
                <p className="text-[10px] font-medium text-[#8A7F78] uppercase tracking-wide mt-0.5">Today</p>
              </div>
              <div className="py-3 text-center">
                <p className="text-xl font-bold text-[#9DC1A5]">{totalMinutes}</p>
                <p className="text-[10px] font-medium text-[#8A7F78] uppercase tracking-wide mt-0.5">Mins</p>
              </div>
            </div>
          </div>

          {commitment && (
            <div className="mt-3">
              <WeeklyRecap completedDates={commitment.completedDates} streak={streak} />
            </div>
          )}
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 py-5">
        <div className="inline-flex w-full sm:w-auto rounded-2xl bg-[#F0E9CE] dark:bg-[#1B1714] p-1 mb-5">
          {allowedViews.map((v) => (
            <button
              key={v}
              onClick={() => handleViewChange(v)}
              className={`flex-1 sm:flex-none sm:px-6 py-2 rounded-xl text-sm font-semibold transition-all ${
                viewMode === v
                  ? "bg-white dark:bg-[#2C2622] text-[#1B1714] dark:text-white shadow-sm"
                  : "text-[#8A7F78]"
              }`}
              aria-pressed={viewMode === v}
            >
              {viewLabels[v]}
            </button>
          ))}
        </div>

        <div className="animate-fade-in">
          {viewMode === "focus" ? (
            <FocusView key={selectedDate} workout={workout} onProgressChange={handleProgressChange} />
          ) : viewMode === "checklist" ? (
            <ChecklistView
              key={selectedDate}
              workout={workout}
              onProgressChange={handleProgressChange}
              onOpenDetailView={() => handleViewChange("coach")}
            />
          ) : (
            <CoachView key={selectedDate} workout={workout} onProgressChange={handleProgressChange} />
          )}
        </div>

        {activeProgram === "adhd" && (
          <Link
            href="/habits"
            className="mt-6 flex items-center gap-3 bg-[#79A98C]/8 hover:bg-[#79A98C]/12 rounded-2xl p-4 transition-colors"
          >
            <span className="text-2xl">💡</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#1B1714] dark:text-white">Fighting an urge right now?</p>
              <p className="text-xs text-[#8A7F78]">
                Eating out, scrolling, skipping rehab? Get an instant intervention in Habit Coach.
              </p>
            </div>
            <span className="text-[#79A98C]">→</span>
          </Link>
        )}

        {activeProgram === "adhd" && (
          <Link
            href="/settings"
            className="mt-3 flex items-center gap-3 bg-[#79A98C]/10 hover:bg-[#79A98C]/15 rounded-2xl p-4 transition-colors"
          >
            <span className="text-2xl">⏰</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#1B1714] dark:text-white">Set break reminders</p>
              <p className="text-xs text-[#8A7F78]">Get nudged for each break so you never forget · in Settings</p>
            </div>
            <span className="text-[#79A98C]">→</span>
          </Link>
        )}

        <div className="mt-6">
          {!showVideoCard && !youtubeVideo && !isEditingVideo ? (
            <button
              onClick={() => setShowVideoCard(true)}
              className="text-sm text-[#8A7F78] hover:text-[#79A98C] transition-colors"
            >
              + Add a motivation video
            </button>
          ) : (
            <div className="bg-white dark:bg-[#1B1714] rounded-2xl p-4 border border-[#F0E9CE] dark:border-[#3D3730]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[#1B1714] dark:text-white">💪 Stay Motivated</h3>
                {youtubeVideo && !isEditingVideo && (
                  <button
                    onClick={() => setIsEditingVideo(true)}
                    className="text-xs text-[#79A98C] font-medium px-3 py-1 rounded-lg hover:bg-[#79A98C]/10 transition-all"
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
                <div className="aspect-video rounded-xl overflow-hidden bg-[#F0E9CE] dark:bg-[#3D3730]">
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
