"use client";

import { ArrowRight, Clock3, FileText, Sparkles, WandSparkles } from "lucide-react";
import { useState } from "react";
import { heroPrompt, templates } from "@/lib/workflow/hero";
import type { Workflow } from "@/lib/workflow/schema";
import type { ExecutionPlan } from "@/lib/workflow/compiler";

export function HomeWorkspace({ onGenerate }: { onGenerate: (workflow: Workflow, source: "gemini" | "deterministic-template", execution: ExecutionPlan) => void }) {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const generateWith = async (requestedPrompt: string) => {
    setGenerating(true);
    try {
      const response = await fetch("/api/workflows/generate", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ prompt: requestedPrompt }) });
      if (!response.ok) throw new Error("Generation failed");
      const data = await response.json() as { workflow: Workflow; source: "gemini" | "deterministic-template"; execution: ExecutionPlan };
      onGenerate(data.workflow, data.source, data.execution);
    } finally {
      setGenerating(false);
    }
  };
  const generate = () => generateWith(prompt.trim() || heroPrompt);
  return (
    <div className="page home-page">
      <section className="hero">
        <div className="eyebrow"><Sparkles size={14} /> AI workflow workspace</div>
        <h1>What agreement should<br />we put into motion?</h1>
        <p>Describe a business process, payment, or agreement. PactFlow will turn it into an executable multi-party workflow.</p>
        <div className="prompt-box">
          <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Describe a business process, payment, or agreement..." />
          <div className="prompt-actions">
            <div className="chips">{["Payment", "Escrow", "Approval", "Revenue split"].map((chip) => <button key={chip} onClick={() => setPrompt(heroPrompt)}>{chip}</button>)}</div>
            <button className="primary-button" onClick={generate} disabled={generating}><WandSparkles size={16} />{generating ? "Building flow..." : "Generate flow"}<ArrowRight size={15} /></button>
          </div>
        </div>
        <button className="hero-example" onClick={() => setPrompt(heroPrompt)}><span>Try an example</span> “Pay a supplier when buyer and logistics confirm delivery.”</button>
      </section>
      <section className="section-block">
        <div className="section-heading"><div><small>START WITH A PATTERN</small><h2>Suggested templates</h2></div><button onClick={() => setPrompt("Create an accounting workflow for invoice approval and reconciliation.")}>View all <ArrowRight size={14} /></button></div>
        <div className="template-grid">{templates.map((item) => <button className="template-card" key={item.name} onClick={() => { setPrompt(item.prompt); void generateWith(item.prompt); }}><span className={`template-icon ${item.accent}`}><FileText size={19} /></span><small>{item.type}</small><h3>{item.name}</h3><p>{item.detail}</p><ArrowRight className="card-arrow" size={17} /></button>)}</div>
      </section>
      <section className="recent-row"><div><Clock3 size={17} /><span><small>RECENT FLOW</small><b>Verified supplier payment</b></span></div><span className="draft-badge">Draft</span><p>Edited just now</p><button onClick={() => void generate()}>Open flow <ArrowRight size={14} /></button></section>
    </div>
  );
}
