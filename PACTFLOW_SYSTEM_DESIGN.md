# PactFlow — System Design & Agent Build Spec

**Status:** MVP / Prototype for bounty submission  
**Deadline:** 23 Aug 2026  
**Primary goal:** Build a convincing, polished prototype that demonstrates how a business process can be turned into a programmable multi-party workflow with Solana-based execution/proof.  
**Priority:** Submission quality > production completeness.

---

## 1. Product Summary

### Working name
**PactFlow**

### One-liner
**Build business workflows that execute onchain.**

### Product promise
A user describes a business process in plain English. PactFlow turns it into a visual workflow combining business events, multi-party approvals, conditions, payment actions, and independently verifiable Solana execution.

### Core thesis
Automation itself does not require blockchain.

Blockchain is valuable when:
- multiple independent parties participate,
- money depends on shared conditions,
- no single participant should control the final state,
- the execution/proof must be independently verifiable.

PactFlow should therefore focus on **multi-party business agreements**, not generic automation.

---

## 2. MVP Scope

### Must demonstrate
1. User enters a plain-English business process.
2. PactFlow generates a visual workflow.
3. User can inspect/edit the flow.
4. User can start a simulated execution.
5. Multiple actors approve/confirm required steps.
6. Payment remains blocked until conditions are satisfied.
7. Final execution creates a Solana-based proof/attestation.
8. UI shows the final proof and transaction metadata.

### Hero demo
Prompt:

> Pay a supplier 1,000 USDC when both the buyer and logistics provider confirm delivery.

Generated flow:

```text
[Delivery Event]
      |
      +------------------+
      |                  |
      v                  v
[Buyer Approval]   [Logistics Approval]
      |                  |
      +--------+---------+
               |
               v
          [Condition]
             AND
               |
               v
       [Pay 1,000 USDC]
               |
               v
        [Onchain Proof]
```

### Out of scope for MVP
Do NOT build:
- SCEX integration
- CAEX integration
- real accounting integrations
- MISA / FAST integrations
- full compliance suite
- national blockchain integration
- full marketplace
- mobile app
- production auth
- enterprise RBAC
- full smart-contract DSL
- production-grade treasury
- complex AI agent framework
- generic document editor
- generic spreadsheet/table builder

These can appear in roadmap only.

---

## 3. UX Architecture

PactFlow should feel like an **AI business operations workspace**, not a crypto dApp.

### Main navigation
- Home
- Flows
- Templates
- Runs
- Connections (can be mostly mock)
- Profile / workspace

### Product primitives
Long-term conceptual model:

```text
                  FLOWON

              AI WORKSPACE
                   |
      +------------+-------------+
      |            |             |
      v            v             v
    FLOWS        RECORDS        PROOFS
      |            |             |
 Business Logic  State/Data   Verification
      |            |             |
      +------------+-------------+
                   |
            EXECUTION LAYER
                   |
          +--------+--------+
          |                 |
          v                 v
        Web2              Solana
    API/Webhook       Payment/Proof
```

For MVP:
- Flows = real/polished
- Runs = real/polished
- Proofs = real/polished
- Records = minimal/mock
- Connections = minimal/mock

---


---

## 3A. Mandatory UI/UX Skill Workflow for Coding Agents

PactFlow is a UI-heavy product. Agents must use the **UI Skills** collection before implementing or changing interface code.

### Mandatory rule

Before reading or changing UI code for a UI-related task, run:

```bash
npx ui-skills start
npx ui-skills categories
npx ui-skills list --category '<category>'
npx ui-skills get '<skill>'
```

Always start with:

```bash
npx ui-skills start
```

Then:

1. Inspect the available categories.
2. Choose the smallest relevant category for the current UI task.
3. List the skills in that category.
4. Load only the smallest relevant skill.
5. Implement according to the loaded skill.
6. Do not manually choose a skill from memory or from a copied list.
7. Re-run discovery when the UI task materially changes.

### Examples

For the Home AI workspace:
- discover skills relevant to app shell, dashboard, command/input UX, spacing, hierarchy, or AI workspace patterns.

For the Flow Builder:
- discover skills relevant to node editors, canvas UX, graph navigation, side panels, contextual actions, or workflow-builder interaction.

For Runs / Execution:
- discover skills relevant to status visualization, progressive disclosure, activity timelines, loading/error states, and transactional feedback.

For Proof / Verification:
- discover skills relevant to trust UX, transaction detail views, technical metadata, copy hierarchy, and verification states.

