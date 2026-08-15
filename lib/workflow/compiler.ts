import type { Workflow } from "./schema";

export type ExecutionPlan = { ready: boolean; mode: "supplier-demo" | "preview-only"; reasons: string[] };

export function compileWorkflow(workflow: Workflow): ExecutionPlan {
  const reasons: string[] = [];
  const kinds = new Set(workflow.nodes.map((node) => node.kind));
  const isHero = workflow.id === "supplier-payment-v1" || workflow.id === "supplier-payment-template";
  if (!kinds.has("event")) reasons.push("Add a business event trigger before running.");
  if (!kinds.has("proof")) reasons.push("Add an attestation node to create an execution proof.");
  if (!isHero) reasons.push("This workflow has no generic runtime adapter yet.");
  return { ready: reasons.length === 0, mode: isHero && reasons.length === 0 ? "supplier-demo" : "preview-only", reasons };
}
