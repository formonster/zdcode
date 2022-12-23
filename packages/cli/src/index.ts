#!/usr/bin/env node
import { Command } from 'commander'
import temp from '@zdcode/template'
import packageJson from '../package.json'

const program = new Command()

temp(program)

program.version(
  packageJson.version,
  '-v, --version',
  'output the current version'
)

program.parse(process.argv)