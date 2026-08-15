import { describe, expect, it } from "vitest";
import { compileWorkflow } from "./compiler";
import { supplierPaymentWorkflow } from "./template";

describe("workflow compiler guard", () => {
  it("marks the hero workflow ready", () => {
    expect(compileWorkflow(supplierPaymentWorkflow).ready).toBe(true);
  });

  it("keeps incomplete workflows preview-only", () => {
    const workflow = { ...supplierPaymentWorkflow, nodes: supplierPaymentWorkflow.nodes.filter((node) => node.kind !== "event") };
    const plan = compileWorkflow(workflow);
    expect(plan.ready).toBe(false);
    expect(plan.mode).toBe("preview-only");
  });
});
