-- Lifestyle Blueprint Tables (Non-disruptive, additive only)
-- These tables are independent from existing completions, settings, block_timers

-- 1. MEAL RECIPES TABLE
CREATE TABLE meal_recipes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'chicken', 'beef', 'carb', 'vegetable', 'snack'
  category TEXT, -- 'breakfast', 'lunch', 'dinner', 'snack'
  description TEXT,
  ingredients TEXT[], -- JSON array of ingredients
  instructions TEXT[], -- JSON array of step-by-step instructions
  macros JSONB, -- { protein: number, carbs: number, fat: number, calories: number }
  prep_time_minutes INTEGER,
  difficulty TEXT, -- 'easy', 'medium', 'hard'
  tags TEXT[], -- 'spicy', 'vegetarian', etc
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. DAILY HABITS TABLE
CREATE TABLE daily_habits (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  habit_name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'sleep', 'nutrition', 'exercise', 'hydration', 'supplements', 'general'
  target_time TEXT, -- e.g., "10:00 PM", "6:00 AM", "3:30 PM"
  frequency TEXT NOT NULL, -- 'daily', 'weekly', 'once'
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, habit_name)
);

-- 3. DAILY HABIT COMPLETIONS (Track what was done each day)
CREATE TABLE daily_habit_completions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  habit_id TEXT NOT NULL REFERENCES daily_habits(id) ON DELETE CASCADE,
  date TEXT NOT NULL, -- YYYY-MM-DD format
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, habit_id, date)
);

-- 4. USER MEAL PREFERENCES
CREATE TABLE user_meal_preferences (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  liked_recipes TEXT[], -- array of recipe IDs
  excluded_recipes TEXT[], -- array of recipe IDs user doesn't want
  dietary_restrictions TEXT[], -- 'no_spicy', 'no_dairy', etc
  preferred_carb TEXT, -- default carb choice
  preferred_cooking_time INTEGER, -- max prep time in minutes
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. LIFESTYLE BLUEPRINT (Store custom blueprint data per user)
CREATE TABLE lifestyle_blueprint (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  blueprint_name TEXT DEFAULT 'My Lifestyle Blueprint',
  blueprint_content JSONB, -- Full structured blueprint data
  sleep_bedtime TEXT, -- e.g., "10:00 PM"
  sleep_wake_time TEXT, -- e.g., "6:00 AM"
  meditation_time INT, -- in minutes
  water_goal_liters DECIMAL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 6. WEEKLY MEAL PLANS (Optional: pre-planned meals for the week)
CREATE TABLE weekly_meal_plans (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start_date TEXT NOT NULL, -- YYYY-MM-DD
  day_of_week TEXT NOT NULL, -- 'Monday', 'Tuesday', etc
  breakfast_recipe_id TEXT,
  lunch_recipe_id TEXT,
  lunch_carb TEXT,
  lunch_vegetable TEXT,
  dinner_recipe_id TEXT,
  dinner_carb TEXT,
  dinner_vegetable TEXT,
  snack_recipe_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, week_start_date, day_of_week)
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) - Users only see their own data
-- ============================================

-- Enable RLS on all tables
ALTER TABLE daily_habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_meal_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE lifestyle_blueprint ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_recipes ENABLE ROW LEVEL SECURITY;

-- MEAL RECIPES: Anyone can read (shared recipes), but only admins can write
CREATE POLICY "Anyone can read recipes" ON meal_recipes FOR SELECT USING (true);
CREATE POLICY "Only authenticated users can insert recipes" ON meal_recipes FOR INSERT WITH CHECK (true);

-- DAILY HABITS: Users only see/edit their own
CREATE POLICY "Users can read own habits" ON daily_habits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own habits" ON daily_habits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own habits" ON daily_habits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own habits" ON daily_habits FOR DELETE USING (auth.uid() = user_id);

-- DAILY HABIT COMPLETIONS: Users only see/edit their own
CREATE POLICY "Users can read own habit completions" ON daily_habit_completions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own habit completions" ON daily_habit_completions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own habit completions" ON daily_habit_completions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own habit completions" ON daily_habit_completions FOR DELETE USING (auth.uid() = user_id);

-- USER MEAL PREFERENCES: Users only see/edit their own
CREATE POLICY "Users can read own preferences" ON user_meal_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own preferences" ON user_meal_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON user_meal_preferences FOR UPDATE USING (auth.uid() = user_id);

-- LIFESTYLE BLUEPRINT: Users only see/edit their own
CREATE POLICY "Users can read own blueprint" ON lifestyle_blueprint FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own blueprint" ON lifestyle_blueprint FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own blueprint" ON lifestyle_blueprint FOR UPDATE USING (auth.uid() = user_id);

-- WEEKLY MEAL PLANS: Users only see/edit their own
CREATE POLICY "Users can read own meal plans" ON weekly_meal_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own meal plans" ON weekly_meal_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own meal plans" ON weekly_meal_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own meal plans" ON weekly_meal_plans FOR DELETE USING (auth.uid() = user_id);
