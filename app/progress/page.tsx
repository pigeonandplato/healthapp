"use client";

import { useState, useEffect } from "react";
import { getAllCompletions } from "@/lib/db";
import { calculateProgressStats, detectMilestones, ProgressStats, Milestone } from "@/lib/progress";
import { getAllExercises } from "@/lib/db";
import MilestoneCelebration from "@/components/MilestoneCelebration";

export default function ProgressPage() {
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [exerciseNames, setExerciseNames] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    loadProgress();
  }, []);

  async function loadProgress() {
    setLoading(true);
    try {
      const completions = await getAllCompletions();
      const exercises = await getAllExercises();
      
      // Create exercise name map
      const nameMap = new Map<string, string>();
      exercises.forEach(ex => nameMap.set(ex.id, ex.name));
      setExerciseNames(nameMap);
      
      // Update exercise stats with names
      const progressStats = await calculateProgressStats(completions);
      progressStats.exerciseStats.forEach(stat => {
        stat.exerciseName = nameMap.get(stat.exerciseId) || stat.exerciseId;
      });
      
      setStats(progressStats);
      
      // Detect new milestones
      const newMilestones = detectMilestones(progressStats);
      if (newMilestones.length > 0) {
        setMilestones(newMilestones);
      }
    } catch (error) {
      console.error("Error loading progress:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF2D55] mx-auto mb-4"></div>
          <p className="text-[#8E8E93]">Loading progress...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-[#8E8E93] mb-4">No progress data yet</p>
          <p className="text-sm text-[#8E8E93]">Complete your first workout to see progress!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black p-4 pb-24">
      {milestones.length > 0 && (
        <MilestoneCelebration milestones={milestones} onClose={() => setMilestones([])} />
      )}
      
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            label="Total Workouts"
            value={stats.totalWorkouts}
            emoji="💪"
            color="from-[#FF2D55] to-[#FF6482]"
          />
          <StatCard
            label="Current Streak"
            value={`${stats.currentStreak} days`}
            emoji="🔥"
            color="from-[#FF9500] to-[#FFB340]"
          />
          <StatCard
            label="Longest Streak"
            value={`${stats.longestStreak} days`}
            emoji="👑"
            color="from-[#5856D6] to-[#7B7AE8]"
          />
          <StatCard
            label="Completion Rate"
            value={`${Math.round(stats.completionRate)}%`}
            emoji="📊"
            color="from-[#34C759] to-[#5AE878]"
          />
        </div>

        {/* Weekly Chart */}
        <ChartCard title="Weekly Progress (Last 12 Weeks)">
          <WeeklyChart data={stats.weeklyStats} />
        </ChartCard>

        {/* Monthly Chart */}
        <ChartCard title="Monthly Progress">
          <MonthlyChart data={stats.monthlyStats} />
        </ChartCard>

        {/* Top Exercises */}
        <ChartCard title="Most Completed Exercises">
          <ExerciseList exercises={stats.exerciseStats} />
        </ChartCard>
      </div>
    </div>
  );
}

function StatCard({ label, value, emoji, color }: { label: string; value: string | number; emoji: string; color: string }) {
  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-4 shadow-sm border border-[#E5E5EA] dark:border-[#38383A]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{emoji}</span>
        <span className="text-2xl font-bold text-[#1C1C1E] dark:text-white">{value}</span>
      </div>
      <p className="text-sm text-[#8E8E93]">{label}</p>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-6 shadow-sm border border-[#E5E5EA] dark:border-[#38383A]">
      <h3 className="text-lg font-semibold text-[#1C1C1E] dark:text-white mb-4">{title}</h3>
      {children}
    </div>
  );
}

function WeeklyChart({ data }: { data: ProgressStats['weeklyStats'] }) {
  if (data.length === 0) {
    return <p className="text-[#8E8E93] text-sm">No weekly data yet</p>;
  }

  const maxWorkouts = Math.max(...data.map(d => d.workoutsCompleted), 1);
  const chartHeight = 120;

  return (
    <div className="space-y-2">
      {data.slice().reverse().map((week, index) => {
        const height = (week.workoutsCompleted / maxWorkouts) * chartHeight;
        return (
          <div key={week.week} className="flex items-end gap-2">
            <div className="text-xs text-[#8E8E93] w-16 flex-shrink-0">
              {week.dateRange}
            </div>
            <div className="flex-1 flex items-end gap-1">
              <div
                className="bg-[#FF2D55] rounded-t flex-1 min-h-[4px] transition-all"
                style={{ height: `${Math.max(height, 4)}px` }}
                title={`${week.workoutsCompleted} workouts`}
              />
            </div>
            <div className="text-xs text-[#8E8E93] w-12 text-right">
              {week.workoutsCompleted}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MonthlyChart({ data }: { data: ProgressStats['monthlyStats'] }) {
  if (data.length === 0) {
    return <p className="text-[#8E8E93] text-sm">No monthly data yet</p>;
  }

  const maxWorkouts = Math.max(...data.map(d => d.workoutsCompleted), 1);
  const chartHeight = 120;

  return (
    <div className="space-y-3">
      {data.slice().reverse().map((month) => {
        const height = (month.workoutsCompleted / maxWorkouts) * chartHeight;
        return (
          <div key={month.month} className="flex items-end gap-3">
            <div className="text-sm text-[#8E8E93] w-24 flex-shrink-0">
              {month.monthName.split(' ')[0]}
            </div>
            <div className="flex-1 relative">
              <div
                className="bg-gradient-to-t from-[#FF2D55] to-[#FF6482] rounded-t min-h-[8px] transition-all"
                style={{ height: `${Math.max(height, 8)}px` }}
                title={`${month.workoutsCompleted} workouts (${Math.round(month.completionRate)}%)`}
              />
            </div>
            <div className="text-sm font-medium text-[#1C1C1E] dark:text-white w-16 text-right">
              {month.workoutsCompleted}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ExerciseList({ exercises }: { exercises: ProgressStats['exerciseStats'] }) {
  if (exercises.length === 0) {
    return <p className="text-[#8E8E93] text-sm">No exercise data yet</p>;
  }

  const maxCount = Math.max(...exercises.map(e => e.timesCompleted), 1);

  return (
    <div className="space-y-3">
      {exercises.map((exercise, index) => {
        const width = (exercise.timesCompleted / maxCount) * 100;
        return (
          <div key={exercise.exerciseId} className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-[#FF2D55] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1C1C1E] dark:text-white truncate">
                {exercise.exerciseName}
              </p>
              <div className="mt-1 h-2 bg-[#E5E5EA] dark:bg-[#38383A] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FF2D55] rounded-full transition-all"
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
            <div className="text-sm font-semibold text-[#1C1C1E] dark:text-white">
              {exercise.timesCompleted}
            </div>
          </div>
        );
      })}
    </div>
  );
}

