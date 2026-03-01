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
import { openDB, DBSchema, IDBPDatabase } from 'idb';

function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

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

// Get all completions for progress tracking
export async function getAllCompletions(): Promise<ExerciseCompletion[]> {
  const userId = await getUserId();
  if (!userId) return [];

  const { data, error } = await supabase
    .from("completions")
    .select("*")
    .eq("user_id", userId)
    .eq("completed", true)
    .order("date", { ascending: false });
  
  if (error || !data) return [];
  
  return data.map((c) => ({
    exerciseId: c.exercise_id,
    date: c.date,
    completed: c.completed,
    notes: c.notes,
    completedAt: c.completed_at,
  }));
}

// Get completions by date range
export async function getCompletionsByDateRange(startDate: string, endDate: string): Promise<ExerciseCompletion[]> {
  const userId = await getUserId();
  if (!userId) return [];

  const { data, error } = await supabase
    .from("completions")
    .select("*")
    .eq("user_id", userId)
    .eq("completed", true)
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: true });
  
  if (error || !data) return [];
  
  return data.map((c) => ({
    exerciseId: c.exercise_id,
    date: c.date,
    completed: c.completed,
    notes: c.notes,
    completedAt: c.completed_at,
  }));
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
      last_updated: timer.lastUpdated || new Date().toISOString(),
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
    lastUpdated: data.last_updated || new Date().toISOString(),
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
    lastUpdated: t.last_updated || new Date().toISOString(),
  }));
}

// ============================================
// WORKOUTS - Generated locally (no sync needed)
// ============================================

export async function getTodayWorkout(): Promise<WorkoutDay | undefined> {
  const today = toLocalDateString(new Date());
  return getWorkoutByDate(today);
}

