import path from 'path'
import { defineConfig } from 'vite'
import packagejson from './package.json'
import dts from 'vite-plugin-dts'

export default defineConfig({
  // plugins: [
  //   dts({
  //     outputDir: './dist/types',
  //     entryRoot: './src',
  //     // skipDiagnostics: false,
  //   }),
  // ],
  build: {
    // sourcemap: true,
    emptyOutDir: false,
    lib: {
      // entry: path.resolve(__dirname, 'src/index.ts'),
      entry: path.resolve(__dirname, 'src/vite-generate.ts'),
      fileName: 'vite-generate.bin',
      formats: ['cjs'],
      // formats: ['cjs', 'es'],
    },
    rollupOptions: {
      output: { banner: '#!/usr/bin/env node ', format: 'cjs' },
      external: [...Object.keys(packagejson.dependencies), 'path', 'fs'],
    },
  },
})
