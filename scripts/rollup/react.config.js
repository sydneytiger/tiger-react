import {
	getPackageJSON,
	resolveDistPath,
	resolvePkgPath,
	getBaseRollupPlugins
} from './utils';
import generatePackageJson from 'rollup-plugin-generate-package-json';

// * extract the name and module properties from react/package.json
// * module字段是每个包的入口文件 不能缺失
const { name, module } = getPackageJSON('react');

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
		plugins: [
			...getBaseRollupPlugins(),
			// * 给react包添加一个package.json
			generatePackageJson({
				inputFolder: pkgPath,
				outputFolder: distPath,
				baseContents: ({ name, description, version }) => ({
					name,
					description,
					version,
					main: 'index.js'
				})
			})
		]
	},
	{
		input: `${pkgPath}/src/jsx.ts`,
		output: [
			// * jsx-runtime
			{
				file: `${distPath}/jsx-runtime.js`,
				name: 'jsx-runtime.js',
				format: 'umd'
			},
			// * jsx-dev-runtime
			{
				file: `${distPath}/jsx-dev-runtime.js`,
				name: 'jsx-dev-runtime.js',
				format: 'umd'
			}
		],
		plugins: [...getBaseRollupPlugins()]
	}
];
