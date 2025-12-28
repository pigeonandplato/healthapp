// Hybrid: Local workout generation + Supabase for progress sync
import {
  Exercise,
  ExerciseBlock,
  WorkoutDay,
  ExerciseCompletion,
  BlockTimerState,
  ProgramMeta,
} from "./types";
import { allExercises, getBlocksForProgramMeta } from "./seedData";
import { getProgramMetaForDate } from "./program";
import { supabase } from "./supabase";

// Helper to get current user ID
async function getUserId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

// ============================================
// COMPLETIONS - Synced to Supabase (per user)
// ============================================

export async function saveCompletion(
  exerciseId: string,
  date: string,
  completed: boolean,
  notes?: string
): Promise<void> {
  const userId = await getUserId();
  if (!userId) return;

  const id = `${userId}-${exerciseId}-${date}`;
  const { error } = await supabase
    .from("completions")
    .upsert({
      id,
      user_id: userId,
      exercise_id: exerciseId,
      date,
      completed,
      notes,
      completed_at: completed ? new Date().toISOString() : null,
    });
  
  if (error) {
    console.error("Error saving completion:", error);
  }
}

export async function getCompletion(exerciseId: string, date: string): Promise<ExerciseCompletion | undefined> {
  const userId = await getUserId();
  if (!userId) return undefined;

  const id = `${userId}-${exerciseId}-${date}`;
  const { data, error } = await supabase
    .from("completions")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error || !data) return undefined;
  
  return {
    exerciseId: data.exercise_id,
    date: data.date,
    completed: data.completed,
    notes: data.notes,
    completedAt: data.completed_at,
  };
}

export async function getCompletionsByDate(date: string): Promise<ExerciseCompletion[]> {
  const userId = await getUserId();
  if (!userId) return [];

  const { data, error } = await supabase
    .from("completions")
    .select("*")
    .eq("user_id", userId)
    .eq("date", date);
  
  if (error || !data) return [];
  
  return data.map((c) => ({
    exerciseId: c.exercise_id,
    date: c.date,
    completed: c.completed,
    notes: c.notes,
    completedAt: c.completed_at,
  }));
}

export async function deleteCompletion(exerciseId: string, date: string): Promise<void> {
  const userId = await getUserId();
  if (!userId) return;

  const id = `${userId}-${exerciseId}-${date}`;
  const { error } = await supabase
    .from("completions")
    .delete()
    .eq("id", id);
  
  if (error) {
    console.error("Error deleting completion:", error);
  }
}

// ============================================
// SETTINGS - Synced to Supabase (per user)
// ============================================

export async function getSetting(key: string): Promise<any> {
  const userId = await getUserId();
  if (!userId) return undefined;

  const id = `${userId}-${key}`;
  const { data, error } = await supabase
    .from("settings")
    .select("value")
    .eq("id", id)
    .single();
  
  if (error || !data) return undefined;
  return data.value;
}

export async function saveSetting(key: string, value: any): Promise<void> {
  const userId = await getUserId();
  if (!userId) return;

  const id = `${userId}-${key}`;
  const { error } = await supabase
    .from("settings")
    .upsert({ id, user_id: userId, key, value });
  
  if (error) {
    console.error("Error saving setting:", error);
  }
}

// ============================================
// BLOCK TIMERS - Synced to Supabase (per user)
// ============================================

export async function saveBlockTimer(timer: BlockTimerState): Promise<void> {
  const userId = await getUserId();
  if (!userId) return;

  const id = `${userId}-${timer.blockId}-${timer.date}`;
  const { error } = await supabase
    .from("block_timers")
    .upsert({
      id,
      user_id: userId,
      block_id: timer.blockId,
      date: timer.date,
      elapsed_seconds: timer.elapsedSeconds,
      is_running: timer.isRunning,
    });
  
  if (error) {
    console.error("Error saving block timer:", error);
  }
}

export async function getBlockTimer(blockId: string, date: string): Promise<BlockTimerState | undefined> {
  const userId = await getUserId();
  if (!userId) return undefined;

  const id = `${userId}-${blockId}-${date}`;
  const { data, error } = await supabase
    .from("block_timers")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error || !data) return undefined;
  
  return {
    blockId: data.block_id,
    date: data.date,
    elapsedSeconds: data.elapsed_seconds,
    isRunning: data.is_running,
  };
}

export async function getBlockTimersByDate(date: string): Promise<BlockTimerState[]> {
  const userId = await getUserId();
  if (!userId) return [];

  const { data, error } = await supabase
    .from("block_timers")
    .select("*")
    .eq("user_id", userId)
    .eq("date", date);
  
  if (error || !data) return [];
  
  return data.map((t) => ({
    blockId: t.block_id,
    date: t.date,
    elapsedSeconds: t.elapsed_seconds,
    isRunning: t.is_running,
  }));
}

// ============================================
// WORKOUTS - Generated locally (no sync needed)
// ============================================

export async function getTodayWorkout(): Promise<WorkoutDay | undefined> {
  const today = new Date().toISOString().split("T")[0];
  return getWorkoutByDate(today);
}

export async function getWorkoutByDate(date: string): Promise<WorkoutDay | undefined> {
  // Workouts are generated from program meta, not stored
  const programMeta: ProgramMeta = await getProgramMetaForDate(date);
  const blocks = getBlocksForProgramMeta(programMeta);

  return {
    id: `workout-${date}`,
    date,
    blocks,
    program: programMeta,
  };
}

export async function saveWorkoutDay(workout: WorkoutDay): Promise<void> {
  // Workouts are generated, not stored - this is a no-op
  // Completions are what track progress
}

export async function pushToTomorrow(exerciseIds: string[]): Promise<void> {
  // This feature requires more complex logic with Supabase
  // For now, we'll skip this feature
  console.log("Push to tomorrow not yet implemented with Supabase");
}

// ============================================
// EXERCISES - Static data (no sync needed)
// ============================================

export async function getAllExercises(): Promise<Exercise[]> {
  return allExercises;
}

export async function getExerciseById(id: string): Promise<Exercise | undefined> {
  return allExercises.find((ex) => ex.id === id);
}

// ============================================
// UTILITIES
// ============================================

export function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function getDayRotation(date?: string): 'A' | 'B' | 'C' {
  const targetDate = date ? new Date(date) : new Date();
  const startDate = new Date('2024-01-01');
  const daysSinceStart = Math.floor((targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const rotation = ['A', 'B', 'C'] as const;
  return rotation[daysSinceStart % 3];
}

// Legacy function - no longer needed with Supabase
export async function initDB(): Promise<void> {
  // No-op - Supabase doesn't need initialization
}
