import {
	getPackageJSON,
	resolveDistPath,
	resolvePkgPath,
	getBaseRollupPlugins
} from './utils';
import generatePackageJson from 'rollup-plugin-generate-package-json';
import alias from '@rollup/plugin-alias';

// * extract the name and module properties from react-dom/package.json
// * module字段是每个包的入口文件 不能缺失
const { name, module } = getPackageJSON('react-dom');

// * path to to react-dom source code
const pkgPath = resolvePkgPath(name);

// * path to react-dom module output
const distPath = resolveDistPath(name);

export default [
	// * react
	{
		input: `${pkgPath}/${module}`,
		output: [
			{
				file: `${distPath}/index.js`,
				name: 'index.js',
				format: 'umd' //* support both commonJs and es module
			},
			{
				file: `${distPath}/client.js`,
				name: 'client.js',
				format: 'umd' //* support both commonJs and es module
			}
		],
		plugins: [
			...getBaseRollupPlugins(),
			//* resolve alias
			alias({
				entries: {
					hostConfig: `${pkgPath}/src/hostConfig.ts`
				}
			}),
			//* 给react包添加一个package.json
			generatePackageJson({
				inputFolder: pkgPath,
				outputFolder: distPath,
				baseContents: ({ name, description, version }) => ({
					name,
					description,
					version,
					peerDependencies: {
						react: version
					},
					main: 'index.js'
				})
			})
		]
	}
];
