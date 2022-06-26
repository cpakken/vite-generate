import { loadConfigFromFile } from 'vite'
import type { UserConfigWithGenerate } from './define'
import { relativeCwd, resolveCwd } from './utils'

export async function createViteGenerateConfig(viteConfigPath: string): Promise<UserConfigWithGenerate> {
  const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'
  const resolvedPath = resolveCwd(viteConfigPath)

  const { config } = (await loadConfigFromFile({ command: 'serve', mode }, resolvedPath)) || { config: {} }

  const { generate, ...userConfig } = config as UserConfigWithGenerate
  if (!generate) throw new Error('generate is not defined in vite config')

  const { viteConfig, entries } = generate

  const configFinal = viteConfig ? viteConfig(userConfig) : userConfig

  const optimizedEntries = entries.map(({ input }) => relativeCwd(input, configFinal.root))
  // console.log({ optimizedEntries })

  return {
    ...configFinal,
    generate,
    // logLevel: 'silent',
    logLevel: 'info',
    cacheDir: 'node_modules/.vite-generate',
    server: { middlewareMode: 'ssr' },
    optimizeDeps: { entries: optimizedEntries },
  }
}
