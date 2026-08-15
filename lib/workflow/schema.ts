import { z } from "zod";

export const nodeKindSchema = z.enum(["event", "approval", "condition", "payment", "proof"]);

export const workflowNodeSchema = z.object({
  id: z.string().min(1),
  kind: nodeKindSchema,
  label: z.string().min(1),
  eyebrow: z.string().min(1),
  detail: z.string().min(1),
  position: z.object({ x: z.number(), y: z.number() }),
  config: z.record(z.unknown()).default({}),
});

export const workflowEdgeSchema = z.object({
  id: z.string().min(1),
  source: z.string().min(1),
  target: z.string().min(1),
});

export const workflowSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  version: z.number().int().positive(),
  status: z.enum(["draft", "published", "archived"]),
  nodes: z.array(workflowNodeSchema).min(1),
  edges: z.array(workflowEdgeSchema),
});

export type Workflow = z.infer<typeof workflowSchema>;

export const generateFlowRequestSchema = z.object({ prompt: z.string().trim().min(5).max(2_000) });

export const runActionSchema = z.union([
  z.enum(["delivery_received", "buyer_approved", "logistics_approved"]),
  z.object({ type: z.literal("complete_node"), nodeId: z.string().min(1) }),
]);
export const runStatusSchema = z.enum(["waiting", "completed", "failed"]);
export const nodeRunStatusSchema = z.enum(["waiting", "ready", "completed", "blocked", "verified"]);

export const workflowRunSchema = z.object({
  id: z.string(),
  workflowId: z.string(),
  workflowVersion: z.number().int().positive(),
  status: runStatusSchema,
  workflowName: z.string().default("Verified supplier payment"),
  signals: z.record(z.boolean()).default({}),
  events: z.object({ deliveryReceived: z.boolean() }),
  approvals: z.object({ buyer: z.boolean(), logistics: z.boolean() }),
  nodeRuns: z.record(nodeRunStatusSchema),
  proof: z.object({
    proofHash: z.string(),
    signature: z.string(),
    network: z.literal("Solana Devnet"),
    explorerUrl: z.string().url().nullable(),
    mode: z.enum(["live", "simulated"]),
    fallbackReason: z.string().optional(),
    createdAt: z.string(),
  }).nullable(),
});

export type WorkflowRun = z.infer<typeof workflowRunSchema>;
export type RunAction = z.infer<typeof runActionSchema>;

export const advanceRunRequestSchema = z.object({ run: workflowRunSchema, action: runActionSchema });
