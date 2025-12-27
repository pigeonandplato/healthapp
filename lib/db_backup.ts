// IndexedDB wrapper using idb library
// Handles all data persistence for the Health Tracker PWA

import { openDB, DBSchema, IDBPDatabase } from "idb";
import {
  Exercise,
  ExerciseBlock,
  WorkoutDay,
  ExerciseCompletion,
  BlockTimerState,
  Phase,
} from "./types";
import { allExercises, allBlocks } from "./seedData";

// Database schema
interface HealthTrackerDB extends DBSchema {
  exercises: {
    key: string;
    value: Exercise;
    indexes: { "by-phase": Phase; "by-category": string };
  };
  completions: {
    key: string; // `${exerciseId}-${date}`
    value: ExerciseCompletion;
    indexes: { "by-date": string; "by-exercise": string };
  };
  workoutDays: {
    key: string; // ISO date string
    value: WorkoutDay;
  };
  blockTimers: {
    key: string; // `${blockId}-${date}`
    value: BlockTimerState;
    indexes: { "by-date": string };
  };
  settings: {
    key: string;
    value: any;
  };
}

const DB_NAME = "health-tracker";
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<HealthTrackerDB> | null = null;

// Initialize database
export async function initDB(): Promise<IDBPDatabase<HealthTrackerDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<HealthTrackerDB>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      // Create exercises store
      if (!db.objectStoreNames.contains("exercises")) {
        const exerciseStore = db.createObjectStore("exercises", {
          keyPath: "id",
        });
        exerciseStore.createIndex("by-phase", "phase");
        exerciseStore.createIndex("by-category", "category");
      }

      // Create completions store
      if (!db.objectStoreNames.contains("completions")) {
        const completionStore = db.createObjectStore("completions", {
          keyPath: "id",
        });
        completionStore.createIndex("by-date", "date");
        completionStore.createIndex("by-exercise", "exerciseId");
      }

      // Create workoutDays store
      if (!db.objectStoreNames.contains("workoutDays")) {
        db.createObjectStore("workoutDays", { keyPath: "date" });
      }

      // Create blockTimers store
      if (!db.objectStoreNames.contains("blockTimers")) {
        const timerStore = db.createObjectStore("blockTimers", {
          keyPath: "id",
        });
        timerStore.createIndex("by-date", "date");
      }

      // Create settings store
      if (!db.objectStoreNames.contains("settings")) {
        db.createObjectStore("settings");
      }
    },
  });

  // Seed database on first run
  await seedDatabase(dbInstance);

  return dbInstance;
}

// Seed database with initial exercise data
async function seedDatabase(db: IDBPDatabase<HealthTrackerDB>) {
  const tx = db.transaction("exercises", "readwrite");
  const store = tx.objectStore("exercises");

  // Check if already seeded
  const count = await store.count();
  if (count > 0) {
    await tx.done;
    return;
  }

  // Add all exercises
  for (const exercise of allExercises) {
    await store.add(exercise);
  }

  await tx.done;
  console.log("Database seeded with exercises");
}

// ==================== EXERCISE OPERATIONS ====================

export async function getAllExercises(): Promise<Exercise[]> {
  const db = await initDB();
  return db.getAll("exercises");
}

export async function getExerciseById(id: string): Promise<Exercise | undefined> {
  const db = await initDB();
  return db.get("exercises", id);
}

export async function getExercisesByPhase(phase: Phase): Promise<Exercise[]> {
  const db = await initDB();
  return db.getAllFromIndex("exercises", "by-phase", phase);
}

export async function getExercisesByCategory(category: string): Promise<Exercise[]> {
  const db = await initDB();
  return db.getAllFromIndex("exercises", "by-category", category);
}

// ==================== COMPLETION OPERATIONS ====================

function getCompletionKey(exerciseId: string, date: string): string {
  return `${exerciseId}-${date}`;
}

export async function saveCompletion(
  exerciseId: string,
  date: string,
  completed: boolean,
  notes?: string
): Promise<void> {
  const db = await initDB();
  const id = getCompletionKey(exerciseId, date);

  const completion: ExerciseCompletion & { id: string } = {
    id,
    exerciseId,
    date,
    completed,
    notes,
    completedAt: completed ? new Date().toISOString() : undefined,
  };

  await db.put("completions", completion);
}

export async function getCompletion(
  exerciseId: string,
  date: string
): Promise<ExerciseCompletion | undefined> {
  const db = await initDB();
  const id = getCompletionKey(exerciseId, date);
  return db.get("completions", id);
}

