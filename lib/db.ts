// Hybrid: Local workout generation + Supabase for progress sync
import {
  Exercise,
  ExerciseBlock,
  WorkoutDay,
  ExerciseCompletion,
  BlockTimerState,
  ProgramMeta,
  ProgramType,
  ProgramInfo,
  DayRotation,
} from "./types";
import { allExercises, getBlocksForProgramMeta } from "./seedData";
import { allGymExercises, getGymBlocksForDay, GYM_PROGRAM_ID } from "./gymSeedData";
import {
  allRehabExercises,
  getRehabBlocksForProgramWeekAndDay,
  REHAB_PROGRAM_ID,
} from "./rehabSeedData";
import { getProgramMetaForDate } from "./program";
import { supabase } from "./supabase";
import { openDB, DBSchema, IDBPDatabase } from 'idb';

// ============================================
// PROGRAM DEFINITIONS
// ============================================
export const AVAILABLE_PROGRAMS: ProgramInfo[] = [
  {
    id: "run5k-24w-v1",
    type: "running",
    name: "5K Running Program",
    description: "24-week progressive running program for injury recovery",
    icon: "🏃",
  },
  {
    id: "gym-ppl-v1",
    type: "gym",
    name: "Gym PPL Workout",
    description: "Push/Pull/Legs strength training split",
    icon: "🏋️",
  },
  {
    id: REHAB_PROGRAM_ID,
    type: "rehab",
    name: "Rehab Strength",
    description: "3-week progressive rehab strength (Mon/Wed/Fri)",
    icon: "🩹",
  },
];

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
  notes?: string,
  weight?: number,
  reps?: number,
  sets?: number
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
      weight,
      reps,
      sets,
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
    weight: data.weight,
    reps: data.reps,
    sets: data.sets,
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
    weight: c.weight,
    reps: c.reps,
    sets: c.sets,
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
  return [...allExercises, ...allGymExercises, ...allRehabExercises];
}

export async function getExerciseById(id: string): Promise<Exercise | undefined> {
  return (
    allExercises.find((ex) => ex.id === id) ||
    allGymExercises.find((ex) => ex.id === id) ||
    allRehabExercises.find((ex) => ex.id === id)
  );
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
// ACTIVE PROGRAM SELECTION
// ============================================

const ACTIVE_PROGRAM_KEY = "activeProgram";
const GYM_PROGRAM_START_DATE_KEY = "gymProgramStartDate";
const REHAB_PROGRAM_START_DATE_KEY = "rehabProgramStartDate";

export async function getActiveProgram(): Promise<ProgramType> {
  const value = await getSetting(ACTIVE_PROGRAM_KEY);
  return (value as ProgramType) || "running";
}

export async function setActiveProgram(programType: ProgramType): Promise<void> {
  await saveSetting(ACTIVE_PROGRAM_KEY, programType);
}

export async function getGymProgramStartDate(): Promise<string> {
  const existing = await getSetting(GYM_PROGRAM_START_DATE_KEY);
  if (existing) return existing;
  const today = toLocalDateString(new Date());
  await saveSetting(GYM_PROGRAM_START_DATE_KEY, today);
  return today;
}

export async function setGymProgramStartDate(startDate: string): Promise<void> {
  await saveSetting(GYM_PROGRAM_START_DATE_KEY, startDate);
  await clearWorkoutCache();
}

export async function getRehabProgramStartDate(): Promise<string> {
  const existing = await getSetting(REHAB_PROGRAM_START_DATE_KEY);
  if (existing) return existing;
  const today = toLocalDateString(new Date());
  await saveSetting(REHAB_PROGRAM_START_DATE_KEY, today);
  return today;
}

export async function setRehabProgramStartDate(startDate: string): Promise<void> {
  await saveSetting(REHAB_PROGRAM_START_DATE_KEY, startDate);
  await clearWorkoutCache();
}

export function getGymDayForDate(dateIso: string): { isGymDay: boolean; day: DayRotation; dayName: string } {
  // Parse as local date to avoid timezone issues
  const parts = dateIso.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const dayNum = parseInt(parts[2], 10);
  const date = new Date(year, month - 1, dayNum);
  const dayOfWeek = date.getDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  
  console.log('[GymDay Debug]', { dateIso, year, month, dayNum, dayOfWeek, dateStr: date.toString() });
  
  // Gym days: Monday=A, Wednesday=B, Friday=C
  if (dayOfWeek === 1) return { isGymDay: true, day: 'A', dayName: 'Monday' };
  if (dayOfWeek === 3) return { isGymDay: true, day: 'B', dayName: 'Wednesday' };
  if (dayOfWeek === 5) return { isGymDay: true, day: 'C', dayName: 'Friday' };
  
  return { isGymDay: false, day: 'A', dayName: '' };
}

export async function getGymWorkoutByDate(date: string): Promise<WorkoutDay | null> {
  const { isGymDay, day: dayRotation } = getGymDayForDate(date);
  
  // Return null for rest days (not Mon/Wed/Fri)
  if (!isGymDay) {
    return null;
  }
  
  const startDate = await getGymProgramStartDate();
  const blocks = getGymBlocksForDay(dayRotation);
  
  // Parse dates as local to avoid timezone issues
  const [y1, m1, d1] = date.split('-').map(Number);
  const [y2, m2, d2] = startDate.split('-').map(Number);
  const targetDate = new Date(y1, m1 - 1, d1);
  const start = new Date(y2, m2 - 1, d2);
  
  const gymMeta: ProgramMeta = {
    planId: GYM_PROGRAM_ID,
    startDate,
    week: Math.floor((targetDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 7)) + 1,
    phase: "P1",
    phaseWeek: 1,
    day: dayRotation,
  };

  return {
    id: `gym-workout-${date}`,
    date,
    blocks,
    program: gymMeta,
  };
}

function rehabPhaseForWeek(week: number): ProgramMeta["phase"] {
  if (week >= 3) return "P3";
  if (week === 2) return "P2";
  return "P1";
}

export async function getRehabWorkoutByDate(date: string): Promise<WorkoutDay | null> {
  const { isGymDay, day: dayRotation } = getGymDayForDate(date);
  if (!isGymDay) {
    return null;
  }

  const startDate = await getRehabProgramStartDate();
  const [y1, m1, d1] = date.split("-").map(Number);
  const [y2, m2, d2] = startDate.split("-").map(Number);
  const targetDate = new Date(y1, m1 - 1, d1);
  const start = new Date(y2, m2 - 1, d2);

  const programWeek =
    Math.floor((targetDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 7)) + 1;
  const week = Math.max(1, programWeek);
  const blocks = getRehabBlocksForProgramWeekAndDay(week, dayRotation);

  const rehabMeta: ProgramMeta = {
    planId: REHAB_PROGRAM_ID,
    startDate,
    week,
    phase: rehabPhaseForWeek(week),
    phaseWeek: week >= 3 ? week - 2 : week,
    day: dayRotation,
  };

  return {
    id: `rehab-workout-${date}`,
    date,
    blocks,
    program: rehabMeta,
  };
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
