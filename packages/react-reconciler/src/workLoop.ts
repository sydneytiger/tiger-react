import { beginWork } from './beginWork';
import { commitMutationEffects } from './commitWork';
import { completeWork } from './completeWork';
import { createWorkInProgress, FiberNode, FiberRootNode } from './fiber';
import { MutationMask, NoFlags } from './fiberFlags';
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
	console.log('🐯 ~ scheduleUpdateOnFiber ~ root:', root);
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
	console.log('🐯 ~ renderRoot ~ workInProgress:', workInProgress);

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

	// * wip fiberNode树 以及树中的flags执行具体的dom操作
	commitRoot(root);
}

function commitRoot(root: FiberRootNode) {
	const finishedWork = root.finishedWork;

	if (finishedWork === null) return;

	if (__DEV__) {
		console.warn('🐯 start commit process', finishedWork);
	}

	//* reset
	root.finishedWork = null;

	//* 判断是否有在3个子阶段内需要执行的操作
	//* 检查root node的flags和subtreeFlags 决定是否要处理mutation
	const subtreeHasEffect =
		(finishedWork.subTreeFlags & MutationMask) !== NoFlags;
	const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags;

	if (subtreeHasEffect || rootHasEffect) {
		//TODO beforeMutation
		//* mutation
		commitMutationEffects(finishedWork);
		root.current = finishedWork;
		//TODO layout
	} else {
		root.current = finishedWork;
	}
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
	console.log('🐯 ~ performUnitOfWork ~ fiber:', fiber);
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
	let node: FiberNode | null = fiber;

	do {
		completeWork(node);
		console.log('🐯 ~ completeUnitOfWork ~ node:', node);
		const sibling = node.sibling;

		if (sibling !== null) {
			workInProgress = sibling;
			return;
		}
		node = node.return;
		workInProgress = node;
	} while (node !== null);
}
