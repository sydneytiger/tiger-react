// * Container vary from host env. For a web app, the container is a DOM
export type Container = any;

// * 模拟DOM操作
// * 这些方法应该在ReactDOM种实现
export const createInstance = (...arg: any) => {
	return {} as any;
};

export const appendInitialChild = (...arg: any) => {
	return {} as any;
};

export const createTextInstance = (...arg: any) => {
	return {} as any;
};
export const appendChildToContainer = (...arg: any) => {
	return {} as any;
};
