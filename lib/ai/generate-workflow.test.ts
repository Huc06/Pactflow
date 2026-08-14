import { describe, expect, it } from "vitest";
import { validateGraph } from "./generate-workflow";
import { supplierPaymentWorkflow } from "../workflow/template";

describe("AI workflow graph validation", () => {
  it("accepts the supplier payment DAG", () => {
    expect(() => validateGraph(supplierPaymentWorkflow)).not.toThrow();
  });

  it("rejects edges referencing unknown nodes", () => {
    const workflow = { ...supplierPaymentWorkflow, edges: [...supplierPaymentWorkflow.edges, { id: "bad", source: "missing", target: "proof" }] };
    expect(() => validateGraph(workflow)).toThrow("unknown node");
  });

  it("rejects cyclic model output", () => {
    const workflow = { ...supplierPaymentWorkflow, edges: [...supplierPaymentWorkflow.edges, { id: "cycle", source: "proof", target: "delivery" }] };
    expect(() => validateGraph(workflow)).toThrow("acyclic");
  });
});
