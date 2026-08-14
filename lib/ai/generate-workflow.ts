import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import { generateWorkflow } from "../workflow/template";
import { workflowSchema, type Workflow } from "../workflow/schema";

const aiNodeSchema = z.object({
  id: z.string().regex(/^[a-z][a-z0-9_]*$/),
  kind: z.enum(["event", "approval", "condition", "payment", "proof"]),
  label: z.string(),
  eyebrow: z.string(),
  detail: z.string(),
  x: z.number(),
  y: z.number(),
});

const aiWorkflowSchema = z.object({
  name: z.string(),
  description: z.string(),
  nodes: z.array(aiNodeSchema),
  edges: z.array(z.object({ id: z.string(), source: z.string(), target: z.string() })),
});

export type GenerationResult = { workflow: Workflow; source: "openai" | "deterministic-template"; fallbackReason?: string };

export async function generateWorkflowWithFallback(prompt: string): Promise<GenerationResult> {
  if (!process.env.OPENAI_API_KEY) return { workflow: generateWorkflow(prompt), source: "deterministic-template", fallbackReason: "OPENAI_API_KEY is not configured" };
  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 20_000, maxRetries: 1 });
    const response = await client.responses.parse({
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      input: [
        { role: "system", content: "Convert business agreements into small executable PactFlow DAGs. Use blockchain only for payment or independently verifiable proof. Always end payment workflows with a proof node. Keep private data offchain. Use 3-8 nodes with readable vertical positions and no cycles." },
        { role: "user", content: prompt },
      ],
      text: { format: zodTextFormat(aiWorkflowSchema, "pactflow_workflow") },
    });
    if (!response.output_parsed) throw new Error("The model did not return a workflow");
    const parsed = response.output_parsed;
    const workflow = workflowSchema.parse({
      id: `generated-${Date.now()}`,
      name: parsed.name,
      description: parsed.description,
      version: 1,
      status: "draft",
      nodes: parsed.nodes.map((node) => ({ id: node.id, kind: node.kind, label: node.label, eyebrow: node.eyebrow, detail: node.detail, position: { x: node.x, y: node.y }, config: {} })),
      edges: parsed.edges,
    });
    validateGraph(workflow);
    return { workflow, source: "openai" };
  } catch (error) {
    const fallbackReason = error instanceof Error ? error.message : "Unknown generation error";
    return { workflow: generateWorkflow(prompt), source: "deterministic-template", fallbackReason };
  }
}

export function validateGraph(workflow: Workflow) {
  const ids = new Set(workflow.nodes.map((node) => node.id));
  if (ids.size !== workflow.nodes.length) throw new Error("Workflow contains duplicate node IDs");
  for (const edge of workflow.edges) if (!ids.has(edge.source) || !ids.has(edge.target)) throw new Error("Workflow edge references an unknown node");
  const adjacency = new Map<string, string[]>();
  for (const id of ids) adjacency.set(id, []);
  for (const edge of workflow.edges) adjacency.get(edge.source)?.push(edge.target);
  const visiting = new Set<string>(); const visited = new Set<string>();
  const visit = (id: string) => {
    if (visiting.has(id)) throw new Error("Workflow must be acyclic");
    if (visited.has(id)) return;
    visiting.add(id); for (const next of adjacency.get(id) || []) visit(next); visiting.delete(id); visited.add(id);
  };
  for (const id of ids) visit(id);
}
