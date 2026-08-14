"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { FlowBuilder } from "@/components/flow-builder";
import { HomeWorkspace } from "@/components/home-workspace";
import { RunView } from "@/components/run-view";
import { supplierPaymentWorkflow } from "@/lib/workflow/template";
import type { Workflow } from "@/lib/workflow/schema";

type Screen = "Home" | "Flows" | "Runs";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("Home");
  const [workflow, setWorkflow] = useState<Workflow>(supplierPaymentWorkflow);
  const [source, setSource] = useState<"gemini" | "deterministic-template">("deterministic-template");
  const navigate = (item: string) => {
    if (item === "Runs") setScreen("Runs");
    else if (item === "Flows") setScreen("Flows");
    else if (item === "Home" || item === "Templates" || item === "Connections") setScreen("Home");
  };
  return <AppShell active={screen} onNavigate={navigate}>
    {screen === "Home" && <HomeWorkspace onGenerate={(nextWorkflow, nextSource) => { setWorkflow(nextWorkflow); setSource(nextSource); setScreen("Flows"); }} />}
    {screen === "Flows" && <FlowBuilder workflow={workflow} source={source} onBack={() => setScreen("Home")} onRun={() => setScreen("Runs")} />}
    {screen === "Runs" && <RunView onBack={() => setScreen("Flows")} />}
  </AppShell>;
}
