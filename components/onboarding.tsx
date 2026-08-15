"use client";

import { ArrowRight, Check, FileText, ShieldCheck, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

const steps = [
  { icon: FileText, label: "Describe the agreement", detail: "Start with plain English. PactFlow turns the intent into a workflow you can inspect." },
  { icon: ShieldCheck, label: "Get every party aligned", detail: "Approvals and conditions keep money blocked until the agreement is satisfied." },
  { icon: Sparkles, label: "Prove the outcome", detail: "A cryptographic proof records the execution on Solana without exposing private data." },
];

export function Onboarding() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  useEffect(() => { setOpen(window.localStorage.getItem("pactflow-onboarding-complete") !== "true"); }, []);
  const close = () => { window.localStorage.setItem("pactflow-onboarding-complete", "true"); setOpen(false); };
  if (!open) return null;
  const current = steps[step]; const Icon = current.icon;
  return <div className="onboarding-backdrop" role="presentation"><section className="onboarding-modal" role="dialog" aria-modal="true" aria-labelledby="onboarding-title"><button className="onboarding-close" aria-label="Close onboarding" onClick={close}><X size={17} /></button><div className="onboarding-kicker"><span className="onboarding-mark"><Check size={14} /></span> Welcome to PactFlow</div><h2 id="onboarding-title">Turn an agreement<br />into something executable.</h2><p className="onboarding-intro">A short tour before you build your first multi-party workflow.</p><div className="onboarding-steps">{steps.map((item, index) => <button className={`onboarding-step ${index === step ? "selected" : ""} ${index < step ? "visited" : ""}`} key={item.label} onClick={() => setStep(index)}><span className="onboarding-step-number">{index < step ? <Check size={12} /> : index + 1}</span><span>{item.label}</span></button>)}</div><div className="onboarding-detail"><span className="onboarding-icon"><Icon size={20} /></span><div><h3>{current.label}</h3><p>{current.detail}</p></div></div><div className="onboarding-footer"><span>{step + 1} of {steps.length}</span>{step < steps.length - 1 ? <button className="primary-button" onClick={() => setStep(step + 1)}>Next <ArrowRight size={15} /></button> : <button className="primary-button" onClick={close}>Start building <ArrowRight size={15} /></button>}</div></section></div>;
}
