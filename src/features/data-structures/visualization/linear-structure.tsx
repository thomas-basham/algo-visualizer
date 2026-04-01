"use client";

import { memo } from "react";

import { StructureNode } from "@/features/data-structures/visualization/structure-node";
import type {
  DataStructureId,
  LinearStructureSnapshot,
} from "@/features/data-structures/engine/types";

type LinearStructureProps = {
  structureId: Exclude<DataStructureId, "binary-search-tree">;
  snapshot: LinearStructureSnapshot;
  activeIds: string[];
  visitedIds: string[];
  foundIds: string[];
  insertedIds: string[];
  removedIds: string[];
};

function getNodeTone(
  nodeId: string,
  activeSet: Set<string>,
  visitedSet: Set<string>,
  foundSet: Set<string>,
  insertedSet: Set<string>,
  removedSet: Set<string>,
) {
  if (foundSet.has(nodeId)) {
    return "found";
  }

  if (removedSet.has(nodeId)) {
    return "removed";
  }

  if (insertedSet.has(nodeId)) {
    return "inserted";
  }

  if (activeSet.has(nodeId)) {
    return "active";
  }

  if (visitedSet.has(nodeId)) {
    return "visited";
  }

  return "default";
}

function getStructureLabels(
  structureId: Exclude<DataStructureId, "binary-search-tree">,
  index: number,
  size: number,
) {
  if (structureId === "stack") {
    if (index === size - 1) {
      return "Top";
    }

    if (index === 0) {
      return "Base";
    }

    return undefined;
  }

  if (structureId === "queue") {
    if (index === 0) {
      return "Front";
    }

    if (index === size - 1) {
      return "Back";
    }

    return undefined;
  }

  if (index === 0) {
    return "Head";
  }

  if (index === size - 1) {
    return "Tail";
  }

  return undefined;
}

export const LinearStructure = memo(function LinearStructure({
  structureId,
  snapshot,
  activeIds,
  visitedIds,
  foundIds,
  insertedIds,
  removedIds,
}: LinearStructureProps) {
  const activeSet = new Set(activeIds);
  const visitedSet = new Set(visitedIds);
  const foundSet = new Set(foundIds);
  const insertedSet = new Set(insertedIds);
  const removedSet = new Set(removedIds);

  if (snapshot.nodes.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] px-6 py-12 text-center text-sm leading-7 text-slate-400">
        This {structureId.replace("-", " ")} is empty. Run an add operation to create the next node.
      </div>
    );
  }

  if (structureId === "stack") {
    return (
      <div className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] p-5">
        <div className="mx-auto flex max-w-xs flex-col-reverse gap-3">
          {snapshot.nodes.map((node, index) => (
            <StructureNode
              key={node.id}
              value={node.value}
              label={getStructureLabels(structureId, index, snapshot.nodes.length)}
              tone={getNodeTone(
                node.id,
                activeSet,
                visitedSet,
                foundSet,
                insertedSet,
                removedSet,
              )}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] p-5">
      <div className="overflow-x-auto pb-1">
        <div className="flex min-w-max items-center gap-3">
          {snapshot.nodes.map((node, index) => (
            <div key={node.id} className="flex items-center gap-3">
              <StructureNode
                value={node.value}
                label={getStructureLabels(structureId, index, snapshot.nodes.length)}
                tone={getNodeTone(
                  node.id,
                  activeSet,
                  visitedSet,
                  foundSet,
                  insertedSet,
                  removedSet,
                )}
                className="min-w-24"
              />
              {index < snapshot.nodes.length - 1 ? (
                <div className="flex items-center gap-2 text-slate-500">
                  <span className="h-px w-6 bg-white/12" />
                  <span className="text-xs uppercase tracking-[0.18em]">
                    {structureId === "linked-list" ? "Next" : "Then"}
                  </span>
                  <span className="h-px w-6 bg-white/12" />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
