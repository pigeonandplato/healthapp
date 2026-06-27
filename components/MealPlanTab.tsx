'use client';

import React, { useState, useEffect } from 'react';
import {
  BREAKFAST_RECIPE,
  CHICKEN_RECIPES,
  BEEF_RECIPES,
  CARB_SIDES,
  VEGETABLE_SIDES,
  SNACK_RECIPES,
} from '@/lib/mealPlanData';
import { MealRecipe, MealSelection, MealMacros } from '@/lib/lifestyleBlueprintTypes';
import { getWeeklyMealPlan, saveWeeklyMealPlan } from '@/lib/lifestyleBlueprintDb';

export default function MealPlanTab() {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [mealSelection, setMealSelection] = useState<MealSelection>({} as MealSelection);
  const [loading, setLoading] = useState(false);
  const [showRecipeDetails, setShowRecipeDetails] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState('');

  // Get week start date (Monday)
  const getWeekStartDate = (date: string) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff)).toISOString().split('T')[0];
  };

  // Load meal plan for the week
  useEffect(() => {
    const loadMealPlan = async () => {
      setLoading(true);
      try {
        const weekStart = getWeekStartDate(selectedDate);
        const plan = await getWeeklyMealPlan(weekStart);
        if (plan) {
          // Load meal for current date from the plan
          const dayMeals = plan.meals?.[selectedDate];
          if (dayMeals) {
            setMealSelection(dayMeals);
          }
        }
      } catch (error) {
        console.error('Error loading meal plan:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMealPlan();
  }, [selectedDate]);

  // Calculate total macros
  const calculateTotalMacros = (): MealMacros => {
    let total = { protein: 0, carbs: 0, fat: 0, calories: 0 };

    if (mealSelection.breakfast) {
      total.protein += mealSelection.breakfast.macros.protein;
      total.carbs += mealSelection.breakfast.macros.carbs;
      total.fat += mealSelection.breakfast.macros.fat;
      total.calories += mealSelection.breakfast.macros.calories;
    }

    if (mealSelection.lunch?.combinedMacros) {
      const m = mealSelection.lunch.combinedMacros;
      total.protein += m.protein;
      total.carbs += m.carbs;
      total.fat += m.fat;
      total.calories += m.calories;
    }

    if (mealSelection.snack) {
      total.protein += mealSelection.snack.macros.protein;
      total.carbs += mealSelection.snack.macros.carbs;
      total.fat += mealSelection.snack.macros.fat;
      total.calories += mealSelection.snack.macros.calories;
    }

    if (mealSelection.dinner?.combinedMacros) {
      const m = mealSelection.dinner.combinedMacros;
      total.protein += m.protein;
      total.carbs += m.carbs;
      total.fat += m.fat;
      total.calories += m.calories;
    }

    return total;
  };

  const handleRecipeSelect = (meal: 'lunch' | 'dinner', part: 'protein' | 'carb' | 'vegetable', recipe: MealRecipe) => {
    setMealSelection(prev => {
      const current = prev[meal] || { protein: null, carb: null, vegetable: null };
      const updated = { ...current, [part]: recipe };

      // Calculate combined macros
      if (updated.protein && updated.carb && updated.vegetable) {
        const combined = {
          protein: updated.protein.macros.protein + updated.carb.macros.protein + updated.vegetable.macros.protein,
          carbs: updated.protein.macros.carbs + updated.carb.macros.carbs + updated.vegetable.macros.carbs,
          fat: updated.protein.macros.fat + updated.carb.macros.fat + updated.vegetable.macros.fat,
          calories: updated.protein.macros.calories + updated.carb.macros.calories + updated.vegetable.macros.calories,
        };
        return { ...prev, [meal]: { ...updated, combinedMacros: combined } };
      }

      return { ...prev, [meal]: updated };
    });
  };

  const handleSaveMealPlan = async () => {
    try {
      const weekStart = getWeekStartDate(selectedDate);
      const plan = await getWeeklyMealPlan(weekStart);

      const meals = plan?.meals || {};
      meals[selectedDate] = mealSelection;

      await saveWeeklyMealPlan(weekStart, meals);
      setSavedMessage('Meal plan saved!');
      setTimeout(() => setSavedMessage(''), 3000);
    } catch (error) {
      console.error('Error saving meal plan:', error);
    }
  };

  const totalMacros = calculateTotalMacros();

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading meal plan...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Meal Plan</h2>
        <p className="text-gray-600">Plan your meals for the day</p>
      </div>

      {/* Date Picker */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </div>

      {/* Daily Total Macros */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600 mb-3">Daily Macros (Target: 160-180g protein, 160-200g carbs, 60-75g fat)</p>
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{Math.round(totalMacros.protein)}g</p>
            <p className="text-xs text-gray-600">Protein</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{Math.round(totalMacros.carbs)}g</p>
            <p className="text-xs text-gray-600">Carbs</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{Math.round(totalMacros.fat)}g</p>
            <p className="text-xs text-gray-600">Fat</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{Math.round(totalMacros.calories)}</p>
            <p className="text-xs text-gray-600">Calories</p>
          </div>
        </div>
      </div>

      {/* Breakfast (Fixed) */}
      <div className="border rounded-lg p-4 bg-blue-50">
        <h3 className="font-semibold text-lg mb-3">🌅 Breakfast (Fixed)</h3>
        <div className="bg-white p-3 rounded border border-gray-200">
          <p className="font-medium">{BREAKFAST_RECIPE.name}</p>
          <p className="text-sm text-gray-600">{BREAKFAST_RECIPE.description}</p>
          <p className="text-xs text-gray-500 mt-2">
            {BREAKFAST_RECIPE.macros.protein}g P • {BREAKFAST_RECIPE.macros.carbs}g C • {BREAKFAST_RECIPE.macros.fat}g F • {BREAKFAST_RECIPE.macros.calories} cal
          </p>
        </div>
      </div>

      {/* Lunch & Dinner - Simplified View */}
      <div className="border rounded-lg p-4 bg-yellow-50 space-y-3">
        <h3 className="font-semibold text-lg">Meals (Lunch & Dinner)</h3>
        <p className="text-sm text-gray-600">Select protein, carb, and vegetable for each meal</p>
      </div>

      {/* Save Button */}
      <div className="flex gap-2">
        <button
          onClick={handleSaveMealPlan}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700"
        >
          Save Meal Plan
        </button>
        {savedMessage && (
          <p className="text-green-600 py-2 font-medium">{savedMessage}</p>
        )}
      </div>
    </div>
  );
}