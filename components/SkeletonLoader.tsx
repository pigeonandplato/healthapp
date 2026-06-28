"use client";

export function ExerciseCardSkeleton() {
  return (
    <div className="bg-white dark:bg-[#1B1714] rounded-2xl p-4 animate-pulse border border-[#F0E9CE] dark:border-[#3D3730]">
      <div className="h-6 bg-[#F0E9CE] dark:bg-[#3D3730] rounded w-3/4 mb-3"></div>
      <div className="h-32 bg-[#F0E9CE] dark:bg-[#3D3730] rounded mb-3"></div>
      <div className="h-4 bg-[#F0E9CE] dark:bg-[#3D3730] rounded w-1/2"></div>
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
        <div key={i} className="bg-white dark:bg-[#1B1714] rounded-2xl p-4 animate-pulse">
          <div className="h-8 bg-[#F0E9CE] dark:bg-[#3D3730] rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-[#F0E9CE] dark:bg-[#3D3730] rounded w-3/4"></div>
        </div>
      ))}
    </div>
  );
}

