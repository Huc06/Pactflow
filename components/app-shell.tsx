"use client";

import { Blocks, Cable, FileCheck2, GitBranch, Home, PanelLeftClose, Play, Sparkles } from "lucide-react";
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
        <div className="brand"><span className="brand-mark"><Sparkles size={17} /></span><span>PactFlow</span></div>
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
