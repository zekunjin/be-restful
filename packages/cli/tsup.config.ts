import { defineConfig } from 'tsup'

export default defineConfig(options => ({
  entry: ['./src/index.ts'],
  splitting: false,
  sourcemap: !options.watch,
  clean: !options.watch,
  treeshake: !options.watch,
  dts: true,
  format: ['cjs'],
  external: ['../public/swagger.json', '../public/client.d.ts'],
  minify: !options.watch
}))
