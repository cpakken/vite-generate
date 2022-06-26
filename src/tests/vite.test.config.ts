import { defineGenerateConfig } from '../define'

export default defineGenerateConfig({
  resolve: {
    dedupe: ['mobx'],
  },
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
