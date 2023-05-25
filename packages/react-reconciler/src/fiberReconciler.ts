import { Container } from 'hostConfig';
import { ReactElementType } from 'shared/ReactTypes';
import { FiberNode, FiberRootNode } from './fiber';
import {
	createUpdate,
	createUpdateQueue,
	enqueueUpdate,
	UpdateQueue
} from './updateQueue';
import { scheduleUpdateOnFiber } from './workLoop';
import { HostRoot } from './workTags';

// * hooks to ReactDOM.createRoot()
export const createContainer = (container: Container) => {
	const hostRootFiber = new FiberNode(HostRoot, {}, null);
	// * 接入更新机制
	hostRootFiber.updateQueue = createUpdateQueue();
	const root = new FiberRootNode(container, hostRootFiber);

	return root;
};

// * hooks to .render()
export const updateContainer = (
	element: ReactElementType | null,
	root: FiberRootNode
) => {
	const hostRootFiber = root.current;
	const update = createUpdate<ReactElementType | null>(element);
	enqueueUpdate(
		hostRootFiber.updateQueue as UpdateQueue<ReactElementType | null>,
		update
	);
	// * 接入实现fiberNode递归的workloop
	scheduleUpdateOnFiber(hostRootFiber);

	return element;
};
