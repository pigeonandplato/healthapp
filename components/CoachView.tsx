"use client";

import { useState, useEffect } from "react";
import { WorkoutDay, ExerciseCompletion } from "@/lib/types";
import { getCompletionsByDate } from "@/lib/db";
import ExerciseCard from "./ExerciseCard";
import BlockTimer from "./BlockTimer";
import { WorkoutSkeleton } from "./SkeletonLoader";
import Break2RestCard, { workoutHasBreak2 } from "./Break2RestCard";
import { formatLongDate, toLocalDateString } from "@/lib/dates";

interface CoachViewProps {
  workout: WorkoutDay;
  onProgressChange?: (completed: number, total: number) => void;
}

export default function CoachView({ workout, onProgressChange }: CoachViewProps) {
  const [completions, setCompletions] = useState<Record<string, ExerciseCompletion>>({});
  const [loading, setLoading] = useState(true);

  const trackableIds = workout.blocks
    .flatMap((b) => b.exercises)
    .filter((ex) => ex.category !== "Guidance")
    .map((ex) => ex.id);

  // Load all completions for this workout
  useEffect(() => {
    let active = true;
    async function loadCompletions() {
      setLoading(true);
      const allCompletions = await getCompletionsByDate(workout.date);
      if (!active) return;
      const completionMap: Record<string, ExerciseCompletion> = {};

      allCompletions.forEach((completion) => {
        completionMap[completion.exerciseId] = completion;
      });

      setCompletions(completionMap);
      setLoading(false);

      const completed = trackableIds.filter((id) => completionMap[id]?.completed).length;
      onProgressChange?.(completed, trackableIds.length);
    }

    loadCompletions();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workout.date]);

  const handleCompletionChange = (exerciseId: string, completed: boolean) => {
    setCompletions((prev) => {
      const next = {
        ...prev,
        [exerciseId]: {
          exerciseId,
          date: workout.date,
          completed,
          completedAt: completed ? new Date().toISOString() : undefined,
        },
      };
      const done = trackableIds.filter((id) => next[id]?.completed).length;
      onProgressChange?.(done, trackableIds.length);
      return next;
    });
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
    return <WorkoutSkeleton />;
  }

  const hasBreak2 = workoutHasBreak2(workout.blocks);
  const isBreak1Block = (block: { id: string; name: string }) =>
    block.id.includes("break1") || block.name.includes("Break 1");
  const isToday = workout.date === toLocalDateString(new Date());
  const headerTitle = isToday ? "Today's Workout" : formatLongDate(workout.date);

  return (
    <div className="space-y-4 pb-8">
      {/* Workout Header */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl border border-[#EDE8DC] dark:border-[#38383A] px-5 py-4">
        <h2 className="text-xl font-bold text-[#1C1C1E] dark:text-white mb-0.5">{headerTitle}</h2>
        <p className="text-sm text-[#8E8E93]">
          {workout.blocks.filter((b) => b.exercises.some((e) => e.category !== "Guidance")).length} blocks · ~
          {workout.blocks.reduce((sum, b) => sum + b.estimatedMinutes, 0)} min
          {!hasBreak2 && workout.blocks.some((b) => b.name.includes("Break")) && (
            <span className="block text-xs mt-0.5">Break 2 (knee) rests today — Mon / Wed / Fri only</span>
          )}
        </p>
      </div>

      {/* Blocks */}
      {workout.blocks.flatMap((block) => {
        const trackable = block.exercises.filter((e) => e.category !== "Guidance");
        if (trackable.length === 0) return null;
        const exerciseIds = trackable.map((e) => e.id);
        const progress = calculateProgress(exerciseIds);

        return [
          <div
            key={block.id}
            className="bg-white dark:bg-[#1C1C1E] rounded-2xl border border-[#EDE8DC] dark:border-[#38383A] p-5 space-y-4 w-full"
          >
            {/* Block Header */}
            <div className="border-b border-[#EDE8DC] dark:border-[#38383A] pb-4">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-2xl font-bold text-[#1C1C1E] dark:text-white">
                    {block.name}
                  </h3>
                  {block.description && (
                    <p className="text-sm text-[#8E8E93] dark:text-[#8E8E93] mt-1">
                      {block.description}
                    </p>
                  )}
                  <p className="text-sm text-[#8E8E93] dark:text-[#8E8E93] mt-1">
                    Estimated time: ~{block.estimatedMinutes} minutes
                  </p>
                </div>

                {/* Progress Badge */}
                <div className="flex-shrink-0 text-right">
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      progress.percentage === 100
                        ? "bg-[#3F6B40]/10 text-[#3F6B40] dark:bg-[#3F6B40]/20 dark:text-[#87A87C]"
                        : "bg-[#4A8FA8]/15 text-[#4A8FA8] dark:bg-[#4A8FA8]/20 dark:text-[#9DBFD0]"
                    }`}
                  >
                    {progress.completed}/{progress.total} done
                  </div>
                  <div className="text-xs text-[#8E8E93] dark:text-[#8E8E93] mt-1">
                    {progress.percentage}%
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#EDE8DC] dark:bg-[#38383A] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#9DBFD0] to-[#4A8FA8] h-full transition-all duration-500 ease-out"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>

              {/* Block Timer */}
              <div className="mt-4">
                <BlockTimer blockId={block.id} date={workout.date} />
              </div>
            </div>

            {/* Exercises */}
            <div className="space-y-5 w-full">
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
          </div>,
          ...(isBreak1Block(block) && !hasBreak2 ? [<Break2RestCard key="break2-rest" />] : []),
        ];
      })}

      {/* Completion Summary */}
      <div className="bg-white dark:bg-[#2C2C2E] rounded-lg p-6 shadow-md border border-[#EDE8DC] dark:border-[#38383A]">
        <h3 className="text-lg font-bold text-[#1C1C1E] dark:text-white mb-3">
          Workout Summary
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-[#8E8E93] dark:text-[#8E8E93]">Total Exercises</p>
            <p className="text-2xl font-bold text-[#1C1C1E] dark:text-white">
              {workout.blocks
                .flatMap((b) => b.exercises)
                .filter((e) => e.category !== "Guidance").length}
            </p>
          </div>
          <div>
            <p className="text-sm text-[#8E8E93] dark:text-[#8E8E93]">Completed</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {Object.values(completions).filter((c) => c.completed).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



