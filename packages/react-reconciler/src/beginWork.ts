import { FiberNode } from './fiber';

//! 递归中的递阶段
export const beginWork = (fiber: FiberNode): FiberNode | null => {
	console.log('🐯 ~ beginWork ~ fiber:', fiber);
	// * will eventually return child fiber node
	return null;
};
