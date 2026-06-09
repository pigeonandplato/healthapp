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
  CustomProgramRow,
  Phase,
} from "./types";
import { allExercises } from "./seedData";
import { allGymExercises, getGymBlocksForDay, GYM_PROGRAM_ID } from "./gymSeedData";
import {
  allAdhdExercises,
  getAdhdBlocksForWeekAndKneeDay,
  adhdPhaseForWeek,
  ADHD_PROGRAM_ID,
} from "./adhdSeedData";
import { supabase } from "./supabase";
import { openDB, DBSchema, IDBPDatabase } from 'idb';

// ============================================
// PROGRAM DEFINITIONS
// ============================================
export const AVAILABLE_PROGRAMS: ProgramInfo[] = [
  {
    id: ADHD_PROGRAM_ID,
    type: "adhd",
    name: "ADHD Knee + Back",
    description: "3 daily WFH breaks · 12-week progressive plan",
    icon: "🧠",
  },
  {
    id: "gym-ppl-v1",
    type: "gym",
    name: "Gym PPL Workout",
    description: "Push/Pull/Legs strength training split",
    icon: "🏋️",
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
// PREFERENCES & PROGRESS STATE - Synced to Supabase
// Stored in the generic settings table (no schema change needed).
// ============================================

const COMPLETION_SOUND_KEY = "completion_sound";
const SEEN_ACHIEVEMENTS_KEY = "seen_achievements";
const LAST_SEEN_LEVEL_KEY = "last_seen_level";

// Completion sound preference. Returns undefined when never set.
export async function getCompletionSoundSetting(): Promise<boolean | undefined> {
  const v = await getSetting(COMPLETION_SOUND_KEY);
  if (v === undefined || v === null) return undefined;
  return v === true || v === "true";
}

export async function setCompletionSoundSetting(enabled: boolean): Promise<void> {
  await saveSetting(COMPLETION_SOUND_KEY, enabled);
}

// Achievements already celebrated. Returns null when never set (first run).
export async function getSeenAchievements(): Promise<string[] | null> {
  const v = await getSetting(SEEN_ACHIEVEMENTS_KEY);
  if (v === undefined || v === null) return null;
  return Array.isArray(v) ? (v as string[]) : [];
}

export async function setSeenAchievements(ids: string[]): Promise<void> {
  await saveSetting(SEEN_ACHIEVEMENTS_KEY, ids);
}

// Highest level the user has already been congratulated for. null when unset.
export async function getLastSeenLevel(): Promise<number | null> {
  const v = await getSetting(LAST_SEEN_LEVEL_KEY);
  if (v === undefined || v === null) return null;
  return Number(v);
}

export async function setLastSeenLevel(level: number): Promise<void> {
  await saveSetting(LAST_SEEN_LEVEL_KEY, level);
}

// Habit Coach habits — stored in the generic settings table so they sync
// across devices. localStorage remains the offline-first source of truth; this
// is the cloud mirror. Returns null when never synced.
const USER_HABITS_KEY = "user_habits";

export async function getRemoteHabits(): Promise<unknown[] | null> {
  const v = await getSetting(USER_HABITS_KEY);
  if (v === undefined || v === null) return null;
  return Array.isArray(v) ? v : [];
}

export async function saveRemoteHabits(habits: unknown[]): Promise<void> {
  await saveSetting(USER_HABITS_KEY, habits);
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
  const base = [...allExercises, ...allGymExercises, ...allAdhdExercises];
  const customRows = await getCustomProgram();
  if (customRows) {
    const seen = new Set<string>();
    for (const r of customRows) {
      const ex = customRowToExercise(r, Number(r.week) || 1);
      if (!seen.has(ex.id)) {
        seen.add(ex.id);
        base.push(ex);
      }
    }
  }
  return base;
}

export async function getExerciseById(id: string): Promise<Exercise | undefined> {
  return (
    allExercises.find((ex) => ex.id === id) ||
    allGymExercises.find((ex) => ex.id === id) ||
    allAdhdExercises.find((ex) => ex.id === id)
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
const ADHD_PROGRAM_START_DATE_KEY = "adhdProgramStartDate";
const CUSTOM_PROGRAM_KEY = "custom_program";
const CUSTOM_PROGRAM_NAME_KEY = "custom_program_name";
const CUSTOM_PROGRAM_START_DATE_KEY = "customProgramStartDate";

export async function getActiveProgram(): Promise<ProgramType> {
  const value = await getSetting(ACTIVE_PROGRAM_KEY);
  if (value === "gym" || value === "adhd") return value;
  if (value === "custom") {
    // Only honor a custom selection if a custom program actually exists.
    const hasCustom = await hasCustomProgram();
    return hasCustom ? "custom" : "adhd";
  }
  if (value === "running" || value === "rehab") {
    await saveSetting(ACTIVE_PROGRAM_KEY, "adhd");
    return "adhd";
  }
  return "adhd";
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

export async function getAdhdProgramStartDate(): Promise<string> {
  const existing = await getSetting(ADHD_PROGRAM_START_DATE_KEY);
  if (existing) return existing;
  const today = toLocalDateString(new Date());
  await saveSetting(ADHD_PROGRAM_START_DATE_KEY, today);
  return today;
}

export async function setAdhdProgramStartDate(startDate: string): Promise<void> {
  await saveSetting(ADHD_PROGRAM_START_DATE_KEY, startDate);
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

export async function getAdhdWorkoutByDate(date: string): Promise<WorkoutDay> {
  const { isGymDay: isKneeDay, day: dayRotation } = getGymDayForDate(date);
  const startDate = await getAdhdProgramStartDate();
  const [y1, m1, d1] = date.split("-").map(Number);
  const [y2, m2, d2] = startDate.split("-").map(Number);
  const targetDate = new Date(y1, m1 - 1, d1);
  const start = new Date(y2, m2 - 1, d2);

  const programWeek =
    Math.floor((targetDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 7)) + 1;
  const week = Math.max(1, programWeek);
  const phase = adhdPhaseForWeek(week);
  const blocks = getAdhdBlocksForWeekAndKneeDay(week, isKneeDay);

  const adhdMeta: ProgramMeta = {
    planId: ADHD_PROGRAM_ID,
    startDate,
    week,
    phase,
    phaseWeek: phase === "P1" ? week : phase === "P2" ? week - 4 : week - 8,
    day: dayRotation,
  };

  return {
    id: `adhd-workout-${date}`,
    date,
    blocks,
    program: adhdMeta,
  };
}

// ============================================
// CUSTOM PROGRAM - User-imported (CSV / Sheets)
// ============================================
export const CUSTOM_PROGRAM_ID = "custom-program-v1";

export async function getCustomProgram(): Promise<CustomProgramRow[] | null> {
  const rows = await getSetting(CUSTOM_PROGRAM_KEY);
  if (!Array.isArray(rows) || rows.length === 0) return null;
  return rows as CustomProgramRow[];
}

export async function hasCustomProgram(): Promise<boolean> {
  const rows = await getCustomProgram();
  return !!rows && rows.length > 0;
}

export async function getCustomProgramName(): Promise<string> {
  const name = await getSetting(CUSTOM_PROGRAM_NAME_KEY);
  return name || "My Custom Program";
}

export async function saveCustomProgram(rows: CustomProgramRow[], name?: string): Promise<void> {
  await saveSetting(CUSTOM_PROGRAM_KEY, rows);
  if (name) await saveSetting(CUSTOM_PROGRAM_NAME_KEY, name);
  // Anchor the program to today so week 1 starts now.
  await saveSetting(CUSTOM_PROGRAM_START_DATE_KEY, toLocalDateString(new Date()));
  await clearWorkoutCache();
}

export async function getCustomProgramStartDate(): Promise<string> {
  const existing = await getSetting(CUSTOM_PROGRAM_START_DATE_KEY);
  if (existing) return existing;
  const today = toLocalDateString(new Date());
  await saveSetting(CUSTOM_PROGRAM_START_DATE_KEY, today);
  return today;
}

export async function setCustomProgramStartDate(startDate: string): Promise<void> {
  await saveSetting(CUSTOM_PROGRAM_START_DATE_KEY, startDate);
  await clearWorkoutCache();
}

function customRowToExercise(row: CustomProgramRow, week: number): Exercise {
  const slug = (row.exerciseName || "move").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 24);
  return {
    id: row.exerciseId || `custom-w${week}-${row.day}-${slug}`,
    name: row.exerciseName || "Exercise",
    description: row.description || "",
    phase: Phase.PHASE_0,
    media: { type: "svg", alt: row.exerciseName || "Exercise" },
    prescription: {
      sets: row.sets,
      reps: row.reps,
      holdSeconds: row.holdSeconds,
      minutes: row.minutes,
      description: row.description || undefined,
    },
    instructions: row.description ? [row.description] : [],
    commonMistakes: [],
    stopConditions: [],
    category: row.blockName || "Custom",
  };
}

function buildCustomBlocks(rows: CustomProgramRow[], week: number, day: DayRotation): ExerciseBlock[] {
  const dayRows = rows.filter((r) => String(r.day).toUpperCase() === day && Number(r.week) === week);
  if (dayRows.length === 0) return [];

  // Preserve block order as first seen in the CSV.
  const order: string[] = [];
  const groups = new Map<string, CustomProgramRow[]>();
  for (const r of dayRows) {
    const name = r.blockName || "Workout";
    if (!groups.has(name)) {
      groups.set(name, []);
      order.push(name);
    }
    groups.get(name)!.push(r);
  }

  return order.map((name, i) => {
    const blockRows = groups.get(name)!;
    const exercises = blockRows.map((r) => customRowToExercise(r, week));
    const estMinutes = exercises.reduce((sum, ex) => {
      if (ex.prescription.minutes) return sum + ex.prescription.minutes;
      return sum + 2; // rough estimate per set-based move
    }, 0);
    return {
      id: `custom-w${week}-${day}-block${i}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 16)}`,
      name,
      estimatedMinutes: Math.max(5, estMinutes),
      exercises,
    };
  });
}

export async function getCustomWorkoutByDate(date: string): Promise<WorkoutDay | null> {
  const rows = await getCustomProgram();
  if (!rows) return null;

  const { isGymDay, day } = getGymDayForDate(date);
  if (!isGymDay) return null; // Custom programs run Mon (A) / Wed (B) / Fri (C)

  const startDate = await getCustomProgramStartDate();
  const [y1, m1, d1] = date.split("-").map(Number);
  const [y2, m2, d2] = startDate.split("-").map(Number);
  const targetDate = new Date(y1, m1 - 1, d1);
  const start = new Date(y2, m2 - 1, d2);

  const maxWeek = Math.max(1, ...rows.map((r) => Number(r.week) || 1));
  const rawWeek = Math.floor((targetDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 7)) + 1;
  // Clamp into the program range; hold at the last week once finished.
  const week = Math.min(maxWeek, Math.max(1, rawWeek));

  const blocks = buildCustomBlocks(rows, week, day);
  if (blocks.length === 0) return null;

  const meta: ProgramMeta = {
    planId: CUSTOM_PROGRAM_ID,
    startDate,
    week,
    phase: "P1",
    phaseWeek: week,
    day,
  };

  return {
    id: `custom-workout-${date}`,
    date,
    blocks,
    program: meta,
  };
}

export async function getAvailablePrograms(): Promise<ProgramInfo[]> {
  const programs = [...AVAILABLE_PROGRAMS];
  if (await hasCustomProgram()) {
    const name = await getCustomProgramName();
    programs.push({
      id: CUSTOM_PROGRAM_ID,
      type: "custom",
      name,
      description: "Your imported program · Mon / Wed / Fri",
      icon: "🗂️",
    });
  }
  return programs;
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
