import path from 'path'
import { loadConfigFromFile } from 'vite'
import { UserConfigWithGenerate } from './define'

export async function createViteConfigGenerate(viteConfigPath: string): Promise<UserConfigWithGenerate> {
  const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'
  const resolvedPath = path.resolve(process.cwd(), viteConfigPath)
  const { config } = (await loadConfigFromFile({ command: 'serve', mode }, resolvedPath)) || { config: {} }

  const { generate, ...userConfig } = config as UserConfigWithGenerate
  if (!generate) throw new Error('generate is not defined in vite config')

  const { viteConfig, entries } = generate

  const configFinal = viteConfig ? viteConfig(userConfig) : userConfig

  return {
    ...configFinal,
    generate,
    logLevel: 'silent',
    cacheDir: 'node_modules/.vite-generate',
    server: { middlewareMode: 'ssr' },
    build: {
      //https://vitejs.dev/config/#optimizedeps-entries
      rollupOptions: {
        input: entries.map(({ input }) => path.resolve(process.cwd(), input)),
      },
    },
  }
}
