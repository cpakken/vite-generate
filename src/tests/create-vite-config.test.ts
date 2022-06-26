import { createViteConfigGenerate } from '../create-vite-config-generate'
import path from 'path'

test('createViteConfigGenerate', async () => {
  const configPath = path.resolve(__dirname, './vite.test.config.ts')
  const config = await createViteConfigGenerate(configPath)
  expect(config).toBeDefined()
})
