import write from 'write'

import { run } from '../run'

describe('Name of the group', () => {
  // const writeMock = vi.fn()
  const { log } = console
  vi.mock('write', () => ({ default: vi.fn(async (_, val) => val) }))
  const logSpy = vi.spyOn(console, 'log')

  afterEach(() => {
    vi.clearAllMocks()
  })

  test('run', async () => {
    await run({ config: 'src/tests/vite.test.config.ts' })
    log('sdf', (write as any).mock.calls)
  })
})