### Agent constraint

Do not begin by copying Diaflow pixel-for-pixel.

Use Diaflow only as a reference for:
- workspace structure,
- canvas-first interaction,
- contextual node creation,
- consistent navigation,
- dense-but-readable enterprise tooling.

PactFlow must keep its own product identity and visual system.

### UI implementation priority

When UI tradeoffs arise, optimize in this order:

1. Comprehension in under 30 seconds
2. Clear business workflow hierarchy
3. Reliable demo interaction
4. Enterprise polish
5. Responsive desktop behavior
6. Animation / delight
7. Mobile support

### Visual acceptance standard

The app should look like a credible B2B SaaS product, not:
- a generic hackathon dashboard,
- a crypto wallet,
- a clone of Diaflow,
- or a UI kit assembled without product hierarchy.

The agent should explicitly mention which `ui-skills` skill was loaded before implementing each major UI surface.

## 4. Screen Design

## 4.1 Home — AI Workspace

Purpose:
- Main entry point
- User should not need to understand workflow concepts before starting

Layout:
- persistent left sidebar
- center greeting
- large prompt box
- quick action chips
- suggested templates
- recent flows

Prompt placeholder:

> Describe a business process, payment, or agreement...

Quick action chips:
- Payment
- Escrow
- Approval
- Supplier
- Revenue Split
- Webhook

Suggested templates:
- Supplier Payment
- Freelancer Escrow
- Revenue Split
- Purchase Order Settlement

Interaction:
1. User types prompt
2. Click Generate
3. AI response shows a workflow card inline
4. Buttons:
   - Edit Flow
   - Run Simulation

Do not force immediate navigation to builder.

---

## 4.2 Flow Builder — Advanced Mode

Purpose:
- Power-user editing
- Visual representation of workflow
- Inspired by Diaflow-style contextual flow building, but do not copy branding/UI directly

Layout:
- persistent app sidebar
- top flow header
- large dotted/grid canvas
- nodes
- contextual node picker when creating connection
- right node config panel
- Test / Deploy buttons

Recommended interaction:
When user drags a connector from one node, show contextual picker:

> What should happen next?

Categories:

### Business
- Request Approval
- Multi Approval
- Verify Delivery
- Check Condition

### Payment
- USDC Payment
- Escrow
- Revenue Split

### Onchain
- Create Attestation
- Verify Signature
- Record Proof

### Integration
- API Call
- Webhook
- Mock Exchange
- Mock ERP

Do not overload with 30+ components in MVP.

---

## 4.3 Run / Execution View

Can be a dedicated page or inline panel/modal.

Execution should be shown as a step-by-step state machine.

Initial:

```text
RUN #001 — Pending

Delivery event       Waiting
Buyer approval       Waiting
Logistics approval   Waiting
Payment              Blocked
Onchain proof        Not started
```

After delivery:

```text
Delivery event       Received
Buyer approval       Approved
Logistics approval   Waiting
Payment              Blocked
```

After logistics approval:

```text
Delivery event       Received
Buyer approval       Approved
Logistics approval   Approved
Payment              Executing
```

Final:

```text
Delivery event       Received
Buyer approval       Approved
Logistics approval   Approved
Payment              Completed
Onchain proof        Verified
```

Buttons for simulation:
- Simulate Delivery Event
- Approve as Buyer
- Approve as Logistics
- Continue Execution
- View Proof

---

## 4.4 Proof / Verification View

Show:

- Workflow name
- Run ID
- Status
- Amount
- Payer
- Payee
- Network
- transaction signature
- slot/block
- execution hash
- workflow version
- approvals count
- completion time

Explain proof in plain English:

> This proof contains a cryptographic commitment to the workflow inputs, approvals, and final execution result. Sensitive business data remains offchain.

CTA:
- View on Solana Explorer
- Copy Proof Hash

---

## 5. Technical Architecture

Recommended stack:

```text
Next.js 15+ / React
TypeScript
Tailwind CSS
shadcn/ui
@xyflow/react
Zod
Supabase or local JSON for MVP
Solana web3.js
Solana Wallet Adapter if needed
LLM structured output for prompt -> workflow
```

Prototype-first rule:
- Prefer one deployable Next.js application
- Avoid microservices
- Avoid unnecessary backend complexity
- Use mock data where production integrations do not exist

High-level:

