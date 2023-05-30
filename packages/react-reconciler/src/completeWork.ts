import { FiberNode } from './fiber';
import { NoFlags } from './fiberFlags';
import { HostComponent, HostRoot, HostText } from './workTags';
import {
	createInstance,
	appendInitialChild,
	createTextInstance
} from 'hostConfig';
import { Container } from 'hostConfig';
/**
 * * 需要解决的问题
 * * 1. 对于Host类型fiberNode: 构建离屏DOM树
 * * 2. 标记Update flag (TODO)
 */

//! 递中的归阶段
export const completeWork = (wip: FiberNode): FiberNode | null => {
	const newProps = wip.pendingProps;
	const current = wip.alternate;

	switch (wip.tag) {
		case HostComponent:
			if (current !== null && wip.stateNode) {
				// TODO HostComponent update
			} else {
				// * mount 首屏渲染
				// * 1. 构建DOM元素
				const instance = createInstance(wip.type, newProps);
				// * 2. 将DOM元素插入DOM树
				appendAllChildren(instance, wip);
				wip.stateNode = instance;
			}
			bubbleProperties(wip);
			return null;
		case HostText:
			if (current !== null && wip.stateNode) {
				// TODO HostText update
			} else {
				// * mount 首屏渲染
				// * 构建Text DOM元素
				const instance = createTextInstance(newProps.content);
				wip.stateNode = instance;
			}
			bubbleProperties(wip);
			return null;
		case HostRoot:
			bubbleProperties(wip);
			return null;
		default:
			if (__DEV__) {
				console.warn('🐯 ~ completeWork 未实现的类型 tag', wip);
			}
			return null;
	}
};

/**
 * * 在@param parent节点下插入@param wip节点
 */
function appendAllChildren(parent: Container, wip: FiberNode) {
	let node = wip.child;

	// * 递归建构DOM节点以及子节点和兄弟节点
	while (node !== null) {
		// * 寻找 HostComponent和HostText节点
		if (node.tag === HostComponent || node.tag === HostText) {
			appendInitialChild(parent, node.stateNode);
		} else if (node.child != null) {
			// * 继续往下找
			node.child.return = node;
			node = node.child;
			continue;
		}

		// * 子节点都找完了 递归回到到上一级 找兄弟节点
		if (node === wip) return;
		while (node.sibling === null) {
			if (node.return === null || node.return === wip) return;

			node = node?.return;
		}
		node.sibling.return = node;
		node = node.sibling;
	}
}

// * flags分布在不同的fiberNode种 为了快速找到他们
// * 利用向上归的流程吧 子节点和子节点所有兄弟节点的flags冒泡到父节点的subtreeFlags里
function bubbleProperties(wip: FiberNode) {
	let subtreeFlags = NoFlags;
	let child = wip.child;

	while (child !== null) {
		subtreeFlags |= child.subTreeFlags;
		subtreeFlags |= child.flags;

		child.return = wip;
		child = child.sibling;
	}

	wip.subTreeFlags = subtreeFlags;
}
