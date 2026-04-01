"use client";

import { memo, useMemo } from "react";

import { cn } from "@/lib/utils";
import type { TreeStructureNode, TreeStructureSnapshot } from "@/features/data-structures/engine/types";

type TreeStructureProps = {
  snapshot: TreeStructureSnapshot;
  activeIds: string[];
  visitedIds: string[];
  foundIds: string[];
  insertedIds: string[];
  removedIds: string[];
};

type NodePosition = {
  node: TreeStructureNode;
  x: number;
  depth: number;
};

function buildNodePositions(snapshot: TreeStructureSnapshot) {
  const nodeMap = new Map(snapshot.nodes.map((node) => [node.id, node]));
  const positions = new Map<string, NodePosition>();
  let nextColumn = 0;
  let maxDepth = 0;

  function walk(nodeId: string | null, depth: number) {
    if (!nodeId) {
      return;
    }

    const node = nodeMap.get(nodeId);

    if (!node) {
      return;
    }

    walk(node.leftId, depth + 1);
    positions.set(node.id, {
      node,
      x: nextColumn,
      depth,
    });
    nextColumn += 1;
    maxDepth = Math.max(maxDepth, depth);
    walk(node.rightId, depth + 1);
  }

  walk(snapshot.rootId, 0);

  return {
    positions,
    columns: Math.max(nextColumn, 1),
    rows: maxDepth + 1,
  };
}

function getNodeTone(
  nodeId: string,
  activeSet: Set<string>,
  visitedSet: Set<string>,
  foundSet: Set<string>,
  insertedSet: Set<string>,
  removedSet: Set<string>,
) {
  if (foundSet.has(nodeId)) {
    return "border-emerald-300/30 bg-emerald-300/14 text-emerald-50";
  }

  if (removedSet.has(nodeId)) {
    return "border-rose-300/30 bg-rose-300/12 text-rose-50 opacity-70";
  }

  if (insertedSet.has(nodeId)) {
    return "border-fuchsia-300/28 bg-fuchsia-300/12 text-fuchsia-50";
  }

  if (activeSet.has(nodeId)) {
    return "border-cyan-300/30 bg-cyan-300/14 text-cyan-50";
  }

  if (visitedSet.has(nodeId)) {
    return "border-white/8 bg-white/[0.03] text-slate-400";
  }

  return "border-white/10 bg-white/[0.05] text-slate-100";
}

export const TreeStructure = memo(function TreeStructure({
  snapshot,
  activeIds,
  visitedIds,
  foundIds,
  insertedIds,
  removedIds,
}: TreeStructureProps) {
  const activeSet = new Set(activeIds);
  const visitedSet = new Set(visitedIds);
  const foundSet = new Set(foundIds);
  const insertedSet = new Set(insertedIds);
  const removedSet = new Set(removedIds);

  const layout = useMemo(() => buildNodePositions(snapshot), [snapshot]);
  const nodePositions = Array.from(layout.positions.values());
  const svgHeight = layout.rows * 110;

  if (!snapshot.rootId || snapshot.nodes.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] px-6 py-12 text-center text-sm leading-7 text-slate-400">
        This tree is empty. Run an insert operation to create the root node.
      </div>
    );
  }

  return (
    <div className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] p-5">
      <div className="relative overflow-x-auto">
        <div className="relative min-w-[36rem]" style={{ height: svgHeight }}>
          <svg className="absolute inset-0 h-full w-full">
            {nodePositions.flatMap(({ node, x, depth }) => {
              const lines = [];
              const x1 = layout.columns === 1 ? 50 : (x / (layout.columns - 1)) * 100;
              const y1 = depth * 110 + 42;

              if (node.leftId) {
                const leftPosition = layout.positions.get(node.leftId);

                if (leftPosition) {
                  const x2 =
                    layout.columns === 1
                      ? 50
                      : (leftPosition.x / (layout.columns - 1)) * 100;
                  const y2 = leftPosition.depth * 110 + 12;

                  lines.push(
                    <line
                      key={`${node.id}-${node.leftId}`}
                      x1={`${x1}%`}
                      y1={y1}
                      x2={`${x2}%`}
                      y2={y2}
                      stroke="rgba(148, 163, 184, 0.35)"
                      strokeWidth="2"
                    />,
                  );
                }
              }

              if (node.rightId) {
                const rightPosition = layout.positions.get(node.rightId);

                if (rightPosition) {
                  const x2 =
                    layout.columns === 1
                      ? 50
                      : (rightPosition.x / (layout.columns - 1)) * 100;
                  const y2 = rightPosition.depth * 110 + 12;

                  lines.push(
                    <line
                      key={`${node.id}-${node.rightId}`}
                      x1={`${x1}%`}
                      y1={y1}
                      x2={`${x2}%`}
                      y2={y2}
                      stroke="rgba(148, 163, 184, 0.35)"
                      strokeWidth="2"
                    />,
                  );
                }
              }

              return lines;
            })}
          </svg>

          {nodePositions.map(({ node, x, depth }) => {
            const leftPercent = layout.columns === 1 ? 50 : (x / (layout.columns - 1)) * 100;

            return (
              <div
                key={node.id}
                className="absolute w-20 -translate-x-1/2"
                style={{
                  left: `${leftPercent}%`,
                  top: depth * 110,
                }}
              >
                <div
                  className={cn(
                    "rounded-3xl border px-4 py-3 text-center transition duration-300",
                    getNodeTone(
                      node.id,
                      activeSet,
                      visitedSet,
                      foundSet,
                      insertedSet,
                      removedSet,
                    ),
                  )}
                >
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    Node
                  </div>
                  <div className="mt-1 text-2xl font-semibold tracking-tight">{node.value}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});