```text
Browser
  |
  v
Next.js App
  |
  +---------------------+
  |                     |
  v                     v
Workflow UI         API Routes / Server Actions
  |                     |
  v                     v
Workflow JSON       Execution Engine
                        |
              +---------+----------+
              |                    |
              v                    v
         Mock/Web2 Nodes       Solana Layer
              |                    |
         API/Webhooks         Attestation/Proof
```

---

## 6. Repository Structure

```text
pactflow/
├── app/
│   ├── page.tsx
│   ├── dashboard/
│   ├── flows/
│   │   ├── page.tsx
│   │   ├── new/
│   │   └── [flowId]/
│   │       ├── page.tsx
│   │       └── builder/
│   ├── runs/
│   │   ├── page.tsx
│   │   └── [runId]/
│   ├── templates/
│   ├── connections/
│   └── api/
│       ├── ai/
│       ├── flows/
│       ├── runs/
│       └── solana/
│
├── components/
│   ├── layout/
│   ├── home/
│   ├── workflow/
│   │   ├── FlowCanvas.tsx
│   │   ├── NodePicker.tsx
│   │   ├── NodeInspector.tsx
│   │   ├── nodes/
│   │   └── edges/
│   ├── execution/
│   └── proof/
│
├── lib/
│   ├── workflow/
│   │   ├── schema.ts
│   │   ├── registry.ts
│   │   ├── engine.ts
│   │   ├── validator.ts
│   │   └── hash.ts
│   ├── ai/
│   │   └── generate-flow.ts
│   ├── solana/
│   │   ├── client.ts
│   │   ├── attestation.ts
│   │   └── explorer.ts
│   ├── mocks/
│   └── utils/
│
├── data/
│   ├── templates.ts
│   ├── mock-runs.ts
│   └── mock-connections.ts
│
├── types/
└── README.md
```

---

## 7. Workflow Data Model

Workflow JSON is the source of truth.

```ts
export type WorkflowStatus =
  | "draft"
  | "published"
  | "archived";

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  version: number;
  status: WorkflowStatus;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: string;
  updatedAt: string;
}
```

Node:

```ts
export type NodeType =
  | "manual_trigger"
  | "webhook_trigger"
  | "business_event"
  | "approval"
  | "multi_approval"
  | "condition"
  | "usdc_payment"
  | "escrow"
  | "attestation"
  | "webhook_output"
  | "api_call";

export interface WorkflowNode {
  id: string;
  type: NodeType;
  label: string;
  position: {
    x: number;
    y: number;
  };
  config: Record<string, unknown>;
}
```

Edge:

```ts
export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}
```

---

## 8. Hero Workflow Example

```json
{
  "id": "supplier-payment-v1",
  "name": "Verified Supplier Payment",
  "description": "Pay supplier after buyer and logistics confirm delivery.",
  "version": 1,
  "status": "draft",
  "nodes": [
    {
      "id": "delivery",
      "type": "business_event",
      "label": "Delivery Event",
      "position": { "x": 400, "y": 80 },
      "config": {
        "event": "shipment.delivered"
      }
    },
    {
      "id": "buyerApproval",
      "type": "approval",
      "label": "Buyer Approval",
      "position": { "x": 260, "y": 220 },
      "config": {
        "role": "buyer"
      }
    },
    {
      "id": "logisticsApproval",
      "type": "approval",
      "label": "Logistics Approval",
      "position": { "x": 540, "y": 220 },
      "config": {
        "role": "logistics"
      }
    },
    {
      "id": "condition",
      "type": "condition",
      "label": "Both Approved",
      "position": { "x": 400, "y": 360 },
      "config": {
        "operator": "AND"
      }
    },
    {
      "id": "payment",
      "type": "usdc_payment",
      "label": "Pay 1,000 USDC",
      "position": { "x": 400, "y": 500 },
      "config": {
        "amount": 1000,
        "asset": "USDC",
        "network": "solana-devnet",
        "payer": "company_treasury",
        "payee": "supplier_wallet"
      }
    },
    {
      "id": "proof",
      "type": "attestation",
      "label": "Onchain Proof",
      "position": { "x": 400, "y": 640 },
      "config": {}
    }
  ],
  "edges": [
    { "id": "e1", "source": "delivery", "target": "buyerApproval" },
    { "id": "e2", "source": "delivery", "target": "logisticsApproval" },
    { "id": "e3", "source": "buyerApproval", "target": "condition" },
    { "id": "e4", "source": "logisticsApproval", "target": "condition" },
    { "id": "e5", "source": "condition", "target": "payment" },
    { "id": "e6", "source": "payment", "target": "proof" }
  ],
  "createdAt": "2026-08-13T00:00:00Z",
  "updatedAt": "2026-08-13T00:00:00Z"
}
```

