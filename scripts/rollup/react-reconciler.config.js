import {
	getPackageJSON,
	resolveDistPath,
	resolvePkgPath,
	getBaseRollupPlugins
} from './utils';

// * extract the name and module properties from react-reconciler/package.json
// * module字段是每个包的入口文件 不能缺失
const { name, module } = getPackageJSON('react-reconciler');

// * path to to react source code
const pkgPath = resolvePkgPath(name);

// * path to react module output
const distPath = resolveDistPath(name);

export default [
	// * react
	{
		input: `${pkgPath}/${module}`,
		output: {
			file: `${distPath}/index.js`,
			name: 'index.js',
			format: 'umd' //* support both commonJs and es module
		},
		plugins: [...getBaseRollupPlugins()]
	}
];
