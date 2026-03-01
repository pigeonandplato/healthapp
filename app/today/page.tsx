"use client";

import { useState, useEffect } from "react";
import { WorkoutDay, ViewMode } from "@/lib/types";
import { getTodayWorkout, getTodayDateString, getCompletionsByDate, getDayRotation, getWorkoutByDate, getYouTubeVideo, clearWorkoutCache } from "@/lib/db";
import { calculateStreak, getMotivationalMessage } from "@/lib/streak";
import { getProgramMetaForDate, setProgramStartDate } from "@/lib/program";
import type { ProgramMeta } from "@/lib/types";
import ChecklistView from "@/components/ChecklistView";
import CoachView from "@/components/CoachView";
import ViewToggle from "@/components/ViewToggle";
import StatsCard from "@/components/StatsCard";
import CircularProgress from "@/components/CircularProgress";
import StickyProgressBar from "@/components/StickyProgressBar";
import { StatsSkeleton } from "@/components/SkeletonLoader";
import DatePicker from "@/components/DatePicker";
import YouTubeVideoEditor from "@/components/YouTubeVideoEditor";
import { saveYouTubeVideo } from "@/lib/db";

function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export default function TodayPage() {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return toLocalDateString(new Date());
  });
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
  const [isEditingVideo, setIsEditingVideo] = useState(false);

  // Load view preference from localStorage
  useEffect(() => {
    const savedView = localStorage.getItem("preferredView") as ViewMode;
    if (savedView === "coach" || savedView === "checklist") {
      setViewMode(savedView);
    }
  }, []);

  // Load workout for selected date
  useEffect(() => {
    async function loadWorkout() {
      setLoading(true);
      try {
        const selectedWorkout = await getWorkoutByDate(selectedDate);
        setWorkout(selectedWorkout || null);
        
        // Get selected date's day rotation
        const rotation = getDayRotation(selectedDate);
        setDayRotation(rotation);
        
        // Calculate stats
        if (selectedWorkout) {
          const trackableIds = selectedWorkout.blocks.flatMap((b) =>
            b.exercises
              .filter((ex) => ex.category !== "Guidance")
              .map((ex) => ex.id)
          );
          const trackableSet = new Set(trackableIds);
          const totalEx = trackableIds.length;
          setTotalExercises(totalEx);

          // Get selected date's completions (excluding Guidance items)
          const completions = await getCompletionsByDate(selectedWorkout.date);
          const completed = completions.filter((c) => c.completed && trackableSet.has(c.exerciseId)).length;
          const progress = totalEx > 0 ? Math.round((completed / totalEx) * 100) : 0;
          setTodayProgress(progress);
        }
        
        // Calculate streak (always based on today)
        const currentStreak = await calculateStreak();
        setStreak(currentStreak);
        
        // Get program meta for selected date
        const meta = await getProgramMetaForDate(selectedDate);
        setProgramMeta(meta);
        
        // Load tomorrow's workout for preview (always tomorrow from today)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowDate = toLocalDateString(tomorrow);
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
  }, [selectedDate]);

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
    const startDate = parseLocalDate(programMeta.startDate);
    startDate.setDate(startDate.getDate() - 1); // Push forward by moving start back
    const newStartDate = toLocalDateString(startDate);
    await setProgramStartDate(newStartDate);
    
    // Clear cache to force regeneration with new start date
    await clearWorkoutCache();
    
    // Reload workout with new program start date
    const updatedMeta = await getProgramMetaForDate(selectedDate);
    setProgramMeta(updatedMeta);
    const selectedWorkout = await getWorkoutByDate(selectedDate);
    setWorkout(selectedWorkout || null);
    
    // Recalculate progress
    if (selectedWorkout) {
      const trackableIds = selectedWorkout.blocks.flatMap((b) =>
        b.exercises
          .filter((ex) => ex.category !== "Guidance")
          .map((ex) => ex.id)
      );
      const trackableSet = new Set(trackableIds);
      const totalEx = trackableIds.length;
      setTotalExercises(totalEx);

      const completions = await getCompletionsByDate(selectedWorkout.date);
      const completed = completions.filter((c) => c.completed && trackableSet.has(c.exerciseId)).length;
      const progress = totalEx > 0 ? Math.round((completed / totalEx) * 100) : 0;
      setTodayProgress(progress);
    }
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

  const selectedDateObj = parseLocalDate(selectedDate);
  const todayDate = selectedDateObj.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  
  const isToday = selectedDate === toLocalDateString(new Date());

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
          {/* Date Picker & Info */}
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-base text-[#8E8E93] font-medium">{todayDate}</p>
                {!isToday && (
                  <span className="text-xs bg-[#FF9500] text-white px-2 py-0.5 rounded-full font-medium">
                    {selectedDateObj < new Date() ? "Past" : "Future"}
                  </span>
                )}
              </div>
              {programMeta && (
                <p className="text-sm text-[#8E8E93]">
                  Week {programMeta.week} · {programMeta.phase} · Day {programMeta.day}
                </p>
              )}
            </div>
            <DatePicker
              selectedDate={selectedDate}
              onDateChange={(date) => {
                setSelectedDate(date);
              }}
            />
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
        {(youtubeVideo || isEditingVideo) && (
          <div className="mb-6 bg-white dark:bg-[#1C1C1E] rounded-2xl p-4 shadow-sm border border-[#E5E5EA] dark:border-[#38383A]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[#1C1C1E] dark:text-white">
                💪 Stay Motivated
              </h3>
              {!isEditingVideo && youtubeVideo && (
                <button
                  onClick={() => setIsEditingVideo(true)}
                  className="text-xs text-[#FF2D55] hover:text-[#FF6482] font-medium px-3 py-1 rounded-lg hover:bg-[#FF2D55]/10 transition-all"
                >
                  Edit
                </button>
              )}
            </div>
            
            {isEditingVideo ? (
              <YouTubeVideoEditor
                initialUrl={youtubeVideo || ""}
                onSave={async (url) => {
                  await saveYouTubeVideo(url);
                  setYoutubeVideo(url);
                  setIsEditingVideo(false);
                }}
              />
            ) : youtubeVideo ? (
              <>
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
                  Video not working? <button onClick={() => setIsEditingVideo(true)} className="text-[#FF2D55] underline">Edit it here</button> or go to <a href="/settings" className="text-[#FF2D55] underline">Settings</a>
                </p>
              </>
            ) : null}
          </div>
        )}
        
        {/* Add Video Button - if no video exists */}
        {!youtubeVideo && !isEditingVideo && (
          <div className="mb-6 bg-white dark:bg-[#1C1C1E] rounded-2xl p-4 shadow-sm border border-[#E5E5EA] dark:border-[#38383A]">
            <div className="text-center py-4">
              <p className="text-sm text-[#8E8E93] mb-3">Add a motivation video to stay focused</p>
              <button
                onClick={() => setIsEditingVideo(true)}
                className="bg-[#FF2D55] hover:bg-[#FF6482] text-white font-semibold py-2 px-6 rounded-xl transition-all"
              >
                + Add Video
              </button>
            </div>
          </div>
        )}
        
        {/* Start Workout Button - Always show */}
        <button
          onClick={handleShowCoachView}
          className="w-full bg-[#FF2D55] hover:bg-[#FF6482] text-white font-semibold py-4 px-6 rounded-xl shadow-card transition-all active:scale-[0.98] mb-6 text-base"
        >
          {isToday ? "Start Today's Workout" : `Start ${todayDate} Workout`}
        </button>

        {/* View Content */}
        <div className="animate-fade-in">
          {viewMode === "checklist" ? (
            <ChecklistView workout={workout} />
          ) : (
            <CoachView workout={workout} />
          )}
        </div>

        {/* Program Rules Section - At bottom of main content */}
        <section className="mt-12 mb-8">
        <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-6 shadow-sm border border-[#E5E5EA] dark:border-[#38383A]">
          <h2 className="text-xl font-bold text-[#1C1C1E] dark:text-white mb-4">
            📋 Program Rules
          </h2>
          
          <div className="space-y-4 text-sm text-[#1C1C1E] dark:text-white">
            <div>
              <h3 className="font-semibold mb-2 text-[#FF2D55]">🟢 Green Light (Progress Normally)</h3>
              <ul className="list-disc list-inside space-y-1 text-[#8E8E93] dark:text-[#8E8E93] ml-2">
                <li>Pain ≤ 2/10 during exercise</li>
                <li>Back to baseline by next morning</li>
                <li>No symptom increase</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 text-[#FF9500]">🟡 Yellow (Hold Current Level)</h3>
              <ul className="list-disc list-inside space-y-1 text-[#8E8E93] dark:text-[#8E8E93] ml-2">
                <li>Pain 3–4/10 or stiffness into next day</li>
                <li>Keep same intensity 1 more week</li>
                <li>Don't progress yet</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 text-[#FF3B30]">🔴 Red (Reduce Volume/Intensity)</h3>
              <ul className="list-disc list-inside space-y-1 text-[#8E8E93] dark:text-[#8E8E93] ml-2">
                <li>Pain ≥ 5/10</li>
                <li>Sharp/radiating pain</li>
                <li>Increased tingling/numbness</li>
                <li>Pain lasting &gt;24–48h</li>
                <li>→ Drop volume/intensity 30–50%, reassess</li>
              </ul>
            </div>
            
            <div className="pt-2 border-t border-[#E5E5EA] dark:border-[#38383A]">
              <h3 className="font-semibold mb-2">💡 Progression Rule</h3>
              <p className="text-[#8E8E93] dark:text-[#8E8E93]">
                If 2 good sessions in a row: progress ONE thing (reps OR height OR range). 
                Increase total weekly running time by ≤10%.
              </p>
            </div>
          </div>
        </div>
        </section>
      </main>
    </div>
  );
}

