import pkg from '../package.json' assert { type: 'json' }
import {
	create_contents_module,
	virtual_module_id_prefix
} from './index.js'

const name = pkg.name
const namespace = name

export const plugin_contents = () => ({
	name,
	setup (build) {
		build.onResolve(
			{
				filter: new RegExp('^' + virtual_module_id_prefix)
			},
			async ({ path, resolveDir, importer }) => ({
				path: await build.resolve(
					path.slice(virtual_module_id_prefix.length),
					{
						kind: 'import-statement',
						resolveDir
					}
				)
					.then(x => x.path)
				,
				namespace
			})
		)

		build.onLoad(
			{
				filter: /.*/, namespace
			},
			async ({ path }) => ({
				contents: await create_contents_module(path),
				loader: 'js'
			})
		)
	}
})
