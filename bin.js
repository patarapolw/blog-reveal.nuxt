#!/usr/bin/env node

const { spawnSync } = require('child_process')
const path = require('path')
const yargs = require('yargs')

const { argv } = yargs
  .scriptName('blog-reveal')
  .command('$0 [cmd] <root>', 'Start up Nuxt-ts server', (y) => {
    y
      .positional('cmd', {
        describe: 'Command to pass to Nuxt-ts via Yarn',
        default: 'dev',
      })
      .positional('root', {
        describe: 'Root folder to scan (Must have config.yaml and folders)',
      })
  })
  .help()

process.env.ROOT = path.resolve(process.cwd(), argv.root)

spawnSync('yarn', [argv.cmd], {
  stdio: 'inherit',
  cwd: __dirname,
})
