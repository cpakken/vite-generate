import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import packagejson from './package.json'

export default defineConfig({
  plugins: [
    dts({
      outputDir: 'dist/types',
      // entryRoot: './src',
      // skipDiagnostics: false,
    }),
  ],
  build: {
    outDir: 'dist',
    lib: { entry: 'src/index.ts', name: 'vite-generate' },
    rollupOptions: {
      input: {
        'vite-generate.bin': 'src/bin.ts',
        index: 'src/index.ts',
      },
      output: [
        {
          dir: 'dist/cjs',
          format: 'cjs',
          banner: '#!/usr/bin/env node ',
          entryFileNames: '[name].cjs.js',
          chunkFileNames: '[name].cjs.js',
        },
        {
          dir: 'dist/es',
          format: 'es',
          banner: '#!/usr/bin/env node ',
          entryFileNames: '[name].es.js',
          chunkFileNames: '[name].es.js',
        },
      ],
      external: [...Object.keys(packagejson.dependencies), 'path', 'fs'],
    },
  },
})
