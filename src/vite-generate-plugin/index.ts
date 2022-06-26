const generateRegex = /^generate:/
export const moduleKeyRegex = /^\0generate:((?<key>\w+):)?/

export default function viteGeneratePlugin() {
  const virtualStore = new Map<string, any>()

  return {
    name: 'vite-generate-plugin',
    resolveId(id: string) {
      if (generateRegex.test(id)) {
        // const resolvedGenerateId = '\0' + id
        const resolvedGenerateId = '\0' + id
        virtualStore.set(resolvedGenerateId, true)
        return resolvedGenerateId
      }
    },
    load(id: string) {
      if (virtualStore.has(id)) {
        return /* typescript */ `
        export const msg = "from virtual module: ${id}"
        export default "from default virtual module: ${id}"
        `
      }
    },
  }
}
