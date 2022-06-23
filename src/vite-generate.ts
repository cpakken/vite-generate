import { Command } from 'commander'
import { run } from './run'

const program = new Command()
program
  .option('-C, --config [configPath]', 'Path to the vite.config file')
  .option('-W, --watch', 'watch for changes')
  .action(run)
  .parse(process.argv)
