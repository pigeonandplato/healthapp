/** Shown on Tue/Thu/Sat/Sun when Break 2 (knee) is intentionally skipped. */
export default function Break2RestCard() {
  return (
    <div className="rounded-3xl border-2 border-dashed border-[#C7C7CC] dark:border-[#48484A] bg-[#F2F2F7]/80 dark:bg-[#1C1C1E]/60 p-5">
      <div className="flex items-start gap-3">
        <div className="text-2xl flex-shrink-0">🦵</div>
        <div>
          <h3 className="text-lg font-bold text-[#8E8E93]">Break 2 — Knee Strength</h3>
          <p className="text-sm text-[#8E8E93] mt-1">
            Rest day for knee block. This break runs{" "}
            <strong className="text-[#1C1C1E] dark:text-white">Monday, Wednesday & Friday</strong> only — not on this day.
          </p>
          <p className="text-xs text-[#C7C7CC] dark:text-[#636366] mt-2">
            Use the date picker → tap <strong>Mon</strong> to see Break 2.
          </p>
        </div>
      </div>
    </div>
  );
}

export function workoutHasBreak2(blocks: { id: string; name: string }[]): boolean {
  return blocks.some((b) => b.id.includes("break2") || b.name.includes("Break 2"));
}
