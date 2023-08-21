import { defineConfig } from 'tsup'

export default defineConfig(options => ({
  entry: ['./src/index.ts'],
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  dts: false,
  format: ['cjs'],
  minify: !options.watch
}))
