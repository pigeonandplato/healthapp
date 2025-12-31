import { getSetting, saveSetting } from "./db";
import type { DayRotation, ProgramMeta, ProgramPhase } from "./types";

export const PROGRAM_PLAN_ID = "run5k-24w-v1";
const PROGRAM_START_DATE_KEY = "programStartDate";
const PROGRAM_PLAN_ID_KEY = "programPlanId";

export type ProgramPhaseDef = {
  phase: ProgramPhase;
  startWeek: number; // inclusive
  endWeek: number; // inclusive
  title: string;
  focus: string[];
  running: "none" | "run-walk" | "continuous" | "durability";
  gate: string[];
};

export const PROGRAM_PHASES: ProgramPhaseDef[] = [
  {
    phase: "P1",
    startWeek: 1,
    endWeek: 4,
    title: "Foundation (Calm disc + build base)",
    focus: [
      "Spine hygiene + core endurance (anti-flexion)",
      "Knee-friendly quad/glute capacity",
      "Aerobic base via walking/elliptical/peloton",
      "Ulnar nerve irritation: ergonomics + gentle glides",
    ],
    running: "none",
    gate: [
      "Walk 40 min comfortably",
      "No symptom flare >24h after strength",
      "Step-up/step-down small range pain ≤3/10",
    ],
  },
  {
    phase: "P2",
    startWeek: 5,
    endWeek: 8,
    title: "Build (Strength + impact readiness)",
    focus: [
      "Progress step-downs + supported split squat range",
      "Add anti-rotation (Pallof) + carries",
      "Incline walking + elliptical conditioning",
    ],
    running: "none",
    gate: [
      "Step-down 6–8" + '"' + " height x 8/side pain ≤3/10",
      "Supported split squat x 8/side pain ≤3/10",
      "2×15 slow calf raises pain ≤3/10",
    ],
  },
  {
    phase: "P3",
    startWeek: 9,
    endWeek: 12,
    title: "Return to Run (Run-walk)",
    focus: [
      "Run-walk 2–3×/wk if gates met",
      "Maintain strength 2×/wk minimum",
      "Keep back calm: neutral spine + hinge control",
    ],
    running: "run-walk",
    gate: [
      "No next-day knee swelling/pain spike after run-walk",
      "Back symptoms stable or improving",
    ],
  },
  {
    phase: "P4",
    startWeek: 13,
    endWeek: 18,
    title: "5K Continuous (Easy)",
    focus: [
      "Build continuous easy running",
      "Long run grows gradually",
      "Keep strength for resilience",
    ],
    running: "continuous",
    gate: ["20 min continuous easy run", "Strength maintained 2×/wk"],
  },
  {
    phase: "P5",
    startWeek: 19,
    endWeek: 24,
    title: "Durability + Confidence",
    focus: [
      "2 easy runs + 1 quality-lite session",
      "Strides or gentle intervals",
      "Injury-risk reduction via strength",
    ],
    running: "durability",
    gate: ["Comfortable 5K weekly", "Symptoms controlled with load rules"],
  },
];

function isoDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export async function ensureProgramInitialized(): Promise<{ startDate: string; planId: string }> {
  const existingStart = await getSetting(PROGRAM_START_DATE_KEY);
  const existingPlan = await getSetting(PROGRAM_PLAN_ID_KEY);
  if (existingStart && existingPlan) return { startDate: existingStart, planId: existingPlan };

  const today = isoDate(new Date());
  await saveSetting(PROGRAM_START_DATE_KEY, existingStart || today);
  await saveSetting(PROGRAM_PLAN_ID_KEY, existingPlan || PROGRAM_PLAN_ID);
  return { startDate: existingStart || today, planId: existingPlan || PROGRAM_PLAN_ID };
}

export async function setProgramStartDate(startDateIso: string): Promise<void> {
  await saveSetting(PROGRAM_START_DATE_KEY, startDateIso);
  await saveSetting(PROGRAM_PLAN_ID_KEY, PROGRAM_PLAN_ID);
}

// Optimized version that accepts startDate and planId to avoid repeated DB calls
export function getProgramMetaForDateSync(
  dateIso: string,
  startDate: string,
  planId: string
): ProgramMeta {
  const target = new Date(dateIso);
  const start = new Date(startDate);

  const diffDays = Math.floor((target.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const week = clamp(Math.floor(diffDays / 7) + 1, 1, 24);

  const dayRotation: DayRotation = (['A','B','C'] as const)[((diffDays % 3) + 3) % 3];

  const phaseDef = PROGRAM_PHASES.find(p => week >= p.startWeek && week <= p.endWeek) || PROGRAM_PHASES[0];
  const phaseWeek = week - phaseDef.startWeek + 1;

  return {
    planId,
    startDate,
    week,
    phase: phaseDef.phase,
    phaseWeek,
    day: dayRotation,
  };
}

export async function getProgramMetaForDate(dateIso?: string): Promise<ProgramMeta> {
  const { startDate, planId } = await ensureProgramInitialized();
  const targetDate = dateIso || new Date().toISOString().split('T')[0];
  return getProgramMetaForDateSync(targetDate, startDate, planId);
}
