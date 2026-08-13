"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { FlowBuilder } from "@/components/flow-builder";
import { HomeWorkspace } from "@/components/home-workspace";
import { RunView } from "@/components/run-view";

type Screen = "Home" | "Flows" | "Runs";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("Home");
  const navigate = (item: string) => {
    if (item === "Runs") setScreen("Runs");
    else if (item === "Flows") setScreen("Flows");
    else if (item === "Home" || item === "Templates" || item === "Connections") setScreen("Home");
  };
  return <AppShell active={screen} onNavigate={navigate}>
    {screen === "Home" && <HomeWorkspace onGenerate={() => setScreen("Flows")} />}
    {screen === "Flows" && <FlowBuilder onBack={() => setScreen("Home")} onRun={() => setScreen("Runs")} />}
    {screen === "Runs" && <RunView onBack={() => setScreen("Flows")} />}
  </AppShell>;
}
