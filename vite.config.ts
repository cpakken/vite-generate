import path from 'path'
import dts from 'vite-plugin-dts'
import { defineConfig } from 'vitest/config'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import packagejson from './package.json'

export default defineConfig({
  // plugins: [
  //   dts({
  //     outputDir: './dist/types',
  //     entryRoot: './src',
  //     // skipDiagnostics: false,
  //   }),
  // ],'path', 'fs'
  build: {
    // sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, 'src/vite-generate.ts'),
      name: 'vite-generate',
      formats: ['cjs', 'es'],
      // formats: ['cjs'],
    },
    rollupOptions: {
      // external: [...Object.keys(packagejson.dependencies), 'path'],
      external: [...Object.keys(packagejson.dependencies), 'path', 'fs'],
      // external: [...Object.keys(packagejson.dependencies), /^node:/],
      // external: Object.keys(packagejson.dependencies),
      // plugins: [nodeResolve()],
    },
  },
})
