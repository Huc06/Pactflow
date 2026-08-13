import { createHash } from "node:crypto";
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

export function advanceRun(run: WorkflowRun, action: RunAction): WorkflowRun {
  const next = structuredClone(run);
  if (action === "delivery_received") next.events.deliveryReceived = true;
  if (action === "buyer_approved" && next.events.deliveryReceived) next.approvals.buyer = true;
  if (action === "logistics_approved" && next.events.deliveryReceived) next.approvals.logistics = true;
  return evaluateRun(next);
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
  if (settled && !run.proof) run.proof = createProof(run);
  return run;
}

function createProof(run: WorkflowRun) {
  const payload = JSON.stringify({ workflowId: run.workflowId, version: run.workflowVersion, runId: run.id, approvals: run.approvals, amount: 1_000, asset: "USDC" });
  const proofHash = createHash("sha256").update(payload).digest("hex");
  return { proofHash, signature: `5PactFlowDemo${proofHash.slice(0, 30)}`, network: "Solana Devnet" as const, createdAt: new Date().toISOString() };
}
