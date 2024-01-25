import { join as join_path } from 'node:path'
import { fileURLToPath } from 'node:url'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { build } from 'esbuild'
import pkg from '../package.json' assert { type: 'json' }
import { plugin_contents } from '../src/esbuild.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const test = suite(pkg.name)

const js_data_uri = string =>
	`data:text/javascript;base64,${Buffer.from(string).toString(`base64`)}`

test('', async () => {
	const bundle = await build({
		bundle: true,
		entryPoints: [ join_path(__dirname, 'fixtures', 'main.js') ],
		format: 'esm',
		platform: 'node',
		plugins: [
			plugin_contents()
		],
		write: false
	})
	
	const main_module = await import(js_data_uri(bundle.outputFiles[0].text))
	assert.equal(typeof main_module.foo, 'string')
	const foo_module = await import(js_data_uri(main_module.foo))
	assert.equal(foo_module.foo('x'), 'foo x')
})

test('', async () => {
	try {
		const bundle = await build({
			bundle: true,
			entryPoints: [ join_path(__dirname, 'fixtures', 'import_non_existant.js') ],
			format: 'esm',
			platform: 'node',
			plugins: [
				plugin_contents()
			],
			write: false
		})
		assert.unreachable('should have thrown')
	} catch (error) {
		assert.match(error.message, 'import_non_existant.js')
		assert.match(error.message, 'Could not resolve "./really_non_existant.js"')
	}
})

test.run()
