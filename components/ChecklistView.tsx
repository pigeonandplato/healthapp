"use client";

import { useState, useEffect, useCallback } from "react";
import { WorkoutDay, Exercise } from "@/lib/types";
import { getCompletionsByDate, saveCompletion } from "@/lib/db";
import { triggerCompletion } from "@/utils/haptics";
import { WorkoutSkeleton } from "./SkeletonLoader";

interface ChecklistViewProps {
  workout: WorkoutDay;
  onProgressChange?: (completed: number, total: number) => void;
  onOpenDetailView?: () => void;
}

function ExerciseDetailPreview({ exercise }: { exercise: Exercise }) {
  return (
    <div className="mt-3 pl-9 space-y-2 text-xs text-gray-600 dark:text-gray-400">
      {exercise.description && (
        <p className="text-sm text-gray-700 dark:text-gray-300">{exercise.description}</p>
      )}
      {exercise.instructions.length > 0 && (
        <div>
          <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">How to do it</p>
          <ul className="list-disc pl-4 space-y-1">
            {exercise.instructions.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>
        </div>
      )}
      {exercise.commonMistakes.length > 0 && (
        <div>
          <p className="font-semibold text-amber-800 dark:text-amber-200 mb-1">Watch out for</p>
          <ul className="list-disc pl-4 space-y-1">
            {exercise.commonMistakes.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      )}
      {exercise.stopConditions.length > 0 && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-2">
          <p className="font-semibold text-red-800 dark:text-red-200 mb-1">Stop if</p>
          <ul className="list-disc pl-4 space-y-1 text-red-700 dark:text-red-300">
            {exercise.stopConditions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function ChecklistView({ workout, onProgressChange, onOpenDetailView }: ChecklistViewProps) {
  const [completions, setCompletions] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const trackableExercises = workout.blocks
    .flatMap((b) => b.exercises)
    .filter((ex) => ex.category !== "Guidance");

  useEffect(() => {
    let active = true;
    async function loadCompletions() {
      setLoading(true);
      const allCompletions = await getCompletionsByDate(workout.date);
      if (!active) return;
      const completionMap: Record<string, boolean> = {};
      allCompletions.forEach((completion) => {
        completionMap[completion.exerciseId] = completion.completed;
      });
      setCompletions(completionMap);
      setLoading(false);

      const completed = trackableExercises.filter((ex) => completionMap[ex.id]).length;
      onProgressChange?.(completed, trackableExercises.length);
    }

    loadCompletions();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workout.date]);

  const handleToggle = async (exerciseId: string) => {
    const newCompleted = !completions[exerciseId];
    const next = { ...completions, [exerciseId]: newCompleted };
    setCompletions(next);
    if (newCompleted) triggerCompletion();

    await saveCompletion(exerciseId, workout.date, newCompleted);

    const completed = trackableExercises.filter((ex) => next[ex.id]).length;
    onProgressChange?.(completed, trackableExercises.length);
  };

  const formatPrescription = (exercise: WorkoutDay["blocks"][number]["exercises"][number]) => {
    const p = exercise.prescription;
    if (p.description) return p.description;

    const parts: string[] = [];
    if (p.sets) parts.push(`${p.sets}×`);
    if (p.reps) parts.push(`${p.reps}`);
    if (p.holdSeconds) parts.push(`${p.holdSeconds}s`);
    if (p.minutes) parts.push(`${p.minutes}m`);

    return parts.join(" ");
  };

  const completedCount = trackableExercises.filter((ex) => completions[ex.id]).length;
  const total = trackableExercises.length;
  const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  if (loading) {
    return <WorkoutSkeleton />;
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Progress Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-card border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Progress</h2>
          <span className="text-2xl font-bold text-[#CF9030]">{percentage}%</span>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden mb-2">
          <div
            className="bg-gradient-to-r from-[#EF9D8C] to-[#CF9030] h-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          {completedCount} of {total} exercises completed
        </p>
      </div>

      {/* Blocks */}
      {workout.blocks.map((block) => {
        const trackable = block.exercises.filter((ex) => ex.category !== "Guidance");
        if (trackable.length === 0) return null;
        const blockCompleted = trackable.filter((ex) => completions[ex.id]).length;
        const blockTotal = trackable.length;
        const blockDone = blockCompleted === blockTotal;

        return (
          <div
            key={block.id}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-card border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Block Header */}
            <div className={`px-5 py-3 border-b border-gray-200 dark:border-gray-600 transition-colors ${blockDone ? "bg-green-50 dark:bg-green-900/20" : "bg-gray-50 dark:bg-gray-900/40"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100">{block.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">~{block.estimatedMinutes} min</p>
                </div>
                <span className={`text-sm font-bold ${blockDone ? "text-[#34C759]" : "text-gray-600 dark:text-gray-300"}`}>
                  {blockDone ? "✓ Done" : `${blockCompleted}/${blockTotal}`}
                </span>
              </div>
            </div>

            {/* Exercise List */}
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {trackable.map((exercise) => {
                const isCompleted = completions[exercise.id] || false;
                const isExpanded = expandedId === exercise.id;
                const hasDetails =
                  exercise.description ||
                  exercise.instructions.length > 0 ||
                  exercise.commonMistakes.length > 0 ||
                  exercise.stopConditions.length > 0;

                return (
                  <li
                    key={exercise.id}
                    className="px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <input
                          type="checkbox"
                          checked={isCompleted}
                          onChange={() => handleToggle(exercise.id)}
                          className="w-6 h-6 rounded-lg border-gray-300 dark:border-gray-600 text-[#FF2D55] focus:ring-2 focus:ring-[#FF2D55] focus:ring-offset-0 cursor-pointer"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : exercise.id)}
                          className="w-full text-left"
                          disabled={!hasDetails}
                        >
                          <div className="flex items-start justify-between gap-2">
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
                            {hasDetails && (
                              <svg
                                className={`w-4 h-4 flex-shrink-0 text-gray-400 transition-transform mt-0.5 ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            )}
                          </div>
                        </button>

                        {isExpanded && hasDetails && <ExerciseDetailPreview exercise={exercise} />}

                        {isExpanded && onOpenDetailView && exercise.media.type === "video" && (
                          <button
                            type="button"
                            onClick={onOpenDetailView}
                            className="mt-2 ml-0 text-xs font-semibold text-[#007AFF]"
                          >
                            Open Detail view for video →
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}

      {/* Completion Message */}
      {percentage === 100 && total > 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-5 text-center">
          <p className="text-lg font-bold text-green-800 dark:text-green-200 mb-1">🎉 All done!</p>
          <p className="text-sm text-green-700 dark:text-green-300">
            Great job finishing all {total} exercises today.
          </p>
        </div>
      )}
    </div>
  );
}
