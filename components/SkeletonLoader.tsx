"use client";

export function ExerciseCardSkeleton() {
  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-4 animate-pulse border border-[#E5E5EA] dark:border-[#38383A]">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
      <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
  );
}

export function WorkoutSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <ExerciseCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-4 animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      ))}
    </div>
  );
}

