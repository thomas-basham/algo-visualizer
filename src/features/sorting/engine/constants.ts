import type {
  SortingAlgorithmMeta,
  SortingComparisonConfig,
  SortingInputPresetId,
} from "@/features/sorting/engine/types";

export const sortingInputPresets: Array<{
  id: SortingInputPresetId;
  label: string;
  description: string;
}> = [
  {
    id: "random",
    label: "Random",
    description: "Unstructured values with no special ordering.",
  },
  {
    id: "nearly-sorted",
    label: "Nearly Sorted",
    description: "Mostly ordered values with a few local disruptions.",
  },
  {
    id: "reversed",
    label: "Reversed",
    description: "Descending order, which is a hard case for some simple algorithms.",
  },
  {
    id: "few-unique",
    label: "Few Unique",
    description: "Many duplicate values drawn from a small palette.",
  },
];

export const sortingAlgorithms: SortingAlgorithmMeta[] = [
  {
    id: "bubble",
    label: "Bubble Sort",
    description: "Simple adjacent swaps. Easy to teach, poor at scale.",
    beginnerExplanation:
      "Bubble Sort repeatedly walks through neighboring pairs. If the left value is bigger than the right value, it swaps them. After each pass, the largest remaining value has bubbled to the end.",
    pseudocode: [
      { line: 1, code: "repeat until no swaps happen" },
      { line: 2, code: "  swapped = false" },
      { line: 3, code: "  for each adjacent pair in the unsorted range" },
      { line: 4, code: "    compare left and right values" },
      { line: 5, code: "    if left > right" },
      { line: 6, code: "      swap them" },
      { line: 7, code: "      swapped = true" },
      { line: 8, code: "  mark the last position as sorted" },
    ],
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
    beginnerExplanation:
      "Selection Sort grows a sorted prefix one position at a time. It scans the unsorted region, finds the smallest value, and places it at the current front position.",
    pseudocode: [
      { line: 1, code: "for each start index from left to right" },
      { line: 2, code: "  minIndex = start" },
      { line: 3, code: "  scan the rest of the array" },
      { line: 4, code: "    compare current minimum with the next value" },
      { line: 5, code: "    if the next value is smaller, update minIndex" },
      { line: 6, code: "  swap start with minIndex" },
      { line: 7, code: "  mark start as sorted" },
    ],
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
    beginnerExplanation:
      "Insertion Sort keeps a sorted prefix on the left. It takes the next value and slides it left until it lands in the correct position within that sorted prefix.",
    pseudocode: [
      { line: 1, code: "mark the first value as sorted" },
      { line: 2, code: "for each value from left to right" },
      { line: 3, code: "  while the value can move left" },
      { line: 4, code: "    compare it with the value before it" },
      { line: 5, code: "    if they are already in order, stop" },
      { line: 6, code: "    otherwise swap them" },
      { line: 7, code: "  mark the prefix as sorted" },
    ],
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
    beginnerExplanation:
      "Merge Sort keeps splitting the array into smaller halves until each piece is trivially sorted. Then it merges those sorted pieces back together by repeatedly taking the smaller front value.",
    pseudocode: [
      { line: 1, code: "split the range until each piece has one value" },
      { line: 2, code: "sort the left half" },
      { line: 3, code: "sort the right half" },
      { line: 4, code: "start merging the two sorted halves" },
      { line: 5, code: "compare the front values from both halves" },
      { line: 6, code: "write the smaller value into the merged output" },
      { line: 7, code: "copy any remaining values" },
    ],
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
    beginnerExplanation:
      "Quick Sort picks a pivot, moves smaller values to one side and larger values to the other, then repeats that idea on each side. It is fast on average but sensitive to pivot choice.",
    pseudocode: [
      { line: 1, code: "choose a pivot value" },
      { line: 2, code: "scan the range and compare each value with the pivot" },
      { line: 3, code: "if a value belongs on the left side, swap it forward" },
      { line: 4, code: "place the pivot between the two partitions" },
      { line: 5, code: "mark the pivot position as sorted" },
      { line: 6, code: "repeat on the left and right partitions" },
    ],
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
    description:
      "Educational approximation of native engine behavior using comparator callbacks and a write-back phase.",
    beginnerExplanation:
      "JavaScript engines use optimized internal sorting strategies that are not exposed to the page. This view shows the observable comparator calls and an approximate final write-back so learners can still compare high-level behavior.",
    pseudocode: [
      { line: 1, code: "native engine requests comparator callbacks" },
      { line: 2, code: "compare the two values passed into the comparator" },
      { line: 3, code: "finish internal native ordering" },
      { line: 4, code: "approximate the final write-back into visible slots" },
    ],
    note:
      "JavaScript engines do not expose their true internal move/swap timeline. This mode visualizes observable comparator callbacks and an approximate overwrite phase so users can still compare behavior.",
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

export const standardSortingSizeMax = 48;
export const performanceSortingSizeMax = 128;
export const performanceModeThreshold = 72;

export const defaultSortingConfig: SortingComparisonConfig = {
  leftAlgorithmId: "bubble",
  rightAlgorithmId: "quick",
  inputPreset: "random",
  size: 24,
  speed: 72,
  performanceMode: false,
};
