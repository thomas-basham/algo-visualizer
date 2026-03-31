import type {
  SortingAlgorithmMeta,
  SortingComparisonConfig,
} from "@/features/sorting/engine/types";

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
    description: "Divide-and-conquer sorting with explicit merge ranges and overwrite animation.",
    implemented: true,
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
    description: "Partition-driven sorting that keeps pivot behavior visible throughout the run.",
    implemented: true,
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
    description: "Educational approximation of native engine behavior using comparator callbacks and a write-back phase.",
    note: "JavaScript engines do not expose their true internal move/swap timeline. This mode visualizes observable comparator callbacks and an approximate overwrite phase so users can still compare behavior.",
    implemented: true,
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

export const defaultSortingConfig: SortingComparisonConfig = {
  leftAlgorithmId: "bubble",
  rightAlgorithmId: "quick",
  size: 24,
  speed: 72,
};
