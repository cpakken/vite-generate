import { defineGenerateConfig } from '../types'

export default defineGenerateConfig({
  generate: {
    entries: [
      {
        input: 'src/tests/test.generate.ts',
        output: {
          foo: 'dist/out/generated.json',
        },
      },
    ],
  },
})
