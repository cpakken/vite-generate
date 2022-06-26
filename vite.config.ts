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
        'vite-generate.bin': 'src/vite-generate.ts',
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

// export default defineConfig({
//   plugins: [
//     dts({
//       outputDir: './dist/types',
//       entryRoot: './src',
//       // skipDiagnostics: false,
//     }),
//   ],
//   build: {
//     // sourcemap: true,
//     lib: {
//       // entry: path.resolve(__dirname, 'src/vite-generate.ts'),
//       // name: 'vite-generate',
//       entry: path.resolve(__dirname, 'src/index.ts'),
//       // name: 'index',
//       // fileName: 'index.js',
//       formats: ['cjs', 'es'],
//       // formats: ['cjs'],
//     },
//     rollupOptions: {
//       // output: [{ banner: '#!/usr/bin/env node ' }],
//       external: [...Object.keys(packagejson.dependencies), 'path', 'fs'],
//     },
//   },
// })
