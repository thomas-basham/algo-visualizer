"use client";

import { memo } from "react";

import { cn } from "@/lib/utils";
import type { GraphSample } from "@/features/graphs/engine/types";

type GraphCanvasProps = {
  graph: GraphSample;
  activeNodeIds: string[];
  activeEdgeIds: string[];
  visitedNodeIds: string[];
  frontierNodeIds: string[];
  currentNodeId: string | null;
};

function getNodeTone(
  nodeId: string,
  visitedSet: Set<string>,
  frontierSet: Set<string>,
  activeSet: Set<string>,
  currentNodeId: string | null,
) {
  if (nodeId === currentNodeId) {
    return "border-cyan-300/35 bg-cyan-300/18 text-cyan-50 shadow-[0_0_0_1px_rgba(103,232,249,0.12)]";
  }

  if (activeSet.has(nodeId)) {
    return "border-sky-300/30 bg-sky-300/12 text-sky-50";
  }

  if (visitedSet.has(nodeId)) {
    return "border-emerald-300/30 bg-emerald-300/14 text-emerald-50";
  }

  if (frontierSet.has(nodeId)) {
    return "border-violet-300/28 bg-violet-300/12 text-violet-50";
  }

  return "border-white/10 bg-white/[0.05] text-slate-100";
}

export const GraphCanvas = memo(function GraphCanvas({
  graph,
  activeNodeIds,
  activeEdgeIds,
  visitedNodeIds,
  frontierNodeIds,
  currentNodeId,
}: GraphCanvasProps) {
  const nodeMap = new Map(graph.nodes.map((node) => [node.id, node]));
  const activeSet = new Set(activeNodeIds);
  const activeEdgeSet = new Set(activeEdgeIds);
  const visitedSet = new Set(visitedNodeIds);
  const frontierSet = new Set(frontierNodeIds);

  return (
    <div className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] p-5">
      <div className="relative overflow-x-auto">
        <div className="relative min-h-[24rem] min-w-[38rem]">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 640 400" aria-hidden="true">
            {graph.edges.map((edge) => {
              const fromNode = nodeMap.get(edge.from);
              const toNode = nodeMap.get(edge.to);

              if (!fromNode || !toNode) {
                return null;
              }

              return (
                <line
                  key={edge.id}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={
                    activeEdgeSet.has(edge.id)
                      ? "rgba(103, 232, 249, 0.95)"
                      : "rgba(148, 163, 184, 0.32)"
                  }
                  strokeWidth={activeEdgeSet.has(edge.id) ? "4" : "2.5"}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>

          {graph.nodes.map((node) => (
            <div
              key={node.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: node.x, top: node.y }}
            >
              <div
                className={cn(
                  "flex h-16 w-16 items-center justify-center rounded-full border text-xl font-semibold tracking-tight transition duration-300",
                  getNodeTone(node.id, visitedSet, frontierSet, activeSet, currentNodeId),
                )}
              >
                {node.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3 text-xs text-slate-400">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
          Current node
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
          Visited node
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-violet-300" />
          Waiting in frontier
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-sky-300" />
          Active edge / neighbor
        </span>
      </div>
    </div>
  );
});
