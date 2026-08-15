import { createHash } from "node:crypto";
import { attestProof } from "../solana/attestation";
import { supplierPaymentWorkflow } from "./template";
import type { Workflow } from "./schema";
import type { RunAction, WorkflowRun } from "./schema";

export function createRun(workflow: Workflow = supplierPaymentWorkflow): WorkflowRun {
  const run = { id: `RUN-${Date.now().toString(36).toUpperCase()}`, workflowId: workflow.id, workflowVersion: workflow.version, workflowName: workflow.name, status: "waiting" as const, events: { deliveryReceived: false }, approvals: { buyer: false, logistics: false }, signals: {}, nodeRuns: {}, proof: null };
  return evaluateRun(run, workflow);
}

export async function advanceRun(run: WorkflowRun, action: RunAction, workflow: Workflow = supplierPaymentWorkflow): Promise<WorkflowRun> {
  const next = structuredClone(run);
  const normalized = typeof action === "string" ? legacyAction(action) : action;
  if (normalized && next.nodeRuns[normalized.nodeId] === "ready") next.signals[normalized.nodeId] = true;
  const evaluated = evaluateRun(next, workflow);
  if (evaluated.status === "completed" && !evaluated.proof) evaluated.proof = await createProof(evaluated);
  return evaluated;
}

function evaluateRun(run: WorkflowRun, workflow: Workflow): WorkflowRun {
  const completed = new Set<string>();
  for (const [id, status] of Object.entries(run.nodeRuns)) if (status === "completed" || status === "verified") completed.add(id);
  const incoming = new Map<string, string[]>();
  workflow.nodes.forEach((node) => incoming.set(node.id, []));
  workflow.edges.forEach((edge) => incoming.get(edge.target)?.push(edge.source));
  let changed = true;
  while (changed) {
    changed = false;
    for (const node of workflow.nodes) {
      if (completed.has(node.id)) continue;
      const parents = incoming.get(node.id) || [];
      const parentsReady = parents.every((parent) => completed.has(parent));
      const manuallyDone = run.signals[node.id] === true;
      const auto = node.kind === "condition" || node.kind === "payment" || node.kind === "proof";
      if ((manuallyDone || (auto && parentsReady)) && (parents.length === 0 || parentsReady)) { completed.add(node.id); changed = true; }
    }
  }
  run.nodeRuns = Object.fromEntries(workflow.nodes.map((node) => {
    const parents = incoming.get(node.id) || [];
    const ready = parents.every((parent) => completed.has(parent));
    const done = completed.has(node.id);
    return [node.id, done ? (node.kind === "proof" ? "verified" : "completed") : node.kind === "payment" || node.kind === "condition" || node.kind === "proof" ? "blocked" : ready ? "ready" : "waiting"];
  }));
  run.status = workflow.nodes.length > 0 && workflow.nodes.every((node) => completed.has(node.id)) ? "completed" : "waiting";
  run.events.deliveryReceived = Boolean(run.signals.delivery || run.signals.invoice || run.signals.milestone || run.signals.order || run.signals.sale);
  run.approvals.buyer = Boolean(run.signals.buyer); run.approvals.logistics = Boolean(run.signals.logistics);
  return run;
}

function legacyAction(action: Exclude<RunAction, { type: "complete_node" }>) {
  return { type: "complete_node" as const, nodeId: action === "delivery_received" ? "delivery" : action === "buyer_approved" ? "buyer" : "logistics" };
}

async function createProof(run: WorkflowRun) {
  const payload = JSON.stringify({ workflowId: run.workflowId, version: run.workflowVersion, runId: run.id, signals: run.signals, nodes: run.nodeRuns });
  const proofHash = createHash("sha256").update(payload).digest("hex");
  return { proofHash, ...(await attestProof(proofHash)), createdAt: new Date().toISOString() };
}