---

## 9. Execution Model

Each run is a state machine.

```ts
export type RunStatus =
  | "pending"
  | "running"
  | "waiting"
  | "completed"
  | "failed";

export type NodeRunStatus =
  | "idle"
  | "ready"
  | "running"
  | "waiting"
  | "completed"
  | "failed"
  | "blocked";
```

Run:

```ts
export interface WorkflowRun {
  id: string;
  workflowId: string;
  workflowVersion: number;
  status: RunStatus;
  input: Record<string, unknown>;
  nodeRuns: Record<string, NodeRun>;
  createdAt: string;
  completedAt?: string;
  proof?: ExecutionProof;
}
```

Node run:

```ts
export interface NodeRun {
  nodeId: string;
  status: NodeRunStatus;
  startedAt?: string;
  completedAt?: string;
  output?: Record<string, unknown>;
  error?: string;
}
```

---

## 10. Node Runtime Interface

```ts
export interface NodeExecutionContext {
  run: WorkflowRun;
  workflow: Workflow;
  inputs: Record<string, unknown>;
  previousOutputs: Record<string, unknown>;
}

export interface NodeExecutionResult {
  status: "completed" | "waiting" | "failed";
  output?: Record<string, unknown>;
  reason?: string;
}

export interface RuntimeNodeHandler {
  type: NodeType;

  validate(
    node: WorkflowNode,
    workflow: Workflow
  ): Promise<void>;

  execute(
    node: WorkflowNode,
    context: NodeExecutionContext
  ): Promise<NodeExecutionResult>;
}
```

For MVP, handlers can be simple.

Examples:

### Approval
Returns waiting until the corresponding role has approved.

### Condition
Checks all upstream approval nodes.

### Payment
Can start as simulation, then optionally send a real devnet transaction.

### Attestation
Creates final workflow proof.

---

## 11. Execution Algorithm

Pseudo-code:

```ts
async function advanceRun(runId: string) {
  const run = await loadRun(runId);
  const workflow = await loadWorkflow(run.workflowId);

  const orderedNodes = topologicalSort(workflow);

  for (const node of orderedNodes) {
    const nodeRun = run.nodeRuns[node.id];

    if (nodeRun.status === "completed") {
      continue;
    }

    if (!allRequiredParentsCompleted(node, run, workflow)) {
      markBlocked(node);
      continue;
    }

    const result = await executeNode(node, run, workflow);

    updateNodeRun(node.id, result);

    if (result.status === "waiting") {
      run.status = "waiting";
      return run;
    }

    if (result.status === "failed") {
      run.status = "failed";
      return run;
    }
  }

  if (allNodesCompleted(run)) {
    run.status = "completed";
  }

  return run;
}
```

For bounty prototype, implementation can be simpler and deterministic.

---

## 12. Approval Model

Approval record:

```ts
export interface Approval {
  id: string;
  runId: string;
  nodeId: string;
  role: "buyer" | "logistics" | "finance" | "supplier";
  actorName: string;
  actorId: string;
  decision: "approved" | "rejected";
  timestamp: string;
  signature?: string;
}
```

MVP may simulate users with buttons:
- Approve as Buyer
- Approve as Logistics

Optional:
Use wallet signature for one actor if time allows.

---

## 13. AI Flow Generation

LLM should not invent arbitrary code.

Input:
Plain-English user intent.

Output:
Strict workflow JSON matching Zod schema.

Available node types should be constrained.

Example system instruction:

```text
You convert business process descriptions into executable PactFlow workflows.

Use only these node types:
- manual_trigger
- webhook_trigger
- business_event
- approval
- multi_approval
- condition
- usdc_payment
- escrow
- attestation
- webhook_output
- api_call

Rules:
1. Create a valid directed acyclic graph.
2. Use blockchain/payment nodes only when the process involves shared trust, settlement, or independently verifiable execution.
3. Keep private business data offchain.
4. Do not add unnecessary nodes.
5. Return JSON only.
```

Generation flow:

```text
User Prompt
   |
   v
LLM structured output
   |
   v
Zod validation
   |
   +---- invalid ---> repair / fallback template
   |
   v
Workflow JSON
   |
   v
React Flow canvas
```

