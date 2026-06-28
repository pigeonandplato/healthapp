"use client";

import { useState, useEffect } from "react";
import { getAllCompletions, getSeenAchievements, setSeenAchievements } from "@/lib/db";
import { calculateProgressStats, ProgressStats } from "@/lib/progress";
import { getAllExercises } from "@/lib/db";
import {
  computeCommitmentStats,
  computeAchievements,
  pickNewlyEarned,
  earnedIds,
  CommitmentStats,
  Achievement,
} from "@/lib/gamification";
import LevelBar from "@/components/LevelBar";
import WeeklyRecap from "@/components/WeeklyRecap";
import ConsistencyCalendar from "@/components/ConsistencyCalendar";
import AchievementsGrid from "@/components/AchievementsGrid";

export default function ProgressPage() {
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [commitment, setCommitment] = useState<CommitmentStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [newWins, setNewWins] = useState<Achievement[]>([]);
  const [showCharts, setShowCharts] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  useEffect(() => {
    loadProgress();
  }, []);

  async function loadProgress() {
    setLoading(true);
    try {
      const completions = await getAllCompletions();
      const exercises = await getAllExercises();

      const nameMap = new Map<string, string>();
      exercises.forEach((ex) => nameMap.set(ex.id, ex.name));

      const progressStats = await calculateProgressStats(completions);
      progressStats.exerciseStats.forEach((stat) => {
        stat.exerciseName = nameMap.get(stat.exerciseId) || stat.exerciseId;
      });
      setStats(progressStats);

      const commitmentStats = computeCommitmentStats(completions);
      setCommitment(commitmentStats);
      const allAchievements = computeAchievements(commitmentStats);
      setAchievements(allAchievements);

      const seen = await getSeenAchievements();
      if (seen === null) {
        await setSeenAchievements(earnedIds(allAchievements));
      } else {
        const fresh = pickNewlyEarned(allAchievements, seen);
        if (fresh.length > 0) {
          await setSeenAchievements([...seen, ...fresh.map((a) => a.id)]);
          setNewWins(fresh);
        }
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
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4A8FA8] mx-auto mb-3" />
          <p className="text-[#8E8E93] text-sm">Loading progress...</p>
        </div>
      </div>
    );
  }

  if (!stats || !commitment) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-xs">
          <p className="text-4xl mb-3">💪</p>
          <p className="text-[#1C1C1E] dark:text-white font-semibold mb-1">No progress yet</p>
          <p className="text-sm text-[#8E8E93]">Complete your first workout on Today to see stats here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFAF6] dark:bg-black pb-24">
      <div className="max-w-2xl mx-auto px-4 pt-5 pb-4">
        {/* Page heading */}
        <h1 className="text-3xl font-bold text-[#1C1C1E] dark:text-white">Progress</h1>
        <p className="text-sm text-[#8E8E93] mt-0.5">
          {stats.totalWorkouts} workout{stats.totalWorkouts !== 1 ? "s" : ""} logged
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-4 space-y-3">
        {newWins.length > 0 && (
          <div className="bg-[#3F6B40]/10 border border-[#3F6B40]/20 rounded-2xl p-4 flex items-start gap-3">
            <span className="text-2xl">{newWins[0].emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#1C1C1E] dark:text-white">
                {newWins.length === 1 ? "New win!" : `${newWins.length} new wins!`}
              </p>
              <p className="text-xs text-[#8E8E93] mt-0.5">
                {newWins.map((w) => w.title).join(" · ")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setNewWins([])}
              className="text-[#8E8E93] text-sm px-2"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        )}

        {/* 4-stat row */}
        <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl border border-[#EDE8DC] dark:border-[#38383A]">
          <div className="grid grid-cols-4 divide-x divide-[#EDE8DC] dark:divide-[#38383A]">
            <StatCell label="STREAK" value={commitment.currentStreak} />
            <StatCell label="WORKOUTS" value={stats.totalWorkouts} />
            <StatCell label="30-DAY" value={`${commitment.rollingConsistency}%`} />
            <StatCell label="BEST" value={`${stats.longestStreak}d`} />
          </div>
        </div>

        {/* Standalone XP / Level bar */}
        <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl border border-[#EDE8DC] dark:border-[#38383A] px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-[#1C1C1E] dark:text-white">
              Level {commitment.level.level} · <span className="text-[#8E8E93] font-normal">{commitment.level.title}</span>
            </span>
            <span className="text-xs text-[#8E8E93]">{commitment.level.xpToNextLevel} XP to {commitment.level.level + 1}</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-[#EDE8DC] dark:bg-[#38383A] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#4A8FA8] transition-all duration-700"
              style={{ width: `${commitment.level.progressPct}%` }}
            />
          </div>
        </div>

        {/* Weekly bar chart — prominent */}
        <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl border border-[#EDE8DC] dark:border-[#38383A] px-4 pt-4 pb-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-[#1C1C1E] dark:text-white">Minutes per week</p>
            <p className="text-xs text-[#8E8E93]">last 8 weeks</p>
          </div>
          <WeeklyBarChart data={stats.weeklyStats} />
        </div>

        <WeeklyRecap completedDates={commitment.completedDates} streak={commitment.currentStreak} />

        <Collapsible
          title="Consistency"
          subtitle={`${commitment.activeDays} active days`}
          open
        >
          <ConsistencyCalendar completedDates={commitment.completedDates} />
        </Collapsible>

        <Collapsible
          title="Achievements"
          subtitle={`${achievements.filter((a) => a.earned).length} of ${achievements.length} earned`}
          open={showAchievements}
          onToggle={() => setShowAchievements(!showAchievements)}
        >
          <AchievementsGrid achievements={achievements} />
        </Collapsible>

        <Collapsible
          title="Detailed charts"
          subtitle="Weekly, monthly & exercise breakdown"
          open={showCharts}
          onToggle={() => setShowCharts(!showCharts)}
        >
          <div className="space-y-6 pt-2">
            <div>
              <p className="text-xs font-semibold text-[#8E8E93] uppercase mb-3">Last 12 weeks</p>
              <WeeklyChart data={stats.weeklyStats} />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#8E8E93] uppercase mb-3">Monthly</p>
              <MonthlyChart data={stats.monthlyStats} />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#8E8E93] uppercase mb-3">Top exercises</p>
              <ExerciseList exercises={stats.exerciseStats} />
            </div>
          </div>
        </Collapsible>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-lg font-bold text-[#1C1C1E] dark:text-white">{value}</p>
      <p className="text-[10px] text-[#8E8E93]">{label}</p>
    </div>
  );
}

function StatCell({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="py-4 text-center">
      <p className="text-2xl font-bold text-[#1C1C1E] dark:text-white leading-none mb-1">{value}</p>
      <p className="text-[10px] font-medium text-[#8E8E93] uppercase tracking-wider">{label}</p>
    </div>
  );
}

function WeeklyBarChart({ data }: { data: ProgressStats["weeklyStats"] }) {
  if (data.length === 0) return <p className="text-[#8E8E93] text-sm text-center py-4">No data yet</p>;
  const recent = data.slice().reverse().slice(0, 8);
  const max = Math.max(...recent.map((d) => d.workoutsCompleted * 30), 1);
  const lastIdx = recent.length - 1;
  return (
    <div className="flex items-end gap-1.5 h-28">
      {recent.map((week, i) => {
        const isCurrent = i === lastIdx;
        const val = week.workoutsCompleted * 30;
        const pct = Math.max(val / max, val > 0 ? 0.06 : 0);
        const label = i === lastIdx ? "Now" : `W${i + 1}`;
        return (
          <div key={week.week} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex items-end" style={{ height: "88px" }}>
              <div
                className={`w-full rounded-t-lg transition-all ${
                  isCurrent ? "bg-[#3F6B40]" : "bg-[#EDE8DC] dark:bg-[#2C2C2E]"
                }`}
                style={{ height: `${pct * 100}%`, minHeight: val > 0 ? "8px" : "0" }}
              />
            </div>
            <span className={`text-[9px] font-medium ${isCurrent ? "text-[#3F6B40]" : "text-[#8E8E93]"}`}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function Collapsible({
  title,
  subtitle,
  open,
  onToggle,
  children,
}: {
  title: string;
  subtitle: string;
  open?: boolean;
  onToggle?: () => void;
  children: React.ReactNode;
}) {
  const [internalOpen, setInternalOpen] = useState(open ?? false);
  const isOpen = onToggle ? open : internalOpen;
  const toggle = onToggle ?? (() => setInternalOpen(!internalOpen));

  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl border border-[#EDE8DC] dark:border-[#38383A] overflow-hidden">
      <button
        type="button"
        onClick={toggle}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div>
          <p className="font-semibold text-[#1C1C1E] dark:text-white">{title}</p>
          <p className="text-xs text-[#8E8E93]">{subtitle}</p>
        </div>
        <span className="text-[#8E8E93] text-sm">{isOpen ? "Hide" : "Show"}</span>
      </button>
      {isOpen && <div className="px-4 pb-4 border-t border-[#EDE8DC] dark:border-[#38383A]">{children}</div>}
    </div>
  );
}

function WeeklyChart({ data }: { data: ProgressStats["weeklyStats"] }) {
  if (data.length === 0) return <p className="text-[#8E8E93] text-sm">No data yet</p>;
  const max = Math.max(...data.map((d) => d.workoutsCompleted), 1);
  return (
    <div className="space-y-2">
      {data
        .slice()
        .reverse()
        .slice(0, 8)
        .map((week) => (
          <div key={week.week} className="flex items-center gap-2">
            <span className="text-[10px] text-[#8E8E93] w-14 flex-shrink-0 truncate">{week.dateRange}</span>
            <div className="flex-1 h-2 bg-[#E5E5EA] dark:bg-[#38383A] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#3F6B40] rounded-full"
                style={{ width: `${(week.workoutsCompleted / max) * 100}%` }}
              />
            </div>
            <span className="text-xs text-[#8E8E93] w-4 text-right">{week.workoutsCompleted}</span>
          </div>
        ))}
    </div>
  );
}

function MonthlyChart({ data }: { data: ProgressStats["monthlyStats"] }) {
  if (data.length === 0) return <p className="text-[#8E8E93] text-sm">No data yet</p>;
  const max = Math.max(...data.map((d) => d.workoutsCompleted), 1);
  return (
    <div className="space-y-2">
      {data
        .slice()
        .reverse()
        .slice(0, 6)
        .map((month) => (
          <div key={month.month} className="flex items-center gap-2">
            <span className="text-xs text-[#8E8E93] w-16 flex-shrink-0">
              {month.monthName.split(" ")[0]}
            </span>
            <div className="flex-1 h-2.5 bg-[#E5E5EA] dark:bg-[#38383A] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#9DBFD0] to-[#4A8FA8] rounded-full"
                style={{ width: `${(month.workoutsCompleted / max) * 100}%` }}
              />
            </div>
            <span className="text-xs font-medium text-[#1C1C1E] dark:text-white w-6 text-right">
              {month.workoutsCompleted}
            </span>
          </div>
        ))}
    </div>
  );
}

function ExerciseList({ exercises }: { exercises: ProgressStats["exerciseStats"] }) {
  if (exercises.length === 0) return <p className="text-[#8E8E93] text-sm">No data yet</p>;
  const top = exercises.slice(0, 8);
  const max = Math.max(...top.map((e) => e.timesCompleted), 1);
  return (
    <div className="space-y-2">
      {top.map((exercise, i) => (
        <div key={exercise.exerciseId} className="flex items-center gap-2">
          <span className="text-[10px] text-[#8E8E93] w-4">{i + 1}</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[#1C1C1E] dark:text-white truncate">
              {exercise.exerciseName}
            </p>
            <div className="mt-1 h-1.5 bg-[#E5E5EA] dark:bg-[#38383A] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#3F6B40] rounded-full"
                style={{ width: `${(exercise.timesCompleted / max) * 100}%` }}
              />
            </div>
          </div>
          <span className="text-xs text-[#8E8E93]">{exercise.timesCompleted}</span>
        </div>
      ))}
    </div>
  );
}
