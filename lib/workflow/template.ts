import { heroEdges, heroNodes } from "./hero";
import { workflowSchema, type Workflow } from "./schema";
import type { FlowNode } from "./types";

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
  const text = prompt.toLowerCase();
  if (/account|accounting|invoice|bookkeep|reconcil|finance|expense/.test(text)) return makeTemplate("accounting", "Invoice approval & reconciliation", "Route an invoice through finance approval before recording the settlement proof.", [
    ["invoice", "event", "Invoice received", "Accounting event", "invoice.received", { x: 330, y: 20 }],
    ["finance", "approval", "Finance approval", "Controller", "Required signer", { x: 330, y: 175 }],
    ["match", "condition", "Invoice matched", "Accounting check", "PO + receipt + invoice", { x: 330, y: 330 }],
    ["payment", "payment", "Release settlement", "Accounts payable", "1,000 USDC · optional", { x: 330, y: 485 }],
    ["proof", "proof", "Record accounting proof", "Attestation", "Solana Devnet", { x: 330, y: 640 }],
  ], [["e1", "invoice", "finance"], ["e2", "finance", "match"], ["e3", "match", "payment"], ["e4", "payment", "proof"]], prompt);
  if (/escrow|freelance|milestone/.test(text)) return makeTemplate("escrow", "Freelancer milestone escrow", "Release funds after a client accepts the completed milestone.", [
    ["milestone", "event", "Milestone submitted", "Business event", "milestone.submitted", { x: 330, y: 20 }],
    ["client", "approval", "Client acceptance", "Project owner", "Required signer", { x: 330, y: 175 }],
    ["condition", "condition", "Milestone accepted", "Condition", "Acceptance required", { x: 330, y: 330 }],
    ["payment", "payment", "Release escrow", "Solana payment", "Funds → freelancer", { x: 330, y: 485 }],
    ["proof", "proof", "Record proof", "Attestation", "Solana Devnet", { x: 330, y: 640 }],
  ], [["e1", "milestone", "client"], ["e2", "client", "condition"], ["e3", "condition", "payment"], ["e4", "payment", "proof"]], prompt);
  if (/revenue|split|distribution|creator|agency/.test(text)) return makeTemplate("revenue-split", "Creator revenue split", "Distribute settled revenue between creator and agency, then record the result.", [
    ["sale", "event", "Sale settled", "Business event", "sale.settled", { x: 330, y: 20 }],
    ["split", "condition", "Calculate 70 / 30 split", "Distribution rule", "Creator + agency", { x: 330, y: 175 }],
    ["distribution", "payment", "Distribute revenue", "Settlement", "Creator and agency", { x: 330, y: 330 }],
    ["proof", "proof", "Record split proof", "Attestation", "Solana Devnet", { x: 330, y: 485 }],
  ], [["e1", "sale", "split"], ["e2", "split", "distribution"], ["e3", "distribution", "proof"]], prompt);
  if (/purchase|order|receipt|invoice match/.test(text)) return makeTemplate("purchase-order", "Purchase order settlement", "Match the purchase order, receipt, and invoice before settlement.", [
    ["order", "event", "Purchase order approved", "Business event", "purchase_order.approved", { x: 330, y: 20 }],
    ["receipt", "condition", "Receipt matched", "Operations check", "Goods received", { x: 330, y: 175 }],
    ["invoice", "approval", "Invoice approved", "Accounts payable", "Required signer", { x: 330, y: 330 }],
    ["payment", "payment", "Settle purchase order", "Settlement", "Supplier payment", { x: 330, y: 485 }],
    ["proof", "proof", "Record settlement proof", "Attestation", "Solana Devnet", { x: 330, y: 640 }],
  ], [["e1", "order", "receipt"], ["e2", "receipt", "invoice"], ["e3", "invoice", "payment"], ["e4", "payment", "proof"]], prompt);
  return workflowSchema.parse({ ...supplierPaymentWorkflow, description: `Generated from: ${prompt}` });
}

type TemplateNode = [string, FlowNode["kind"], string, string, string, { x: number; y: number }];
function makeTemplate(id: string, name: string, description: string, rawNodes: TemplateNode[], rawEdges: [string, string, string][], prompt: string): Workflow {
  return workflowSchema.parse({ id: `${id}-template`, name, description: `${description} Prompt: ${prompt}`, version: 1, status: "draft", nodes: rawNodes.map(([nodeId, kind, label, eyebrow, detail, position]) => ({ id: nodeId, kind, label, eyebrow, detail, position, config: {} })), edges: rawEdges.map(([edgeId, source, target]) => ({ id: edgeId, source, target })) });
}
