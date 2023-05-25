import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { FiberNode } from './fiber';

// * a global pointer pointing to the working fiber node
let workInProgress: FiberNode | null = null;

function prepareFreshStack(fiber: FiberNode) {
	workInProgress = fiber;
}

// * init func, let the workInProgress point to a fiber node
export function renderRoot(root: FiberNode) {
	prepareFreshStack(root);

	do {
		try {
			workLoop();
			break;
		} catch (ex) {
			console.error('WorkLoop error', ex);
			workInProgress = null;
		}
	} while (true);
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
