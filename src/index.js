import { readFile } from 'node:fs/promises'

export const virtual_module_id_prefix = 'virtual:contents:'

export const create_contents_module = async path => `export default ${JSON.stringify(await readFile(path, 'utf8'))}`
