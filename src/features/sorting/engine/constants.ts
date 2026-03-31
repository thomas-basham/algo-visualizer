import type { SortingAlgorithmMeta, SortingRunConfig } from "@/features/sorting/engine/types";

export const sortingAlgorithms: SortingAlgorithmMeta[] = [
  {
    id: "bubble",
    label: "Bubble Sort",
    description: "Simple adjacent swaps. Easy to teach, poor at scale.",
    category: "comparison",
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
    category: "comparison",
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
    category: "comparison",
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
    description: "Divide and conquer with predictable performance.",
    category: "comparison",
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
    description: "Fast in practice with careful pivot strategy.",
    category: "comparison",
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
    description: "Browser/runtime implementation for benchmark comparison only.",
    category: "native",
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

export const defaultSortingConfig: SortingRunConfig = {
  algorithmId: "quick",
  distribution: "random",
  size: 32,
  speed: 60,
};

