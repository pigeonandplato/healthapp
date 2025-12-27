"use client";

import { useState, useEffect } from "react";
import { WorkoutDay, ExerciseCompletion } from "@/lib/types";
import { getCompletionsByDate } from "@/lib/db";
import ExerciseCard from "./ExerciseCard";
import BlockTimer from "./BlockTimer";

interface CoachViewProps {
  workout: WorkoutDay;
}

export default function CoachView({ workout }: CoachViewProps) {
  const [completions, setCompletions] = useState<Record<string, ExerciseCompletion>>({});
  const [loading, setLoading] = useState(true);

  // Load all completions for this workout
  useEffect(() => {
    async function loadCompletions() {
      setLoading(true);
      const allCompletions = await getCompletionsByDate(workout.date);
      const completionMap: Record<string, ExerciseCompletion> = {};
      
      allCompletions.forEach((completion) => {
        completionMap[completion.exerciseId] = completion;
      });
      
      setCompletions(completionMap);
      setLoading(false);
    }

    loadCompletions();
  }, [workout.date]);

  const handleCompletionChange = (exerciseId: string, completed: boolean) => {
    setCompletions((prev) => ({
      ...prev,
      [exerciseId]: {
        exerciseId,
        date: workout.date,
        completed,
        completedAt: completed ? new Date().toISOString() : undefined,
      },
    }));
  };

  const calculateProgress = (blockExerciseIds: string[]) => {
    const completed = blockExerciseIds.filter(
      (id) => completions[id]?.completed
    ).length;
    return {
      completed,
      total: blockExerciseIds.length,
      percentage: blockExerciseIds.length > 0 
        ? Math.round((completed / blockExerciseIds.length) * 100)
        : 0,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Workout Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Today's Workout</h2>
        <p className="text-blue-100">
          {workout.blocks.length} blocks • ~
          {workout.blocks.reduce((sum, b) => sum + b.estimatedMinutes, 0)} minutes total
        </p>
      </div>

      {/* Program Rules (Quick) */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Program Rules (Quick)</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          These are not tracked—just follow them.
        </p>
        <div className="space-y-3">
          {workout.blocks
            .flatMap((b) => b.exercises)
            .filter((ex) => ex.category === "Guidance")
            .map((ex) => (
              <div key={ex.id} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="font-semibold text-gray-900 dark:text-gray-100">{ex.name}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{ex.description}</div>
                <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 mt-2 space-y-1">
                  {ex.instructions.slice(0, 4).map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      </div>

      {/* Blocks */}
      {workout.blocks.map((block) => {
        const trackable = block.exercises.filter((e) => e.category !== "Guidance");
        if (trackable.length === 0) return null;
        const exerciseIds = trackable.map((e) => e.id);
        const progress = calculateProgress(exerciseIds);

        return (
          <div
            key={block.id}
            className="bg-gray-50 dark:bg-gray-900 rounded-lg p-5 space-y-4"
          >
            {/* Block Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {block.name}
                  </h3>
                  {block.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {block.description}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    Estimated time: ~{block.estimatedMinutes} minutes
                  </p>
                </div>

                {/* Progress Badge */}
                <div className="flex-shrink-0 text-right">
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      progress.percentage === 100
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    }`}
                  >
                    {progress.completed}/{progress.total} done
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {progress.percentage}%
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full transition-all duration-500 ease-out"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>

              {/* Block Timer */}
              <div className="mt-4">
                <BlockTimer blockId={block.id} date={workout.date} />
              </div>
            </div>

            {/* Exercises */}
            <div className="space-y-5">
              {block.exercises
                .filter((exercise) => exercise.category !== "Guidance")
                .map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  date={workout.date}
                  completion={completions[exercise.id]}
                  onCompletionChange={handleCompletionChange}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Completion Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
          Workout Summary
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Exercises</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {workout.blocks
                .flatMap((b) => b.exercises)
                .filter((e) => e.category !== "Guidance").length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {Object.values(completions).filter((c) => c.completed).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

