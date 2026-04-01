import { buildTimeline } from "@/lib/animation/timeline";
import type { VisualizationEvent } from "@/lib/animation/types";
import { createDataStructureEvent } from "@/features/data-structures/engine/event-helpers";
import { reduceDataStructureEvent } from "@/features/data-structures/engine/reducer";
import {
  cloneDataStructureSnapshot,
  createInitialDataStructureState,
} from "@/features/data-structures/engine/sample-run";
import type {
  DataStructureId,
  DataStructureOperationId,
  DataStructureSnapshot,
  DataStructureTimeline,
  LinearStructureNode,
  LinearStructureSnapshot,
  TreeStructureNode,
  TreeStructureSnapshot,
} from "@/features/data-structures/engine/types";

type OperationEmitter = {
  annotate: (
    label: string,
    operation: DataStructureOperationId,
    stepTitle: string,
    stepDetail: string,
    targetIds?: string[],
    sourceIds?: string[],
  ) => void;
  compare: (
    targetIds: string[],
    label: string,
    operation: DataStructureOperationId,
    stepTitle: string,
    stepDetail: string,
  ) => void;
  insert: (
    targetIds: string[],
    snapshot: DataStructureSnapshot,
    label: string,
    operation: DataStructureOperationId,
    stepTitle: string,
    stepDetail: string,
    sourceIds?: string[],
  ) => void;
  remove: (
    targetIds: string[],
    snapshot: DataStructureSnapshot,
    label: string,
    operation: DataStructureOperationId,
    stepTitle: string,
    stepDetail: string,
    sourceIds?: string[],
  ) => void;
  markFound: (
    targetIds: string[],
    label: string,
    operation: DataStructureOperationId,
    stepTitle: string,
    stepDetail: string,
  ) => void;
  finish: () => VisualizationEvent[];
};

function createEmitter(): OperationEmitter {
  const events: VisualizationEvent[] = [];

  return {
    annotate(label, operation, stepTitle, stepDetail, targetIds = [], sourceIds) {
      events.push(
        createDataStructureEvent("annotate", targetIds, label, {
          operation,
          stepTitle,
          stepDetail,
          sourceIds,
        }),
      );
    },
    compare(targetIds, label, operation, stepTitle, stepDetail) {
      events.push(
        createDataStructureEvent("compare", targetIds, label, {
          operation,
          stepTitle,
          stepDetail,
        }),
      );
    },
    insert(targetIds, snapshot, label, operation, stepTitle, stepDetail, sourceIds) {
      events.push(
        createDataStructureEvent("insert", targetIds, label, {
          operation,
          stepTitle,
          stepDetail,
          snapshot,
          sourceIds,
        }),
      );
    },
    remove(targetIds, snapshot, label, operation, stepTitle, stepDetail, sourceIds) {
      events.push(
        createDataStructureEvent("remove", targetIds, label, {
          operation,
          stepTitle,
          stepDetail,
          snapshot,
          sourceIds,
        }),
      );
    },
    markFound(targetIds, label, operation, stepTitle, stepDetail) {
      events.push(
        createDataStructureEvent("markFound", targetIds, label, {
          operation,
          stepTitle,
          stepDetail,
        }),
      );
    },
    finish() {
      return events;
    },
  };
}

function createLinearNode(snapshot: LinearStructureSnapshot, value: number): LinearStructureNode {
  return {
    id: `node-${snapshot.nextId}`,
    value,
  };
}

function cloneLinearSnapshot(snapshot: LinearStructureSnapshot): LinearStructureSnapshot {
  return cloneDataStructureSnapshot(snapshot) as LinearStructureSnapshot;
}

function cloneTreeSnapshot(snapshot: TreeStructureSnapshot): TreeStructureSnapshot {
  return cloneDataStructureSnapshot(snapshot) as TreeStructureSnapshot;
}

