// Core type definitions for the Health Tracker PWA

export enum Phase {
  PHASE_0 = 0,
  PHASE_1 = 1,
  PHASE_2 = 2,
  PHASE_3 = 3,
  PHASE_4 = 4,
  PHASE_5 = 5,
}

export type DayRotation = "A" | "B" | "C";
export type ExtendedDayRotation = DayRotation | "D" | "E";

// 24-week program phases (6 months)
export type ProgramPhase = "P1" | "P2" | "P3" | "P4" | "P5";

// Program types available in the app
export type ProgramType = "gym" | "adhd" | "custom" | "chacha";

// A single row of a user-imported custom program (from JSON).
export type CustomProgramRow = {
  week: number;
  day: string; // A, B, or C
  blockName: string;
  exerciseId: string;
  exerciseName: string;
  sets?: number;
  reps?: number;
  holdSeconds?: number;
  minutes?: number;
  description?: string;
  /** YouTube watch URL, youtu.be link, embed URL, or 11-character video ID */
  videoUrl?: string;
};

export type ProgramInfo = {
  id: string;
  type: ProgramType;
  name: string;
  description: string;
  icon: string;
};

export type ProgramMeta = {
  planId: string;
  startDate: string; // ISO date (YYYY-MM-DD)
  week: number; // 1-based
  phase: ProgramPhase;
  phaseWeek: number; // 1-based week within phase
  day: ExtendedDayRotation; // A/B/C rotation day (D/E used by Chacha Training)
};

export type ExerciseMedia = {
  type: "svg" | "image" | "video";
  svg?: string;
  src?: string;
  videoUrl?: string; // YouTube video URL or ID
  youtubeSearchTerm?: string; // Search term for YouTube
  alt: string;
};

export type ExercisePrescription = {
  sets?: number;
  reps?: number;
  holdSeconds?: number;
  minutes?: number;
  description?: string;
};

export type Exercise = {
  id: string;
  name: string;
  description: string;
  phase: Phase;
  media: ExerciseMedia;
  prescription: ExercisePrescription;
  instructions: string[];
  commonMistakes: string[];
  stopConditions: string[];
  category: string;
};

export type ExerciseBlock = {
  id: string;
  name: string;
  description?: string;
  estimatedMinutes: number;
  exercises: Exercise[];
};

export type WorkoutDay = {
  id: string;
  date: string; // ISO date string
  blocks: ExerciseBlock[];
  program?: ProgramMeta;
};

export type ExerciseCompletion = {
  exerciseId: string;
  date: string; // ISO date string
  completed: boolean;
  notes?: string;
  completedAt?: string; // ISO timestamp
  // Gym tracking fields
  weight?: number; // Weight in lbs
  reps?: number; // Actual reps completed
  sets?: number; // Actual sets completed
};

export type BlockTimerState = {
  blockId: string;
  date: string;
  elapsedSeconds: number;
  isRunning: boolean;
  lastUpdated: string; // ISO timestamp
};

export type ViewMode = "focus" | "checklist" | "coach";

