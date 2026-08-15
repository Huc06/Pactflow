import type { Edge } from "@xyflow/react";
import type { FlowNode } from "./types";

export const heroPrompt = "Pay a supplier 1,000 USDC when both the buyer and logistics provider confirm delivery.";

export const heroNodes: FlowNode[] = [
  { id: "delivery", kind: "event", label: "Delivery received", eyebrow: "Business event", detail: "shipment.delivered", position: { x: 330, y: 20 } },
  { id: "buyer", kind: "approval", label: "Buyer approval", eyebrow: "Nguyen Trading", detail: "Required signer", position: { x: 100, y: 175 } },
  { id: "logistics", kind: "approval", label: "Logistics approval", eyebrow: "FastShip", detail: "Required signer", position: { x: 560, y: 175 } },
  { id: "condition", kind: "condition", label: "Both approved", eyebrow: "Condition", detail: "2 of 2 confirmations", position: { x: 330, y: 335 } },
  { id: "payment", kind: "payment", label: "Pay 1,000 USDC", eyebrow: "Solana payment", detail: "Company → Supplier", position: { x: 330, y: 490 } },
  { id: "proof", kind: "proof", label: "Record proof", eyebrow: "Attestation", detail: "Solana devnet", position: { x: 330, y: 645 } },
];

export const heroEdges: Edge[] = [
  { id: "e1", source: "delivery", target: "buyer" },
  { id: "e2", source: "delivery", target: "logistics" },
  { id: "e3", source: "buyer", target: "condition" },
  { id: "e4", source: "logistics", target: "condition" },
  { id: "e5", source: "condition", target: "payment" },
  { id: "e6", source: "payment", target: "proof" },
];

export const templates = [
  { name: "Verified supplier payment", type: "Payment", detail: "Two-party delivery confirmation", prompt: heroPrompt, accent: "green" },
  { name: "Freelancer escrow", type: "Escrow", detail: "Release by milestone acceptance", prompt: "Release freelancer escrow when the client approves milestone 2.", accent: "blue" },
  { name: "Revenue split", type: "Distribution", detail: "Automatic partner settlement", prompt: "Split creator revenue 70/30 between creator and agency after a sale settles.", accent: "amber" },
  { name: "Purchase order settlement", type: "Settlement", detail: "Match order, receipt, and invoice", prompt: "Approve a purchase order and settle it when the invoice matches the receipt.", accent: "violet" },
  { name: "Accounting reconciliation", type: "Accounting", detail: "Invoice, approval, and ledger proof", prompt: "Create an accounting workflow for invoice approval, three-way matching, and ledger proof.", accent: "green" },
];
