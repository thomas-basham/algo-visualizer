import type {
  DataStructureMeta,
  DataStructureMetrics,
  DataStructureSnapshot,
} from "@/features/data-structures/engine/types";

type DataStructuresMetricsPanelProps = {
  metrics: DataStructureMetrics;
  snapshot: DataStructureSnapshot;
  structure: DataStructureMeta;
};

function getSize(snapshot: DataStructureSnapshot) {
  return snapshot.nodes.length;
}

const formatter = new Intl.NumberFormat("en-US");

export function DataStructuresMetricsPanel({
  metrics,
  snapshot,
  structure,
}: DataStructuresMetricsPanelProps) {
  const items = [
    {
      label: "Steps",
      value: formatter.format(metrics.steps),
      detail: "Frames advanced on the playback timeline",
    },
    {
      label: "Comparisons",
      value: formatter.format(metrics.comparisons),
      detail: "Value or node checks emitted by the operation",
    },
    {
      label: "Operations",
      value: formatter.format(metrics.operations),
      detail: "Mutations and terminal events emitted so far",
    },
    {
      label: "Elapsed",
      value: `${(metrics.elapsedMs / 1000).toFixed(2)}s`,
      detail: "Playback time at the current frame",
    },
    {
      label: "Size",
      value: formatter.format(getSize(snapshot)),
      detail: `Current ${structure.label.toLowerCase()} node count`,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-4"
        >
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {item.label}
          </div>
          <div className="mt-3 text-2xl font-semibold tracking-tight text-white">
            {item.value}
          </div>
          <div className="mt-2 text-xs leading-6 text-slate-400">{item.detail}</div>
        </div>
      ))}
    </div>
  );
}
