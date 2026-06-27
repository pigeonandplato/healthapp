// Lifestyle Blueprint Types
// Extends existing app with meal planning, daily habits, and full blueprint features

// ============================================
// MEAL RECIPE TYPES
// ============================================

export interface MealMacros {
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
}

export interface MealRecipe {
  id: string;
  name: string;
  type: 'chicken' | 'beef' | 'carb' | 'vegetable' | 'snack' | 'breakfast';
  category?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  description: string;
  ingredients: string[];
  instructions: string[];
  macros: MealMacros;
  prep_time_minutes: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags?: string[];
}

export interface MealSelection {
  breakfast?: {
    recipe: MealRecipe;
    macros: MealMacros;
  };
  lunch?: {
    protein: MealRecipe;
    carb: MealRecipe;
    vegetable: MealRecipe;
    combinedMacros: MealMacros;
  };
  snack?: {
    recipe: MealRecipe;
    macros: MealMacros;
  };
  dinner?: {
    protein: MealRecipe;
    carb: MealRecipe;
    vegetable: MealRecipe;
    combinedMacros: MealMacros;
  };
  dailyTotalMacros?: MealMacros;
}

export interface UserMealPreferences {
  id: string;
  user_id: string;
  liked_recipes: string[];
  excluded_recipes: string[];
  dietary_restrictions: string[];
  preferred_carb?: string;
  preferred_cooking_time?: number;
  created_at: string;
  updated_at: string;
}

export interface WeeklyMealPlan {
  id: string;
  user_id: string;
  week_start_date: string;
  meals: {
    [day: string]: MealSelection;
  };
  created_at: string;
}

// ============================================
// DAILY HABITS TYPES
// ============================================

export type HabitCategory = 'sleep' | 'nutrition' | 'exercise' | 'hydration' | 'supplements' | 'general';
export type HabitFrequency = 'daily' | 'weekly' | 'once';

export interface DailyHabit {
  id: string;
  user_id: string;
  habit_name: string;
  category: HabitCategory;
  target_time?: string; // e.g., "10:00 PM", "6:00 AM"
  frequency: HabitFrequency;
  is_active: boolean;
  created_at: string;
}

export interface DailyHabitCompletion {
  id: string;
  user_id: string;
  habit_id: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  completed_at?: string;
  notes?: string;
  created_at: string;
}

export interface DailyHabitCompletionRecord {
  habit: DailyHabit;
  completion: DailyHabitCompletion | null;
}

export interface HabitStats {
  totalHabits: number;
  completedToday: number;
  completionPercentage: number;
  completionByCategory: Record<HabitCategory, { completed: number; total: number }>;
  weeklyTrend: { date: string; percentage: number }[];
}

// ============================================
// LIFESTYLE BLUEPRINT TYPES
// ============================================

export interface LifestyleBlueprintSection {
  name: string;
  content: string;
  subsections?: {
    [key: string]: string;
  };
}

export interface LifestyleBlueprint {
  id: string;
  user_id: string;
  blueprint_name: string;
  sleep_bedtime: string; // "10:00 PM"
  sleep_wake_time: string; // "6:00 AM"
  meditation_time: number; // minutes
  water_goal_liters: number;
  sections: {
    sleep: LifestyleBlueprintSection;
    medication: LifestyleBlueprintSection;
    breakfast: LifestyleBlueprintSection;
    lunch: LifestyleBlueprintSection;
    snacks: LifestyleBlueprintSection;
    dinner: LifestyleBlueprintSection;
    movement: LifestyleBlueprintSection;
    hydration: LifestyleBlueprintSection;
    groceries: LifestyleBlueprintSection;
    eatingOut: LifestyleBlueprintSection;
    alcohol: LifestyleBlueprintSection;
    dailyChecklist: LifestyleBlueprintSection;
    weeklyChecklist: LifestyleBlueprintSection;
    schedule: LifestyleBlueprintSection;
    macros: LifestyleBlueprintSection;
    [key: string]: LifestyleBlueprintSection;
  };
  created_at: string;
  updated_at: string;
}

// ============================================
// UI STATE TYPES
// ============================================

export interface MealPlanTabState {
  selectedDate: string;
  selectedMeals: MealSelection;
  showRecipeDetails?: string; // recipe id
  filterCategory?: string;
}

export interface DailyHabitsTabState {
  selectedDate: string;
  habits: DailyHabitCompletionRecord[];
  stats: HabitStats;
  selectedCategory?: HabitCategory;
}

export interface BlueprintViewState {
  selectedSection?: string;
  searchQuery?: string;
  isEditMode: boolean;
}
