export type NodeKind = "event" | "approval" | "condition" | "payment" | "proof";

export type FlowNode = {
  id: string;
  kind: NodeKind;
  label: string;
  eyebrow: string;
  detail: string;
  position: { x: number; y: number };
};

export type RunStepStatus = "waiting" | "ready" | "approved" | "blocked" | "executing" | "completed" | "verified";

export type DemoStage = 0 | 1 | 2 | 3;
