import { Props, Key, Ref, ReactElementType } from 'shared/ReactTypes';
import { FunctionComponent, HostComponent, WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';
import { Container } from 'hostConfig';

export class FiberNode {
	type: any;
	tag: WorkTag;
	pendingProps: Props;
	key: Key;
	stateNode: any;

	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;
	index: number;
	ref: Ref;

	memoizedProps: Props | null;
	memoizedState: any;

	alternate: FiberNode | null;
	flags: Flags;
	subTreeFlags: Flags;
	updateQueue: unknown;

	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		// * instance type
		// * e.g. for a FunctionComponent
		// * the tag value is 0;
		// * the type is the function itself () => {}
		this.tag = tag;
		this.type = null;

		this.key = key;

		// * save the HostComponent's DOM
		// * 保存着DOM节点
		this.stateNode = null;

		//! properties to link between fiber nodes
		//! they make a tree
		// * return -> parent fiber node
		// * sibling -> next same level fiber node
		// * child -> child fiber node
		this.return = null;
		this.sibling = null;
		this.child = null;

		// * the index of parallel fiber nodes
		// * e.g. ui > li * 3
		// * li elements have index of 0, 1, 3 respectively
		this.index = 0;

		this.ref = null;

		//! work unit data 工作单元
		//* pendingProps/memoizedProps store the props data from the ReactElement
		//* pendingProps stores the data before work
		//* memoizedProps stores the data after work
		//* memoizedState stores the state data after work
		this.pendingProps = pendingProps;
		this.memoizedProps = null;
		this.memoizedState = null;
		this.updateQueue = null;

		// * react stores two fiber node tree: current & workInProgress
		// * current represent the current DOM
		// * workInProgress is the new tree about to update
		// * alternate is use to point to the other corresponding fiber node
		// * e.g. if this fiber node is current tree, the alternate points to same one in workInProgress tree vice versa
		this.alternate = null;

		// * after fiber node being worked. It is flagged as different value
		// * like Placement, Update, then the ReactDOM uses flag to call DOM api
		// * e.g. appendChild, removeChild
		this.flags = NoFlags;
		// * 用于保存子fiberNode种冒泡传上来的flags
		this.subTreeFlags = NoFlags;
	}
}

export class FiberRootNode {
	// * 指向hostRootFiber
	container: Container;
	current: FiberNode;
	// ? 指向已经递归更新完成后的 hostRootFiber
	finishedWork: FiberNode | null;

	constructor(container: Container, hostRootFiber: FiberNode) {
		this.container = container;
		this.current = hostRootFiber;
		hostRootFiber.stateNode = this;
		this.finishedWork = null;
	}
}

export const createWorkInProgress = (
	current: FiberNode,
	pendingProps: Props
): FiberNode => {
	let wip = current.alternate;
	const {
		tag,
		key,
		type,
		stateNode,
		updateQueue,
		child,
		memoizedProps,
		memoizedState
	} = current;

	// * wip is null at first meaningful paint (FMP)
	// * it is not be null after FMP.
	if (wip === null) {
		// mount
		wip = new FiberNode(tag, pendingProps, key);
		wip.stateNode = stateNode;

		wip.alternate = current;
		current.alternate = wip;
	} else {
		// update
		wip.pendingProps = pendingProps;
		wip.flags = NoFlags;
		wip.subTreeFlags = NoFlags;
	}

	wip.type = type;
	wip.updateQueue = updateQueue;
	wip.child = child;
	wip.memoizedProps = memoizedProps;
	wip.memoizedState = memoizedState;

	return wip;
};

export const createFiberFromElement = (
	element: ReactElementType
): FiberNode => {
	const { type, key, props } = element;
	let fiberTag: WorkTag = FunctionComponent;

	if (typeof type === 'string') {
		// * <div/> type = 'div'
		fiberTag = HostComponent;
	} else if (typeof type !== 'function' && __DEV__) {
		console.warn('🐯 ~ createFiberFromElement 未定义的type类型:', element);
	}

	const fiber = new FiberNode(fiberTag, props, key);
	fiber.type = type;
	return fiber;
};
