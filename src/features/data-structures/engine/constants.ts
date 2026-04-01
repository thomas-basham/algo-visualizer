import type {
  DataStructureId,
  DataStructureMeta,
  DataStructuresRunConfig,
} from "@/features/data-structures/engine/types";

export const dataStructures: DataStructureMeta[] = [
  {
    id: "stack",
    label: "Stack",
    description: "Last in, first out storage where the top item is always the next one to leave.",
    beginnerExplanation:
      "A stack behaves like a pile of trays. You place new values on top and remove the most recent value first.",
    operations: {
      add: {
        label: "Push",
        description: "Add a new value to the top of the stack.",
        complexity: "O(1)",
        requiresValue: true,
        valueLabel: "Value to push",
        valueHint: "Choose the next value that should become the top item.",
      },
      remove: {
        label: "Pop",
        description: "Remove the current top value from the stack.",
        complexity: "O(1)",
        requiresValue: false,
      },
      search: {
        label: "Search",
        description: "Check values from the top down until the target is found.",
        complexity: "O(n)",
        requiresValue: true,
        valueLabel: "Target value",
        valueHint: "Stacks must inspect each value from the top until they find a match.",
      },
    },
    pseudocode: {
      add: [
        { line: 1, code: "create a new node with the input value" },
        { line: 2, code: "place the new node on top of the stack" },
        { line: 3, code: "update top to the new node" },
      ],
      remove: [
        { line: 1, code: "if the stack is empty, stop" },
        { line: 2, code: "store the top node" },
        { line: 3, code: "move top to the next item below it" },
        { line: 4, code: "return the removed value" },
      ],
      search: [
        { line: 1, code: "start at the top of the stack" },
        { line: 2, code: "compare the current node with the target" },
        { line: 3, code: "if equal, return found" },
        { line: 4, code: "move down one node and repeat" },
        { line: 5, code: "if nothing matches, return not found" },
      ],
    },
  },
  {
    id: "queue",
    label: "Queue",
    description: "First in, first out storage where the earliest value is served first.",
    beginnerExplanation:
      "A queue behaves like a line at a ticket counter. New values join at the back and removals happen at the front.",
    operations: {
      add: {
        label: "Enqueue",
        description: "Add a new value at the back of the queue.",
        complexity: "O(1)",
        requiresValue: true,
        valueLabel: "Value to enqueue",
        valueHint: "The new value joins the tail of the queue.",
      },
      remove: {
        label: "Dequeue",
        description: "Remove the front value from the queue.",
        complexity: "O(1)",
        requiresValue: false,
      },
      search: {
        label: "Search",
        description: "Check values from the front toward the back.",
        complexity: "O(n)",
        requiresValue: true,
        valueLabel: "Target value",
        valueHint: "Queues inspect one value at a time from the front.",
      },
    },
    pseudocode: {
      add: [
        { line: 1, code: "create a new node with the input value" },
        { line: 2, code: "attach it at the back of the queue" },
        { line: 3, code: "update tail to the new node" },
      ],
      remove: [
        { line: 1, code: "if the queue is empty, stop" },
        { line: 2, code: "store the front node" },
        { line: 3, code: "move front to the next node" },
        { line: 4, code: "return the removed value" },
      ],
      search: [
        { line: 1, code: "start at the front of the queue" },
        { line: 2, code: "compare the current node with the target" },
        { line: 3, code: "if equal, return found" },
        { line: 4, code: "move to the next node and repeat" },
        { line: 5, code: "if nothing matches, return not found" },
      ],
    },
  },
  {
    id: "linked-list",
    label: "Linked List",
    description: "A chain of nodes where each value points to the next node in the sequence.",
    beginnerExplanation:
      "A linked list stores values inside nodes. Each node knows where the next node is, so traversals move one link at a time.",
    note: "This demo uses a singly linked list and appends at the tail without a dedicated tail pointer.",
    operations: {
      add: {
        label: "Append",
        description: "Add a new node at the tail of the list.",
        complexity: "O(n)",
        requiresValue: true,
        valueLabel: "Value to append",
        valueHint: "The new node is linked to the end of the current chain.",
      },
      remove: {
        label: "Remove Value",
        description: "Traverse until the target value is found, then relink around it.",
        complexity: "O(n)",
        requiresValue: true,
        valueLabel: "Value to remove",
        valueHint: "The first matching value is removed from the chain.",
      },
      search: {
        label: "Search",
        description: "Traverse the list from head to tail looking for a match.",
        complexity: "O(n)",
        requiresValue: true,
        valueLabel: "Target value",
        valueHint: "The list checks each node in order because it cannot jump ahead.",
      },
    },
    pseudocode: {
      add: [
        { line: 1, code: "create a new node with the input value" },
        { line: 2, code: "if the list is empty, set head to the new node" },
        { line: 3, code: "otherwise walk to the tail node" },
        { line: 4, code: "set tail.next to the new node" },
      ],
      remove: [
        { line: 1, code: "start at the head node" },
        { line: 2, code: "compare the current node with the target value" },
        { line: 3, code: "if equal, relink previous.next around this node" },
        { line: 4, code: "otherwise move to the next node" },
        { line: 5, code: "if the end is reached, return not found" },
      ],
      search: [
        { line: 1, code: "start at the head node" },
        { line: 2, code: "compare the current node with the target" },
        { line: 3, code: "if equal, return found" },
        { line: 4, code: "move to current.next" },
        { line: 5, code: "if the tail is reached, return not found" },
      ],
    },
  },
  {
    id: "binary-search-tree",
    label: "Binary Search Tree",
    description: "A tree where smaller values go left and larger values go right.",
    beginnerExplanation:
      "A binary search tree keeps values ordered by position. Each comparison decides whether to move left or right until the value is found or a new node is inserted.",
    note: "Balanced trees stay fast. An unbalanced BST can degrade to linked-list-like behavior.",
    operations: {
      add: {
        label: "Insert",
        description: "Follow comparisons from the root until an empty child position is found.",
        complexity: "Average O(log n), worst O(n)",
        requiresValue: true,
        valueLabel: "Value to insert",
        valueHint: "Each comparison decides whether the value belongs on the left or right branch.",
      },
      remove: {
        label: "Remove Value",
        description: "Search for the target node, then reconnect the tree depending on its children.",
        complexity: "Average O(log n), worst O(n)",
        requiresValue: true,
        valueLabel: "Value to remove",
        valueHint: "Removing a node with two children uses the in-order successor in this demo.",
      },
      search: {
        label: "Search",
        description: "Compare at the root and keep moving left or right until the target is found.",
        complexity: "Average O(log n), worst O(n)",
        requiresValue: true,
        valueLabel: "Target value",
        valueHint: "Only one branch is explored at a time because the tree is ordered.",
      },
    },
    pseudocode: {
      add: [
        { line: 1, code: "if the tree is empty, create the root" },
        { line: 2, code: "start at the root" },
        { line: 3, code: "compare the input value with the current node" },
        { line: 4, code: "move left for smaller values, right otherwise" },
        { line: 5, code: "attach the new node at the first empty child" },
      ],
      remove: [
        { line: 1, code: "search for the target node" },
        { line: 2, code: "if the node has no child, remove it" },
        { line: 3, code: "if the node has one child, promote that child" },
        { line: 4, code: "if the node has two children, find the in-order successor" },
        { line: 5, code: "replace the target value and remove the successor" },
      ],
      search: [
        { line: 1, code: "start at the root" },
        { line: 2, code: "compare the current node with the target" },
        { line: 3, code: "if equal, return found" },
        { line: 4, code: "move left for smaller targets, right for larger ones" },
        { line: 5, code: "if a null child is reached, return not found" },
      ],
    },
  },
];

export const availableDataStructures = dataStructures;

export const dataStructureMap = dataStructures.reduce<Record<DataStructureId, DataStructureMeta>>(
  (collection, structure) => {
    collection[structure.id] = structure;
    return collection;
  },
  {
    stack: dataStructures[0],
    queue: dataStructures[1],
    "linked-list": dataStructures[2],
    "binary-search-tree": dataStructures[3],
  },
);

export const defaultDataStructuresConfig: DataStructuresRunConfig = {
  structureId: "stack",
  operationId: "add",
  speed: 72,
};

export const dataStructuresValueMin = 1;
export const dataStructuresValueMax = 99;
