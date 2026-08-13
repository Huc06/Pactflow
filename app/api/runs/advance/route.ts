import { NextResponse } from "next/server";
import { advanceRun } from "@/lib/workflow/engine";
import { advanceRunRequestSchema } from "@/lib/workflow/schema";

export async function POST(request: Request) {
  const input = advanceRunRequestSchema.safeParse(await request.json());
  if (!input.success) return NextResponse.json({ error: "Invalid run state or action." }, { status: 400 });
  return NextResponse.json({ run: advanceRun(input.data.run, input.data.action) });
}
