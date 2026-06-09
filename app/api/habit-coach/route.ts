import { NextRequest, NextResponse } from "next/server";
import { buildIntervention, HabitKind } from "@/lib/habitCoach";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const label = typeof body?.label === "string" ? body.label : "";
    const kind: HabitKind = body?.kind === "build" ? "build" : "break";

    if (!label.trim()) {
      return NextResponse.json({ error: "label is required" }, { status: 400 });
    }

    const intervention = buildIntervention(label, kind);
    return NextResponse.json(intervention, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ error: "Failed to build intervention" }, { status: 500 });
  }
}
