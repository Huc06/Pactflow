import { NextResponse } from "next/server";
import { generateFlowRequestSchema } from "@/lib/workflow/schema";
import { generateWorkflow } from "@/lib/workflow/template";

export async function POST(request: Request) {
  const input = generateFlowRequestSchema.safeParse(await request.json());
  if (!input.success) return NextResponse.json({ error: "Please provide a valid agreement description." }, { status: 400 });
  return NextResponse.json({ workflow: generateWorkflow(input.data.prompt), source: "deterministic-template" });
}
