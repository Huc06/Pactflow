import { NextResponse } from "next/server";
import { createRun } from "@/lib/workflow/engine";

export async function POST() {
  return NextResponse.json({ run: createRun() }, { status: 201 });
}
