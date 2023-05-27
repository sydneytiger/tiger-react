import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { createWorkInProgress, FiberNode, FiberRootNode } from './fiber';
import { HostRoot } from './workTags';

// * a global pointer pointing to the working fiber node
let workInProgress: FiberNode | null = null;

function prepareFreshStack(root: FiberRootNode) {
	workInProgress = createWorkInProgress(root.current, {});
}

/**
 * * connect the fiberRootNode's container and the renderRoot function below
 * @param fiber the fiber node which triggered update
 */
export function scheduleUpdateOnFiber(fiber: FiberNode) {
	// TODO 调度功能

	const root = markUpdateFromFiberToRoot(fiber);
	renderRoot(root);
}

/**
 * * bubble up to the fiberRootNode
 * @param fiber the fiber node which triggered update
 */
function markUpdateFromFiberToRoot(fiber: FiberNode) {
	let node = fiber;
	let parent = node.return;

	while (parent !== null) {
		node = parent;
		parent = node.return;
	}

	if (node.tag === HostRoot) {
		// * now the node is the hostRootFiber
		return node.stateNode;
	}

	return null;
}

// * init func, let the workInProgress point to a fiber node
function renderRoot(root: FiberRootNode) {
	prepareFreshStack(root);

	do {
		try {
			workLoop();
			break;
		} catch (ex) {
			if (__DEV__) {
				console.error('WorkLoop error', ex);
			}
			workInProgress = null;
		}
	} while (true);

	// * 这时候 wip fiberNode tree已经构建完毕
	const finishedWork = root.current.alternate;
	root.finishedWork = finishedWork;

	// * wip fiberNode树 以及树种的flags执行具体的dom操作
	// TODO commitRoot(root);
}

function workLoop() {
	while (workInProgress !== null) {
		performUnitOfWork(workInProgress);
	}
}

// * 如果有子节点，遍历子节点 （递）
function performUnitOfWork(fiber: FiberNode) {
	// * next could be the child of fiber or null (fiber is a leaf node)
	const next = beginWork(fiber);
	fiber.memoizedProps = fiber.pendingProps;

	if (next === null) {
		// * 已经是叶子节点 递已经完成 开始归
		completeUnitOfWork(fiber);
	} else {
		// * 继续向下遍历 继续递
		workInProgress = next;
	}
}

// * 如果没有子节点，遍历兄弟节点 （归）
function completeUnitOfWork(fiber: FiberNode) {
	const node: FiberNode | null = fiber;

	do {
		completeWork(node);
		const sibling = node.sibling;

		if (sibling !== null) {
			workInProgress = sibling;
			return;
		}

		workInProgress = node.return;
	} while (node !== null);
}
