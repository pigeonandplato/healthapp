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

// 24-week program phases (6 months)
export type ProgramPhase = "P1" | "P2" | "P3" | "P4" | "P5";

export type ProgramMeta = {
  planId: string;
  startDate: string; // ISO date (YYYY-MM-DD)
  week: number; // 1-based
  phase: ProgramPhase;
  phaseWeek: number; // 1-based week within phase
  day: DayRotation; // A/B/C rotation day
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
};

export type BlockTimerState = {
  blockId: string;
  date: string;
  elapsedSeconds: number;
  isRunning: boolean;
  lastUpdated: string; // ISO timestamp
};

export type ViewMode = "checklist" | "coach";

