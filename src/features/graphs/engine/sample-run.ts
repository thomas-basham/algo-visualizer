import { availableGraphAlgorithms, graphSamples } from "@/features/graphs/engine/constants";
import type {
  GraphAlgorithmId,
  GraphAnimationState,
  GraphSample,
} from "@/features/graphs/engine/types";

export function getGraphSample(sampleId: string) {
  return graphSamples.find((sample) => sample.id === sampleId) ?? graphSamples[0];
}

export function getNextGraphSample(currentSampleId: string) {
  const currentIndex = graphSamples.findIndex((sample) => sample.id === currentSampleId);
  const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % graphSamples.length;

  return graphSamples[nextIndex];
}

export function getDefaultStartNodeId(sample: GraphSample) {
  return sample.nodes[0]?.id ?? "";
}

export function createInitialGraphState(
  graph: GraphSample,
  algorithmId: GraphAlgorithmId,
): GraphAnimationState {
  const algorithm =
    availableGraphAlgorithms.find((item) => item.id === algorithmId) ?? availableGraphAlgorithms[0];

  return {
    graph,
    frontierLabel: algorithm.frontierLabel,
    frontierNodeIds: [],
    activeNodeIds: [],
    activeEdgeIds: [],
    visitedNodeIds: [],
    traversalOrderIds: [],
    currentNodeId: null,
    metrics: {
      comparisons: 0,
      visitedCount: 0,
    },
    summary: "Generate a traversal to animate how the graph expands from the chosen start node.",
    stepTitle: "Ready to traverse",
    stepDetail:
      "Breadth-First Search uses a queue and explores level by level. Depth-First Search uses a stack and commits to one branch before backtracking.",
    pseudocodeLine: null,
  };
}
