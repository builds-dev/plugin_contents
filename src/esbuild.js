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
			async ({ path, resolveDir, importer }) => {
				const resolve_path = path.slice(virtual_module_id_prefix.length)
				const resolved = await build.resolve(
					resolve_path,
					{
						kind: 'import-statement',
						resolveDir
					}
				)

				if (resolved.errors.length) {
					return resolved
				}

				return {
					path: resolved.path,
					namespace
				}
			}
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
