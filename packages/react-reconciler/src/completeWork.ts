import { FiberNode } from './fiber';

//! 递中的归阶段
export const completeWork = (fiber: FiberNode) => {
	console.log('🐯 ~ completeWork ~ fiber:', fiber);
	// * will eventually return child fiber node
};
