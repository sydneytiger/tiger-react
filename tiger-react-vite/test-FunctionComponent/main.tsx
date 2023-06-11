import React from 'react';
import ReactDOM from 'react-dom/client';

const HelloWorld = () => (
	<span ref="spanRef" key="321">
		hello world!
	</span>
);

const App = () => (
	<div key="123">
		<HelloWorld />
	</div>
);

const root = document.querySelector('#root');
ReactDOM.createRoot(root).render(<App />);

console.log('🐯 ~ React:', React);
console.log('🐯 ~ App:', App);
console.log('🐯 ~ ReactDOM:', ReactDOM);
