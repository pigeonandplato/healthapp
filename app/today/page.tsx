"use client";

import Link from "next/link";

import { useState, useEffect } from "react";
import { WorkoutDay, ViewMode } from "@/lib/types";
import { getTodayWorkout, getTodayDateString, getCompletionsByDate, getDayRotation, getWorkoutByDate } from "@/lib/db";
import { calculateStreak, getMotivationalMessage } from "@/lib/streak";
import { getProgramMetaForDate, setProgramStartDate } from "@/lib/program";
import type { ProgramMeta } from "@/lib/types";
import ChecklistView from "@/components/ChecklistView";
import CoachView from "@/components/CoachView";
import ViewToggle from "@/components/ViewToggle";
import StatsCard from "@/components/StatsCard";
import CircularProgress from "@/components/CircularProgress";

export default function TodayPage() {
  const [workout, setWorkout] = useState<WorkoutDay | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("checklist");
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [todayProgress, setTodayProgress] = useState(0);
  const [totalExercises, setTotalExercises] = useState(0);
  const [dayRotation, setDayRotation] = useState<'A' | 'B' | 'C'>('A');
  const [tomorrowWorkout, setTomorrowWorkout] = useState<WorkoutDay | null>(null);
  const [programMeta, setProgramMeta] = useState<ProgramMeta | null>(null);
  const [showMissedDayPrompt, setShowMissedDayPrompt] = useState(false);

  // Load view preference from localStorage
  useEffect(() => {
    const savedView = localStorage.getItem("preferredView") as ViewMode;
    if (savedView === "coach" || savedView === "checklist") {
      setViewMode(savedView);
    }
  }, []);

  // Load today's workout and stats
  useEffect(() => {
    async function loadWorkout() {
      setLoading(true);
      try {
        const todayWorkout = await getTodayWorkout();
        setWorkout(todayWorkout || null);
        
        // Get today's day rotation
        const rotation = getDayRotation();
        setDayRotation(rotation);
        
        // Calculate stats
        if (todayWorkout) {
          const totalEx = todayWorkout.blocks.reduce(
            (sum, b) => sum + b.exercises.length,
            0
          );
          setTotalExercises(totalEx);
          
          // Get today's completions
          const completions = await getCompletionsByDate(todayWorkout.date);
          const completed = completions.filter((c) => c.completed).length;
          const progress = totalEx > 0 ? Math.round((completed / totalEx) * 100) : 0;
          setTodayProgress(progress);
        }
        
        // Calculate streak
        const currentStreak = await calculateStreak();
        setStreak(currentStreak);
        
        // Get program meta
        const meta = await getProgramMetaForDate();
        setProgramMeta(meta);
        
        // Load tomorrow's workout for preview
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowDate = tomorrow.toISOString().split("T")[0];
        const tomorrowW = await getWorkoutByDate(tomorrowDate);
        setTomorrowWorkout(tomorrowW || null);
      } catch (error) {
        console.error("Failed to load workout:", error);
      } finally {
        setLoading(false);
      }
    }

    loadWorkout();
  }, []);

  const handleViewChange = (newView: ViewMode) => {
    setViewMode(newView);
    localStorage.setItem("preferredView", newView);
  };

  const handleShowCoachView = () => {
    setViewMode("coach");
    localStorage.setItem("preferredView", "coach");
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePushProgramOneDay = async () => {
    if (!programMeta) return;
    const startDate = new Date(programMeta.startDate);
    startDate.setDate(startDate.getDate() - 1); // Push forward by moving start back
    const newStartDate = startDate.toISOString().split("T")[0];
    await setProgramStartDate(newStartDate);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your workout...</p>
        </div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full text-center shadow-lg">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            No Workout Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Unable to load today's workout. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const totalMinutes = workout
    ? workout.blocks.reduce((sum, b) => sum + b.estimatedMinutes, 0)
    : 0;

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-black">
      {/* Modern iOS-Style Header */}
      <header className="gradient-blue-purple text-white shadow-xl relative overflow-hidden">
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-4 safe-top py-6 relative z-10">
          {/* Greeting */}
          <div className="mb-6 animate-slide-up-ios">
            <h1 className="text-3xl font-black mb-1 drop-shadow-lg tracking-tight">
              {getGreeting()}, Champion! 💪
            </h1>
            <p className="text-white/80 text-base font-medium">{todayDate}</p>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <Link
                href="/program"
                className="glass-modern px-4 py-2 rounded-full text-white font-semibold text-sm hover:scale-105 active:scale-95 transition-transform touch-target"
              >
                {programMeta ? `Week ${programMeta.week} • ${programMeta.phase} • Day ${programMeta.day}` : `Day ${dayRotation}`}
              </Link>
              <Link
                href="/schedule"
                className="glass-modern px-4 py-2 rounded-full text-white font-semibold text-sm hover:scale-105 active:scale-95 transition-transform touch-target"
              >
                📅 Schedule
              </Link>
              <button
                onClick={() => setShowMissedDayPrompt(!showMissedDayPrompt)}
                className="glass-modern px-4 py-2 rounded-full text-white font-semibold text-sm hover:scale-105 active:scale-95 transition-transform touch-target"
              >
                ⏭️ Missed Day?
              </button>
            </div>
            {showMissedDayPrompt && (
              <div className="mt-3 glass-modern rounded-2xl p-4 animate-slide-up-ios">
                <p className="text-white text-sm mb-3 leading-relaxed">
                  Missed today's workout? Push your entire program forward by 1 day so tomorrow shows today's exercises.
                </p>
                <button
                  onClick={handlePushProgramOneDay}
                  className="bg-white text-[#0A84FF] hover:bg-white/90 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 touch-target w-full"
                >
                  ⏭️ Push Program Forward 1 Day
                </button>
              </div>
            )}
            <p className="text-white/70 text-sm mt-2">{getMotivationalMessage()}</p>
          </div>

          {/* Stats Grid - iOS Card Style */}
          <div className="grid grid-cols-3 gap-3 animate-fade-in-ios">
            <StatsCard value={streak} label="Day Streak" icon="🔥" color="orange" />
            <StatsCard
              value={`${todayProgress}%`}
              label="Today"
              icon="✅"
              color="green"
            />
            <StatsCard
              value={totalMinutes}
              label="Minutes"
              icon="⏱️"
              color="purple"
            />
          </div>

          {/* Progress Circle */}
          {todayProgress > 0 && (
            <div className="mt-5 flex justify-center animate-bounce-gentle">
              <CircularProgress percentage={todayProgress} size={90} strokeWidth={7} />
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 pb-32 safe-bottom">
        {/* Quick Action Button - iOS Style */}
        {viewMode === "checklist" && (
          <div className="mb-6 animate-slide-up-ios">
            <button
              onClick={handleShowCoachView}
              className="w-full gradient-blue-purple text-white font-bold py-5 px-6 rounded-2xl shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 ios-button touch-target"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
                />
              </svg>
              <span className="text-base">Show me my exercises for today</span>
            </button>
          </div>
        )}

        
        {/* Quick Navigation */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Link
            href="/schedule"
            className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl p-4 shadow-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 transition flex items-center gap-3"
          >
            <div className="text-3xl">📅</div>
            <div>
              <div className="font-bold text-gray-900 dark:text-gray-100">Schedule</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">View full calendar</div>
            </div>
          </Link>
          <Link
            href="/program"
            className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl p-4 shadow-lg border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 transition flex items-center gap-3"
          >
            <div className="text-3xl">🎯</div>
            <div>
              <div className="font-bold text-gray-900 dark:text-gray-100">Program</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Phases & gates</div>
            </div>
          </Link>
        </div>

        {/* Tomorrow Preview */}
        {tomorrowWorkout && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-5 mb-6 border-2 border-indigo-300 dark:border-indigo-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                🔮 Tomorrow Preview
              </h3>
              <Link
                href="/schedule"
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View full schedule →
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-4xl">
                {tomorrowWorkout.program?.day === 'A' ? '💪' : 
                 tomorrowWorkout.program?.day === 'B' ? '🏋️' : '🚴'}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  Day {tomorrowWorkout.program?.day || 'A'}
                  {tomorrowWorkout.program && (
                    <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-2">
                      (Week {tomorrowWorkout.program.week})
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {tomorrowWorkout.blocks.length} blocks • ~
                  {tomorrowWorkout.blocks.reduce((s, b) => s + b.estimatedMinutes, 0)} min
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {tomorrowWorkout.blocks.map(b => b.name).slice(0, 2).join(' • ')}
                  {tomorrowWorkout.blocks.length > 2 && '...'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Toggle */}
        <div className="flex justify-center mb-6">
          <ViewToggle currentView={viewMode} onViewChange={handleViewChange} />
        </div>

        {/* View Content */}
        <div>
          {viewMode === "checklist" ? (
            <ChecklistView workout={workout} />
          ) : (
            <CoachView workout={workout} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white mt-12 shadow-2xl">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <div className="mb-4">
            <h3 className="text-2xl font-black mb-2">Health Tracker PWA</h3>
            <p className="text-blue-100 text-sm">
              Your personal fitness companion • Always offline-ready
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="flex justify-center gap-6 text-sm">
            <div>
              <div className="font-bold text-lg">{totalExercises}</div>
              <div className="text-blue-200">Exercises</div>
            </div>
            <div>
              <div className="font-bold text-lg">{workout?.blocks.length || 0}</div>
              <div className="text-blue-200">Blocks</div>
            </div>
            <div>
              <div className="font-bold text-lg">{streak}</div>
              <div className="text-blue-200">Day Streak</div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-xs text-blue-200">
              Made with 💙 • Version 1.0.0
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

