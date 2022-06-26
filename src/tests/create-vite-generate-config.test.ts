import { createViteGenerateConfig } from '../create-vite-generate-config'
import path from 'path'

test('createViteGenerateConfig', async () => {
  const configPath = path.resolve(__dirname, './vite.test.config.ts')
  const config = await createViteGenerateConfig(configPath)
  expect(config).toBeDefined()
})
