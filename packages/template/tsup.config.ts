import { defineConfig } from 'tsup'

export default defineConfig((options) => {
  return {
    entry: ['./src/index.ts'],
    minify: !options.watch,
    dts: true,
    format: ['esm', 'cjs']
  }
})