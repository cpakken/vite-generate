import { Command } from 'commander'
import { run } from './run'

const program = new Command()
program
  .option('-c, --config [configPath]', 'Path to the vite.config file')
  .option('-w, --watch', 'watch for changes')
  .action(run)
  .parse(process.argv)
