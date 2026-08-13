# PactFlow

PactFlow turns multi-party business agreements into visual workflows that execute exactly as agreed.

The MVP demonstrates a supplier payment workflow in which 1,000 USDC remains blocked until both the buyer and logistics provider confirm delivery. Once its conditions are satisfied, PactFlow produces an independently verifiable Solana execution proof while keeping sensitive business data offchain.

## Status

PactFlow is currently being developed as an MVP/prototype. See [PACTFLOW_SYSTEM_DESIGN.md](./PACTFLOW_SYSTEM_DESIGN.md) for the product and technical specification.

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
