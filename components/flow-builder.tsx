"use client";

import { ArrowLeft, Check, ChevronDown, Play, Save, Sparkles } from "lucide-react";
import { FlowCanvas } from "./workflow/flow-canvas";
import type { Workflow } from "@/lib/workflow/schema";

export function FlowBuilder({ workflow, source, onBack, onRun }: { workflow: Workflow; source: "openai" | "deterministic-template"; onBack: () => void; onRun: () => void }) {
  return <div className="builder-page">
    <div className="builder-header"><button className="icon-button" onClick={onBack}><ArrowLeft size={18} /></button><div className="builder-title"><small>FLOW / DRAFT</small><h2>{workflow.name}</h2></div><span className="saved"><Check size={13} /> All changes saved</span><div className="header-actions"><button className="secondary-button"><Save size={15} /> Save</button><button className="primary-button" onClick={onRun}><Play size={15} /> Test flow</button></div></div>
    <div className="builder-body"><div className="canvas-wrap"><div className="canvas-toolbar"><span><Sparkles size={14} /> {source === "openai" ? "Generated with AI · schema verified" : "Reliable template fallback"}</span><button>v1 <ChevronDown size={13} /></button></div><FlowCanvas workflow={workflow} /></div>
    <aside className="inspector"><div className="inspector-head"><small>WORKFLOW DETAILS</small><h3>{workflow.name}</h3><p>{workflow.description}</p></div><div className="inspector-section"><label>Graph</label><div className="config-row"><b>{workflow.nodes.length} workflow nodes</b><span>{workflow.edges.length} verified connections</span></div></div><div className="inspector-section"><label>Required approvals</label><div className="actor"><span>NT</span><div><b>Nguyen Trading</b><small>Buyer</small></div><em>Required</em></div><div className="actor"><span>FS</span><div><b>FastShip</b><small>Logistics</small></div><em>Required</em></div></div><div className="inspector-section"><label>Settlement</label><div className="amount"><span>Amount</span><b>1,000.00 <small>USDC</small></b></div><div className="config-row"><b>Solana Devnet</b><span>Proof enabled</span></div></div><div className="inspector-note">Private agreement data stays offchain. Only a cryptographic proof is recorded on Solana.</div></aside></div>
  </div>;
}
