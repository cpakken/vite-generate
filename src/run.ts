import { createServer } from 'vite'
import path from 'path'
import write from 'write'
import chalk from 'chalk'
import { GenerateJSONConfig } from './types'
import { prepareViteConfigForGenerate } from './plugin'

type EventName = 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir'
type GenerateOptions = {
  config?: string
  watch?: boolean
}

export async function run(options: GenerateOptions = { watch: false }) {
  const relPath = (p: string) => path.relative(process.cwd(), p)

  // const viteConfig = config.vite && { ...config.vite, configFile: false }
  const { config, watch } = options

  const viteServer = await createServer({
    ...(config && { configFile: path.resolve(process.cwd(), config) }),
    plugins: [prepareViteConfigForGenerate()],
  })

  const { entries } = (viteServer.config as any).generate as GenerateJSONConfig

  const builds = entries.map(({ input, output }) => {
    const prev: Record<string, any> = {}

    return async (eventName?: EventName, changedPath?: string) => {
      try {
        const outputs = typeof output === 'string' ? { default: output } : output

        const inputPath = path.resolve(process.cwd(), input)
        const ssrModule = await viteServer.ssrLoadModule(inputPath)

        Object.entries(outputs).forEach(([name, out]) => {
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
            write(path.resolve(process.cwd(), outPath), JSON.stringify(result))
          }
        })
      } catch (e) {
        viteServer.ssrFixStacktrace(e as Error)
        console.error(e)
      }
    }
  })

  await Promise.all(builds.map((build) => build()))

  if (watch) {
    console.log('\nWatching for changes...')
    viteServer.watcher.on('all', (eventName, path) => builds.forEach((build) => build(eventName, path)))
  } else {
    if (import.meta.env.MODE !== 'test') process.exit()
  }
}