Fallback:
If AI fails, return hero Supplier Payment template.

---

## 14. Solana Layer

Solana should be used as:
- execution rail for payment (optional real devnet transfer)
- proof/attestation layer
- neutral verification mechanism

Do NOT store sensitive enterprise data onchain.

### Proof payload

```ts
export interface ExecutionProofPayload {
  workflowId: string;
  workflowVersion: number;
  runId: string;
  inputHash: string;
  approvalsHash: string;
  executionHash: string;
  timestamp: string;
}
```

Create canonical JSON and hash it:

```text
workflow definition
+ execution inputs
+ approvals
+ payment result
        |
        v
canonical serialization
        |
        v
SHA-256
        |
        v
proof hash
        |
        v
Solana transaction / memo / attestation
```

For MVP, acceptable approaches:
1. Solana Memo transaction containing proof hash
2. Tiny custom program storing proof hash
3. Devnet payment + memo proof

Recommended MVP:
**Use a Solana devnet transaction with proof hash in memo or equivalent simple attestation.**

Reason:
- fastest to implement
- easy to verify
- easy to show explorer link
- avoids unnecessary smart contract complexity

---

## 15. Proof Object

```ts
export interface ExecutionProof {
  proofHash: string;
  transactionSignature: string;
  network: "solana-devnet";
  explorerUrl: string;
  slot?: number;
  createdAt: string;
}
```

UI copy:

> Verified on Solana

> This proof commits to the workflow inputs, approvals, and final execution result without exposing confidential business data.

---

## 16. Records / Business Data

Do NOT build full Diaflow-style tables.

MVP can use simple resource cards or mock JSON.

Example:

```ts
export interface ShipmentRecord {
  id: string;
  supplier: string;
  buyer: string;
  logisticsProvider: string;
  amount: number;
  currency: "USDC";
  status:
    | "created"
    | "delivered"
    | "approved"
    | "paid";
}
```

Hero record:

```text
Shipment #VN-2048
Supplier: ABC Manufacturing
Buyer: Nguyen Trading
Logistics: FastShip
Amount: 1,000 USDC
Status: Awaiting confirmation
```

---

## 17. Templates

MVP templates:

### Supplier Payment
Delivery → Buyer Approval + Logistics Approval → USDC Payment → Proof

### Freelancer Escrow
Client Funds Escrow → Freelancer Submits → Client Approval → Release → Proof

### Revenue Split
Payment Received → Split Rules → Multiple Payouts → Proof

### Purchase Order Settlement
PO Approved → Shipment Verified → Buyer Approval → Payment → Proof

Only Supplier Payment must be fully demo-ready.

---


---

## 17A. Expanded Example Library

The agent should seed multiple examples so the product does not look like it only supports one forced supplier-payment use case.

These examples are not all required to have full production execution. The **Supplier Payment** flow remains the primary fully-polished demo. The others should exist as templates, sample data, and optionally runnable simulations.

### Example A — Supplier Payment (Primary Demo)

**User intent**

> Pay a supplier 1,000 USDC only after both the buyer and logistics provider confirm delivery.

**Why onchain**
- Buyer and logistics provider are independent parties.
- Payment depends on shared confirmation.
- No participant should be able to unilaterally rewrite the final approval state.
- Final settlement/proof should be independently verifiable.

**Flow**

```text
[Shipment Delivered]
        |
   +----+----+
   |         |
   v         v
[Buyer]   [Logistics]
Approve    Confirm
   |         |
   +----+----+
        |
        v
    [AND Rule]
        |
        v
[Pay 1,000 USDC]
        |
        v
 [Onchain Proof]
```

---

### Example B — Freelancer Milestone Escrow

**User intent**

> Lock 2,000 USDC for a design project. Release 50% when the client approves the first milestone and release the remaining 50% after final delivery.

**Why onchain**
- Client and freelancer do not need to trust one party to hold and release funds manually.
- Release rules can be pre-agreed.
- Escrow state and payouts can be independently verified.

**Flow**

```text
[Client Funds Escrow]
          |
          v
[Milestone 1 Submitted]
          |
          v
 [Client Approval]
          |
          v
 [Release 1,000 USDC]
          |
          v
 [Final Work Submitted]
          |
          v
 [Client Final Approval]
          |
          v
 [Release 1,000 USDC]
          |
          v
    [Final Proof]
```

**Suggested nodes**
- Manual Trigger
- Escrow
- Business Event
- Approval
- USDC Payment
- Attestation

