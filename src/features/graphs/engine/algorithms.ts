import { buildTimeline } from "@/lib/animation/timeline";
import type { VisualizationEvent } from "@/lib/animation/types";
import { createGraphEvent } from "@/features/graphs/engine/event-helpers";
import { reduceGraphEvent } from "@/features/graphs/engine/reducer";
import { createInitialGraphState } from "@/features/graphs/engine/sample-run";
import type {
  GraphAlgorithmId,
  GraphSample,
  GraphTimeline,
} from "@/features/graphs/engine/types";

type GraphTraversalContext = {
  graph: GraphSample;
  startNodeId: string;
  frontierLabel: string;
};

type TraversalRecorder = {
  annotate: (
    label: string,
    frontierNodeIds: string[],
    stepTitle: string,
    stepDetail: string,
    pseudocodeLine: number | null,
    targetIds?: string[],
    sourceIds?: string[],
    currentNodeId?: string | null,
  ) => void;
  compare: (
    currentNodeId: string,
    currentNodeLabel: string,
    neighborNodeId: string,
    neighborNodeLabel: string,
    edgeId: string,
    frontierNodeIds: string[],
    stepTitle: string,
    stepDetail: string,
    pseudocodeLine: number,
  ) => void;
  visit: (
    nodeId: string,
    nodeLabel: string,
    frontierNodeIds: string[],
    stepTitle: string,
    stepDetail: string,
    pseudocodeLine: number,
  ) => void;
  finish: () => VisualizationEvent[];
};

function createNodeMap(graph: GraphSample) {
  return new Map(graph.nodes.map((node) => [node.id, node]));
}

function createAdjacency(graph: GraphSample) {
  const nodeMap = createNodeMap(graph);
  const adjacency = new Map<
    string,
    Array<{
      nodeId: string;
      edgeId: string;
      label: string;
    }>
  >();

  graph.nodes.forEach((node) => {
    adjacency.set(node.id, []);
  });

  graph.edges.forEach((edge) => {
    adjacency.get(edge.from)?.push({
      nodeId: edge.to,
      edgeId: edge.id,
      label: nodeMap.get(edge.to)?.label ?? edge.to,
    });
    adjacency.get(edge.to)?.push({
      nodeId: edge.from,
      edgeId: edge.id,
      label: nodeMap.get(edge.from)?.label ?? edge.from,
    });
  });

  adjacency.forEach((neighbors) => {
    neighbors.sort((left, right) => left.label.localeCompare(right.label));
  });

  return adjacency;
}

function createRecorder(frontierLabel: string): TraversalRecorder {
  const events: VisualizationEvent[] = [];

  return {
    annotate(
      label,
      frontierNodeIds,
      stepTitle,
      stepDetail,
      pseudocodeLine,
      targetIds = [],
      sourceIds,
      currentNodeId,
    ) {
      events.push(
        createGraphEvent("annotate", targetIds, label, {
          frontierNodeIds,
          frontierLabel,
          stepTitle,
          stepDetail,
          pseudocodeLine,
          sourceIds,
          currentNodeId,
        }),
      );
    },
    compare(
      currentNodeId,
      currentNodeLabel,
      neighborNodeId,
      neighborNodeLabel,
      edgeId,
      frontierNodeIds,
      stepTitle,
      stepDetail,
      pseudocodeLine,
    ) {
      events.push(
        createGraphEvent(
          "compare",
          [edgeId, neighborNodeId],
          `Inspecting edge from ${currentNodeLabel} to ${neighborNodeLabel}.`,
          {
            frontierNodeIds,
            frontierLabel,
            stepTitle,
            stepDetail,
            pseudocodeLine,
            sourceIds: [currentNodeId],
            currentNodeId,
          },
        ),
      );
    },
    visit(nodeId, nodeLabel, frontierNodeIds, stepTitle, stepDetail, pseudocodeLine) {
      events.push(
        createGraphEvent("visit", [nodeId], `Visiting ${nodeLabel}.`, {
          frontierNodeIds,
          frontierLabel,
          stepTitle,
          stepDetail,
          pseudocodeLine,
          currentNodeId: nodeId,
        }),
      );
    },
    finish() {
      return events;
    },
  };
}

