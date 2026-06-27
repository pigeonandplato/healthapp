// Default Daily Habits from Gilly's Lifestyle Blueprint
import { DailyHabit } from './lifestyleBlueprintTypes';

export const DEFAULT_DAILY_HABITS: Omit<DailyHabit, 'id' | 'user_id' | 'created_at'>[] = [
  // ============================================
  // SLEEP HABITS
  // ============================================
  {
    habit_name: 'Phone in other room',
    category: 'sleep',
    target_time: '9:45 PM',
    frequency: 'daily',
    is_active: true,
  },
  {
    habit_name: 'Lights out, bed',
    category: 'sleep',
    target_time: '10:00 PM',
    frequency: 'daily',
    is_active: true,
  },
  {
    habit_name: 'Wake up',
    category: 'sleep',
    target_time: '6:00 AM',
    frequency: 'daily',
    is_active: true,
  },

  // ============================================
  // NUTRITION HABITS
  // ============================================
  {
    habit_name: 'Breakfast: Cappuccino + Croissant + Eggs + Apple',
    category: 'nutrition',
    target_time: '6:00 AM',
    frequency: 'daily',
    is_active: true,
  },
  {
    habit_name: 'Vyvanse with breakfast',
    category: 'supplements',
    target_time: '6:00 AM',
    frequency: 'daily',
    is_active: true,
  },
  {
    habit_name: 'Lunch: Protein + Carb + Vegetable',
    category: 'nutrition',
    target_time: '12:30 PM',
    frequency: 'daily',
    is_active: true,
  },
  {
    habit_name: 'Afternoon Snack',
    category: 'nutrition',
    target_time: '3:00 PM',
    frequency: 'daily',
    is_active: true,
  },
  {
    habit_name: 'Dinner: Protein + Carb + Vegetable',
    category: 'nutrition',
    target_time: '6:30 PM',
    frequency: 'daily',
    is_active: true,
  },

  // ============================================
  // EXERCISE HABITS
  // ============================================
  {
    habit_name: 'Gym workout',
    category: 'exercise',
    target_time: '7:30 AM',
    frequency: 'daily',
    is_active: true,
  },
  {
    habit_name: 'Dog walk (15 min)',
    category: 'exercise',
    target_time: '8:30 AM',
    frequency: 'daily',
    is_active: true,
  },
  {
    habit_name: 'Movement break (9:30 AM)',
    category: 'exercise',
    target_time: '9:30 AM',
    frequency: 'daily',
    is_active: true,
  },
  {
    habit_name: 'Movement break (10:30 AM)',
    category: 'exercise',
    target_time: '10:30 AM',
    frequency: 'daily',
    is_active: true,
  },
  {
    habit_name: 'Movement break (1:30 PM)',
    category: 'exercise',
    target_time: '1:30 PM',
    frequency: 'daily',
    is_active: true,
  },
  {
    habit_name: 'Movement break (3:30 PM)',
    category: 'exercise',
    target_time: '3:30 PM',
    frequency: 'daily',
    is_active: true,
  },
  {
    habit_name: 'Movement break (4:30 PM)',
    category: 'exercise',
    target_time: '4:30 PM',
    frequency: 'daily',
    is_active: true,
  },

  // ============================================
  // HYDRATION HABITS
  // ============================================
  {
    habit_name: 'Drink 1L water by 12 PM',
    category: 'hydration',
    target_time: '12:00 PM',
    frequency: 'daily',
    is_active: true,
  },
  {
    habit_name: 'Drink 1L water by 5 PM',
    category: 'hydration',
    target_time: '5:00 PM',
    frequency: 'daily',
    is_active: true,
  },
  {
    habit_name: 'Drink 1L water by 9 PM',
    category: 'hydration',
    target_time: '9:00 PM',
    frequency: 'daily',
    is_active: true,
  },

  // ============================================
  // GENERAL HABITS
  // ============================================
  {
    habit_name: 'Sunlight exposure (open blinds)',
    category: 'general',
    target_time: '6:00 AM',
    frequency: 'daily',
    is_active: true,
  },
  {
    habit_name: 'Shower',
    category: 'general',
    target_time: '9:00 AM',
    frequency: 'daily',
    is_active: true,
  },
  {
    habit_name: 'Work starts',
    category: 'general',
    target_time: '9:00 AM',
    frequency: 'daily',
    is_active: true,
  },
  {
    habit_name: 'Family time',
    category: 'general',
    target_time: '7:00 PM',
    frequency: 'daily',
    is_active: true,
  },
  {
    habit_name: 'Wind-down (read, stretch, no screens)',
    category: 'general',
    target_time: '8:30 PM',
    frequency: 'daily',
    is_active: true,
  },
];

// Weekly habits (not daily) - no target_time needed
export const DEFAULT_WEEKLY_HABITS: Omit<DailyHabit, 'id' | 'user_id' | 'created_at'>[] = [
  {
    habit_name: 'Grocery shopping',
    category: 'nutrition',
    frequency: 'weekly',
    is_active: true,
  },
  {
    habit_name: 'Meal prep (1 hour)',
    category: 'nutrition',
    frequency: 'weekly',
    is_active: true,
  },
  {
    habit_name: 'Boil 14 eggs for week',
    category: 'nutrition',
    frequency: 'weekly',
    is_active: true,
  },
  {
    habit_name: 'Plan restaurant for eating out',
    category: 'nutrition',
    frequency: 'weekly',
    is_active: true,
  },
  {
    habit_name: 'Weigh yourself',
    category: 'general',
    frequency: 'weekly',
    is_active: true,
  },
  {
    habit_name: 'Check gym sessions completed (5 target)',
    category: 'exercise',
    frequency: 'weekly',
    is_active: true,
  },
];

export const ALL_DEFAULT_HABITS = [...DEFAULT_DAILY_HABITS, ...DEFAULT_WEEKLY_HABITS];
