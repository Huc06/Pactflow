import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { generateWorkflow } from "../workflow/template";
import { workflowSchema, type Workflow } from "../workflow/schema";
import { compileWorkflow } from "../workflow/compiler";

const aiNodeSchema = z.object({
  id: z.string().min(1),
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

export type GenerationResult = { workflow: Workflow; source: "gemini" | "deterministic-template"; execution: ReturnType<typeof compileWorkflow>; fallbackReason?: string };

export async function generateWorkflowWithFallback(prompt: string): Promise<GenerationResult> {
  if (!process.env.GEMINI_API_KEY) { const workflow = generateWorkflow(prompt); return { workflow, source: "deterministic-template", execution: compileWorkflow(workflow), fallbackReason: "GEMINI_API_KEY is not configured" }; }
  try {
    const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await client.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-flash-latest",
      contents: "Convert this business agreement into a small executable PactFlow DAG:\n\n" + prompt,
      config: {
        systemInstruction: "Convert business agreements into small executable PactFlow DAGs. Use blockchain only for payment or independently verifiable proof. Always end payment workflows with a proof node. Keep private data offchain. Use 3-8 nodes with readable vertical positions and no cycles.",
        responseMimeType: "application/json",
        responseJsonSchema: {
          type: "object",
          properties: {
            name: { type: "string" }, description: { type: "string" },
            nodes: { type: "array", items: { type: "object", properties: { id: { type: "string" }, kind: { type: "string", enum: ["event", "approval", "condition", "payment", "proof"] }, label: { type: "string" }, eyebrow: { type: "string" }, detail: { type: "string" }, x: { type: "number" }, y: { type: "number" } }, required: ["id", "kind", "label", "eyebrow", "detail", "x", "y"] } },
            edges: { type: "array", items: { type: "object", properties: { id: { type: "string" }, source: { type: "string" }, target: { type: "string" } }, required: ["id", "source", "target"] } },
          }, required: ["name", "description", "nodes", "edges"],
        },
      },
    });
    if (!response.text) throw new Error("Gemini did not return a workflow");
    const parsed = aiWorkflowSchema.parse(JSON.parse(response.text));
    const idMap = new Map<string, string>();
    parsed.nodes.forEach((node, index) => idMap.set(node.id, `${node.id.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^[^a-z]+/, "node_") || "node"}_${index}`));
    const workflow = workflowSchema.parse({
      id: `generated-${Date.now()}`,
      name: parsed.name,
      description: parsed.description,
      version: 1,
      status: "draft",
      nodes: parsed.nodes.map((node) => ({ id: idMap.get(node.id), kind: node.kind, label: node.label, eyebrow: node.eyebrow, detail: node.detail, position: { x: node.x, y: node.y }, config: {} })),
      edges: parsed.edges.map((edge) => ({ ...edge, source: idMap.get(edge.source) || edge.source, target: idMap.get(edge.target) || edge.target })),
    });
    validateGraph(workflow);
    return { workflow, source: "gemini", execution: compileWorkflow(workflow) };
  } catch (error) {
    const fallbackReason = error instanceof Error ? error.message : "Unknown generation error";
    const workflow = generateWorkflow(prompt);
    return { workflow, source: "deterministic-template", execution: compileWorkflow(workflow), fallbackReason };
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
