import type { ConfigEnv, UserConfig } from 'vite'

export type GenerateEntry = {
  input: string
  output: string | Record<string, string>
}

export type GenerateJSONConfig = {
  entries: GenerateEntry[]
  viteFinal?: (viteConfig: UserConfig) => UserConfig
}

export type UserConfigWithGenerate = UserConfig & { generate: GenerateJSONConfig }
export type UserConfigExportWithGenerate =
  | UserConfigWithGenerate
  | Promise<UserConfigWithGenerate>
  | ((env: ConfigEnv) => UserConfigExportWithGenerate | Promise<UserConfigWithGenerate>)

export function defineGenerateConfig(config: UserConfigExportWithGenerate): UserConfigExportWithGenerate {
  return config
}

// module.exports = [
//   {
//     input: 'src/manifest/manifest.v2.ts',
//     output: {
//       dev: '$PATH/lib/manifest.v2.dev.json',
//       prod: '$PATH/lib/manifest.v2.prod.json',
//     },
//   },
//   {
//     input: 'src/manifest/manifest.v3.ts',
//     output: 'src/manifest/lib/manifest.v3.json',
//   },
// ]
