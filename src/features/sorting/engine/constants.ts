import type { SortingAlgorithmMeta, SortingRunConfig } from "@/features/sorting/engine/types";

export const sortingAlgorithms: SortingAlgorithmMeta[] = [
  {
    id: "bubble",
    label: "Bubble Sort",
    description: "Simple adjacent swaps. Easy to teach, poor at scale.",
    implemented: true,
    bigO: {
      best: "O(n)",
      average: "O(n²)",
      worst: "O(n²)",
      space: "O(1)",
      stable: true,
      inPlace: true,
    },
  },
  {
    id: "selection",
    label: "Selection Sort",
    description: "Repeatedly selects the minimum from the unsorted region.",
    implemented: true,
    bigO: {
      best: "O(n²)",
      average: "O(n²)",
      worst: "O(n²)",
      space: "O(1)",
      stable: false,
      inPlace: true,
    },
  },
  {
    id: "insertion",
    label: "Insertion Sort",
    description: "Strong for nearly sorted inputs and small arrays.",
    implemented: true,
    bigO: {
      best: "O(n)",
      average: "O(n²)",
      worst: "O(n²)",
      space: "O(1)",
      stable: true,
      inPlace: true,
    },
  },
  {
    id: "merge",
    label: "Merge Sort",
    description: "Planned next: divide-and-conquer playback with merge writes.",
    implemented: false,
    bigO: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
      space: "O(n)",
      stable: true,
      inPlace: false,
    },
  },
  {
    id: "quick",
    label: "Quick Sort",
    description: "Planned next: partition-based playback with pivot states.",
    implemented: false,
    bigO: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n²)",
      space: "O(log n)",
      stable: false,
      inPlace: true,
    },
  },
  {
    id: "native-js",
    label: "JavaScript Native Sort",
    description: "Planned later as a benchmark-only comparison mode.",
    implemented: false,
    bigO: {
      best: "Engine dependent",
      average: "Engine dependent",
      worst: "Engine dependent",
      space: "Engine dependent",
      stable: true,
      inPlace: true,
    },
  },
];

export const availableSortingAlgorithms = sortingAlgorithms.filter(
  (algorithm) => algorithm.implemented,
);

export const defaultSortingConfig: SortingRunConfig = {
  algorithmId: "bubble",
  size: 24,
  speed: 72,
};
