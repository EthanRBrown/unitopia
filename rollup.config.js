import ts from 'rollup-plugin-ts'
import { readFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url)))

export default [
  // browser-friendly UMD build
  {
    input: 'src/main.ts',
    output: {
      name: 'unitopia',
      file: pkg.browser,
      format: 'umd',
    },
    plugins: [ts()],
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: 'src/main.ts',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
    plugins: [ts()],
  },
]
