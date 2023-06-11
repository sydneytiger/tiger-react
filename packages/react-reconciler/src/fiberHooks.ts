import { FiberNode } from './fiber';

/**
 * 知识点:
 * 如果一个 FiberNode 是 FunctionComponent e.g.
 * const App = () => {
 * 	return <div>Hello world!</div>
 * }
 * 为了得到 children 我们需要执行这个 function
 * 在 fiber node 中 function 存在与 wip.type 里
 * 而 function 要执行的参数存在于 wip.pendingProps 中
 */
export const renderWithHooks = (wip: FiberNode) => {
	const ComponentFunc = wip.type;
	const props = wip.pendingProps;
	const children = ComponentFunc(props);

	return children;
};
