# PactFlow

PactFlow turns multi-party business agreements into visual workflows that execute exactly as agreed.

The MVP demonstrates a supplier payment workflow in which 1,000 USDC remains blocked until both the buyer and logistics provider confirm delivery. Once its conditions are satisfied, PactFlow produces an independently verifiable Solana execution proof while keeping sensitive business data offchain.

## Status

The first interactive MVP vertical slice is implemented. It includes Gemini Structured Outputs workflow generation with deterministic fallback, visual workflow builder, API-driven approval state machine, blocked settlement behavior, and SHA-256 execution proof.

The Solana proof boundary supports live devnet Memo transactions and automatically falls back to a clearly labeled demo adapter when no signer is configured or the network is unavailable. See [PACTFLOW_SYSTEM_DESIGN.md](./PACTFLOW_SYSTEM_DESIGN.md) for the full specification.

## Planned stack

- Next.js and React
- TypeScript
- Tailwind CSS
- React Flow
- Zod
- Solana web3.js
- pnpm

## Core demo

1. Describe a business agreement in plain English.
2. Generate and inspect its visual workflow.
3. Simulate delivery and multi-party approvals.
4. Execute payment only when all conditions pass.
5. Create and display a Solana-verifiable proof.

## Run locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000), generate the example flow, select **Test flow**, and complete the three simulation actions.

To publish proof hashes to Solana devnet, copy `.env.example` to `.env.local` and provide a funded devnet `SOLANA_SECRET_KEY`. It accepts the Solana CLI JSON byte-array format or base58. Secrets are only read in the server-side adapter and must never be committed.

To generate custom workflow graphs with AI, set `GEMINI_API_KEY` and optionally `GEMINI_MODEL`. Gemini JSON output is constrained with `responseJsonSchema`, validated again with Zod, and checked for invalid references and cycles. Missing credentials, refusals, timeouts, and invalid graphs fall back to the supplier-payment template.

## Verify

```bash
pnpm lint
pnpm test
pnpm build
```

## API routes

- `POST /api/workflows/generate` validates a natural-language prompt and returns workflow JSON.
- `POST /api/runs` creates a new deterministic supplier-payment run.
- `POST /api/runs/advance` validates an action and advances the workflow state machine.
