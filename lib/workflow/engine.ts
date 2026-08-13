import { createHash } from "node:crypto";
import { attestProof } from "../solana/attestation";
import type { RunAction, WorkflowRun } from "./schema";

export function createRun(): WorkflowRun {
  return evaluateRun({
    id: "RUN-001",
    workflowId: "supplier-payment-v1",
    workflowVersion: 1,
    status: "waiting",
    events: { deliveryReceived: false },
    approvals: { buyer: false, logistics: false },
    nodeRuns: {},
    proof: null,
  });
}

export async function advanceRun(run: WorkflowRun, action: RunAction): Promise<WorkflowRun> {
  const next = structuredClone(run);
  if (action === "delivery_received") next.events.deliveryReceived = true;
  if (action === "buyer_approved" && next.events.deliveryReceived) next.approvals.buyer = true;
  if (action === "logistics_approved" && next.events.deliveryReceived) next.approvals.logistics = true;
  const evaluated = evaluateRun(next);
  if (evaluated.status === "completed" && !evaluated.proof) evaluated.proof = await createProof(evaluated);
  return evaluated;
}

function evaluateRun(run: WorkflowRun): WorkflowRun {
  const delivered = run.events.deliveryReceived;
  const buyer = run.approvals.buyer;
  const logistics = run.approvals.logistics;
  const settled = delivered && buyer && logistics;
  run.status = settled ? "completed" : "waiting";
  run.nodeRuns = {
    delivery: delivered ? "completed" : "ready",
    buyer: buyer ? "completed" : delivered ? "ready" : "waiting",
    logistics: logistics ? "completed" : delivered ? "ready" : "waiting",
    condition: settled ? "completed" : "blocked",
    payment: settled ? "completed" : "blocked",
    proof: settled ? "verified" : "blocked",
  };
  return run;
}

async function createProof(run: WorkflowRun) {
  const payload = JSON.stringify({ workflowId: run.workflowId, version: run.workflowVersion, runId: run.id, approvals: run.approvals, amount: 1_000, asset: "USDC" });
  const proofHash = createHash("sha256").update(payload).digest("hex");
  const attestation = await attestProof(proofHash);
  return { proofHash, ...attestation, createdAt: new Date().toISOString() };
}
