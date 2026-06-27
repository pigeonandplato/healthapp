// Lifestyle Blueprint — local persistence (offline-first, no Supabase required).
import { ALL_DEFAULT_HABITS } from "./defaultDailyHabits";
import { DailyHabit, MealSelection } from "./lifestyleBlueprintTypes";

const HABIT_COMPLETIONS_KEY = "blueprint.habitCompletions";
const MEAL_SELECTIONS_KEY = "blueprint.mealSelections";

function habitIdFromName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function getBlueprintHabits(): DailyHabit[] {
  return ALL_DEFAULT_HABITS.map((h) => ({
    ...h,
    id: habitIdFromName(h.habit_name),
    user_id: "local",
    created_at: "",
  }));
}

function readCompletions(): Record<string, Record<string, boolean>> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(HABIT_COMPLETIONS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeCompletions(data: Record<string, Record<string, boolean>>) {
  localStorage.setItem(HABIT_COMPLETIONS_KEY, JSON.stringify(data));
}

export function getHabitCompletionsForDate(date: string): Map<string, boolean> {
  const all = readCompletions();
  const day = all[date] ?? {};
  return new Map(Object.entries(day));
}

export function setHabitComplete(habitId: string, date: string, completed: boolean): void {
  const all = readCompletions();
  if (!all[date]) all[date] = {};
  all[date][habitId] = completed;
  writeCompletions(all);
}

function readMealSelections(): Record<string, MealSelection> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(MEAL_SELECTIONS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeMealSelections(data: Record<string, MealSelection>) {
  localStorage.setItem(MEAL_SELECTIONS_KEY, JSON.stringify(data));
}

export function getMealSelectionForDate(date: string): MealSelection | null {
  return readMealSelections()[date] ?? null;
}

export function saveMealSelectionForDate(date: string, selection: MealSelection): void {
  const all = readMealSelections();
  all[date] = selection;
  writeMealSelections(all);
}
