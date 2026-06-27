# Lifestyle Blueprint Integration Guide

## Overview
This guide explains how to integrate the new Lifestyle Blueprint features (Meal Plan, Daily Habits, Full Blueprint) into your existing health app WITHOUT disrupting current functionality.

**Last updated:** 2026-06-27

---

## File Organization

### New Files in `lib/`
```
lib/
├── lifestyleBlueprintTypes.ts      (Type definitions)
├── lifestyleBlueprintDb.ts         (Database functions)
├── mealPlanData.ts                 (Recipe data & seed data)
└── defaultDailyHabits.ts           (Default habits template)
```

### New Components in `components/`
```
components/
├── DailyHabitsTab.tsx              (Daily habits tracker)
├── MealPlanTab.tsx                 (Meal planning interface)
└── FullBlueprintView.tsx           (Complete blueprint reference)
```

---

## Step-by-Step Integration

### 1. **Copy Type Definitions**
Copy `lifestyleBlueprintTypes.ts` to your `lib/` folder.

### 2. **Copy Recipe Data**
Copy `mealPlanData.ts` to your `lib/` folder.

### 3. **Copy Default Habits**
Copy `defaultDailyHabits.ts` to your `lib/` folder.

### 4. **Copy Database Functions**
Copy `lifestyleBlueprintDb.ts` to your `lib/` folder.
- These functions are independent and don't touch existing `db.ts`
- They communicate directly with Supabase via the `supabase` client

### 5. **Create Supabase Tables**
Run the SQL from `SUPABASE_LIFESTYLE_BLUEPRINT.sql` in your Supabase dashboard:
1. Go to Supabase → SQL Editor
2. Create new query
3. Paste the entire SQL file
4. Execute

This creates 6 new tables (completely separate from existing tables):
- `meal_recipes`
- `daily_habits`
- `daily_habit_completions`
- `user_meal_preferences`
- `lifestyle_blueprint`
- `weekly_meal_plans`

### 6. **Copy Components**
Copy these to your `components/` folder:
- `DailyHabitsTab.tsx`
- `MealPlanTab.tsx`
- `FullBlueprintView.tsx`

### 7. **Update Main Page Navigation**

Find your main `app/page.tsx` or layout component and add tabs for the new features.

**Example structure:**

```tsx
'use client';
import { useState } from 'react';
import WorkoutsTab from '@/components/WorkoutsTab';        // Existing
import DailyHabitsTab from '@/components/DailyHabitsTab';  // NEW
import MealPlanTab from '@/components/MealPlanTab';        // NEW
import FullBlueprintView from '@/components/FullBlueprintView'; // NEW

const TAB_OPTIONS = ['Workouts', 'Daily Habits', 'Meal Plan', 'Full Plan'];

export default function Home() {
  const [activeTab, setActiveTab] = useState('Workouts');

  return (
    <div>
      {/* Navigation Tabs */}
      <div className="flex border-b">
        {TAB_OPTIONS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'Workouts' && <WorkoutsTab />}
        {activeTab === 'Daily Habits' && <DailyHabitsTab />}
        {activeTab === 'Meal Plan' && <MealPlanTab />}
        {activeTab === 'Full Plan' && <FullBlueprintView />}
      </div>
    </div>
  );
}
```

---

## Database Setup Checklist

- [ ] Create all 6 Supabase tables from SQL
- [ ] Enable RLS policies on all tables
- [ ] Verify RLS policies are working (users only see their own data)

**Test:** Try creating a habit in the app and verify it appears in Supabase.

---

## What Was NOT Changed

✅ Existing `lib/db.ts` functions remain untouched
✅ Existing program selection (ADHD, Gym, Chacha, Custom) untouched
✅ Existing workout tracking functionality untouched
✅ Existing progress tracking untouched
✅ All existing components still work

**These new features are completely additive and non-disruptive.**

---

## Support

If you run into issues:
1. Check the browser console for errors
2. Verify Supabase tables were created correctly
3. Test database functions in isolation
4. Check that environment variables are set
5. Review this INTEGRATION_GUIDE for step-by-step instructions

Good luck! 🚀