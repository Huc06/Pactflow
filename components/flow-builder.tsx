"use client";

import { ArrowLeft, Check, ChevronDown, Play, Save, Sparkles } from "lucide-react";
import { FlowCanvas } from "./workflow/flow-canvas";

export function FlowBuilder({ onBack, onRun }: { onBack: () => void; onRun: () => void }) {
  return <div className="builder-page">
    <div className="builder-header"><button className="icon-button" onClick={onBack}><ArrowLeft size={18} /></button><div className="builder-title"><small>FLOW / DRAFT</small><h2>Verified supplier payment</h2></div><span className="saved"><Check size={13} /> All changes saved</span><div className="header-actions"><button className="secondary-button"><Save size={15} /> Save</button><button className="primary-button" onClick={onRun}><Play size={15} /> Test flow</button></div></div>
    <div className="builder-body"><div className="canvas-wrap"><div className="canvas-toolbar"><span><Sparkles size={14} /> Generated from your agreement</span><button>v1 <ChevronDown size={13} /></button></div><FlowCanvas /></div>
    <aside className="inspector"><div className="inspector-head"><small>WORKFLOW DETAILS</small><h3>Verified supplier payment</h3><p>Pay supplier after buyer and logistics confirm delivery.</p></div><div className="inspector-section"><label>Trigger</label><div className="config-row"><b>Delivery received</b><span>Business event</span></div></div><div className="inspector-section"><label>Required approvals</label><div className="actor"><span>NT</span><div><b>Nguyen Trading</b><small>Buyer</small></div><em>Required</em></div><div className="actor"><span>FS</span><div><b>FastShip</b><small>Logistics</small></div><em>Required</em></div></div><div className="inspector-section"><label>Settlement</label><div className="amount"><span>Amount</span><b>1,000.00 <small>USDC</small></b></div><div className="config-row"><b>Solana Devnet</b><span>Proof enabled</span></div></div><div className="inspector-note">Private agreement data stays offchain. Only a cryptographic proof is recorded on Solana.</div></aside></div>
  </div>;
}
