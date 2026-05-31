"use client";

import { useState, useEffect } from "react";
import { WorkoutDay, ViewMode, ProgramType } from "@/lib/types";
import { getTodayDateString, getCompletionsByDate, getDayRotation, getYouTubeVideo, getActiveProgram, getGymWorkoutByDate, getGymDayForDate, getAdhdWorkoutByDate, saveYouTubeVideo } from "@/lib/db";
import { calculateStreak } from "@/lib/streak";
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
  const [programMeta, setProgramMeta] = useState<ProgramMeta | null>(null);
  const [youtubeVideo, setYoutubeVideo] = useState<string | null>(null);
  const [isEditingVideo, setIsEditingVideo] = useState(false);
  const [activeProgram, setActiveProgramState] = useState<ProgramType>("adhd");
  const [isRestDay, setIsRestDay] = useState(false);

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
        // Get active program first
        const currentProgram = await getActiveProgram();
        setActiveProgramState(currentProgram);
        
        // Load workout based on active program
        let selectedWorkout: WorkoutDay | null | undefined;
        if (currentProgram === "gym") {
          const gymInfo = getGymDayForDate(selectedDate);
          setIsRestDay(!gymInfo.isGymDay);
          selectedWorkout = await getGymWorkoutByDate(selectedDate);
        } else {
          setIsRestDay(false);
          selectedWorkout = await getAdhdWorkoutByDate(selectedDate);
        }
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
        } else {
          setTotalExercises(0);
          setTodayProgress(0);
        }
        
        // Calculate streak (always based on today)
        const currentStreak = await calculateStreak();
        setStreak(currentStreak);
        
        // Get program meta for selected date
        if (selectedWorkout?.program) {
          setProgramMeta(selectedWorkout.program);
        } else {
          setProgramMeta(null);
        }
        
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
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  // Helper to find the next Mon/Wed/Fri training day from a given date
  const getNextScheduledDay = (
    fromDate: Date
  ): { date: Date; day: string; workout: string } => {
    const d = new Date(fromDate);
    const gym = (letter: string, label: string) => {
      if (letter === "A") return `💪 Day A: ${label}`;
      if (letter === "B") return `🔙 Day B: ${label}`;
      return `🦵 Day C: ${label}`;
    };
    for (let i = 1; i <= 7; i++) {
      d.setDate(d.getDate() + 1);
      const dow = d.getDay();
      if (dow === 1) {
        return { date: new Date(d), day: "Monday", workout: gym("A", "Chest") };
      }
      if (dow === 3) {
        return { date: new Date(d), day: "Wednesday", workout: gym("B", "Back + Biceps") };
      }
      if (dow === 5) {
        return { date: new Date(d), day: "Friday", workout: gym("C", "Shoulders + Legs") };
      }
    }
    return { date: d, day: "Monday", workout: gym("A", "Chest") };
  };

  // Helper to jump to a specific weekday
  const jumpToWeekday = (targetDay: number) => { // 1=Mon, 3=Wed, 5=Fri
    const today = new Date();
    const currentDay = today.getDay();
    let daysToAdd = targetDay - currentDay;
    if (daysToAdd <= 0) daysToAdd += 7; // Next week if already passed
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysToAdd);
    const dateStr = toLocalDateString(targetDate);
    console.log('[JumpToWeekday]', { targetDay, currentDay, daysToAdd, dateStr, targetDateDay: targetDate.getDay() });
    setSelectedDate(dateStr);
  };

  if (!workout) {
    // Check if it's a gym rest day
    if (activeProgram === "gym" && isRestDay) {
      const selectedDateObj = parseLocalDate(selectedDate);
      const dayName = selectedDateObj.toLocaleDateString("en-US", { weekday: "long" });
      const nextGym = getNextScheduledDay(selectedDateObj);
      const nextGymDateStr = toLocalDateString(nextGym.date);
      
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
          <div className="max-w-md mx-auto pt-8">
            {/* Rest Day Header */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg mb-4">
              <div className="text-5xl mb-3">😴</div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                Rest Day - {dayName}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Recovery is part of the program
              </p>
            </div>

            {/* Next Workout Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg mb-4">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">NEXT WORKOUT</h3>
              <button
                onClick={() => setSelectedDate(nextGymDateStr)}
                className="w-full bg-gradient-to-r from-[#FF2D55] to-[#FF6482] rounded-xl p-4 text-left text-white hover:opacity-90 transition-opacity"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-lg">{nextGym.day}</div>
                    <div className="text-white/80 text-sm">{nextGym.workout}</div>
                  </div>
                  <div className="text-2xl">→</div>
                </div>
              </button>
            </div>

            {/* Quick Jump Buttons */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg mb-4">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">JUMP TO WORKOUT</h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => jumpToWeekday(1)}
                  className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-3 text-center hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <div className="text-xl mb-1">💪</div>
                  <div className="text-xs font-bold text-red-700 dark:text-red-300">Monday</div>
                  <div className="text-[10px] text-red-600 dark:text-red-400">Chest</div>
                </button>
                <button
                  onClick={() => jumpToWeekday(3)}
                  className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-3 text-center hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <div className="text-xl mb-1">🔙</div>
                  <div className="text-xs font-bold text-blue-700 dark:text-blue-300">Wednesday</div>
                  <div className="text-[10px] text-blue-600 dark:text-blue-400">Back+Biceps</div>
                </button>
                <button
                  onClick={() => jumpToWeekday(5)}
                  className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-3 text-center hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                >
                  <div className="text-xl mb-1">🦵</div>
                  <div className="text-xs font-bold text-green-700 dark:text-green-300">Friday</div>
                  <div className="text-[10px] text-green-600 dark:text-green-400">Shoulders+Legs</div>
                </button>
              </div>
            </div>

            {/* Recovery Tips */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">💡 Recovery Tips</h3>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Stay hydrated</li>
                <li>• Get 7-9 hours of sleep</li>
                <li>• Light stretching or walking</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }
    
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
          {/* Active Program Badge */}
          <div className="mb-3">
            <a href="/program" className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FF2D55]/10 dark:bg-[#FF2D55]/20 rounded-full text-sm font-medium text-[#FF2D55] hover:bg-[#FF2D55]/20 transition-colors">
              {activeProgram === "gym" ? "🏋️ Gym PPL" : "🧠 ADHD Knee + Back"}
              <span className="text-xs opacity-70">Change →</span>
            </a>
          </div>
          
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
                  {activeProgram === "adhd" && `Week ${programMeta.week} · ${programMeta.phase} · `}
                  Day {programMeta.day}
                  {activeProgram === "gym" && (
                    <span className="ml-2">
                      {programMeta.day === "A" ? "💪 Chest" : programMeta.day === "B" ? "🔙 Back + Biceps" : "🦵 Shoulders + Legs"}
                    </span>
                  )}
                  {activeProgram === "adhd" && (
                    <span className="ml-2">
                      🧠 {getGymDayForDate(selectedDate).isGymDay ? "3 breaks (incl. knee)" : "Break 1 + 3 (knee block rest day)"}
                    </span>
                  )}
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
              📋{" "}
              {activeProgram === "gym"
                ? "Gym Training Tips"
                : "ADHD-friendly plan tips"}
            </h2>
            
            {activeProgram === "gym" ? (
              <div className="space-y-4 text-sm text-[#1C1C1E] dark:text-white">
                <div>
                  <h3 className="font-semibold mb-2 text-[#007AFF]">💪 Rotation Schedule</h3>
                  <ul className="list-disc list-inside space-y-1 text-[#8E8E93] dark:text-[#8E8E93] ml-2">
                    <li><strong>Day A:</strong> Chest (Flat, Decline, Incline Press & Fly)</li>
                    <li><strong>Day B:</strong> Back (Pulldowns, Rows) + Biceps (Curls)</li>
                    <li><strong>Day C:</strong> Shoulders (Press, Shrugs, Fly) + Legs</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2 text-[#34C759]">✅ Best Practices</h3>
                  <ul className="list-disc list-inside space-y-1 text-[#8E8E93] dark:text-[#8E8E93] ml-2">
                    <li>Warm up 5-10 min before lifting</li>
                    <li>Control the weight - no swinging</li>
                    <li>Full range of motion on each rep</li>
                    <li>Rest 60-90 seconds between sets</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2 text-[#FF9500]">📈 Progression</h3>
                  <ul className="list-disc list-inside space-y-1 text-[#8E8E93] dark:text-[#8E8E93] ml-2">
                    <li>Increase weight when 3×10 feels easy</li>
                    <li>Add 5 lbs for upper body, 10 lbs for legs</li>
                    <li>Track your lifts to see progress</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-sm text-[#1C1C1E] dark:text-white">
                <div>
                  <h3 className="font-semibold mb-2 text-[#007AFF]">📅 Daily breaks</h3>
                  <ul className="list-disc list-inside space-y-1 text-[#8E8E93] ml-2">
                    <li><strong>Break 1</strong> (morning): Back Armor — daily</li>
                    <li><strong>Break 2</strong> (midday): Knee Strength — Mon / Wed / Fri</li>
                    <li><strong>Break 3</strong> (afternoon): Walk + control — daily</li>
                    <li>Busy day? Do Break 1 only — still a win.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-[#34C759]">🧠 ADHD system</h3>
                  <ul className="list-disc list-inside space-y-1 text-[#8E8E93] ml-2">
                    <li>Same times daily (after coffee / lunch / before shutdown).</li>
                    <li>Open the exercise video before the break starts.</li>
                    <li>Use the minimum-day checklist at the bottom when overwhelmed.</li>
                    <li>Never miss twice — after a miss, only the minimum version is required.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

