import { NextResponse } from "next/server";
import { advanceRun } from "@/lib/workflow/engine";
import { advanceRunRequestSchema, workflowSchema } from "@/lib/workflow/schema";
import { supplierPaymentWorkflow } from "@/lib/workflow/template";

export async function POST(request: Request) {
  const body = await request.json();
  const input = advanceRunRequestSchema.safeParse(body);
  if (!input.success) return NextResponse.json({ error: "Invalid run state or action." }, { status: 400 });
  const workflow = workflowSchema.safeParse(body.workflow).success ? workflowSchema.parse(body.workflow) : supplierPaymentWorkflow;
  return NextResponse.json({ run: await advanceRun(input.data.run, input.data.action, workflow) });
}
