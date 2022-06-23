import chalk from 'chalk'
import path from 'path'
import { createServer, ViteDevServer } from 'vite'
import write from 'write'
import { createViteConfigGenerate } from './create-vite-config-generate'
import { GenerateEntry, GenerateJSONConfig } from './types'

type EventName = 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir'
type GenerateOptions = {
  config?: string
  watch?: boolean
}

export async function run(options: GenerateOptions = { watch: false }) {
  // const viteConfig = config.vite && { ...config.vite, configFile: false }
  const { config, watch } = options

  // const viteServer = await createServer({
  //   ...(config && { configFile: path.resolve(process.cwd(), config) }),
  //   plugins: [prepareViteConfigForGenerate()],
  // })

  const viteServer = await createServer(await createViteConfigGenerate(config || 'vite.config.ts'))

  const { entries } = (viteServer.config as any).generate as GenerateJSONConfig

  const generate = createGenerateProcessor(viteServer, entries)

  await generate()

  if (watch) {
    console.log('\nWatching for changes...')
    // viteServer.watcher.on('all', (eventName, path) => generateEntries.forEach((generate) => generate(eventName, path)))
    viteServer.watcher.on('all', (eventName, path) => generate(eventName, path))
  } else {
    if (import.meta.env.MODE !== 'test') process.exit()
  }
}

function createGenerateProcessor(viteServer: ViteDevServer, entries: GenerateEntry[]) {
  const prev: Record<string, any> = {}

  return (eventName?: EventName, changedPath?: string) => {
    return Promise.all(
      entries.map(async ({ input, output }) => {
        try {
          const outputs = typeof output === 'string' ? { default: output } : output

          const inputPath = path.resolve(process.cwd(), input)
          const ssrModule = await viteServer.ssrLoadModule(inputPath)

          return Promise.all(
            Object.entries(outputs).map(async ([name, out]) => {
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
                // await write(path.resolve(process.cwd(), outPath), JSON.stringify(result))
                await write(path.resolve(process.cwd(), outPath), JSON.stringify(result))
              }
            })
          )
        } catch (e) {
          viteServer.ssrFixStacktrace(e as Error)
          console.error(e)
        }
      })
    )
  }
}

function relPath(p: string) {
  return path.relative(process.cwd(), p)
}
