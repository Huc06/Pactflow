"use client";

import { Blocks, Cable, FileCheck2, GitBranch, Home, PanelLeftClose, Play } from "lucide-react";
import type { ReactNode } from "react";

const items = [
  ["Home", Home],
  ["Flows", GitBranch],
  ["Templates", Blocks],
  ["Runs", Play],
  ["Connections", Cable],
] as const;

export function AppShell({ children, active, onNavigate }: { children: ReactNode; active: string; onNavigate: (item: string) => void }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><PactFlowMark /><span>PactFlow</span></div>
        <nav>
          <p className="nav-label">Workspace</p>
          {items.map(([label, Icon]) => (
            <button className={`nav-item ${active === label ? "active" : ""}`} key={label} onClick={() => onNavigate(label)}>
              <Icon size={17} /><span>{label}</span>{label === "Runs" && <small>1</small>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="network"><i /><span><b>Solana Devnet</b><small>Connected</small></span></div>
          <div className="workspace-avatar"><span>PF</span><div><b>PactFlow Labs</b><small>Prototype workspace</small></div><PanelLeftClose size={16} /></div>
        </div>
      </aside>
      <main className="main-area">
        <header className="topbar"><div><FileCheck2 size={15} /> Enterprise workspace</div><span className="demo-pill">LIVE DEMO</span></header>
        {children}
      </main>
    </div>
  );
}

function PactFlowMark() {
  return <span className="brand-mark" aria-label="PactFlow logo"><svg viewBox="0 0 24 24" role="img" aria-hidden="true"><path d="M7.2 6.25 10.1 3.4a3.4 3.4 0 0 1 4.8 0l1.9 1.9a3.4 3.4 0 0 1 0 4.8l-2.05 2.05" /><path d="m16.8 17.75-2.9 2.85a3.4 3.4 0 0 1-4.8 0l-1.9-1.9a3.4 3.4 0 0 1 0-4.8l2.05-2.05" /><path d="m9.4 14.6 5.2-5.2" /></svg></span>;
}
