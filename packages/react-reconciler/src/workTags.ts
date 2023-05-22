export const FunctionComponent = 0;

// ? ReactDOM.render()
export const HostRoot = 3;

/**
 * * e.g. <div>hello</div>
 * * <div> FiberNode has a tag of HostComponent
 * * hello FiberNode has a tag of HostText
 * */
export const HostComponent = 5;
export const HostText = 6;

export type WorkTag =
	| typeof FunctionComponent
	| typeof HostRoot
	| typeof HostComponent
	| typeof HostText;