export async function getCompletionsByDate(
  date: string
): Promise<ExerciseCompletion[]> {
  const db = await initDB();
  const completions = await db.getAllFromIndex("completions", "by-date", date);
  return completions;
}

export async function deleteCompletion(
  exerciseId: string,
  date: string
): Promise<void> {
  const db = await initDB();
  const id = getCompletionKey(exerciseId, date);
  await db.delete("completions", id);
}

// ==================== WORKOUT DAY OPERATIONS ====================

export async function getTodayWorkout(): Promise<WorkoutDay | undefined> {
  const today = new Date().toISOString().split("T")[0];
  return getWorkoutByDate(today);
}

export async function getWorkoutByDate(
  date: string
): Promise<WorkoutDay | undefined> {
  const db = await initDB();
  let workout = await db.get("workoutDays", date);

  // If no workout exists for this date, create default Phase 0 workout
  if (!workout) {
    workout = await createDefaultWorkout(date);
  }

  return workout;
}

async function createDefaultWorkout(date: string): Promise<WorkoutDay> {
  const db = await initDB();

  // Get blocks for today's rotation (A/B/C)
  const dayRotation = getDayRotation(date);
  const blocks = allBlocks[Phase.PHASE_0][dayRotation];

  const workout: WorkoutDay = {
    id: `workout-${date}`,
    date,
    blocks,
  };

  await db.put("workoutDays", workout);
  return workout;
}

export async function saveWorkoutDay(workout: WorkoutDay): Promise<void> {
  const db = await initDB();
  await db.put("workoutDays", workout);
}

// Push incomplete exercises to tomorrow
export async function pushToTomorrow(exerciseIds: string[]): Promise<void> {
  if (exerciseIds.length === 0) return;

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDate = tomorrow.toISOString().split("T")[0];

  // Get exercises to push
  const exercises: Exercise[] = [];
  for (const id of exerciseIds) {
    const exercise = await getExerciseById(id);
    if (exercise) exercises.push(exercise);
  }

  if (exercises.length === 0) return;

  // Get tomorrow's workout or create new one
  let tomorrowWorkout = await getWorkoutByDate(tomorrowDate);
  if (!tomorrowWorkout) {
    tomorrowWorkout = await createDefaultWorkout(tomorrowDate);
  }

  // Add a "Pushed from Today" block at the top
  const pushedBlock: ExerciseBlock = {
    id: `pushed-${today}`,
    name: "Pushed from Yesterday",
    description: "Exercises carried over from previous day",
    estimatedMinutes: exercises.reduce((sum, ex) => {
      const mins = ex.prescription.minutes || 
        (ex.prescription.sets || 1) * (ex.prescription.reps || 10) * 0.1;
      return sum + mins;
    }, 0),
    exercises,
  };

  // Insert at the beginning
  tomorrowWorkout.blocks = [pushedBlock, ...tomorrowWorkout.blocks];

  await saveWorkoutDay(tomorrowWorkout);
}

// ==================== BLOCK TIMER OPERATIONS ====================

function getTimerKey(blockId: string, date: string): string {
  return `${blockId}-${date}`;
}

export async function saveBlockTimer(timer: BlockTimerState): Promise<void> {
  const db = await initDB();
  const id = getTimerKey(timer.blockId, timer.date);

  await db.put("blockTimers", {
    id,
    ...timer,
  } as any);
}

export async function getBlockTimer(
  blockId: string,
  date: string
): Promise<BlockTimerState | undefined> {
  const db = await initDB();
  const id = getTimerKey(blockId, date);
  return db.get("blockTimers", id);
}

export async function getBlockTimersByDate(
  date: string
): Promise<BlockTimerState[]> {
  const db = await initDB();
  return db.getAllFromIndex("blockTimers", "by-date", date);
}

// ==================== SETTINGS OPERATIONS ====================

export async function getSetting(key: string): Promise<any> {
  const db = await initDB();
  return db.get("settings", key);
}

export async function saveSetting(key: string, value: any): Promise<void> {
  const db = await initDB();
  await db.put("settings", value, key);
}

// ==================== UTILITY ====================

export function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

// Get current day rotation (A/B/C)
export function getDayRotation(date?: string): 'A' | 'B' | 'C' {
  const targetDate = date ? new Date(date) : new Date();
  const startDate = new Date('2024-01-01'); // Reference date for rotation
  const daysSinceStart = Math.floor((targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const rotation = ['A', 'B', 'C'] as const;
  return rotation[daysSinceStart % 3];
}