---

### Example C — Revenue Split for Creator / Agency

**User intent**

> Whenever a client payment arrives, automatically send 70% to the studio, 20% to the contractor, and 10% to the referrer, then create a public proof of the split.

**Why onchain**
- Multiple beneficiaries care about the same source payment.
- Split rules should execute deterministically.
- Recipients can verify that the agreed percentages were applied.

**Flow**

```text
[Payment Received]
        |
        v
 [Validate Amount]
        |
        v
   [Split Payment]
   /      |      \
 70%     20%     10%
  |       |       |
Studio Contractor Referrer
   \      |      /
        [Proof]
```

**Prototype behavior**
A mock incoming payment of 10,000 USDC can produce:
- Studio: 7,000 USDC
- Contractor: 2,000 USDC
- Referrer: 1,000 USDC

---

### Example D — Purchase Order Settlement

**User intent**

> Release payment for a purchase order after the supplier uploads the shipment documents, logistics confirms pickup, and the buyer accepts the shipment.

**Why onchain**
- Supplier, logistics company, and buyer are independent entities.
- Payment depends on multiple verifiable business events.
- Shared execution removes the need for one company's database to decide the final state.

**Flow**

```text
[Purchase Order Approved]
          |
          v
[Supplier Uploads Documents]
          |
          v
 [Logistics Pickup]
          |
          v
  [Buyer Acceptance]
          |
          v
   [Release Payment]
          |
          v
   [Settlement Proof]
```

**Possible future connector nodes**
- ERP
- Logistics API
- Document storage
- Bank / licensed exchange

For MVP these are mocked.

---

### Example E — Conditional Insurance / Parametric Payout

**User intent**

> Pay a predefined benefit when an approved weather data source reports that rainfall exceeds the agreed threshold and the insured farm is eligible.

**Why onchain**
- Payout rule is agreed before the event.
- External data triggers a financial action.
- Insurer and claimant can independently verify the rule and final execution.

**Flow**

```text
[Weather Data]
      |
      v
[Rainfall > Threshold?]
      |
      +------ No ------> [Stop]
      |
     Yes
      |
      v
[Check Farm Eligibility]
      |
      v
 [Release Benefit]
      |
      v
 [Onchain Proof]
```

**Important**
For MVP, weather data is simulated or provided through a mock oracle/API node. Do not build a real insurance product or make regulatory claims.

---

### Example F — B2B Service Acceptance + Payment

**User intent**

> Pay a software vendor after the technical lead marks the delivery as complete and the finance approver confirms the invoice amount.

**Why onchain**
This is only worth putting onchain when vendor and customer are independent organizations and the agreement requires neutral proof of approval/payment.

**Flow**

```text
[Vendor Submits Delivery]
          |
          +----------------+
          |                |
          v                v
[Technical Acceptance] [Finance Approval]
          |                |
          +-------+--------+
                  |
                  v
             [AND Rule]
                  |
                  v
             [Payment]
                  |
                  v
              [Proof]
```

This example is useful because it demonstrates that PactFlow can support agencies, outsourcing teams, and software vendors—not only logistics.

---

### Example G — DAO / Community Grant Milestone

**User intent**

> Release a community grant in three stages when each milestone receives approval from at least 3 of 5 reviewers.

**Why onchain**
- Multiple independent reviewers participate.
- Threshold approval is transparent.
- Funds follow predefined governance rules.

**Flow**

```text
[Grant Funded]
      |
      v
[Milestone Submitted]
      |
      v
[3-of-5 Approval]
      |
      v
[Release Tranche]
      |
      v
[Record Proof]
```

**Suggested configuration**

```json
{
  "threshold": 3,
  "reviewers": 5,
  "trancheAmount": 5000,
  "asset": "USDC"
}
```

---

### Example H — Cross-Company Deposit Refund

**User intent**

> Hold a refundable deposit for equipment rental. Return it automatically when the rental company confirms the equipment was returned and the inspection partner reports no damage.

**Why onchain**
- Renter, rental company, and inspection party have different incentives.
- Deposit release depends on shared conditions.
- Escrow prevents unilateral control over the deposit.

**Flow**

```text
[Deposit Escrowed]
       |
       v
[Equipment Returned]
       |
   +---+---+
   |       |
   v       v
[Rental] [Inspector]
Confirm  No Damage
   |       |
   +---+---+
       |
       v
 [Refund Deposit]
       |
       v
     [Proof]
```

