"use client";

import { useState, useEffect } from "react";
import { WorkoutDay, ExerciseCompletion } from "@/lib/types";
import { getCompletionsByDate, saveCompletion, pushToTomorrow } from "@/lib/db";
import { WorkoutSkeleton } from "./SkeletonLoader";

interface ChecklistViewProps {
  workout: WorkoutDay;
}

export default function ChecklistView({ workout }: ChecklistViewProps) {
  const [completions, setCompletions] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [pushing, setPushing] = useState(false);

  // Load all completions for this workout
  useEffect(() => {
    async function loadCompletions() {
      setLoading(true);
      const allCompletions = await getCompletionsByDate(workout.date);
      const completionMap: Record<string, boolean> = {};
      
      allCompletions.forEach((completion) => {
        completionMap[completion.exerciseId] = completion.completed;
      });
      
      setCompletions(completionMap);
      setLoading(false);
    }

    loadCompletions();
  }, [workout.date]);

  const handleToggle = async (exerciseId: string) => {
    const newCompleted = !completions[exerciseId];
    
    setCompletions((prev) => ({
      ...prev,
      [exerciseId]: newCompleted,
    }));

    await saveCompletion(exerciseId, workout.date, newCompleted);
  };

  const handlePushToTomorrow = async () => {
    const allExerciseIds = workout.blocks.flatMap((block) =>
      block.exercises
        .filter((ex) => ex.category !== "Guidance")
        .map((ex) => ex.id)
    );
    
    const incompleteIds = allExerciseIds.filter(
      (id) => !completions[id]
    );

    if (incompleteIds.length === 0) {
      alert("All exercises are complete! Nothing to push.");
      return;
    }

    const confirmed = confirm(
      `Push ${incompleteIds.length} incomplete exercise${
        incompleteIds.length > 1 ? "s" : ""
      } to tomorrow?`
    );

    if (!confirmed) return;

    setPushing(true);
    try {
      await pushToTomorrow(incompleteIds);
      alert("Successfully pushed incomplete exercises to tomorrow!");
    } catch (error) {
      console.error("Failed to push exercises:", error);
      alert("Failed to push exercises. Please try again.");
    } finally {
      setPushing(false);
    }
  };

  const formatPrescription = (exercise: any) => {
    const p = exercise.prescription;
    if (p.description) return p.description;
    
    const parts: string[] = [];
    if (p.sets) parts.push(`${p.sets}×`);
    if (p.reps) parts.push(`${p.reps}`);
    if (p.holdSeconds) parts.push(`${p.holdSeconds}s`);
    if (p.minutes) parts.push(`${p.minutes}m`);
    
    return parts.join(" ");
  };

  const calculateProgress = () => {
    const allExercises = workout.blocks
      .flatMap((b) => b.exercises)
      .filter((ex) => ex.category !== "Guidance");
    const completed = allExercises.filter((ex) => completions[ex.id]).length;
    return {
      completed,
      total: allExercises.length,
      percentage: allExercises.length > 0 
        ? Math.round((completed / allExercises.length) * 100)
        : 0,
    };
  };

  if (loading) {
    return <WorkoutSkeleton />;
  }

  const progress = calculateProgress();

  return (
    <div className="space-y-6 pb-8">
      {/* Progress Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Progress
          </h2>
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {progress.percentage}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden mb-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full transition-all duration-500"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {progress.completed} of {progress.total} exercises completed
        </p>
      </div>

      {/* Blocks */}
      {workout.blocks.map((block) => {
        const trackable = block.exercises.filter((ex) => ex.category !== "Guidance");
        if (trackable.length === 0) return null;
        const blockCompleted = trackable.filter((ex) => completions[ex.id]).length;
        const blockTotal = trackable.length;

        return (
          <div
            key={block.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Block Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-750 px-5 py-3 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100">
                    {block.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    ~{block.estimatedMinutes} min
                  </p>
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {blockCompleted}/{blockTotal}
                </span>
              </div>
            </div>

            {/* Exercise List */}
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {block.exercises
                .filter((exercise) => exercise.category !== "Guidance")
                .map((exercise) => {
                const isCompleted = completions[exercise.id] || false;

                return (
                  <li
                    key={exercise.id}
                    className="px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                  >
                    <label className="flex items-start gap-3 cursor-pointer">
                      {/* Checkbox */}
                      <div className="flex-shrink-0 mt-0.5">
                        <input
                          type="checkbox"
                          checked={isCompleted}
                          onChange={() => handleToggle(exercise.id)}
                          className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                        />
                      </div>

                      {/* Exercise Info */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-medium text-sm ${
                            isCompleted
                              ? "line-through text-gray-400 dark:text-gray-500"
                              : "text-gray-900 dark:text-gray-100"
                          }`}
                        >
                          {exercise.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {formatPrescription(exercise)}
                        </p>
                      </div>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}

      {/* Push to Tomorrow Button */}
      {progress.completed < progress.total && (
        <button
          onClick={handlePushToTomorrow}
          disabled={pushing}
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
        >
          {pushing ? "Pushing..." : "Push Incomplete to Tomorrow →"}
        </button>
      )}

      {/* Completion Message */}
      {progress.percentage === 100 && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-5 text-center">
          <p className="text-lg font-bold text-green-800 dark:text-green-200 mb-1">
            🎉 Workout Complete!
          </p>
          <p className="text-sm text-green-700 dark:text-green-300">
            Great job finishing all {progress.total} exercises today.
          </p>
        </div>
      )}
    </div>
  );
}



