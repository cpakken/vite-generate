import { createServer } from 'vite'
import viteGeneratePlugin, { moduleKeyRegex } from '..'
import { resolveCwd } from '../../utils'

function viteTestServer() {
  return createServer({
    root: __dirname,
    server: { middlewareMode: 'ssr' },
    cacheDir: resolveCwd('node_modules/.vite-generate-plugin-test'),
    optimizeDeps: { include: [] },
    plugins: [viteGeneratePlugin()],
  })
}

describe('vite-generate-plugin', () => {
  test('basic', async () => {
    const server = await viteTestServer()
    const resolved = await server.ssrLoadModule('generate:asdf')
    // console.log(resolved.msg)
    console.log({ ...resolved })
  })
})

test('moduleKeyRegex', () => {
  // const ids = ['\0generate:asdf:path', '\0generate:path']
  const ids = ['\0generate:asdf:path', '\0generate:path']
  const results = ids.map((id) => ({ ...moduleKeyRegex.exec(id)?.groups }))
  console.log(results)
})
