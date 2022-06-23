import path from 'path'
import { defineConfig } from 'vitest/config'
import packagejson from './package.json'
// import dts from 'vite-plugin-dts'

export default defineConfig({
  // plugins: [
  //   dts({
  //     outputDir: './dist/types',
  //     entryRoot: './src',
  //     // skipDiagnostics: false,
  //   }),
  // ]
  build: {
    // sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, 'src/vite-generate.ts'),
      name: 'vite-generate',
      formats: ['cjs', 'es'],
      // formats: ['cjs'],
    },
    rollupOptions: {
      output: { banner: '#!/usr/bin/env node ' },
      external: [...Object.keys(packagejson.dependencies), 'path', 'fs'],
    },
  },
})
