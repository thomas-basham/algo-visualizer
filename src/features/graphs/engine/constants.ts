import type {
  GraphAlgorithmMeta,
  GraphRunConfig,
  GraphSample,
} from "@/features/graphs/engine/types";

export const graphAlgorithms: GraphAlgorithmMeta[] = [
  {
    id: "bfs",
    label: "Breadth-First Search",
    description: "Explores the graph level by level using a queue.",
    beginnerExplanation:
      "Breadth-First Search starts at one node, visits all of its direct neighbors, then moves outward one layer at a time. The queue keeps track of which node should be explored next.",
    frontierLabel: "Queue",
    note: "This visualizer treats the graph as undirected and marks nodes as discovered when they enter the queue so duplicates do not pile up.",
    pseudocode: [
      { line: 1, code: "mark the start node as discovered" },
      { line: 2, code: "enqueue the start node" },
      { line: 3, code: "while the queue is not empty" },
      { line: 4, code: "  dequeue the front node and visit it" },
      { line: 5, code: "  inspect each neighbor of the current node" },
      { line: 6, code: "  if a neighbor is undiscovered, mark it and enqueue it" },
      { line: 7, code: "repeat until the queue is empty" },
    ],
    bigO: {
      best: "O(V + E)",
      average: "O(V + E)",
      worst: "O(V + E)",
      space: "O(V)",
    },
  },
  {
    id: "dfs",
    label: "Depth-First Search",
    description: "Follows one branch as far as possible before backtracking, using a stack.",
    beginnerExplanation:
      "Depth-First Search dives down one path first. The stack keeps the most recent branch on top so the traversal can backtrack when it hits a dead end.",
    frontierLabel: "Stack",
    note: "This implementation uses an explicit stack instead of recursion so the frontier stays visible during playback.",
    pseudocode: [
      { line: 1, code: "mark the start node as discovered" },
      { line: 2, code: "push the start node onto the stack" },
      { line: 3, code: "while the stack is not empty" },
      { line: 4, code: "  pop the top node and visit it" },
      { line: 5, code: "  inspect each neighbor of the current node" },
      { line: 6, code: "  if a neighbor is undiscovered, mark it and push it" },
      { line: 7, code: "repeat until the stack is empty" },
    ],
    bigO: {
      best: "O(V + E)",
      average: "O(V + E)",
      worst: "O(V + E)",
      space: "O(V)",
    },
  },
];

export const availableGraphAlgorithms = graphAlgorithms;

export const graphSamples: GraphSample[] = [
  {
    id: "campus",
    name: "Campus Paths",
    description: "A balanced practice graph with several short cycles and two clear middle layers.",
    nodes: [
      { id: "node-a", label: "A", x: 88, y: 72 },
      { id: "node-b", label: "B", x: 250, y: 62 },
      { id: "node-c", label: "C", x: 432, y: 90 },
      { id: "node-d", label: "D", x: 154, y: 212 },
      { id: "node-e", label: "E", x: 320, y: 194 },
      { id: "node-f", label: "F", x: 514, y: 216 },
      { id: "node-g", label: "G", x: 270, y: 334 },
    ],
    edges: [
      { id: "edge-a-b", from: "node-a", to: "node-b" },
      { id: "edge-a-d", from: "node-a", to: "node-d" },
      { id: "edge-b-c", from: "node-b", to: "node-c" },
      { id: "edge-b-e", from: "node-b", to: "node-e" },
      { id: "edge-c-f", from: "node-c", to: "node-f" },
      { id: "edge-d-e", from: "node-d", to: "node-e" },
      { id: "edge-d-g", from: "node-d", to: "node-g" },
      { id: "edge-e-f", from: "node-e", to: "node-f" },
      { id: "edge-e-g", from: "node-e", to: "node-g" },
      { id: "edge-f-g", from: "node-f", to: "node-g" },
    ],
  },
  {
    id: "river",
    name: "River Network",
    description: "A graph with branching channels that makes queue versus stack behavior easy to compare.",
    nodes: [
      { id: "node-h", label: "H", x: 84, y: 102 },
      { id: "node-i", label: "I", x: 224, y: 64 },
      { id: "node-j", label: "J", x: 404, y: 82 },
      { id: "node-k", label: "K", x: 564, y: 126 },
      { id: "node-l", label: "L", x: 142, y: 262 },
      { id: "node-m", label: "M", x: 324, y: 222 },
      { id: "node-n", label: "N", x: 498, y: 274 },
      { id: "node-o", label: "O", x: 300, y: 346 },
    ],
    edges: [
      { id: "edge-h-i", from: "node-h", to: "node-i" },
      { id: "edge-h-l", from: "node-h", to: "node-l" },
      { id: "edge-i-j", from: "node-i", to: "node-j" },
      { id: "edge-i-m", from: "node-i", to: "node-m" },
      { id: "edge-j-k", from: "node-j", to: "node-k" },
      { id: "edge-j-m", from: "node-j", to: "node-m" },
      { id: "edge-k-n", from: "node-k", to: "node-n" },
      { id: "edge-l-m", from: "node-l", to: "node-m" },
      { id: "edge-l-o", from: "node-l", to: "node-o" },
      { id: "edge-m-n", from: "node-m", to: "node-n" },
      { id: "edge-m-o", from: "node-m", to: "node-o" },
      { id: "edge-n-o", from: "node-n", to: "node-o" },
    ],
  },
  {
    id: "transit",
    name: "Transit Grid",
    description: "A denser graph that shows how DFS can commit to a branch while BFS fans out more evenly.",
    nodes: [
      { id: "node-p", label: "P", x: 98, y: 86 },
      { id: "node-q", label: "Q", x: 256, y: 76 },
      { id: "node-r", label: "R", x: 426, y: 74 },
      { id: "node-s", label: "S", x: 570, y: 106 },
      { id: "node-t", label: "T", x: 134, y: 236 },
      { id: "node-u", label: "U", x: 316, y: 208 },
      { id: "node-v", label: "V", x: 494, y: 232 },
      { id: "node-w", label: "W", x: 306, y: 340 },
    ],
    edges: [
      { id: "edge-p-q", from: "node-p", to: "node-q" },
      { id: "edge-p-t", from: "node-p", to: "node-t" },
      { id: "edge-q-r", from: "node-q", to: "node-r" },
      { id: "edge-q-u", from: "node-q", to: "node-u" },
      { id: "edge-r-s", from: "node-r", to: "node-s" },
      { id: "edge-r-u", from: "node-r", to: "node-u" },
      { id: "edge-r-v", from: "node-r", to: "node-v" },
      { id: "edge-s-v", from: "node-s", to: "node-v" },
      { id: "edge-t-u", from: "node-t", to: "node-u" },
      { id: "edge-t-w", from: "node-t", to: "node-w" },
      { id: "edge-u-v", from: "node-u", to: "node-v" },
      { id: "edge-u-w", from: "node-u", to: "node-w" },
      { id: "edge-v-w", from: "node-v", to: "node-w" },
    ],
  },
];

export const graphSampleMap = graphSamples.reduce<Record<string, GraphSample>>(
  (collection, sample) => {
    collection[sample.id] = sample;
    return collection;
  },
  {},
);

export const defaultGraphConfig: GraphRunConfig = {
  algorithmId: "bfs",
  speed: 72,
  sampleId: graphSamples[0].id,
  startNodeId: graphSamples[0].nodes[0].id,
};
