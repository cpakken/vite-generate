import { MockedFunction } from 'vitest'
import path from 'path'
import write from 'write'
import { foo } from './test.generate'

import { run } from '../run'

describe('Name of the group', () => {
  // const writeMock = vi.fn()
  vi.mock('write', () => ({ default: vi.fn(async (_, val) => val) }))
  const writeMock = write as MockedFunction<typeof write>

  // const { log } = console
  // const logSpy = vi.spyOn(console, 'log')

  afterEach(() => {
    vi.clearAllMocks()
  })

  test('run', async () => {
    const config = path.resolve(__dirname, './vite.test.config.ts')
    await run({ config })

    // log('sdf', (write as any).mock.calls)
    expect(writeMock.mock.calls.map((call) => call[1])).toEqual([JSON.stringify(foo)])
  })
})
