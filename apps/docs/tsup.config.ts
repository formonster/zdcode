import { defineConfig } from 'tsup'
import { sassPlugin } from 'esbuild-sass-plugin'

export default defineConfig((options) => {
  return {
    entry: [
      './src/stories/*.tsx',
      './src/stories/**/index.tsx',
      '!./src/stories/*.stories.tsx',
    ],
    minify: !options.watch,
    dts: true,
    format: ['esm'],
    clean: true,
    esbuildPlugins: [sassPlugin()],
  }
})
