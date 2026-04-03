// Rehab strength program (3-week progression + optional impact in week 3)
// Source: rehab-strength-program.csv

import { Exercise, ExerciseBlock, Phase, DayRotation } from "./types";
import { exerciseMediaMap } from "./exerciseMedia";

const genericMedia = exerciseMediaMap["generic-exercise"];

const REHAB_CSV = `Week,Day,Block Name,Exercise ID,Exercise Name,Sets,Reps,Hold Seconds,Minutes,Description
1,A,Warm-up,rehab-p1-a-01,McGill curl-up or dead bug (small range),2,8,,,Stop if back ramps up; pick one pattern
1,A,Warm-up,rehab-p1-a-02,Bird dog (hold or slow reps),2,8,,,Each side; long spine no twisting
1,A,Main,rehab-p1-a-03,Glute bridge double leg,3,12,,,Squeeze glutes ribs down
1,A,Main,rehab-p1-a-04,Romanian deadlift RDL dumbbells light,3,9,,,Hip hinge neutral spine bar close
1,A,Main,rehab-p1-a-05,Terminal knee extension band,3,14,,,Each leg; quad not sharp knee pain
1,A,Main,rehab-p1-a-06,Leg press or sled optional very light,3,14,,,High seat partial range if knee sensitive
1,A,Main,rehab-p1-a-07,Seated or standing calf raise,3,14,,,Pause 1s top slow 3s down
1,A,Main,rehab-p1-a-08,Forearm plank on elbows,2,,30,,Hips level breathe; 20-40s range use 30s default
1,B,Main,rehab-p1-b-01,Box squat goblet or bodyweight,3,10,,,High box stop above pain depth
1,B,Main,rehab-p1-b-02,Hip abduction machine or band,3,14,,,Steady no snapping hip
1,B,Main,rehab-p1-b-03,Hamstring bridge feet on bench or light leg curl,2,11,,,Skip if back hates use curl instead
1,B,Main,rehab-p1-b-04,Single-leg balance pad under foot,3,,40,,Each leg; hand on wall OK calm ankle
1,B,Main,rehab-p1-b-05,Face pull or band pull-apart,3,14,,,Shoulder blades not neck
1,B,Main,rehab-p1-b-06,Neutral-grip row cable or machine,3,11,,,Wrist neutral relaxed grip ulnar-safe
1,B,Main,rehab-p1-b-07,Tibialis raise wall or toe walks,2,18,,,Light stop if ankle burns
1,C,Main,rehab-p1-c-01,Split squat short stance rear foot low,2,9,,,Each leg torso tall reduce depth if knee
1,C,Main,rehab-p1-c-02,Step-down slow 4-8 inch box,2,7,,,Each leg pain-free knee quality over depth
1,C,Main,rehab-p1-c-03,Hip thrust bar or dumbbell on hips,3,10,,,Chin slightly tucked ribs down
1,C,Main,rehab-p1-c-04,Pallof press anti-rotation,2,10,,,Each side stand tall resist twist
1,C,Main,rehab-p1-c-05,Farmer carry moderate,2,,,,20-40m each carry relaxed grip stop if ulnar burn
1,C,Main,rehab-p1-c-06,Foot doming short foot,2,9,,,Arch plantar maintenance
1,C,Main,rehab-p1-c-07,Towel scrunch,2,9,,,Arch plantar maintenance
2,A,Warm-up,rehab-p2-a-01,Dead bug or bird dog,2,8,,,Alternate or pick one
2,A,Main,rehab-p2-a-02,Glute bridge or single-leg if tolerated,3,10,,,
2,A,Main,rehab-p2-a-03,Romanian deadlift progress load,4,8,,,3-4 sets 6-10 reps
2,A,Main,rehab-p2-a-04,Terminal knee extension,3,14,,,
2,A,Main,rehab-p2-a-05,Leg press moderate safe depth,3,11,,,
2,A,Main,rehab-p2-a-06,Calf raise try single-leg partial if solid,3,10,,,
2,A,Main,rehab-p2-a-07,Plank,2,,50,,40-60s range use 50s default
2,B,Main,rehab-p2-b-01,Goblet or front squat or high-box squat,4,8,,,Comfortable depth only
2,B,Main,rehab-p2-b-02,Hip abduction,3,14,,,
2,B,Main,rehab-p2-b-03,Romanian deadlift or leg curl alternate week,3,10,,,Alternate with Session A hinge focus
2,B,Main,rehab-p2-b-04,Single-leg balance eyes closed if safe,3,,15,,10-20s per round each leg if applicable
2,B,Main,rehab-p2-b-05,Neutral-grip row,3,10,,,
2,B,Main,rehab-p2-b-06,Face pull or band pull-apart,3,10,,,
2,B,Main,rehab-p2-b-07,Copenhagen side plank knee supported,2,,15,,Each side skip if knee irritates
2,C,Main,rehab-p2-c-01,Bulgarian split squat short stride vertical shin,3,8,,,Each leg
2,C,Main,rehab-p2-c-02,Step-down,3,7,,,Each leg
2,C,Main,rehab-p2-c-03,Hip thrust heavier,4,8,,,
2,C,Main,rehab-p2-c-04,Pallof press,3,10,,,Each side
2,C,Main,rehab-p2-c-05,Farmer carry heavier relaxed grip,3,,,,30m total or per carry per program
2,C,Main,rehab-p2-c-06,Foot doming and towel scrunch,2,9,,,As Phase 1
2,C,Main,rehab-p2-c-07,Bent-knee calf raise soleus,2,15,,,
3,B,Optional impact,rehab-p3-b-01,Pogo hops double leg soft landing,3,8,,,Only if Phase 2 checklist met; 2-3x5-10 minimal knee bend skip if knee-ankle off
3,C,Optional impact,rehab-p3-c-01,Pogo hops double leg soft landing,3,8,,,Add 1x week after B or C not both unless prescribed; still no running unless cleared`;

