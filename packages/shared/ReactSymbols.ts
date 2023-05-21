const supportSymbol = typeof Symbol === 'function' && Symbol.for;

// A unique Id to identify a react element
export const REACT_ELEMENT_TYPE = supportSymbol
	? Symbol.for('react.element')
	: 0xeac7;
