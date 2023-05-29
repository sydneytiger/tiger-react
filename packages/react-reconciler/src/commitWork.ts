import { FiberNode, FiberRootNode } from './fiber';
import { MutationMask, NoFlags, Placement } from './fiberFlags';
import { HostComponent, HostRoot, HostText } from './workTags';
import { Container, appendChildToContainer } from 'hostConfig';

let nextEffect: FiberNode | null = null;

//* 递归fiberNode树 找到含有mutation flag的 HostComponent
export const commitMutationEffects = (finishedWork: FiberNode) => {
	nextEffect = finishedWork;

	while (nextEffect !== null) {
		//* DFS drill down
		const child: FiberNode | null = nextEffect.child;

		if (
			(nextEffect.subTreeFlags & MutationMask) !== NoFlags &&
			child !== null
		) {
			nextEffect = child;
		} else {
			//* DFS rollup
			up: while (nextEffect !== null) {
				commitMutationEffectOnFiber(nextEffect);
				const sibling: FiberNode | null = nextEffect.sibling;

				if (sibling !== null) {
					nextEffect = sibling;
					break up;
				}

				nextEffect = nextEffect.return;
			}
		}
	}
};

const commitMutationEffectOnFiber = (finishedWork: FiberNode) => {
	const flags = finishedWork.flags;

	//* flags存在placement操作
	if ((flags & Placement) !== NoFlags) {
		commitPlacement(finishedWork);
		//* remove Placement from flag
		//* e.g. flag(0b0001110) &= ~Placement(0b0000010) => 0b0001100
		//*                  ^                        ^             ^
		finishedWork.flags &= ~Placement;
	}
	//TODO flags存在update操作
	//TODO flags存在childDeletion操作
};

const commitPlacement = (finishedWork: FiberNode) => {
	if (__DEV__) {
		console.warn('🐯 commit placement', finishedWork);
	}
	//* find the parent DOM
	const hostParent = getHostParent(finishedWork);

	//* append finishedWork's DOM to hostParent
	appendPlacementNodeIntoContainer(finishedWork, hostParent);
};

/**
 ** 向上遍历寻找到原生宿主环境的节点 e.g. HostComponent
 ** 只有原生宿主环境节点才能插入子节点
 ** 例如
 ** <div>
 **   <Tiger />
 **     <Fly />
 ** </div>
 ** 这里 div试试宿主环境节点(HostComponent/HostRoot)它对应一个dom
 ** Tiger和Fly都是react节点 (FunctionComponent) 从Fly向上遍历寻找Parent
 ** 得到的结果是div 而不是Tiger
 */
function getHostParent(fiber: FiberNode): Container {
	let parent = fiber.return;
	while (parent) {
		const parentTag = parent.tag;

		if (parentTag === HostComponent) {
			return parent.stateNode as Container;
		}

		if (parentTag === HostRoot) {
			return (parent.stateNode as FiberRootNode).container;
		}

		//* 不是宿主环境节点 就向上一级 继续寻找
		parent = parent.return;
	}

	if (__DEV__) {
		console.warn('🐯 未找到host parent');
	}
}

/**
 ** 把finishedWork的插入到host parent里 这也是和不同宿主环境原生API对接的接口
 ** 比如: 对应网页宿主的类就是ReactDOM appendChildToContainer
 ** 传参的finishedWork不一定是宿主类型的fiber node
 ** 这时就要向下遍历直到遇到宿主类型的fiber node
 ** 这里又是一个DFS
 */
function appendPlacementNodeIntoContainer(
	finishedWork: FiberNode,
	hostParent: Container
) {
	if (finishedWork.tag === HostComponent || finishedWork.tag === HostText) {
		//* 宿主环境API接口方法
		appendChildToContainer(finishedWork.stateNode, hostParent);
		return;
	}

	//* DFS
	const child = finishedWork.child;
	if (child !== null) {
		appendPlacementNodeIntoContainer(child, hostParent);

		let sibling = child.sibling;
		while (sibling !== null) {
			appendPlacementNodeIntoContainer(sibling, hostParent);
			sibling = sibling.sibling;
		}
	}
}
