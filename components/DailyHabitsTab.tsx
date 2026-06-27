'use client';

import React, { useEffect, useState } from 'react';
import {
  getDailyHabits,
  getHabitCompletionsForDate,
  markHabitComplete,
  getHabitCompletionStats,
} from '@/lib/lifestyleBlueprintDb';
import { DailyHabit, DailyHabitCompletion, HabitStats, HabitCategory } from '@/lib/lifestyleBlueprintTypes';

export default function DailyHabitsTab() {
  const [habits, setHabits] = useState<DailyHabit[]>([]);
  const [completions, setCompletions] = useState<Map<string, DailyHabitCompletion>>(new Map());
  const [stats, setStats] = useState<HabitStats | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory | 'all'>('all');

  // Fetch habits and completions
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get all habits
        const habitsData = await getDailyHabits();
        setHabits(habitsData);

        // Get completions for selected date
        const completionsData = await getHabitCompletionsForDate(selectedDate);
        const completionMap = new Map(completionsData.map(c => [c.habit_id, c]));
        setCompletions(completionMap);

        // Get stats for the past week
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const statsData = await getHabitCompletionStats(
          sevenDaysAgo.toISOString().split('T')[0],
          selectedDate
        );
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching habits data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  // Handle habit completion toggle
  const handleHabitToggle = async (habitId: string) => {
    const completion = completions.get(habitId);
    const isCompleted = completion?.completed ?? false;
    const success = await markHabitComplete(habitId, selectedDate, !isCompleted);

    if (success) {
      const newCompletion = { ...completion, completed: !isCompleted } as DailyHabitCompletion;
      const newCompletions = new Map(completions);
      newCompletions.set(habitId, newCompletion);
      setCompletions(newCompletions);
    }
  };

  // Filter habits by category
  const filteredHabits = selectedCategory === 'all'
    ? habits
    : habits.filter(h => h.category === selectedCategory);

  // Get unique categories
  const categories: HabitCategory[] = ['sleep', 'nutrition', 'exercise', 'hydration', 'supplements', 'general'];

  // Calculate completion percentage for today
  const completedToday = Array.from(completions.values()).filter(c => c.completed).length;
  const completionPercentageToday = habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0;

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Loading habits...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Daily Habits</h2>
        <p className="text-gray-600">Track your daily habits and build consistency</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Today\'s Progress</p>
            <p className="text-2xl font-bold text-blue-600">{completionPercentageToday}%</p>
            <p className="text-xs text-gray-500">{completedToday} of {habits.length} habits</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Weekly Average</p>
            <p className="text-2xl font-bold text-green-600">{stats.completionPercentage}%</p>
            <p className="text-xs text-gray-500">Last 7 days</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Habits</p>
            <p className="text-2xl font-bold text-purple-600">{stats.totalHabits}</p>
            <p className="text-xs text-gray-500">All categories</p>
          </div>
        </div>
      )}

      {/* Date Picker */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">View date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors capitalize ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Habits List */}
      <div className="space-y-2">
        {filteredHabits.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No habits in this category</p>
        ) : (
          filteredHabits.map(habit => {
            const completion = completions.get(habit.id);
            const isCompleted = completion?.completed ?? false;

            return (
              <div
                key={habit.id}
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={() => handleHabitToggle(habit.id)}
                  className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                />

                {/* Habit Info */}
                <div className="flex-1">
                  <p className={`font-medium ${isCompleted ? 'line-through text-gray-400' : ''}`}>
                    {habit.habit_name}
                  </p>
                  {habit.target_time && (
                    <p className="text-sm text-gray-500">
                      {habit.target_time}
                    </p>
                  )}
                </div>

                {/* Category Badge */}
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 capitalize">
                  {habit.category}
                </span>

                {/* Status Icon */}
                {isCompleted && (
                  <div className="text-green-600 text-xl">✓</div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Weekly Trend */}
      {stats && stats.weeklyTrend.length > 0 && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Trend</h3>
          <div className="grid grid-cols-7 gap-2">
            {stats.weeklyTrend.map((day, idx) => (
              <div key={idx} className="text-center">
                <p className="text-xs text-gray-500 mb-2">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
                <div className="bg-gray-200 rounded-lg p-2 h-16 flex items-end justify-center">
                  <div
                    className="bg-blue-600 rounded w-full"
                    style={{ height: `${day.percentage}%` }}
                  />
                </div>
                <p className="text-xs font-semibold mt-2">{day.percentage}%</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      {stats && Object.keys(stats.completionByCategory).length > 0 && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Completion by Category</h3>
          <div className="space-y-3">
            {Object.entries(stats.completionByCategory).map(([category, data]) => {
              const percentage = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
              return (
                <div key={category}>
                  <div className="flex justify-between mb-1">
                    <p className="text-sm font-medium capitalize">{category}</p>
                    <p className="text-sm text-gray-600">{data.completed}/{data.total}</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}