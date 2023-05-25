import path from 'path';
import fs from 'fs';

import ts from 'rollup-plugin-typescript2';
import cjs from '@rollup/plugin-commonjs';

const pkgPath = path.resolve(__dirname, '../../packages');
const distPath = path.resolve(__dirname, '../../dist/node_modules');

export const resolvePkgPath = (pkgName) => `${pkgPath}/${pkgName}`;

export const resolveDistPath = (pkgName) => `${distPath}/${pkgName}`;

export const getPackageJSON = (pkgName) => {
	const path = `${resolvePkgPath(pkgName)}/package.json`;
	const jsonStr = fs.readFileSync(path, { encoding: 'utf-8' });
	return JSON.parse(jsonStr);
};

export const getBaseRollupPlugins = ({ typescript = {} } = {}) => [
	cjs(),
	ts(typescript)
];
