import type { ProgramType } from "./types";
import { addDays, parseLocalDate, toLocalDateString } from "./dates";

/** Weekdays with scheduled training (0=Sun … 6=Sat). ADHD has content every day. */
export function getTrainingWeekdays(program: ProgramType): number[] {
  if (program === "chacha") return [1, 2, 3, 4, 5];
  if (program === "gym" || program === "custom") return [1, 3, 5];
  return [0, 1, 2, 3, 4, 5, 6];
}

function findTrainingDate(fromIso: string, trainingDows: number[], direction: 1 | -1): string {
  if (trainingDows.length === 7) return addDays(fromIso, direction);

  const d = parseLocalDate(fromIso);
  for (let i = 0; i < 14; i++) {
    d.setDate(d.getDate() + direction);
    if (trainingDows.includes(d.getDay())) return toLocalDateString(d);
  }
  return addDays(fromIso, direction);
}

export function nextTrainingDate(fromIso: string, program: ProgramType): string {
  return findTrainingDate(fromIso, getTrainingWeekdays(program), 1);
}

export function prevTrainingDate(fromIso: string, program: ProgramType): string {
  return findTrainingDate(fromIso, getTrainingWeekdays(program), -1);
}