---

## 17B. Examples That Should NOT Be Onchain

The product should demonstrate judgment, not blockchain maximalism.

These should either be rejected by AI generation or generated as normal/offchain automation.

### Internal leave approval

```text
Employee Request
    |
Manager Approval
```

**Recommendation:** Offchain database/workflow only.

Reason:
- One organization controls all participants.
- No shared settlement.
- No independent verification requirement.

### Internal CRM lead routing

```text
New Lead
  |
Assign Sales Rep
  |
Send Slack Message
```

**Recommendation:** Offchain automation.

### Internal document summarization

```text
PDF Uploaded
   |
AI Summary
   |
Save to Workspace
```

**Recommendation:** Offchain automation.

### Product rule

When the AI detects a workflow with no meaningful cross-organization trust, settlement, ownership, or verification requirement, it should say something like:

> This workflow can be automated without putting it onchain. I can build it as a normal PactFlow workflow and only add an onchain step if you need shared verification or settlement.

This behavior is important for the bounty narrative because it proves that PactFlow uses Solana selectively.

---

## 17C. Template Metadata

Seed templates should use a consistent data structure:

```ts
export interface WorkflowTemplate {
  id: string;
  name: string;
  category:
    | "payments"
    | "escrow"
    | "commerce"
    | "services"
    | "finance"
    | "governance";
  shortDescription: string;
  promptExample: string;
  whyOnchain: string[];
  workflow: Workflow;
  featured?: boolean;
}
```

Recommended template seed list:

```text
1. Verified Supplier Payment        [featured]
2. Freelancer Milestone Escrow      [featured]
3. Revenue Split
4. Purchase Order Settlement
5. Conditional Payout
6. B2B Service Acceptance
7. Grant Milestone Release
8. Equipment Deposit Refund
```

Home screen should show 4–6 of these, not only Supplier Payment.

---

## 17D. Suggested Home Template Cards

Cards should communicate the business outcome rather than blockchain primitives.

### Verified Supplier Payment
**Pay only after independent delivery confirmation.**

Tags:
`Supplier` `Approval` `Payment`

### Freelancer Escrow
**Fund milestones upfront and release as work is approved.**

Tags:
`Escrow` `Milestones`

### Revenue Split
**Automatically distribute one payment across multiple parties.**

Tags:
`Payment` `Split`

### Purchase Order Settlement
**Turn shipment verification into conditional settlement.**

Tags:
`Commerce` `Settlement`

### Conditional Payout
**Trigger a payment when trusted external conditions are met.**

Tags:
`Event` `Payment`

### Deposit Refund
**Hold and return deposits based on multi-party verification.**

Tags:
`Escrow` `Verification`

---

## 17E. Demo Strategy Across Examples

Do not attempt to make every example equally complete.

### Tier 1 — Fully polished
- Verified Supplier Payment

Must work end-to-end:
prompt → visual flow → run → approvals → payment → Solana proof.

### Tier 2 — Runnable simulation
- Freelancer Milestone Escrow
- Revenue Split

Should open in builder and have a believable run simulation.

### Tier 3 — Visual templates only
- Purchase Order Settlement
- Conditional Payout
- B2B Service Acceptance
- Grant Milestone
- Deposit Refund

They only need:
- polished template card
- correct nodes
- clear Why Onchain explanation

This creates product breadth without creating unnecessary engineering scope.


## 18. Mock Connections

Use mock integration cards:
- Solana Devnet
- Webhook
- Mock ERP
- Mock Exchange
- CSV Import

Do not claim live SCEX or CAEX integration.

Label clearly:
- Demo
- Mock
- Coming Soon

---

## 19. Visual Design Direction

Target feel:
- enterprise software
- financial infrastructure
- AI workspace
- minimal Web3 aesthetic
- polished dark interface
- spacious canvas
- subtle status colors
- no neon crypto gradients everywhere

Avoid:
- meme-coin look
- excessive purple gradients
- wallet-first onboarding
- blockchain jargon on home screen

Solana should appear only where relevant:
- payment config
- proof
- explorer verification
- network metadata

---

## 20. Demo Script

Target: 60–90 seconds.

### 0:00–0:10
Show Home.

Narration:
> Businesses still coordinate supplier payments across emails, spreadsheets, and separate systems.

### 0:10–0:20
Type:

> Pay a supplier 1,000 USDC when both the buyer and logistics provider confirm delivery.

Generate.

