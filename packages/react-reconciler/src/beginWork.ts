import { ReactElementType } from 'shared/ReactTypes';
import { FiberNode } from './fiber';
import { UpdateQueue, processUpdateQueue } from './updateQueue';
import { HostComponent, HostRoot, HostText } from './workTags';
import { mountChildFibers, reconcileChildFibers } from './childFiber';

/**
 * 例子:
 * <A><B/></A>
 * 当进入A的beginWork时, 通过对比B的current fiberNode和B的 reactElement
 * 生成B对应的wip fiberNode
 */

//! 递归中的递阶段
export const beginWork = (wip: FiberNode) => {
	// * will eventually return child fiber node
	switch (wip.tag) {
		case HostRoot:
			return updateHostRoot(wip);
		case HostComponent:
			return updateHostComponent(wip);
		case HostText:
			// * HostText 没有子节点(leaf node) 所以没有beginWork逻辑
			return null;
		default:
			if (__DEV__) {
				console.warn('🐯 ~ beginWork 未实现的类型 tag');
			}
			return null;
	}
};

/**
 * * HostRoot的beginWork 工作流程
 * * 1. 计算状态最新值
 * * 2. 创造子fiberNode
 */
const updateHostRoot = (wip: FiberNode) => {
	const baseState = wip.memoizedState;
	const updateQueue = wip.updateQueue as UpdateQueue<Element>;
	const pending = updateQueue.shared.pending;
	updateQueue.shared.pending = null;

	// * 计算状态最新值
	const { memoizedState } = processUpdateQueue(baseState, pending);
	wip.memoizedState = memoizedState;

	const nextChildren = wip.memoizedState;
	reconcileChildren(wip, nextChildren);
	return wip.child;
};

/**
 * * HostComponent的beginWork工作流程
 * * 1.创造子fiberNode
 * ! HostComponent里无法触发更新
 */
const updateHostComponent = (wip: FiberNode) => {
	// * fiberNode.pendingProps和reactElement.pendingProps一样
	const nextProps = wip.pendingProps;
	const nextChildren = nextProps.children;
	reconcileChildren(wip, nextChildren);
	return wip.child;
};

/**
 * * 通过对比B的current fiberNode和B的 reactElement
 */
const reconcileChildren = (wip: FiberNode, children?: ReactElementType) => {
	const current = wip.alternate;

	if (current != null) {
		// update fiber node
		wip.child = reconcileChildFibers(wip, current?.child, children);
	} else {
		// mount fiber node
		wip.child = mountChildFibers(wip, null, children);
	}
};
