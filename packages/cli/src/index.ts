#!/usr/bin/env node
import { Command } from 'commander'
import temp from './modules/template'
import frame from './modules/frame'
import packageJson from '../package.json'

const program = new Command()

temp(program)
frame(program)

program.version(
  packageJson.version,
  '-v, --version',
  'output the current version'
)

program.parse(process.argv)