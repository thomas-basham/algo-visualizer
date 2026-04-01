import { MetricTile } from "@/components/ui/metric-tile";
import type { GraphSample } from "@/features/graphs/engine/types";

type GraphFrontierPanelProps = {
  graph: GraphSample;
  frontierLabel: string;
  frontierNodeIds: string[];
  traversalOrderIds: string[];
  currentNodeId: string | null;
};

function resolveLabels(graph: GraphSample, nodeIds: string[]) {
  const nodeMap = new Map(graph.nodes.map((node) => [node.id, node.label]));
  return nodeIds.map((nodeId) => nodeMap.get(nodeId) ?? nodeId);
}

export function GraphFrontierPanel({
  graph,
  frontierLabel,
  frontierNodeIds,
  traversalOrderIds,
  currentNodeId,
}: GraphFrontierPanelProps) {
  const currentLabel = currentNodeId
    ? graph.nodes.find((node) => node.id === currentNodeId)?.label ?? currentNodeId
    : "None";
  const frontierLabels = resolveLabels(graph, frontierNodeIds);
  const traversalLabels = resolveLabels(graph, traversalOrderIds);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
        <MetricTile label="Current Node" value={currentLabel} />
        <MetricTile
          label={frontierLabel}
          value={frontierLabels.length}
          hint={
            frontierLabels.length > 0
              ? frontierLabels.join(" → ")
              : `No nodes waiting in the ${frontierLabel.toLowerCase()}.`
          }
        />
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          {frontierLabel} State
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {frontierLabels.length > 0 ? (
            frontierLabels.map((label, index) => (
              <span
                key={`${label}-${index}`}
                className="inline-flex items-center rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1.5 text-sm font-medium text-violet-50"
              >
                {label}
              </span>
            ))
          ) : (
            <span className="text-sm leading-6 text-slate-400">
              The {frontierLabel.toLowerCase()} is empty.
            </span>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Traversal Order
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {traversalLabels.length > 0 ? (
            traversalLabels.map((label, index) => (
              <span
                key={`${label}-${index}`}
                className="inline-flex items-center rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-sm font-medium text-emerald-50"
              >
                {index + 1}. {label}
              </span>
            ))
          ) : (
            <span className="text-sm leading-6 text-slate-400">
              Traversal order will populate as nodes are visited.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
