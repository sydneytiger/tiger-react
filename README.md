# tiger-react

My own version of React. Recording my react source code learning journey

## Project setup

Use mono-repo instead of multi-repos

- pnpm
- eslint - check syntax and find problems
- prettier - enforce code style
- husky - pre commit
- commit lint - git commit message format lint
- rollup - packaging tool e.g. webpack

## file structure

all code are under packages folder

- packages/react - host neutualised
- packages/react-reconciler - host neutualised
- host specific packages e.g. react-dom for web
- packages/shared - host neutualised

## Implement JSX function

It is under packages/react

1. On compile, Barbel transfers the jsx into a jsx function e.g.

```html
<div key={'keyParent'} style={{ color: 'green'}}>
  <span key={'key123'} ref={'ref123'} style={{ color: 'red'}}>123</span>
  <span key={'key456'} ref={'ref456'} style={{ color: 'blue'}}>456</span>
</div>
```

transfer to

```javascript
import { jsx as _jsx } from 'react/jsx-runtime';
import { jsxs as _jsxs } from 'react/jsx-runtime';
/*#__PURE__*/ _jsxs(
	'div',
	{
		style: {
			color: 'green'
		},
		children: [
			/*#__PURE__*/ _jsx(
				'span',
				{
					ref: 'ref123',
					style: {
						color: 'red'
					},
					children: '123'
				},
				'key123'
			),
			/*#__PURE__*/ _jsx(
				'span',
				{
					ref: 'ref456',
					style: {
						color: 'blue'
					},
					children: '456'
				},
				'key456'
			)
		]
	},
	'keyParent'
);
```

2. At runtime, React.jsx outputs ReactElement objects

```typescript
interface ReactElementType {
	$$typeof: symbol | number; // to identify a react element
	type: ElementType;
	key: Key;
	ref: Ref;
	props: Props;
	__mark: 'tiger-react';
}
```

A jsx function is essentially

## packing react module using Rollup

```bash
pnpm i -D -w rimraf rollup-plugin-generate-package-json rollup-plugin-typescript2 @rollup/plugin-commonjs
```

install plugins

- rollup-plugin-generate-package-json
- rollup-plugin-typescript2
- @rollup/plugin-commonjs
- rimraf - linux rm -rf command equivalent on windows

## Debug react locally approach 1

use pnpm link to push the dist package to local global and run another react project locally.

```bash
cd dist/node_modules/react
pnpm link --global
```

Now a global node_modules is created locally. To use it, let create a tiger-react-demo project and then run it locally.

```javascript
// index.js of tiger-react-demo
import React from 'react';

const jsx = (
	<div>
		Hello <span>tiger-react</span>
	</div>
);

console.log('🐯 ~ React:', React);
console.log('🐯 ~ jsx:', jsx);
```

```bash
cd dev/tiger-react-demo
pnpm link react --global
```

Now in the tiger-react-demo code, the `import React from "react";` no longer point to local `node_modules`. It points to the global `node_modules`.

Drawback: No hot refresh. After change, we have to manually run `pnpm build:dev` and then rerun the demo `npm start`

## React component update

There are three ways triggering update:

1. `ReactDOM.createRoot().render()` or in old version `ReactDOM.render()`
2. `this.setState()` class component
3. The dispatch function returning from `useState` (the second item)

When an update action dispatched from a component, the action bubble up to the root element and then start the `renderRoot` function to recursively iterate the fiber node tree.

```javascript
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
```

The `ReactDOM.createRoot()` creates a `fiberRootNode`. `document.getElementById('root')` has its own fiber node called `hostRootFiber` and then `<App />`
![alt text](./README-resources/fiberRootNode.png 'fiber root node')

**fiberRootNode** is the root. All dispatch functions bubble up here and then start loop down.

> 更新可能发生于任意组件，而更新流程是从根节点递归的
> 需要一个统一的根节点保存通用信息 这个根节点就是 fiberRootNode

## Add **DEV** mark

good for debug

```bash
pnpm i -d -w @rollup/plugin-replace
```
