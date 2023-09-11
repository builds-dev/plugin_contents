import pkg from '../package.json' assert { type: 'json' }
import {
	create_contents_module,
	virtual_module_id_prefix
} from './index.js'

const name = pkg.name
const meta = Symbol()

export const plugin_contents = () => {
	return {
		name,
		resolveId (source, importer, options) {
			return source.startsWith(virtual_module_id_prefix)
				?
					{
						id: source,
						meta: {
							[meta]: { importer, options }
						}
					}
				:
					null
		},
		async load (id) {
			const module_info = this.getModuleInfo(id)
			if (module_info.meta[meta]) {
				const { importer, options } = module_info.meta[meta]
				const resolution = await this.resolve(
					id.slice(virtual_module_id_prefix.length),
					importer,
					options
				)
				this.addWatchFile(resolution.id)
				return { code: await create_contents_module(resolution.id) }
			}
			return null
		}
	}
}