function emitStackEvents(
  snapshot: LinearStructureSnapshot,
  operation: DataStructureOperationId,
  value?: number,
) {
  const emitter = createEmitter();

  if (operation === "add") {
    if (typeof value !== "number") {
      emitter.annotate(
        "Choose a value to push onto the stack.",
        operation,
        "Value required",
        "Pushing needs a concrete value so the stack can create a new top node.",
      );
      return emitter.finish();
    }

    const nextSnapshot = cloneLinearSnapshot(snapshot);
    const node = createLinearNode(nextSnapshot, value);
    nextSnapshot.nodes.push(node);
    nextSnapshot.nextId += 1;

    emitter.insert(
      [node.id],
      nextSnapshot,
      `Pushed ${value} onto the stack.`,
      operation,
      `Push ${value}`,
      `${value} becomes the new top item because stacks add values on top.`,
      snapshot.nodes.at(-1)?.id ? [snapshot.nodes.at(-1)!.id] : undefined,
    );

    return emitter.finish();
  }

  if (operation === "remove") {
    const topNode = snapshot.nodes.at(-1);

    if (!topNode) {
      emitter.annotate(
        "The stack is already empty.",
        operation,
        "Nothing to pop",
        "A pop can only remove the current top value when at least one node is present.",
      );
      return emitter.finish();
    }

    const nextSnapshot = cloneLinearSnapshot(snapshot);
    nextSnapshot.nodes.pop();

    emitter.remove(
      [topNode.id],
      nextSnapshot,
      `Popped ${topNode.value} from the stack.`,
      operation,
      "Pop the top value",
      `${topNode.value} leaves first because stacks remove the most recently added value.`,
    );

    return emitter.finish();
  }

  if (typeof value !== "number") {
    emitter.annotate(
      "Choose a value to search for.",
      operation,
      "Value required",
      "Searching compares the requested target against stack nodes from the top downward.",
    );
    return emitter.finish();
  }

  for (let index = snapshot.nodes.length - 1; index >= 0; index -= 1) {
    const node = snapshot.nodes[index];
    emitter.compare(
      [node.id],
      `Comparing stack top candidate ${node.value} with ${value}.`,
      operation,
      `Check ${node.value}`,
      `${node.value === value ? "This node matches the target." : "The search continues downward because the target has not been found yet."}`,
    );

    if (node.value === value) {
      emitter.markFound(
        [node.id],
        `Found ${value} in the stack.`,
        operation,
        `Found ${value}`,
        `${value} was found before the search reached the bottom of the stack.`,
      );
      return emitter.finish();
    }
  }

  emitter.annotate(
    `${value} is not in the stack.`,
    operation,
    "Target not found",
    "Every node from the top to the bottom was checked and none matched the target value.",
  );

  return emitter.finish();
}

function emitQueueEvents(
  snapshot: LinearStructureSnapshot,
  operation: DataStructureOperationId,
  value?: number,
) {
  const emitter = createEmitter();

  if (operation === "add") {
    if (typeof value !== "number") {
      emitter.annotate(
        "Choose a value to enqueue.",
        operation,
        "Value required",
        "Enqueue needs a concrete value to place at the back of the queue.",
      );
      return emitter.finish();
    }

    const nextSnapshot = cloneLinearSnapshot(snapshot);
    const node = createLinearNode(nextSnapshot, value);
    nextSnapshot.nodes.push(node);
    nextSnapshot.nextId += 1;

    emitter.insert(
      [node.id],
      nextSnapshot,
      `Enqueued ${value} at the back of the queue.`,
      operation,
      `Enqueue ${value}`,
      `${value} joins the tail because queues add new values at the back.`,
      snapshot.nodes.at(-1)?.id ? [snapshot.nodes.at(-1)!.id] : undefined,
    );

    return emitter.finish();
  }

  if (operation === "remove") {
    const frontNode = snapshot.nodes[0];

    if (!frontNode) {
      emitter.annotate(
        "The queue is already empty.",
        operation,
        "Nothing to dequeue",
        "A dequeue can only remove the front value when the queue has at least one node.",
      );
      return emitter.finish();
    }

    const nextSnapshot = cloneLinearSnapshot(snapshot);
    nextSnapshot.nodes.shift();

    emitter.remove(
      [frontNode.id],
      nextSnapshot,
      `Dequeued ${frontNode.value} from the front of the queue.`,
      operation,
      "Remove the front value",
      `${frontNode.value} leaves first because queues serve the oldest value at the front.`,
    );

    return emitter.finish();
  }

  if (typeof value !== "number") {
    emitter.annotate(
      "Choose a value to search for.",
      operation,
      "Value required",
      "Searching compares the requested target against queue nodes from front to back.",
    );
    return emitter.finish();
  }

  for (const node of snapshot.nodes) {
    emitter.compare(
      [node.id],
      `Comparing queue value ${node.value} with ${value}.`,
      operation,
      `Check ${node.value}`,
      `${node.value === value ? "This node matches the target." : "The queue continues checking one node at a time from the front."}`,
    );

    if (node.value === value) {
      emitter.markFound(
        [node.id],
        `Found ${value} in the queue.`,
        operation,
        `Found ${value}`,
        `${value} was found before the search reached the back of the queue.`,
      );
      return emitter.finish();
    }
  }

  emitter.annotate(
    `${value} is not in the queue.`,
    operation,
    "Target not found",
    "Every queue node was checked from the front to the back and no match was found.",
  );

  return emitter.finish();
}

