import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const source = join(root, 'node_modules', 'lism-css', 'dist', 'css', 'main.css')
const targetDir = join(root, 'public', 'vendor', 'lism-css')
const target = join(targetDir, 'main.css')

if (!existsSync(source)) {
  if (existsSync(target)) {
    console.log('vendor-lism-css: using committed public/vendor/lism-css/main.css')
    process.exit(0)
  }
  console.warn('vendor-lism-css: lism-css is not installed and no vendored CSS was found')
  process.exit(0)
}

mkdirSync(targetDir, { recursive: true })
copyFileSync(source, target)
console.log('vendor-lism-css: copied lism-css main.css to public/vendor/lism-css/')