function emitBfsEvents({ graph, startNodeId, frontierLabel }: GraphTraversalContext) {
  const adjacency = createAdjacency(graph);
  const nodeMap = createNodeMap(graph);
  const discovered = new Set<string>([startNodeId]);
  const queue = [startNodeId];
  const recorder = createRecorder(frontierLabel);

  recorder.annotate(
    `Queue starts with ${nodeMap.get(startNodeId)?.label ?? startNodeId}.`,
    [...queue],
    "Initialize the queue",
    "Breadth-First Search begins by marking the start node as discovered and placing it in the queue.",
    1,
    [startNodeId],
    [startNodeId],
    startNodeId,
  );

  while (queue.length > 0) {
    const currentNodeId = queue.shift()!;
    const currentLabel = nodeMap.get(currentNodeId)?.label ?? currentNodeId;

    recorder.visit(
      currentNodeId,
      currentLabel,
      [...queue],
      `Visit ${currentLabel}`,
      `${currentLabel} leaves the front of the queue and becomes the current node for this layer of the traversal.`,
      4,
    );

    const neighbors = adjacency.get(currentNodeId) ?? [];

    neighbors.forEach((neighbor) => {
      const frontierSnapshot = [...queue];
      const neighborLabel = nodeMap.get(neighbor.nodeId)?.label ?? neighbor.nodeId;

      recorder.compare(
        currentNodeId,
        currentLabel,
        neighbor.nodeId,
        neighborLabel,
        neighbor.edgeId,
        frontierSnapshot,
        `Inspect neighbor ${neighborLabel}`,
        discovered.has(neighbor.nodeId)
          ? `${neighborLabel} is already discovered, so the queue does not change.`
          : `${neighborLabel} has not been discovered yet, so BFS can enqueue it for a later layer.`,
        5,
      );

      if (discovered.has(neighbor.nodeId)) {
        recorder.annotate(
          `${neighborLabel} is already discovered.`,
          frontierSnapshot,
          `Skip ${neighborLabel}`,
          "BFS ignores nodes that were already discovered earlier so the queue does not collect duplicates.",
          5,
          [neighbor.edgeId, neighbor.nodeId],
          [currentNodeId],
          currentNodeId,
        );
        return;
      }

      discovered.add(neighbor.nodeId);
      queue.push(neighbor.nodeId);

      recorder.annotate(
        `Enqueued ${neighborLabel}.`,
        [...queue],
        `Queue ${neighborLabel}`,
        `${neighborLabel} joins the back of the queue and will be visited after the earlier nodes finish their turns.`,
        6,
        [neighbor.edgeId, neighbor.nodeId],
        [currentNodeId],
        currentNodeId,
      );
    });
  }

  recorder.annotate(
    "Breadth-First Search is complete.",
    [],
    "Traversal complete",
    "The queue is empty, so every reachable node from the start node has been visited in breadth-first order.",
    7,
  );

  return recorder.finish();
}

function emitDfsEvents({ graph, startNodeId, frontierLabel }: GraphTraversalContext) {
  const adjacency = createAdjacency(graph);
  const nodeMap = createNodeMap(graph);
  const discovered = new Set<string>([startNodeId]);
  const stack = [startNodeId];
  const recorder = createRecorder(frontierLabel);

  recorder.annotate(
    `Stack starts with ${nodeMap.get(startNodeId)?.label ?? startNodeId}.`,
    [...stack],
    "Initialize the stack",
    "Depth-First Search begins by marking the start node as discovered and pushing it onto the stack.",
    1,
    [startNodeId],
    [startNodeId],
    startNodeId,
  );

  while (stack.length > 0) {
    const currentNodeId = stack.pop()!;
    const currentLabel = nodeMap.get(currentNodeId)?.label ?? currentNodeId;

    recorder.visit(
      currentNodeId,
      currentLabel,
      [...stack],
      `Visit ${currentLabel}`,
      `${currentLabel} pops from the top of the stack, so DFS continues down this branch before returning elsewhere.`,
      4,
    );

    const neighbors = [...(adjacency.get(currentNodeId) ?? [])].reverse();

    neighbors.forEach((neighbor) => {
      const frontierSnapshot = [...stack];
      const neighborLabel = nodeMap.get(neighbor.nodeId)?.label ?? neighbor.nodeId;

      recorder.compare(
        currentNodeId,
        currentLabel,
        neighbor.nodeId,
        neighborLabel,
        neighbor.edgeId,
        frontierSnapshot,
        `Inspect neighbor ${neighborLabel}`,
        discovered.has(neighbor.nodeId)
          ? `${neighborLabel} is already discovered, so DFS skips it and keeps the current branch.`
          : `${neighborLabel} is new, so DFS pushes it to the top of the stack and will chase that branch next.`,
        5,
      );

      if (discovered.has(neighbor.nodeId)) {
        recorder.annotate(
          `${neighborLabel} is already discovered.`,
          frontierSnapshot,
          `Skip ${neighborLabel}`,
          "DFS does not push nodes that were already discovered earlier in the traversal.",
          5,
          [neighbor.edgeId, neighbor.nodeId],
          [currentNodeId],
          currentNodeId,
        );
        return;
      }

      discovered.add(neighbor.nodeId);
      stack.push(neighbor.nodeId);

      recorder.annotate(
        `Pushed ${neighborLabel} onto the stack.`,
        [...stack],
        `Push ${neighborLabel}`,
        `${neighborLabel} moves to the top of the stack, so DFS will dive into that branch before backtracking.`,
        6,
        [neighbor.edgeId, neighbor.nodeId],
        [currentNodeId],
        currentNodeId,
      );
    });
  }

  recorder.annotate(
    "Depth-First Search is complete.",
    [],
    "Traversal complete",
    "The stack is empty, so DFS has exhausted every reachable branch from the start node.",
    7,
  );

  return recorder.finish();
}

const implementations: Record<
  GraphAlgorithmId,
  (context: GraphTraversalContext) => VisualizationEvent[]
> = {
  bfs: emitBfsEvents,
  dfs: emitDfsEvents,
};

export function buildGraphTimeline(
  algorithmId: GraphAlgorithmId,
  graph: GraphSample,
  startNodeId: string,
): GraphTimeline {
  const algorithmContext = {
    graph,
    startNodeId,
    frontierLabel: algorithmId === "bfs" ? "Queue" : "Stack",
  };
  const events = implementations[algorithmId](algorithmContext);

  return buildTimeline({
    initialState: createInitialGraphState(graph, algorithmId),
    events,
    reducer: reduceGraphEvent,
  });
}
