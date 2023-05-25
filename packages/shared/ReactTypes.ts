export type Type = any;
export type Key = any;
export type Ref = any;
export type Props = any;
export type ElementType = any;

export interface ReactElementType {
	$$typeof: symbol | number;
	type: ElementType;
	key: Key;
	props: Props;
	ref: Ref;
	__mark: string;
}

/**
 * * action could be
 * * this.setState({a: 1})
 * * this.setState(({a: 0}) => ({a: 1}))
 */
export type Action<State> = State | ((prevState: State) => State);
