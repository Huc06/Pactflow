"use client";

import { Background, BackgroundVariant, Controls, Handle, Position, ReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { Check, CircleDollarSign, FileKey2, PackageCheck, ShieldCheck, Split } from "lucide-react";
import { heroEdges, heroNodes } from "@/lib/workflow/hero";
import type { FlowNode } from "@/lib/workflow/types";

const iconMap = { event: PackageCheck, approval: ShieldCheck, condition: Split, payment: CircleDollarSign, proof: FileKey2 };

function PactNode({ data }: NodeProps<Node<FlowNode>>) {
  const Icon = iconMap[data.kind];
  return (
    <div className={`flow-node ${data.kind}`}>
      <Handle type="target" position={Position.Top} />
      <span className="node-icon"><Icon size={17} /></span>
      <div><small>{data.eyebrow}</small><strong>{data.label}</strong><p>{data.detail}</p></div>
      {(data.kind === "event" || data.kind === "approval") && <span className="node-check"><Check size={12} /></span>}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

const nodeTypes = { pact: PactNode };
const nodes: Node<FlowNode>[] = heroNodes.map((node) => ({ id: node.id, position: node.position, type: "pact", data: node }));

export function FlowCanvas({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flow-canvas ${compact ? "compact" : ""}`}>
      <ReactFlow nodes={nodes} edges={heroEdges} nodeTypes={nodeTypes} fitView fitViewOptions={{ padding: compact ? 0.18 : 0.12 }} nodesDraggable={!compact} nodesConnectable={!compact} elementsSelectable={!compact} proOptions={{ hideAttribution: true }}>
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#27343d" />
        {!compact && <Controls showInteractive={false} />}
      </ReactFlow>
    </div>
  );
}