export async function getWorkoutByDate(date: string): Promise<WorkoutDay | undefined> {
  // Get current program meta first to validate cache
  const programMeta: ProgramMeta = await getProgramMetaForDate(date);
  
  // Check if cached workout matches current program meta
  try {
    const cached = await getCachedWorkout(date);
    const cachedMeta = await getCachedProgramMeta(date);
    
    // Only use cache if program meta matches (same start date and plan)
    if (cached && cachedMeta && 
        cachedMeta.startDate === programMeta.startDate && 
        cachedMeta.planId === programMeta.planId) {
      // Also check if we need to cache exercises
      const cachedExercises = await getCachedExercises();
      if (cachedExercises.length === 0) {
        const exercises = await getAllExercises();
        await cacheExercises(exercises);
      }
      return cached;
    }
  } catch (error) {
    console.error("Error reading from cache:", error);
  }

  // Generate workout if not cached or cache is stale
  const blocks = getBlocksForProgramMeta(programMeta);

  const workout: WorkoutDay = {
    id: `workout-${date}`,
    date,
    blocks,
    program: programMeta,
  };

  // Cache for future use
  try {
    await cacheWorkout(workout);
    await cacheProgramMeta(date, programMeta);
    
    // Cache exercises if not already cached
    const cachedExercises = await getCachedExercises();
    if (cachedExercises.length === 0) {
      const exercises = await getAllExercises();
      await cacheExercises(exercises);
    }
  } catch (error) {
    console.error("Error caching workout:", error);
  }

  return workout;
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
  return toLocalDateString(new Date());
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

// ============================================
// YOUTUBE VIDEO SETTINGS
// ============================================

export async function getYouTubeVideo(): Promise<string | null> {
  return await getSetting("youtube_video_url");
}

export async function saveYouTubeVideo(url: string): Promise<void> {
  await saveSetting("youtube_video_url", url);
}

// ============================================
// CUSTOM EXERCISE VIDEOS - Per user overrides
// ============================================

export async function getCustomExerciseVideo(exerciseId: string): Promise<string | null> {
  return await getSetting(`exercise_video_${exerciseId}`);
}

export async function saveCustomExerciseVideo(exerciseId: string, videoUrl: string): Promise<void> {
  await saveSetting(`exercise_video_${exerciseId}`, videoUrl);
}

export async function deleteCustomExerciseVideo(exerciseId: string): Promise<void> {
  const userId = await getUserId();
  if (!userId) return;
  
  const id = `${userId}-exercise_video_${exerciseId}`;
  const { error } = await supabase
    .from("settings")
    .delete()
    .eq("id", id);
  
  if (error) {
    console.error("Error deleting custom video:", error);
  }
}

// ============================================
// MASTER EXERCISE VIDEOS - Admin updates (for all users)
// ============================================

export async function getMasterExerciseVideo(exerciseId: string): Promise<string | null> {
  // Master videos are stored with key "master_exercise_video_{exerciseId}"
  // Query by key to find the most recent master video (any user can have set it)
  const { data, error } = await supabase
    .from("settings")
    .select("value")
    .eq("key", `master_exercise_video_${exerciseId}`)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  
  if (error || !data) return null;
  return data.value;
}

export async function saveMasterExerciseVideo(exerciseId: string, videoUrl: string): Promise<void> {
  // Master videos are stored with the admin user's ID but with a special key
  // This allows RLS to work while still making it accessible to all users
  const userId = await getUserId();
  if (!userId) return;
  
  const id = `${userId}-master_exercise_video_${exerciseId}`;
  const { error } = await supabase
    .from("settings")
    .upsert({
      id,
      user_id: userId,
      key: `master_exercise_video_${exerciseId}`,
      value: videoUrl,
    });
  
  if (error) {
    console.error("Error saving master video:", error);
  }
}

// Helper to get current user email
export async function getUserEmail(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.email ?? null;
}

// ============================================
// OFFLINE CACHING - IndexedDB for local storage
// ============================================

interface CacheDB extends DBSchema {
  workouts: {
    key: string; // date string
    value: WorkoutDay;
  };
  exercises: {
    key: string; // exercise id
    value: Exercise;
  };
  programMeta: {
    key: string; // date string
    value: ProgramMeta;
  };
}

let cacheDB: IDBPDatabase<CacheDB> | null = null;

async function getCacheDB(): Promise<IDBPDatabase<CacheDB>> {
  if (cacheDB) return cacheDB;
  
  cacheDB = await openDB<CacheDB>('health-tracker-cache', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('workouts')) {
        db.createObjectStore('workouts');
      }
      if (!db.objectStoreNames.contains('exercises')) {
        db.createObjectStore('exercises');
      }
      if (!db.objectStoreNames.contains('programMeta')) {
        db.createObjectStore('programMeta');
      }
    },
  });
  
  return cacheDB;
}

export async function cacheWorkout(workout: WorkoutDay): Promise<void> {
  const db = await getCacheDB();
  await db.put('workouts', workout, workout.date);
}

export async function getCachedWorkout(date: string): Promise<WorkoutDay | undefined> {
  const db = await getCacheDB();
  return await db.get('workouts', date);
}

export async function cacheExercises(exercises: Exercise[]): Promise<void> {
  const db = await getCacheDB();
  const tx = db.transaction('exercises', 'readwrite');
  await Promise.all(exercises.map(ex => tx.store.put(ex, ex.id)));
  await tx.done;
}

export async function getCachedExercises(): Promise<Exercise[]> {
  const db = await getCacheDB();
  return await db.getAll('exercises');
}

export async function cacheProgramMeta(date: string, meta: ProgramMeta): Promise<void> {
  const db = await getCacheDB();
  await db.put('programMeta', meta, date);
}

export async function getCachedProgramMeta(date: string): Promise<ProgramMeta | undefined> {
  const db = await getCacheDB();
  return await db.get('programMeta', date);
}

// Clear workout cache when program start date changes
export async function clearWorkoutCache(): Promise<void> {
  try {
    const db = await getCacheDB();
    const tx = db.transaction('workouts', 'readwrite');
    await tx.store.clear();
    await tx.done;
    
    const metaTx = db.transaction('programMeta', 'readwrite');
    await metaTx.store.clear();
    await metaTx.done;
  } catch (error) {
    console.error("Error clearing cache:", error);
  }
}

// Legacy function - no longer needed with Supabase
export async function initDB(): Promise<void> {
  // Initialize cache DB
  await getCacheDB();
}
