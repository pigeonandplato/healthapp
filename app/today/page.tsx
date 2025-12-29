"use client";

import { useState, useEffect } from "react";
import { WorkoutDay, ViewMode } from "@/lib/types";
import { getTodayWorkout, getTodayDateString, getCompletionsByDate, getDayRotation, getWorkoutByDate, getYouTubeVideo } from "@/lib/db";
import { calculateStreak, getMotivationalMessage } from "@/lib/streak";
import { getProgramMetaForDate, setProgramStartDate } from "@/lib/program";
import type { ProgramMeta } from "@/lib/types";
import ChecklistView from "@/components/ChecklistView";
import CoachView from "@/components/CoachView";
import ViewToggle from "@/components/ViewToggle";
import StatsCard from "@/components/StatsCard";
import CircularProgress from "@/components/CircularProgress";
import StickyProgressBar from "@/components/StickyProgressBar";
import SpotifyEmbedPlayer from "@/components/SpotifyEmbedPlayer";
import { StatsSkeleton } from "@/components/SkeletonLoader";

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
  const [youtubeVideo, setYoutubeVideo] = useState<string | null>(null);

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
          const trackableIds = todayWorkout.blocks.flatMap((b) =>
            b.exercises
              .filter((ex) => ex.category !== "Guidance")
              .map((ex) => ex.id)
          );
          const trackableSet = new Set(trackableIds);
          const totalEx = trackableIds.length;
          setTotalExercises(totalEx);

          // Get today's completions (excluding Guidance items)
          const completions = await getCompletionsByDate(todayWorkout.date);
          const completed = completions.filter((c) => c.completed && trackableSet.has(c.exerciseId)).length;
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
        
        // Load YouTube video
        const videoUrl = await getYouTubeVideo();
        setYoutubeVideo(videoUrl);
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
      <div className="min-h-screen bg-white dark:bg-black">
        <section className="bg-white dark:bg-black border-b border-[#E5E5EA] dark:border-[#38383A]">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <StatsSkeleton />
          </div>
        </section>
        <main className="max-w-4xl mx-auto px-4 py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
          </div>
        </main>
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
    <div className="bg-white dark:bg-black">
      {/* Sticky Progress Bar */}
      <StickyProgressBar progress={todayProgress} />
      
      {/* Stats Section */}
      <section className="bg-white dark:bg-black border-b border-[#E5E5EA] dark:border-[#38383A]">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Date & Phase Info */}
          <div className="mb-4">
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
      </section>

      {/* Main Content - Minimal */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* YouTube Motivation Video */}
        {youtubeVideo && (
          <div className="mb-6 bg-white dark:bg-[#1C1C1E] rounded-2xl p-4 shadow-sm border border-[#E5E5EA] dark:border-[#38383A]">
            <h3 className="text-sm font-semibold text-[#1C1C1E] dark:text-white mb-3">
              💪 Stay Motivated
            </h3>
            <div className="aspect-video rounded-xl overflow-hidden bg-[#E5E5EA] dark:bg-[#38383A]">
              <iframe
                src={youtubeVideo}
                title="Motivation Video"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="text-xs text-[#8E8E93] mt-2 text-center">
              Edit video in <a href="/settings" className="text-[#FF2D55] underline">Settings</a>
            </p>
          </div>
        )}
        
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

      </main>
      
      {/* Spotify Music Player */}
      <SpotifyEmbedPlayer />
    </div>
  );
}

