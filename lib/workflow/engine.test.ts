import { describe, expect, it } from "vitest";
import { advanceRun, createRun } from "./engine";

describe("workflow execution engine", () => {
  it("keeps payment blocked before delivery and approvals", () => {
    const run = createRun();
    expect(run.status).toBe("waiting");
    expect(run.nodeRuns.payment).toBe("blocked");
    expect(run.proof).toBeNull();
  });

  it("does not accept approval before delivery", async () => {
    const run = await advanceRun(createRun(), "buyer_approved");
    expect(run.approvals.buyer).toBe(false);
    expect(run.nodeRuns.payment).toBe("blocked");
  });

  it("keeps payment blocked with only one approval", async () => {
    const delivered = await advanceRun(createRun(), "delivery_received");
    const buyerApproved = await advanceRun(delivered, "buyer_approved");
    expect(buyerApproved.nodeRuns.buyer).toBe("completed");
    expect(buyerApproved.nodeRuns.payment).toBe("blocked");
    expect(buyerApproved.proof).toBeNull();
  });

  it("settles and creates proof only after both approvals", async () => {
    let run = await advanceRun(createRun(), "delivery_received");
    run = await advanceRun(run, "buyer_approved");
    run = await advanceRun(run, "logistics_approved");
    expect(run.status).toBe("completed");
    expect(run.nodeRuns.payment).toBe("completed");
    expect(run.nodeRuns.proof).toBe("verified");
    expect(run.proof?.proofHash).toMatch(/^[a-f0-9]{64}$/);
    expect(run.proof?.mode).toBe("simulated");
    expect(run.proof?.explorerUrl).toBeNull();
  });
});