### 0:20–0:35
Show generated flow.

Narration:
> PactFlow turns the agreement into an executable workflow.

### 0:35–0:50
Run simulation.
Buyer approved.
Logistics pending.
Payment blocked.

Narration:
> Funds cannot move until every required party confirms the shared condition.

### 0:50–1:05
Approve logistics.
Payment executes.

### 1:05–1:20
Show proof.

Narration:
> The final execution is committed to Solana, creating an independently verifiable proof without exposing private business data.

### Final
> PactFlow turns business agreements into workflows that execute exactly as agreed.

---

## 21. Build Order

### Phase 1 — UI Shell
- app shell
- sidebar
- home
- template cards
- visual language

### Phase 2 — Builder
- React Flow canvas
- custom nodes
- edges
- node picker
- inspector
- load hero template

### Phase 3 — Execution
- run model
- approval state
- condition logic
- progress UI
- simulation controls

### Phase 4 — Solana Proof
- generate canonical proof hash
- send devnet attestation/memo
- save tx signature
- show explorer URL

### Phase 5 — AI
- prompt box
- structured workflow generation
- Zod validation
- fallback template

### Phase 6 — Polish
- animations
- empty states
- error states
- responsive desktop layout
- demo data
- seed templates

### Phase 7 — Submission
- deploy public URL
- 2-page deck
- README
- demo video
- X post

---

## 22. Agent Rules

Coding agent must follow these constraints:

1. Do not expand scope without explicit approval.
2. Prefer mock adapters over unfinished real integrations.
3. Keep workflow JSON as source of truth.
4. Keep private business data offchain.
5. Use Solana only for payment/proof-related capabilities.
6. The hero Supplier Payment flow must always remain demoable.
7. Do not block demo on AI availability; fallback to deterministic template.
8. Do not require live SCEX/CAEX/MISA APIs.
9. Prioritize desktop experience.
10. Avoid microservices.
11. Avoid unnecessary authentication complexity.
12. Every major feature must improve the final 60–90 second demo.

---

## 23. Acceptance Criteria

The MVP is accepted when:

- [ ] Public app loads without authentication blockers
- [ ] User can enter hero prompt
- [ ] A valid visual workflow appears
- [ ] Flow can be opened in advanced builder
- [ ] Buyer and logistics approvals can be simulated
- [ ] Payment remains blocked before both approvals
- [ ] Payment proceeds after both approvals
- [ ] Final proof hash is generated
- [ ] A real Solana devnet transaction can be shown OR a clear fallback simulation exists
- [ ] Proof page shows transaction metadata
- [ ] Supplier Payment flow works reliably every time
- [ ] At least 3 additional templates are visible
- [ ] UI looks like enterprise software, not a generic crypto dApp
- [ ] Demo can be completed in under 90 seconds

---

## 24. Suggested Agent Kickoff Prompt

```text
You are the lead engineer for PactFlow.

Read SYSTEM_DESIGN.md completely before writing code.

IMPORTANT — before any UI task, you MUST run:

npx ui-skills start
npx ui-skills categories
npx ui-skills list --category '<category>'
npx ui-skills get '<skill>'

Load the smallest relevant UI skill before implementing. Do not choose a skill manually from memory.

Your job is to build the bounty prototype exactly to the specification.

Priorities:
1. polished product UX,
2. reliable Supplier Payment demo,
3. workflow builder,
4. execution simulation,
5. Solana proof,
6. AI generation last.

Do not expand scope.
Do not add SCEX, CAEX, accounting, compliance, marketplace, or enterprise auth unless explicitly requested.

Start by:
1. running the mandatory ui-skills discovery flow,
2. initializing the Next.js + TypeScript project,
3. creating the app shell and sidebar,
4. implementing the Home AI workspace,
5. implementing the Supplier Payment workflow as deterministic seed data,
6. creating the React Flow builder with custom nodes.

Before each major UI surface, state which ui-skills skill you loaded and why.

After each phase, summarize:
- files changed,
- UI skill used,
- architecture decisions,
- remaining blockers,
- next recommended task.
```

---

## 25. Final Product Narrative

PactFlow is not:
- another wallet,
- another exchange,
- another generic automation tool.

PactFlow is:

> A visual business workflow platform for agreements that depend on multi-party trust, conditions, and money movement.

The product keeps normal business logic offchain and uses Solana selectively where shared execution and independent verification create real value.

The final prototype should make this understandable within 30 seconds.
