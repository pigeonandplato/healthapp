// Progress tracking and analytics utilities
import { ExerciseCompletion } from "./types";
import { calculateStreak } from "./streak";

export interface ProgressStats {
  totalWorkouts: number;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  weeklyStats: WeeklyStat[];
  monthlyStats: MonthlyStat[];
  exerciseStats: ExerciseStat[];
}

export interface WeeklyStat {
  week: string; // "2024-W01"
  dateRange: string; // "Jan 1-7"
  workoutsCompleted: number;
  completionRate: number;
}

export interface MonthlyStat {
  month: string; // "2024-01"
  monthName: string; // "January 2024"
  workoutsCompleted: number;
  completionRate: number;
}

export interface ExerciseStat {
  exerciseId: string;
  exerciseName: string;
  timesCompleted: number;
  lastCompleted?: string;
}

export async function calculateProgressStats(
  completions: ExerciseCompletion[]
): Promise<ProgressStats> {
  const streak = await calculateStreak();
  const weeklyStats = calculateWeeklyStats(completions);
  const monthlyStats = calculateMonthlyStats(completions);
  const exerciseStats = calculateExerciseStats(completions);
  
  // Get unique workout days (by date)
  const uniqueDates = new Set(completions.map(c => c.date));
  const totalWorkouts = uniqueDates.size;
  
  // Calculate longest streak
  const longestStreak = calculateLongestStreak(completions);
  
  // Calculate overall completion rate (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentCompletions = completions.filter(c => 
    new Date(c.date) >= thirtyDaysAgo
  );
  const recentDates = new Set(recentCompletions.map(c => c.date));
  const completionRate = (recentDates.size / 30) * 100;
  
  return {
    totalWorkouts,
    currentStreak: streak,
    longestStreak,
    completionRate: Math.min(100, Math.max(0, completionRate)),
    weeklyStats,
    monthlyStats,
    exerciseStats: exerciseStats.slice(0, 10), // Top 10
  };
}

function calculateWeeklyStats(completions: ExerciseCompletion[]): WeeklyStat[] {
  const stats: Map<string, { dates: Set<string>; dateRange: string }> = new Map();
  
  completions.forEach(completion => {
    const date = new Date(completion.date);
    const year = date.getFullYear();
    const week = getWeekNumber(date);
    const weekKey = `${year}-W${week.toString().padStart(2, '0')}`;
    
    if (!stats.has(weekKey)) {
      const weekStart = getWeekStart(date);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      const dateRange = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}-${weekEnd.toLocaleDateString('en-US', { day: 'numeric' })}`;
      stats.set(weekKey, { dates: new Set(), dateRange });
    }
    
    stats.get(weekKey)!.dates.add(completion.date);
  });
  
  return Array.from(stats.entries())
    .map(([week, data]) => ({
      week,
      dateRange: data.dateRange,
      workoutsCompleted: data.dates.size,
      completionRate: (data.dates.size / 7) * 100,
    }))
    .sort((a, b) => b.week.localeCompare(a.week))
    .slice(0, 12); // Last 12 weeks
}

function calculateMonthlyStats(completions: ExerciseCompletion[]): MonthlyStat[] {
  const stats: Map<string, { dates: Set<string>; monthName: string }> = new Map();
  
  completions.forEach(completion => {
    const date = new Date(completion.date);
    const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    if (!stats.has(monthKey)) {
      stats.set(monthKey, { dates: new Set(), monthName });
    }
    
    stats.get(monthKey)!.dates.add(completion.date);
  });
  
  return Array.from(stats.entries())
    .map(([month, data]) => {
      const daysInMonth = new Date(parseInt(month.split('-')[0]), parseInt(month.split('-')[1]), 0).getDate();
      return {
        month,
        monthName: data.monthName,
        workoutsCompleted: data.dates.size,
        completionRate: (data.dates.size / daysInMonth) * 100,
      };
    })
    .sort((a, b) => b.month.localeCompare(a.month))
    .slice(0, 6); // Last 6 months
}

function calculateExerciseStats(completions: ExerciseCompletion[]): ExerciseStat[] {
  const stats: Map<string, { count: number; lastCompleted?: string }> = new Map();
  
  completions.forEach(completion => {
    if (!stats.has(completion.exerciseId)) {
      stats.set(completion.exerciseId, { count: 0 });
    }
    const stat = stats.get(completion.exerciseId)!;
    stat.count++;
    if (!stat.lastCompleted || completion.date > stat.lastCompleted) {
      stat.lastCompleted = completion.date;
    }
  });
  
  return Array.from(stats.entries())
    .map(([exerciseId, data]) => ({
      exerciseId,
      exerciseName: exerciseId, // Will be replaced with actual name
      timesCompleted: data.count,
      lastCompleted: data.lastCompleted,
    }))
    .sort((a, b) => b.timesCompleted - a.timesCompleted);
}

function calculateLongestStreak(completions: ExerciseCompletion[]): number {
  if (completions.length === 0) return 0;
  
  const dates = Array.from(new Set(completions.map(c => c.date)))
    .map(d => new Date(d))
    .sort((a, b) => a.getTime() - b.getTime());
  
  if (dates.length === 0) return 0;
  
  let longestStreak = 1;
  let currentStreak = 1;
  
  for (let i = 1; i < dates.length; i++) {
    const diffDays = Math.floor((dates[i].getTime() - dates[i - 1].getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }
  
  return longestStreak;
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
}

// Milestone detection
export interface Milestone {
  type: 'streak' | 'workouts' | 'week' | 'month';
  value: number;
  title: string;
  description: string;
  emoji: string;
  achieved: boolean;
  achievedAt?: string;
}

export function detectMilestones(stats: ProgressStats, previousStats?: ProgressStats): Milestone[] {
  const milestones: Milestone[] = [];
  const today = new Date().toISOString().split('T')[0];
  
  // Streak milestones
  const streakMilestones = [3, 7, 14, 30, 50, 100];
  streakMilestones.forEach(threshold => {
    if (stats.currentStreak >= threshold && (!previousStats || previousStats.currentStreak < threshold)) {
      milestones.push({
        type: 'streak',
        value: threshold,
        title: `${threshold}-Day Streak!`,
        description: `You've worked out ${threshold} days in a row!`,
        emoji: threshold >= 100 ? '🏆' : threshold >= 50 ? '👑' : threshold >= 30 ? '🔥' : '💪',
        achieved: true,
        achievedAt: today,
      });
    }
  });
  
  // Workout count milestones
  const workoutMilestones = [10, 25, 50, 100, 200, 500];
  workoutMilestones.forEach(threshold => {
    if (stats.totalWorkouts >= threshold && (!previousStats || previousStats.totalWorkouts < threshold)) {
      milestones.push({
        type: 'workouts',
        value: threshold,
        title: `${threshold} Workouts Completed!`,
        description: `You've completed ${threshold} workouts!`,
        emoji: threshold >= 500 ? '🌟' : threshold >= 200 ? '🎯' : threshold >= 100 ? '🚀' : '⭐',
        achieved: true,
        achievedAt: today,
      });
    }
  });
  
  return milestones;
}

