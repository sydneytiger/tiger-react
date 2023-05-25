import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import type {
	ElementType,
	Key,
	Ref,
	Props,
	ReactElementType
} from '../../shared/ReactTypes';

// To construct a ReactElement object
const ReactElement = (
	type: ElementType,
	key: Key,
	ref: Ref,
	props: Props
): ReactElementType => {
	const element = {
		$$typeof: REACT_ELEMENT_TYPE,
		type,
		key,
		ref,
		props,
		__mark: 'tiger-react'
	};

	return element;
};

export const jsx = (
	type: ElementType,
	config: any,
	...maybeChildren: ReactElementType[]
) => {
	let key: Key = null;
	let ref: Ref = null;

	const props: Props = {};

	for (const name of Object.getOwnPropertyNames(config)) {
		const val = config[name];

		if (name === 'key' && val) {
			key = String(val);
			continue;
		}

		if (name === 'ref' && val) {
			ref = val;
			continue;
		}

		props[name] = val;
	}

	const maybeChildrenLength = maybeChildren.length;
	if (maybeChildrenLength === 1) {
		props.children = maybeChildren[0];
	}

	if (maybeChildrenLength > 1) {
		props.children = maybeChildren;
	}

	return ReactElement(type, key, ref, props);
};

export const jsxDEV = (type: ElementType, config: any) => {
	let key: Key = null;
	let ref: Ref = null;

	const props: Props = {};

	for (const name of Object.getOwnPropertyNames(config)) {
		const val = config[name];

		if (name === 'key' && val) {
			key = String(val);
			continue;
		}

		if (name === 'ref' && val) {
			ref = val;
			continue;
		}

		props[name] = val;
	}

	return ReactElement(type, key, ref, props);
};