type RehabRow = {
  week: number;
  day: DayRotation;
  blockName: string;
  id: string;
  name: string;
  sets?: number;
  reps?: number;
  holdSeconds?: number;
  minutes?: number;
  description: string;
};

const LINE_RE =
  /^(\d+),([ABC]),([^,]+),(rehab-[^,]+),([^,]*),(\d*),(\d*),(\d*),(\d*),(.*)$/;

function parseRehabCsv(csv: string): RehabRow[] {
  const lines = csv.trim().split("\n");
  const out: RehabRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const m = line.match(LINE_RE);
    if (!m) throw new Error(`rehabSeedData: bad CSV line: ${line}`);
    const sets = m[6] ? parseInt(m[6], 10) : undefined;
    const reps = m[7] ? parseInt(m[7], 10) : undefined;
    const holdSeconds = m[8] ? parseInt(m[8], 10) : undefined;
    const minutes = m[9] ? parseInt(m[9], 10) : undefined;
    out.push({
      week: parseInt(m[1], 10),
      day: m[2] as DayRotation,
      blockName: m[3],
      id: m[4],
      name: m[5],
      sets,
      reps,
      holdSeconds,
      minutes,
      description: m[10].trim(),
    });
  }
  return out;
}

const rehabRows = parseRehabCsv(REHAB_CSV);

function slugBlock(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildPrescriptionDescription(row: RehabRow): string {
  const chunks: string[] = [];
  if (row.sets != null && row.reps != null) chunks.push(`${row.sets}×${row.reps}`);
  else {
    if (row.sets != null) chunks.push(`${row.sets} sets`);
    if (row.reps != null) chunks.push(`${row.reps} reps`);
  }
  if (row.holdSeconds != null) chunks.push(`${row.holdSeconds}s hold`);
  if (row.minutes != null) chunks.push(`${row.minutes} min`);
  const core = chunks.join(" · ");
  if (row.description) {
    if (core) return `${core} — ${row.description}`;
    return row.description.length > 120 ? `${row.description.slice(0, 117)}…` : row.description;
  }
  return core || "As prescribed";
}

function exerciseCategory(row: RehabRow): string {
  if (row.blockName.toLowerCase().includes("warm")) return "Warm-up";
  if (row.blockName.toLowerCase().includes("optional")) return "Plyometrics";
  return "Strength";
}

function rowToExercise(row: RehabRow): Exercise {
  const fullDescription = [row.name, row.description].filter(Boolean).join(". ") || row.name;
  return {
    id: row.id,
    name: row.name,
    description: fullDescription,
    phase: Phase.PHASE_0,
    media: genericMedia,
    prescription: {
      sets: row.sets,
      reps: row.reps,
      holdSeconds: row.holdSeconds,
      minutes: row.minutes,
      description: buildPrescriptionDescription(row),
    },
    instructions: row.description
      ? row.description.split(/[.;]\s+/).filter((s) => s.length > 3).slice(0, 5)
      : ["Move with control", "Stay below symptom threshold"],
    commonMistakes: ["Rushing reps", "Compensating with spine or neck"],
    stopConditions: ["Sharp pain", "Symptoms markedly worse next day"],
    category: exerciseCategory(row),
  };
}

function rowsToBlocks(rows: RehabRow[], programWeek: number, day: DayRotation): ExerciseBlock[] {
  const blockOrder: string[] = [];
  const byBlock = new Map<string, RehabRow[]>();
  for (const row of rows) {
    if (!byBlock.has(row.blockName)) {
      blockOrder.push(row.blockName);
      byBlock.set(row.blockName, []);
    }
    byBlock.get(row.blockName)!.push(row);
  }

  return blockOrder.map((blockName) => {
    const group = byBlock.get(blockName)!;
    const exercises = group.map((r) => JSON.parse(JSON.stringify(rowToExercise(r))) as Exercise);
    const estimatedMinutes = Math.max(5, exercises.length * 4);
    return {
      id: `rehab-wk${programWeek}-d${day}-${slugBlock(blockName)}`,
      name: blockName,
      description: `Week ${programWeek} · Day ${day}`,
      estimatedMinutes,
      exercises,
    };
  });
}

/** Calendar week since rehab start (1-based). Same Mon/Wed/Fri cadence as gym. */
export function getRehabBlocksForProgramWeekAndDay(
  programWeek: number,
  day: DayRotation
): ExerciseBlock[] {
  const w = Math.max(1, programWeek);

  if (w === 1) {
    const rows = rehabRows.filter((r) => r.week === 1 && r.day === day);
    return rowsToBlocks(rows, w, day);
  }
  if (w === 2) {
    const rows = rehabRows.filter((r) => r.week === 2 && r.day === day);
    return rowsToBlocks(rows, w, day);
  }

  const main = rehabRows.filter((r) => r.week === 2 && r.day === day);
  const optional =
    day === "B" || day === "C"
      ? rehabRows.filter((r) => r.week === 3 && r.day === day)
      : [];
  return rowsToBlocks([...main, ...optional], w, day);
}

export const REHAB_PROGRAM_ID = "rehab-strength-v1";

const exerciseById = new Map<string, Exercise>();
for (const row of rehabRows) {
  if (!exerciseById.has(row.id)) {
    exerciseById.set(row.id, rowToExercise(row));
  }
}
export const allRehabExercises = [...exerciseById.values()];
