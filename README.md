# PactFlow

### Business agreements that execute exactly as agreed.

PactFlow turns a plain-English agreement into a visual, multi-party workflow. Conditions stay explicit, payment stays blocked until the right people confirm, and the final outcome can be independently verified on Solana.

> **Prototype status:** MVP for bounty/demo use. The default supplier-payment flow is deterministic and always runnable; Gemini and Solana are optional adapters with safe fallbacks.

## The 90-second demo

Describe:

> Pay a supplier 1,000 USDC when both the buyer and logistics provider confirm delivery.

PactFlow generates a workflow, then lets you:

1. Receive the delivery event.
2. Approve as the buyer.
3. Approve as logistics.
4. See payment remain blocked until both approvals exist.
5. Create a proof hash and publish a Solana Devnet Memo transaction.

Private business data stays offchain. The onchain proof commits to the workflow, approvals, and execution result.

## What is implemented

| Surface | Behavior |
| --- | --- |
| Home workspace | Plain-English prompt, templates, first-run onboarding |
| Workflow builder | React Flow canvas, custom nodes, inspector, graph metadata |
| Execution view | Generic DAG state machine with workflow-specific ready actions |
| Settlement guard | Payment remains blocked until both approvals pass |
| Proof view | SHA-256 commitment, live/simulated mode, Explorer link |
| AI generation | Gemini structured JSON with Zod + DAG validation |
| Solana adapter | Devnet Memo transaction with simulation fallback |

All five demo recipes now execute end-to-end in the simulator: supplier payment, freelancer escrow, revenue split, purchase-order settlement, and accounting reconciliation. Event and approval nodes wait for an explicit action; condition, payment, and proof nodes advance automatically when their upstream nodes complete.

## Architecture

```text
Browser
  └─ Next.js app
      ├─ Home / Builder / Run UI
      ├─ API routes
      │   ├─ Workflow generation (Gemini or template fallback)
      │   └─ Run advancement (validated state machine)
      └─ Server adapters
          ├─ Zod workflow + graph validation
          └─ Solana Devnet Memo attestation
```

The workflow JSON is the source of truth. Server-side validation rejects malformed nodes, unknown edge references, and cyclic graphs before a workflow reaches the canvas. A compile step refuses to run graphs without an event trigger or proof node.

## Quick start

Requirements: Node.js 20+, pnpm 10+, and (optionally) the Solana CLI for live Devnet proofs.

```bash
git clone https://github.com/Huc06/Pactflow.git
cd PactFlow
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The app works without credentials using the deterministic template and simulated proof adapter.

## Environment variables

Copy the example file:

```bash
cp .env.example .env.local
```

For Gemini workflow generation:

```env
GEMINI_API_KEY=your_gemini_key
GEMINI_MODEL=gemini-flash-latest
```

For live Solana Devnet proof publishing, use either a local keypair file or a secret key value—not both:

```env
# Recommended locally
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_KEYPAIR_PATH=/absolute/path/to/pactflow-devnet.json

# Recommended for Vercel environment variables
SOLANA_SECRET_KEY=[64-byte JSON array]
```

Use a funded **Devnet-only** wallet. Never commit `.env.local`, a keypair file, or a mainnet private key. Without a signer, PactFlow clearly labels the proof as simulated instead of blocking the demo.

## Verification

```bash
pnpm lint       # ESLint
pnpm test       # execution, adapter, and graph invariants
pnpm build      # production build
```

## API surface

- `POST /api/workflows/generate` — validates a prompt and returns a Gemini-generated or deterministic workflow.
- `POST /api/runs` — creates a supplier-payment run.
- `POST /api/runs/advance` — validates one event/approval and returns the next run state plus proof when complete.

## Product boundaries

PactFlow uses Solana where shared execution and independent verification add value. It does not attempt to be a generic automation platform, wallet, exchange, accounting integration, or enterprise auth system.

Out of scope for this MVP: production treasury, SCEX/CAEX/accounting integrations, mobile apps, complex RBAC, and storing sensitive business records onchain.

## Roadmap

- Persist workflows and runs with a database adapter.
- Add wallet signatures for actor approvals.
- Add real USDC settlement behind an explicit treasury adapter.
- Add deployment configuration for Vercel and managed RPC.
- Expand templates beyond the five executable POC recipes.

## Specification

Read the complete product and technical design in [PACTFLOW_SYSTEM_DESIGN.md](./PACTFLOW_SYSTEM_DESIGN.md).

## License

Prototype code for the PactFlow project. Licensing terms will be added before production distribution.
