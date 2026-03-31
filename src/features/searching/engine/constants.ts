import type {
  SearchAlgorithmMeta,
  SearchingRunConfig,
} from "@/features/searching/engine/types";

export const searchAlgorithms: SearchAlgorithmMeta[] = [
  {
    id: "linear",
    label: "Linear Search",
    description: "Checks values one by one until the target is found or the array ends.",
    beginnerExplanation:
      "Linear Search starts at the first value and inspects each item in order. It is simple and works on any array, but it can take many checks when the target is near the end or missing.",
    pseudocode: [
      { line: 1, code: "for each value from left to right" },
      { line: 2, code: "  compare the current value with the target" },
      { line: 3, code: "  if they match, return the index" },
      { line: 4, code: "return not found" },
    ],
    implemented: true,
    bigO: {
      best: "O(1)",
      average: "O(n)",
      worst: "O(n)",
      space: "O(1)",
    },
  },
  {
    id: "binary",
    label: "Binary Search",
    description: "Repeatedly cuts the remaining sorted range in half.",
    beginnerExplanation:
      "Binary Search only works when the values are already sorted. It checks the middle value, discards half of the remaining range, and repeats until it finds the target or runs out of range.",
    pseudocode: [
      { line: 1, code: "low = 0, high = last index" },
      { line: 2, code: "while low <= high" },
      { line: 3, code: "  mid = floor((low + high) / 2)" },
      { line: 4, code: "  compare values[mid] with the target" },
      { line: 5, code: "  if equal, return mid" },
      { line: 6, code: "  if value is smaller, move low right" },
      { line: 7, code: "  otherwise move high left" },
      { line: 8, code: "return not found" },
    ],
    note: "Binary Search requires the array to stay sorted. This lab keeps the search dataset sorted for both algorithms so the target and values stay stable when you switch algorithms.",
    implemented: true,
    bigO: {
      best: "O(1)",
      average: "O(log n)",
      worst: "O(log n)",
      space: "O(1)",
    },
  },
];

export const availableSearchAlgorithms = searchAlgorithms.filter(
  (algorithm) => algorithm.implemented,
);

export const defaultSearchingConfig: SearchingRunConfig = {
  algorithmId: "linear",
  size: 18,
  speed: 72,
};

export const searchingSizeMax = 32;
