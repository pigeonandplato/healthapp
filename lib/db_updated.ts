// IndexedDB with Program-aware workout generation
import { openDB, DBSchema, IDBPDatabase } from "idb";
import {
  Exercise,
  ExerciseBlock,
  WorkoutDay,
  ExerciseCompletion,
  BlockTimerState,
  Phase,
  ProgramMeta,
} from "./types";
import { programBlocks, allExercises } from "./seedData_new";
import { getProgramMetaForDate } from "./program";

interface HealthTrackerDB extends DBSchema {
  exercises: {
    key: string;
    value: Exercise;
    indexes: { "by-phase": Phase; "by-category": string };
  };
  completions: {
    key: string;
    value: ExerciseCompletion & { id: string };
    indexes: { "by-date": string; "by-exercise": string };
  };
  workoutDays: {
    key: string;
    value: WorkoutDay;
  };
  blockTimers: {
    key: string;
    value: BlockTimerState & { id: string };
    indexes: { "by-date": string };
  };
  settings: {
    key: string;
    value: any;
  };
}

const DB_NAME = "health-tracker";
const DB_VERSION = 2; // Increment for program support

let dbInstance: IDBPDatabase<HealthTrackerDB> | null = null;

export async function initDB(): Promise<IDBPDatabase<HealthTrackerDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<HealthTrackerDB>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      if (!db.objectStoreNames.contains("exercises")) {
        const exerciseStore = db.createObjectStore("exercises", { keyPath: "id" });
        exerciseStore.createIndex("by-phase", "phase");
        exerciseStore.createIndex("by-category", "category");
      }
      if (!db.objectStoreNames.contains("completions")) {
        const completionStore = db.createObjectStore("completions", { keyPath: "id" });
        completionStore.createIndex("by-date", "date");
        completionStore.createIndex("by-exercise", "exerciseId");
      }
      if (!db.objectStoreNames.contains("workoutDays")) {
        db.createObjectStore("workoutDays", { keyPath: "date" });
      }
      if (!db.objectStoreNames.contains("blockTimers")) {
        const timerStore = db.createObjectStore("blockTimers", { keyPath: "id" });
        timerStore.createIndex("by-date", "date");
      }
      if (!db.objectStoreNames.contains("settings")) {
        db.createObjectStore("settings");
      }
    },
  });

  await seedDatabase(dbInstance);
  return dbInstance;
}

async function seedDatabase(db: IDBPDatabase<HealthTrackerDB>) {
  const tx = db.transaction("exercises", "readwrite");
  const store = tx.objectStore("exercises");
  const count = await store.count();
  if (count > 0) {
    await tx.done;
    return;
  }
  for (const exercise of allExercises) {
    await store.add(exercise);
  }
  await tx.done;
}

export async function getTodayWorkout(): Promise<WorkoutDay | undefined> {
  const today = new Date().toISOString().split("T")[0];
  return getWorkoutByDate(today);
}

export async function getWorkoutByDate(date: string): Promise<WorkoutDay | undefined> {
  const db = await initDB();
  let workout = await db.get("workoutDays", date);

  if (!workout) {
    workout = await createDefaultWorkout(date);
  }
  return workout;
}

async function createDefaultWorkout(date: string): Promise<WorkoutDay> {
  const db = await initDB();
  const programMeta: ProgramMeta = await getProgramMetaForDate(date);
  
  const blocks = programBlocks[programMeta.phase]?.[programMeta.day] || programBlocks.P1.A;

  const workout: WorkoutDay = {
    id: `workout-${date}`,
    date,
    blocks,
    program: programMeta,
  };

  await db.put("workoutDays", workout);
  return workout;
}

export async function saveWorkoutDay(workout: WorkoutDay): Promise<void> {
  const db = await initDB();
  await db.put("workoutDays", workout);
}

export async function pushToTomorrow(exerciseIds: string[]): Promise<void> {
  if (exerciseIds.length === 0) return;
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDate = tomorrow.toISOString().split("T")[0];

  const exercises: Exercise[] = [];
  for (const id of exerciseIds) {
    const exercise = await getExerciseById(id);
    if (exercise) exercises.push(exercise);
  }
  if (exercises.length === 0) return;

  let tomorrowWorkout = await getWorkoutByDate(tomorrowDate);
  if (!tomorrowWorkout) {
    tomorrowWorkout = await createDefaultWorkout(tomorrowDate);
  }

  const pushedBlock: ExerciseBlock = {
    id: `pushed-${today}`,
    name: "Pushed from Yesterday",
    description: "Carry-over exercises",
    estimatedMinutes: exercises.reduce((sum, ex) => {
      const mins = ex.prescription.minutes || (ex.prescription.sets || 1) * (ex.prescription.reps || 10) * 0.1;
      return sum + mins;
    }, 0),
    exercises,
  };

  tomorrowWorkout.blocks = [pushedBlock, ...tomorrowWorkout.blocks];
  await saveWorkoutDay(tomorrowWorkout);
}

export async function getAllExercises(): Promise<Exercise[]> {
  const db = await initDB();
  return db.getAll("exercises");
}

export async function getExerciseById(id: string): Promise<Exercise | undefined> {
  const db = await initDB();
  return db.get("exercises", id);
}

export async function saveCompletion(
  exerciseId: string,
  date: string,
  completed: boolean,
  notes?: string
): Promise<void> {
  const db = await initDB();
  const id = `${exerciseId}-${date}`;
  await db.put("completions", {
    id,
    exerciseId,
    date,
    completed,
    notes,
    completedAt: completed ? new Date().toISOString() : undefined,
  });
}

export async function getCompletion(exerciseId: string, date: string): Promise<ExerciseCompletion | undefined> {
  const db = await initDB();
  return db.get("completions", `${exerciseId}-${date}`);
}

export async function getCompletionsByDate(date: string): Promise<ExerciseCompletion[]> {
  const db = await initDB();
  return db.getAllFromIndex("completions", "by-date", date);
}

export async function getSetting(key: string): Promise<any> {
  const db = await initDB();
  return db.get("settings", key);
}

export async function saveSetting(key: string, value: any): Promise<void> {
  const db = await initDB();
  await db.put("settings", value, key);
}

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

export async function saveBlockTimer(timer: BlockTimerState): Promise<void> {
  const db = await initDB();
  const id = `${timer.blockId}-${timer.date}`;
  await db.put("blockTimers", { id, ...timer } as any);
}

export async function getBlockTimer(blockId: string, date: string): Promise<BlockTimerState | undefined> {
  const db = await initDB();
  return db.get("blockTimers", `${blockId}-${date}`);
}

export async function getBlockTimersByDate(date: string): Promise<BlockTimerState[]> {
  const db = await initDB();
  return db.getAllFromIndex("blockTimers", "by-date", date);
}

export async function deleteCompletion(exerciseId: string, date: string): Promise<void> {
  const db = await initDB();
  await db.delete("completions", `${exerciseId}-${date}`);
}

