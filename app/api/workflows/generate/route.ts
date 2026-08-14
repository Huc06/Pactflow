import { NextResponse } from "next/server";
import { generateFlowRequestSchema } from "@/lib/workflow/schema";
import { generateWorkflowWithFallback } from "@/lib/ai/generate-workflow";

export async function POST(request: Request) {
  const input = generateFlowRequestSchema.safeParse(await request.json());
  if (!input.success) return NextResponse.json({ error: "Please provide a valid agreement description." }, { status: 400 });
  return NextResponse.json(await generateWorkflowWithFallback(input.data.prompt));
}
