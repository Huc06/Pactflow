import { NextResponse } from "next/server";
import { createRun } from "@/lib/workflow/engine";
import { workflowSchema } from "@/lib/workflow/schema";
import { supplierPaymentWorkflow } from "@/lib/workflow/template";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const workflow = workflowSchema.safeParse(body.workflow).success ? workflowSchema.parse(body.workflow) : supplierPaymentWorkflow;
  return NextResponse.json({ run: createRun(workflow) }, { status: 201 });
}
