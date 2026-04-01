import type {
  DataStructureAnimationState,
  DataStructureId,
  DataStructureSnapshot,
  DataStructureStateCollection,
  LinearStructureNode,
  LinearStructureSnapshot,
  TreeStructureNode,
  TreeStructureSnapshot,
} from "@/features/data-structures/engine/types";

function createLinearNodes(values: number[]): LinearStructureNode[] {
  return values.map((value, index) => ({
    id: `node-${index + 1}`,
    value,
  }));
}

export function createLinearSnapshot(values: number[]): LinearStructureSnapshot {
  return {
    kind: "linear",
    nodes: createLinearNodes(values),
    nextId: values.length + 1,
  };
}

export function insertIntoTreeSnapshot(
  snapshot: TreeStructureSnapshot,
  value: number,
): TreeStructureSnapshot {
  const nodes = snapshot.nodes.map((node) => ({ ...node }));
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  const newNode: TreeStructureNode = {
    id: `node-${snapshot.nextId}`,
    value,
    leftId: null,
    rightId: null,
  };

  if (!snapshot.rootId) {
    return {
      kind: "tree",
      rootId: newNode.id,
      nextId: snapshot.nextId + 1,
      nodes: [...nodes, newNode],
    };
  }

  let currentId: string | null = snapshot.rootId;

  while (currentId) {
    const currentNode = nodeMap.get(currentId);

    if (!currentNode) {
      break;
    }

    if (value < currentNode.value) {
      if (!currentNode.leftId) {
        currentNode.leftId = newNode.id;
        break;
      }

      currentId = currentNode.leftId;
      continue;
    }

    if (!currentNode.rightId) {
      currentNode.rightId = newNode.id;
      break;
    }

    currentId = currentNode.rightId;
  }

  return {
    kind: "tree",
    rootId: snapshot.rootId,
    nextId: snapshot.nextId + 1,
    nodes: [...nodes, newNode],
  };
}

export function createTreeSnapshot(values: number[]): TreeStructureSnapshot {
  return values.reduce<TreeStructureSnapshot>(
    (snapshot, value) => insertIntoTreeSnapshot(snapshot, value),
    {
      kind: "tree",
      rootId: null,
      nodes: [],
      nextId: 1,
    },
  );
}

export function cloneDataStructureSnapshot(
  snapshot: DataStructureSnapshot,
): DataStructureSnapshot {
  if (snapshot.kind === "linear") {
    return {
      kind: "linear",
      nextId: snapshot.nextId,
      nodes: snapshot.nodes.map((node) => ({ ...node })),
    };
  }

  return {
    kind: "tree",
    rootId: snapshot.rootId,
    nextId: snapshot.nextId,
    nodes: snapshot.nodes.map((node) => ({ ...node })),
  };
}

export function createInitialDataStructureSnapshots(): DataStructureStateCollection {
  return {
    stack: createLinearSnapshot([18, 27, 33]),
    queue: createLinearSnapshot([12, 24, 31, 46]),
    "linked-list": createLinearSnapshot([8, 15, 23, 42]),
    "binary-search-tree": createTreeSnapshot([40, 18, 60, 9, 27, 52, 74]),
  };
}

export function createInitialDataStructureState(
  structureId: DataStructureId,
  snapshot: DataStructureSnapshot,
): DataStructureAnimationState {
  return {
    structureId,
    snapshot: cloneDataStructureSnapshot(snapshot),
    activeIds: [],
    visitedIds: [],
    foundIds: [],
    insertedIds: [],
    removedIds: [],
    metrics: {
      comparisons: 0,
      operations: 0,
    },
    summary: "Choose an operation to animate the next structure change.",
    stepTitle: "Ready to explore",
    stepDetail:
      "Run add, remove, or search to see the structure react one decision at a time.",
  };
}
