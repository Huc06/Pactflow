"use client";

import { ArrowLeft, Check, CircleDashed, Clock3, ExternalLink, LockKeyhole, PackageCheck, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import type { RunAction, WorkflowRun } from "@/lib/workflow/schema";
import type { Workflow } from "@/lib/workflow/schema";

const stageCopy = ["Awaiting delivery", "Awaiting approvals", "One approval remaining", "Execution complete"];

export function RunView({ workflow, onBack }: { workflow: Workflow; onBack: () => void }) {
  const [run, setRun] = useState<WorkflowRun | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/runs", { method: "POST" }).then((response) => response.json()).then((data: { run: WorkflowRun }) => setRun(data.run)).catch(() => setError("Could not create the run. Please try again.")).finally(() => setBusy(false));
  }, []);
  const stage = !run?.events.deliveryReceived ? 0 : !run.approvals.buyer ? 1 : !run.approvals.logistics ? 2 : 3;
  const steps = [
    { label: "Delivery event", detail: "Shipment #VN-2048", done: stage >= 1, icon: PackageCheck },
    { label: "Buyer approval", detail: "Nguyen Trading", done: stage >= 2, icon: ShieldCheck },
    { label: "Logistics approval", detail: "FastShip", done: stage >= 3, icon: ShieldCheck },
    { label: "Payment", detail: "1,000 USDC to ABC Manufacturing", done: stage >= 3, blocked: stage < 3, icon: LockKeyhole },
    { label: "Onchain proof", detail: "Solana Devnet attestation", done: stage >= 3, icon: Sparkles },
  ];
  const action = stage === 0 ? "Simulate delivery" : stage === 1 ? "Approve as buyer" : stage === 2 ? "Approve as logistics" : "Run complete";
  const advance = async () => {
    if (!run || stage === 3) return;
    const actions: RunAction[] = ["delivery_received", "buyer_approved", "logistics_approved"];
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/runs/advance", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ run, action: actions[stage] }) });
      if (!response.ok) throw new Error("Advance failed");
      const data = await response.json() as { run: WorkflowRun };
      setRun(data.run);
    } catch { setError("Execution could not continue. Your current state is safe—try again."); } finally { setBusy(false); }
  };
  return <div className="run-page page">
    <div className="run-top"><button className="icon-button" onClick={onBack}><ArrowLeft size={18} /></button><div><small>{workflow.name.toUpperCase()}</small><h1>Run #001</h1></div><span className={`run-state s${stage}`}><i />{stageCopy[stage]}</span></div>
    <div className="run-layout"><section className="run-panel"><div className="run-summary"><div><small>WORKFLOW EXECUTION</small><h2>{stage === 3 ? "Agreement executed" : "Conditions in progress"}</h2><p>{stage === 3 ? "Every party confirmed and settlement was completed." : "Payment remains locked until all required parties confirm delivery."}</p></div><span className="progress-number">{stage === 0 ? "0" : stage === 1 ? "20" : stage === 2 ? "40" : "100"}<small>%</small></span></div>
      <div className="step-list">{steps.map((step, index) => { const Icon = step.icon; const active = (stage === 0 && index === 0) || (stage === 1 && index === 1) || (stage === 2 && index === 2); return <div className={`run-step ${step.done ? "done" : ""} ${active ? "active" : ""}`} key={step.label}><span className="step-icon">{step.done ? <Check size={17} /> : active ? <CircleDashed size={17} /> : <Icon size={17} />}</span><div><b>{step.label}</b><small>{step.detail}</small></div><span className="step-status">{step.done ? (index === 4 ? "Verified" : "Completed") : step.blocked ? "Blocked" : active ? "Ready" : "Waiting"}</span></div>; })}</div>
      {error && <p className="run-error">{error}</p>}
      <button className="run-action" disabled={stage === 3 || busy || !run} onClick={advance}>{stage < 3 && <>{stage === 0 ? <PackageCheck size={17} /> : <ShieldCheck size={17} />}</>}{busy ? "Advancing securely..." : action}{stage === 3 && <Check size={17} />}</button>
    </section>
    <aside className="run-context"><div className="context-card"><small>WORKFLOW</small><h3>{workflow.name}</h3><p className="workflow-description">{workflow.description}</p><dl><div><dt>Nodes</dt><dd>{workflow.nodes.length}</dd></div><div><dt>Connections</dt><dd>{workflow.edges.length}</dd></div><div><dt>Settlement</dt><dd>1,000 USDC</dd></div></dl></div><div className="context-card"><small>ACTIVITY</small><div className="activity"><Clock3 size={15} /><p><b>Run created</b><span>Just now · PactFlow</span></p></div>{stage >= 1 && <div className="activity"><Check size={15} /><p><b>Delivery received</b><span>Business event</span></p></div>}{stage >= 2 && <div className="activity"><Check size={15} /><p><b>Buyer approved</b><span>Required signer</span></p></div>}</div></aside></div>
    {stage === 3 && run?.proof && <ProofCard proof={run.proof} />}
  </div>;
}

function ProofCard({ proof }: { proof: NonNullable<WorkflowRun["proof"]> }) {
  return <section className="proof-card"><div className="proof-success"><span><Check size={22} /></span><div><small>{proof.mode === "live" ? "VERIFIED ON SOLANA" : "PROOF READY · SIMULATED ATTESTATION"}</small><h2>Execution proof created</h2><p>This cryptographic commitment covers the workflow, approvals, and settlement result without exposing private business data.</p>{proof.mode === "simulated" && <p className="adapter-note">Add a funded devnet signer to publish this proof onchain.</p>}</div></div><div className="proof-data"><div><small>PROOF HASH</small><code>{proof.proofHash}</code></div><div><small>TRANSACTION SIGNATURE · {proof.mode === "live" ? "LIVE" : "DEMO ADAPTER"}</small><code>{proof.signature}</code></div><div className="proof-meta"><span><small>NETWORK</small><b>{proof.network}</b></span><span><small>WORKFLOW VERSION</small><b>v1</b></span><span><small>APPROVALS</small><b>2 of 2</b></span></div>{proof.explorerUrl ? <a className="secondary-button proof-link" href={proof.explorerUrl} target="_blank" rel="noreferrer">View on Solana Explorer <ExternalLink size={14} /></a> : <button className="secondary-button" disabled>Explorer available with live adapter <ExternalLink size={14} /></button>}</div></section>;
}
