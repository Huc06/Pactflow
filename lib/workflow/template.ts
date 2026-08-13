import { heroEdges, heroNodes } from "./hero";
import { workflowSchema, type Workflow } from "./schema";

const configs: Record<string, Record<string, unknown>> = {
  delivery: { event: "shipment.delivered" },
  buyer: { role: "buyer" },
  logistics: { role: "logistics" },
  condition: { operator: "AND", required: 2 },
  payment: { amount: 1_000, asset: "USDC", network: "solana-devnet", payer: "company_treasury", payee: "supplier_wallet" },
  proof: { adapter: "demo", network: "solana-devnet" },
};

export const supplierPaymentWorkflow: Workflow = workflowSchema.parse({
  id: "supplier-payment-v1",
  name: "Verified supplier payment",
  description: "Pay supplier after buyer and logistics confirm delivery.",
  version: 1,
  status: "draft",
  nodes: heroNodes.map((node) => ({ ...node, config: configs[node.id] })),
  edges: heroEdges.map(({ id, source, target }) => ({ id, source, target })),
});

export function generateWorkflow(prompt: string): Workflow {
  return workflowSchema.parse({ ...supplierPaymentWorkflow, description: `Generated from: ${prompt}` });
}
