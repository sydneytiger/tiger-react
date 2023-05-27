import { ReactElementType } from 'shared/ReactTypes';
import { FiberNode, createFiberFromElement } from './fiber';
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import { HostText } from './workTags';
import { Placement } from './fiberFlags';

/**
 * @param shouldTrackEffects boolean 是否追踪副作用
 */
function ChildReconciler(shouldTrackEffects: boolean) {
	const reconcileSingleElement = (
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		element: ReactElementType
	): FiberNode => {
		// * 根据element创建一个fiber
		const fiber = createFiberFromElement(element);
		fiber.return = returnFiber;
		return fiber;
	};

	const reconcileSingleTextNode = (
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		content: string | number
	): FiberNode => {
		const fiber = new FiberNode(HostText, { content }, null);
		fiber.return = returnFiber;
		return fiber;
	};

	const placeSingleChild = (fiber: FiberNode): FiberNode => {
		const isFirstRender = fiber.alternate === null;
		if (shouldTrackEffects && isFirstRender) {
			fiber.flags |= Placement;
		}

		return fiber;
	};

	// * 闭包
	return function reconcileChildFiber(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		newChild?: ReactElementType
	) {
		//* 判断当前fiber类型
		if (typeof newChild === 'object' && newChild !== null) {
			switch (newChild.$$typeof) {
				case REACT_ELEMENT_TYPE:
					const fiber = reconcileSingleElement(
						returnFiber,
						currentFiber,
						newChild
					);
					return placeSingleChild(fiber);
				default:
					if (__DEV__) {
						console.warn(
							'🐯 ~ ChildReconciler 未实现的reconcile类型:',
							newChild
						);
					}
					break;
			}
		}

		// TODO 多节点情况 ul>li*3

		//* HostText情况
		if (typeof newChild === 'string' || typeof newChild === 'number') {
			const fiber = reconcileSingleTextNode(
				returnFiber,
				currentFiber,
				newChild
			);
			return placeSingleChild(fiber);
		}

		if (__DEV__) {
			console.warn('🐯 ~ ChildReconciler 未实现的reconcile类型:', newChild);
		}

		return null;
	};
}

export const reconcileChildFibers = ChildReconciler(true);
export const mountChildFibers = ChildReconciler(false);
