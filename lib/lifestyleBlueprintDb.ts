// Lifestyle Blueprint Database Functions
// Add to lib/db.ts or use as standalone functions
import { supabase } from './supabase';
import {
  DailyHabit,
  DailyHabitCompletion,
  UserMealPreferences,
  LifestyleBlueprint,
  WeeklyMealPlan,
  HabitStats,
} from './lifestyleBlueprintTypes';

// ============================================
// HELPER: Get Current User ID
// ============================================

async function getUserId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

// ============================================
// DAILY HABITS - CRUD
// ============================================

export async function createDailyHabit(habit: Omit<DailyHabit, 'id' | 'user_id' | 'created_at'>): Promise<DailyHabit | null> {
  const userId = await getUserId();
  if (!userId) return null;

  const id = `${userId}-${habit.habit_name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;

  const { data, error } = await supabase
    .from('daily_habits')
    .insert([
      {
        id,
        user_id: userId,
        ...habit,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating habit:', error);
    return null;
  }

  return data;
}

export async function getDailyHabits(): Promise<DailyHabit[]> {
  const userId = await getUserId();
  if (!userId) return [];

  const { data, error } = await supabase
    .from('daily_habits')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('target_time', { ascending: true });

  if (error) {
    console.error('Error fetching habits:', error);
    return [];
  }

  return data || [];
}

export async function updateDailyHabit(habitId: string, updates: Partial<DailyHabit>): Promise<boolean> {
  const userId = await getUserId();
  if (!userId) return false;

  const { error } = await supabase
    .from('daily_habits')
    .update(updates)
    .eq('id', habitId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error updating habit:', error);
    return false;
  }

  return true;
}

export async function deactivateDailyHabit(habitId: string): Promise<boolean> {
  return updateDailyHabit(habitId, { is_active: false });
}

// ============================================
// DAILY HABIT COMPLETIONS - Track Daily Progress
// ============================================

export async function markHabitComplete(habitId: string, date: string, completed: boolean, notes?: string): Promise<boolean> {
  const userId = await getUserId();
  if (!userId) return false;

  const id = `${userId}-${habitId}-${date}`;

  const { error } = await supabase
    .from('daily_habit_completions')
    .upsert({
      id,
      user_id: userId,
      habit_id: habitId,
      date,
      completed,
      completed_at: completed ? new Date().toISOString() : null,
      notes,
    });

  if (error) {
    console.error('Error marking habit complete:', error);
    return false;
  }

  return true;
}

export async function getHabitCompletionsForDate(date: string): Promise<DailyHabitCompletion[]> {
  const userId = await getUserId();
  if (!userId) return [];

  const { data, error } = await supabase
    .from('daily_habit_completions')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date);

  if (error) {
    console.error('Error fetching completions:', error);
    return [];
  }

  return data || [];
}

export async function getHabitCompletionStats(startDate: string, endDate: string): Promise<HabitStats> {
  const userId = await getUserId();
  if (!userId) {
    return {
      totalHabits: 0,
      completedToday: 0,
      completionPercentage: 0,
      completionByCategory: {},
      weeklyTrend: [],
    };
  }

  const habits = await getDailyHabits();
  const completions = await supabase
    .from('daily_habit_completions')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate);

  if (completions.error) {
    console.error('Error fetching completion stats:', completions.error);
    return {
      totalHabits: habits.length,
      completedToday: 0,
      completionPercentage: 0,
      completionByCategory: {},
      weeklyTrend: [],
    };
  }

  const completionData = completions.data || [];
  const today = new Date().toISOString().split('T')[0];
  const completedToday = completionData.filter(c => c.date === today && c.completed).length;

  // Build completion by category
  const completionByCategory: Record<string, { completed: number; total: number }> = {};
  habits.forEach(h => {
    if (!completionByCategory[h.category]) {
      completionByCategory[h.category] = { completed: 0, total: 0 };
    }
    completionByCategory[h.category].total += 1;
  });

  completionData.forEach(c => {
    const habit = habits.find(h => h.id === c.habit_id);
    if (habit && c.completed) {
      completionByCategory[habit.category].completed += 1;
    }
  });

  // Calculate overall percentage
  const totalPossible = habits.length * 7; // Assuming 7 days
  const totalCompleted = completionData.filter(c => c.completed).length;
  const completionPercentage = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

  // Weekly trend (simplified)
  const weeklyTrend = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayCompletions = completionData.filter(c => c.date === dateStr && c.completed).length;
    const dayPercentage = habits.length > 0 ? Math.round((dayCompletions / habits.length) * 100) : 0;
    weeklyTrend.unshift({ date: dateStr, percentage: dayPercentage });
  }

  return {
    totalHabits: habits.length,
    completedToday,
    completionPercentage,
    completionByCategory,
    weeklyTrend,
  };
}

// ============================================
// USER MEAL PREFERENCES
// ============================================

export async function getUserMealPreferences(): Promise<UserMealPreferences | null> {
  const userId = await getUserId();
  if (!userId) return null;

  const { data, error } = await supabase
    .from('user_meal_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching meal preferences:', error);
    return null;
  }

  return data;
}

export async function saveUserMealPreferences(preferences: Partial<UserMealPreferences>): Promise<boolean> {
  const userId = await getUserId();
  if (!userId) return false;

  const id = `${userId}-preferences`;

  const { error } = await supabase
    .from('user_meal_preferences')
    .upsert({
      id,
      user_id: userId,
      ...preferences,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Error saving meal preferences:', error);
    return false;
  }

  return true;
}

// ============================================
// WEEKLY MEAL PLANS
// ============================================

export async function getWeeklyMealPlan(weekStartDate: string): Promise<WeeklyMealPlan | null> {
  const userId = await getUserId();
  if (!userId) return null;

  const { data, error } = await supabase
    .from('weekly_meal_plans')
    .select('*')
    .eq('user_id', userId)
    .eq('week_start_date', weekStartDate)
    .single();

  if (error) {
    console.error('Error fetching weekly meal plan:', error);
    return null;
  }

  return data;
}

export async function saveWeeklyMealPlan(weekStartDate: string, meals: any): Promise<boolean> {
  const userId = await getUserId();
  if (!userId) return false;

  const id = `${userId}-${weekStartDate}`;

  const { error } = await supabase
    .from('weekly_meal_plans')
    .upsert({
      id,
      user_id: userId,
      week_start_date: weekStartDate,
      meals,
    });

  if (error) {
    console.error('Error saving weekly meal plan:', error);
    return false;
  }

  return true;
}

// ============================================
// LIFESTYLE BLUEPRINT
// ============================================

export async function getLifestyleBlueprint(): Promise<LifestyleBlueprint | null> {
  const userId = await getUserId();
  if (!userId) return null;

  const { data, error } = await supabase
    .from('lifestyle_blueprint')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching blueprint:', error);
    return null;
  }

  return data;
}

export async function initializeLifestyleBlueprint(blueprintData: Partial<LifestyleBlueprint>): Promise<boolean> {
  const userId = await getUserId();
  if (!userId) return false;

  const id = `${userId}-blueprint`;

  const { error } = await supabase
    .from('lifestyle_blueprint')
    .upsert({
      id,
      user_id: userId,
      blueprint_name: blueprintData.blueprint_name || 'My Lifestyle Blueprint',
      blueprint_content: blueprintData.blueprint_content || {},
      sleep_bedtime: blueprintData.sleep_bedtime || '10:00 PM',
      sleep_wake_time: blueprintData.sleep_wake_time || '6:00 AM',
      meditation_time: blueprintData.meditation_time || 0,
      water_goal_liters: blueprintData.water_goal_liters || 3,
    });

  if (error) {
    console.error('Error initializing blueprint:', error);
    return false;
  }

  return true;
}

export async function updateLifestyleBlueprint(updates: Partial<LifestyleBlueprint>): Promise<boolean> {
  const userId = await getUserId();
  if (!userId) return false;

  const id = `${userId}-blueprint`;

  const { error } = await supabase
    .from('lifestyle_blueprint')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating blueprint:', error);
    return false;
  }

  return true;
}

// ============================================
// INITIALIZE USER SETUP (First Time)
// ============================================

export async function initializeLifestyleBlueprintForUser(habits: any[], blueprintData: any): Promise<boolean> {
  const userId = await getUserId();
  if (!userId) return false;

  try {
    // 1. Initialize blueprint
    const blueprintSuccess = await initializeLifestyleBlueprint(blueprintData);
    if (!blueprintSuccess) return false;

    // 2. Create default habits
    for (const habit of habits) {
      await createDailyHabit(habit);
    }

    // 3. Initialize meal preferences
    await saveUserMealPreferences({
      liked_recipes: [],
      excluded_recipes: [],
      dietary_restrictions: [],
    });

    return true;
  } catch (error) {
    console.error('Error initializing lifestyle blueprint for user:', error);
    return false;
  }
}
