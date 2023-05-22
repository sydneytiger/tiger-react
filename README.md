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
interface ReactElement {
	$$typeof: symbol | number; // to identify a react element
	type: ElementType;
	key: Key;
	ref: Ref;
	props: Props;
	__mark: 'tiger-react';
}
```

A jsx function is essentially
