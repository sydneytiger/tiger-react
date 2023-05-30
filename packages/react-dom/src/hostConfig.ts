// * Container vary from host env. For a web app, the container is a DOM
export type Container = Element;
export type Instance = Element;

// * 模拟DOM操作
// * 这些方法应该在ReactDOM种实现
export const createInstance = (type: string, props: any): Instance => {
	// TODO handle props
	console.log('🐯 ~ createInstance ~ props:', props);
	return document.createElement(type);
};

export const appendInitialChild = (
	parent: Instance | Container,
	child: Instance
) => {
	parent.appendChild(child);
};

export const createTextInstance = (content: string) => {
	return document.createTextNode(content);
};
export const appendChildToContainer = appendInitialChild;
