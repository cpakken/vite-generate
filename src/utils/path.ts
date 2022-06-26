import { resolve, relative } from 'path'

const cwd = process.cwd()
export const resolveCwd = (path: string, root?: string) => resolve(root ? resolve(cwd, root) : cwd, path)
export const relativeCwd = (path: string, root?: string) => relative(root ? resolve(cwd, root) : cwd, resolveCwd(path))
