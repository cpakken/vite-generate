import type { Plugin } from 'vite'
import type { UserConfigWithGenerate } from './types'
import path from 'path'

//Mofifies vite config to use createServer

export function prepareViteConfigForGenerate(): Plugin {
  return {
    name: 'prepare-vite-config-for-generate',
    config: (_config) => {
      const { generate, ...userConfig } = _config as UserConfigWithGenerate
      if (!generate) throw new Error('generate is not defined in vite config')

      const { viteFinal, entries } = generate
      const config = viteFinal ? viteFinal(userConfig) : userConfig

      return {
        ...config,
        logLevel: 'silent',
        cacheDir: 'node_modules/.generate-json',
        server: { middlewareMode: 'ssr' },
        build: {
          //https://vitejs.dev/config/#optimizedeps-entries
          rollupOptions: {
            input: entries.map(({ input }) => path.resolve(process.cwd(), input)),
          },
        },
      }
    },
  }
}
