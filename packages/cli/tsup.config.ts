import { defineConfig } from 'tsup'

export default defineConfig(options => ({
  entry: ['./src/index.ts'],
  splitting: false,
  sourcemap: false,
  clean: !options.watch,
  treeshake: !options.watch,
  dts: true,
  format: ['cjs'],
  minify: !options.watch
}))