function emitLinkedListEvents(
  snapshot: LinearStructureSnapshot,
  operation: DataStructureOperationId,
  value?: number,
) {
  const emitter = createEmitter();

  if (operation === "add") {
    if (typeof value !== "number") {
      emitter.annotate(
        "Choose a value to append.",
        operation,
        "Value required",
        "Appending needs a value so the list can create a new tail node.",
      );
      return emitter.finish();
    }

    const nextSnapshot = cloneLinearSnapshot(snapshot);
    const node = createLinearNode(nextSnapshot, value);
    nextSnapshot.nodes.push(node);
    nextSnapshot.nextId += 1;

    emitter.insert(
      [node.id],
      nextSnapshot,
      `Appended ${value} to the linked list.`,
      operation,
      `Append ${value}`,
      `${value} becomes the new tail node and the previous tail now points to it.`,
      snapshot.nodes.at(-1)?.id ? [snapshot.nodes.at(-1)!.id] : undefined,
    );

    return emitter.finish();
  }

  if (typeof value !== "number") {
    emitter.annotate(
      operation === "remove"
        ? "Choose a value to remove from the linked list."
        : "Choose a value to search for in the linked list.",
      operation,
      "Value required",
      "Linked-list operations move through the chain one node at a time until the target value is found.",
    );
    return emitter.finish();
  }

  for (let index = 0; index < snapshot.nodes.length; index += 1) {
    const node = snapshot.nodes[index];

    emitter.compare(
      [node.id],
      `Comparing linked-list node ${node.value} with ${value}.`,
      operation,
      `Check ${node.value}`,
      `${node.value === value ? "This node matches the target value." : "Traversal continues through the next pointer."}`,
    );

    if (node.value !== value) {
      continue;
    }

    if (operation === "search") {
      emitter.markFound(
        [node.id],
        `Found ${value} in the linked list.`,
        operation,
        `Found ${value}`,
        `${value} was found before reaching the tail node.`,
      );
      return emitter.finish();
    }

    const nextSnapshot = cloneLinearSnapshot(snapshot);
    nextSnapshot.nodes.splice(index, 1);

    emitter.remove(
      [node.id],
      nextSnapshot,
      `Removed ${value} from the linked list.`,
      operation,
      `Remove ${value}`,
      index === 0
        ? "The head node matched the target, so the list moves its head to the next node."
        : "The previous node now skips over the removed node and points to the following one.",
      index > 0 ? [snapshot.nodes[index - 1].id] : undefined,
    );

    return emitter.finish();
  }

  emitter.annotate(
    operation === "remove"
      ? `${value} is not in the linked list, so nothing was removed.`
      : `${value} is not in the linked list.`,
    operation,
    "Target not found",
    "The traversal reached the tail without finding a matching value.",
  );

  return emitter.finish();
}

function createTreeMap(snapshot: TreeStructureSnapshot) {
  return new Map(snapshot.nodes.map((node) => [node.id, node]));
}

function removeTreeNodeById(snapshot: TreeStructureSnapshot, removedId: string) {
  snapshot.nodes = snapshot.nodes.filter((node) => node.id !== removedId);
}

