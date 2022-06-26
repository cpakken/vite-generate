import chalk from 'chalk'
import path from 'path'
import { createServer, ViteDevServer } from 'vite'
import write from 'write'
import { createViteGenerateConfig } from './create-vite-generate-config'
import { resolveCwd, resolveResult, serializeResult } from './utils'
import { GenerateEntry, GenerateJSONConfig } from './define'

type EventName = 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir'
type GenerateOptions = {
  config?: string
  watch?: boolean
}

export async function run(options: GenerateOptions = { watch: false }) {
  const { config, watch } = options

  const resolvedConfig = await createViteGenerateConfig(config || 'vite.config.ts')

  console.log('loading vite-generate...')
  const viteServer = await createServer(resolvedConfig)

  const { entries } = (viteServer.config as any).generate as GenerateJSONConfig

  const generate = createGenerateProcessor(viteServer, entries)

  await generate()

  if (watch) {
    console.log('\nWatching for changes...')
    viteServer.watcher.on('all', (eventName, path) => generate(eventName, path))
  } else {
    if (import.meta.env.MODE !== 'test') process.exit()
  }
}

function createGenerateProcessor(viteServer: ViteDevServer, entries: GenerateEntry[]) {
  const prev: Record<string, any> = {}
  const { root } = viteServer.config

  return (eventName?: EventName, changedPath?: string) => {
    const processEntry = async ({ input, output }: GenerateEntry): Promise<void[] | undefined> => {
      try {
        const inputPath = resolveCwd(input, root)
        const ssrModule = await viteServer.ssrLoadModule(inputPath)

        const outputs = typeof output === 'string' ? { default: output } : output

        const processOutput = async ([name, out]: [string, string]): Promise<void> => {
          const outPath = out.replace(/^\$PATH/, path.dirname(inputPath))
          const result = ssrModule[name]

          const inputRel = chalk.magentaBright(relPath(inputPath))
          const outRel = chalk.magentaBright(relPath(outPath))

          //Build only if the manifest has changed
          if (prev[name] !== result) {
            if (eventName) {
              //From Change
              const changedPathRel = relPath(changedPath!)

              console.log(
                `${chalk.yellow(eventName)}: ${changedPathRel},\
                     rebuilding ${inputRel}:${chalk.blue(name)} to ${outRel}`
              )
            } else {
              //From Build
              console.log(`building ${inputRel}:${chalk.blue(name)} to ${outRel}`)
            }

            prev[name] = result

            const resolved = await resolveResult(result)
            await write(resolveCwd(outPath, root), serializeResult(resolved))
          }
        }

        return Promise.all(Object.entries(outputs).map(processOutput))
      } catch (e) {
        viteServer.ssrFixStacktrace(e as Error)
        console.error(e)
      }
    }

    return Promise.all(entries.map(processEntry))
  }
}

function relPath(p: string) {
  return path.relative(process.cwd(), p)
}
