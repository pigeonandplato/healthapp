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
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Minimal Header - Apple Health Style */}
      <header className="bg-white dark:bg-black border-b border-[#E5E5EA] dark:border-[#38383A]">
        <div className="max-w-4xl mx-auto px-4 safe-top py-4">
          {/* Top Navigation */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-[#1C1C1E] dark:text-white">Today</h1>
            <Link
              href="/program"
              className="text-[#8E8E93] hover:text-[#1C1C1E] dark:hover:text-white transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </Link>
          </div>

          {/* Date & Phase Info */}
          <div className="mb-6">
            <p className="text-base text-[#8E8E93] font-medium mb-1">{todayDate}</p>
            {programMeta && (
              <p className="text-sm text-[#8E8E93]">
                Week {programMeta.week} · {programMeta.phase} · Day {programMeta.day}
              </p>
            )}
          </div>

          {/* Clean Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <StatsCard value={streak} label="Streak" icon="🔥" color="orange" />
            <StatsCard
              value={`${todayProgress}%`}
              label="Progress"
              icon="✓"
              color="green"
            />
            <StatsCard
              value={totalMinutes}
              label="Minutes"
              icon="⏱"
              color="pink"
            />
          </div>
        </div>
      </header>

      {/* Main Content - Minimal */}
      <main className="max-w-4xl mx-auto px-4 py-6 pb-32 safe-bottom">
        {/* Start Workout Button - Clean */}
        {viewMode === "checklist" && (
          <button
            onClick={handleShowCoachView}
            className="w-full bg-[#FF2D55] hover:bg-[#FF6482] text-white font-semibold py-4 px-6 rounded-xl shadow-card transition-all active:scale-[0.98] mb-6 text-base"
          >
            Start Today's Workout
          </button>
        )}

        {/* View Content */}
        <div className="animate-fade-in">
          {viewMode === "checklist" ? (
            <ChecklistView workout={workout} />
          ) : (
            <CoachView workout={workout} />
          )}
        </div>

        {/* Quick Links - Minimal */}
        <div className="mt-12 flex justify-center gap-4 pb-8">
          <Link
            href="/schedule"
            className="text-[#007AFF] hover:text-[#0051D5] text-sm font-medium transition"
          >
            View Schedule
          </Link>
          <span className="text-[#E5E5EA]">·</span>
          <Link
            href="/program"
            className="text-[#007AFF] hover:text-[#0051D5] text-sm font-medium transition"
          >
            View Program
          </Link>
        </div>
      </main>
    </div>
  );
}