function emitBinarySearchTreeEvents(
  snapshot: TreeStructureSnapshot,
  operation: DataStructureOperationId,
  value?: number,
) {
  const emitter = createEmitter();

  if (typeof value !== "number") {
    emitter.annotate(
      operation === "add"
        ? "Choose a value to insert into the tree."
        : operation === "remove"
          ? "Choose a value to remove from the tree."
          : "Choose a value to search for in the tree.",
      operation,
      "Value required",
      "Tree operations need a target value so each comparison can choose the next branch.",
    );
    return emitter.finish();
  }

  if (operation === "add" && !snapshot.rootId) {
    const nextSnapshot = cloneTreeSnapshot(snapshot);
    const node: TreeStructureNode = {
      id: `node-${nextSnapshot.nextId}`,
      value,
      leftId: null,
      rightId: null,
    };
    nextSnapshot.nodes.push(node);
    nextSnapshot.rootId = node.id;
    nextSnapshot.nextId += 1;

    emitter.insert(
      [node.id],
      nextSnapshot,
      `Inserted ${value} as the root node.`,
      operation,
      `Insert ${value}`,
      "The tree was empty, so the first inserted value becomes the root.",
    );

    return emitter.finish();
  }

  const currentSnapshot = cloneTreeSnapshot(snapshot);
  const nodeMap = createTreeMap(currentSnapshot);

  let currentId = currentSnapshot.rootId;
  let parentId: string | null = null;

  while (currentId) {
    const node = nodeMap.get(currentId);

    if (!node) {
      break;
    }

    emitter.compare(
      [node.id],
      `Comparing tree node ${node.value} with ${value}.`,
      operation,
      `Check ${node.value}`,
      node.value === value
        ? "The current node matches the target value."
        : value < node.value
          ? `${value} is smaller than ${node.value}, so traversal moves left.`
          : `${value} is greater than or equal to ${node.value}, so traversal moves right.`,
    );

    if (operation === "search" && node.value === value) {
      emitter.markFound(
        [node.id],
        `Found ${value} in the tree.`,
        operation,
        `Found ${value}`,
        "The search stops as soon as the target matches the current node.",
      );
      return emitter.finish();
    }

    if (operation === "remove" && node.value === value) {
      const leftId = node.leftId;
      const rightId = node.rightId;

      if (!leftId && !rightId) {
        if (!parentId) {
          currentSnapshot.rootId = null;
        } else {
          const parentNode = nodeMap.get(parentId);

          if (parentNode?.leftId === node.id) {
            parentNode.leftId = null;
          }

          if (parentNode?.rightId === node.id) {
            parentNode.rightId = null;
          }
        }

        removeTreeNodeById(currentSnapshot, node.id);

        emitter.remove(
          [node.id],
          currentSnapshot,
          `Removed leaf node ${value} from the tree.`,
          operation,
          `Remove ${value}`,
          "The node had no children, so it could be removed directly.",
        );

        return emitter.finish();
      }

      if (!leftId || !rightId) {
        const childId = leftId ?? rightId;

        if (!parentId) {
          currentSnapshot.rootId = childId ?? null;
        } else {
          const parentNode = nodeMap.get(parentId);

          if (parentNode?.leftId === node.id) {
            parentNode.leftId = childId ?? null;
          }

          if (parentNode?.rightId === node.id) {
            parentNode.rightId = childId ?? null;
          }
        }

        removeTreeNodeById(currentSnapshot, node.id);

        emitter.remove(
          [node.id],
          currentSnapshot,
          `Removed ${value} and promoted its only child.`,
          operation,
          `Remove ${value}`,
          "A node with one child can be removed by linking its parent directly to that child.",
          childId ? [childId] : undefined,
        );

        return emitter.finish();
      }

      emitter.annotate(
        `Node ${value} has two children, so the in-order successor will replace it.`,
        operation,
        "Find the successor",
        "The smallest node in the right subtree keeps the tree ordered after removal.",
        [node.id],
      );

      let successorParentId = node.id;
      let successorId = rightId;

      while (successorId) {
        const successorNode = nodeMap.get(successorId);

        if (!successorNode) {
          break;
        }

        emitter.compare(
          [successorNode.id],
          `Inspecting successor candidate ${successorNode.value}.`,
          operation,
          `Check successor ${successorNode.value}`,
          successorNode.leftId
            ? "A smaller successor may still exist on the left branch, so traversal keeps moving left."
            : "This is the left-most node in the right subtree, so it becomes the in-order successor.",
        );

        if (!successorNode.leftId) {
          node.value = successorNode.value;

          const successorChildId = successorNode.rightId;
          const successorParentNode = nodeMap.get(successorParentId);

          if (successorParentNode?.leftId === successorNode.id) {
            successorParentNode.leftId = successorChildId;
          } else if (successorParentNode?.rightId === successorNode.id) {
            successorParentNode.rightId = successorChildId;
          }

          removeTreeNodeById(currentSnapshot, successorNode.id);

          emitter.remove(
            [successorNode.id],
            currentSnapshot,
            `Removed ${value} by promoting successor ${successorNode.value}.`,
            operation,
            `Replace ${value} with ${successorNode.value}`,
            "The successor value replaces the target node, and the successor node is then removed from its old position.",
            [node.id],
          );

          return emitter.finish();
        }

        successorParentId = successorNode.id;
        successorId = successorNode.leftId;
      }
    }

    parentId = node.id;
    currentId = value < node.value ? node.leftId : node.rightId;

    if (operation === "search" || operation === "remove") {
      continue;
    }

    if (!currentId) {
      const nextSnapshot = cloneTreeSnapshot(currentSnapshot);
      const nextNodeMap = createTreeMap(nextSnapshot);
      const parentNode = nextNodeMap.get(parentId);
      const newNode: TreeStructureNode = {
        id: `node-${nextSnapshot.nextId}`,
        value,
        leftId: null,
        rightId: null,
      };

      nextSnapshot.nodes.push(newNode);
      nextSnapshot.nextId += 1;

      if (parentNode) {
        if (value < parentNode.value) {
          parentNode.leftId = newNode.id;
        } else {
          parentNode.rightId = newNode.id;
        }
      }

      emitter.insert(
        [newNode.id],
        nextSnapshot,
        `Inserted ${value} into the tree.`,
        operation,
        `Insert ${value}`,
        `${value < node.value ? "The new value belongs on the left branch." : "The new value belongs on the right branch."}`,
        parentNode ? [parentNode.id] : undefined,
      );

      return emitter.finish();
    }
  }

  if (operation === "add") {
    emitter.annotate(
      `Inserted ${value} into the tree.`,
      operation,
      `Insert ${value}`,
      "The next insertion point was found, so a new node can be attached there.",
    );
  } else {
    emitter.annotate(
      operation === "search"
        ? `${value} is not in the tree.`
        : `${value} is not in the tree, so nothing was removed.`,
      operation,
      "Target not found",
      "Traversal reached an empty child position, so the requested value is not present in the tree.",
    );
  }

  return emitter.finish();
}

type StructureImplementation = (
  snapshot: DataStructureSnapshot,
  operation: DataStructureOperationId,
  value?: number,
) => VisualizationEvent[];

const implementations: Record<DataStructureId, StructureImplementation> = {
  stack: (snapshot, operation, value) =>
    emitStackEvents(snapshot as LinearStructureSnapshot, operation, value),
  queue: (snapshot, operation, value) =>
    emitQueueEvents(snapshot as LinearStructureSnapshot, operation, value),
  "linked-list": (snapshot, operation, value) =>
    emitLinkedListEvents(snapshot as LinearStructureSnapshot, operation, value),
  "binary-search-tree": (snapshot, operation, value) =>
    emitBinarySearchTreeEvents(snapshot as TreeStructureSnapshot, operation, value),
};

export function buildDataStructureTimeline(
  structureId: DataStructureId,
  snapshot: DataStructureSnapshot,
  operation: DataStructureOperationId,
  value?: number,
): DataStructureTimeline {
  const initialSnapshot = cloneDataStructureSnapshot(snapshot);
  const events = implementations[structureId](initialSnapshot, operation, value);

  return buildTimeline({
    initialState: createInitialDataStructureState(structureId, snapshot),
    events,
    reducer: reduceDataStructureEvent,
  });
}
