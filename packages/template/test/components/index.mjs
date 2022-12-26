#!/usr/bin/env node
import { Command } from 'commander'
import temp from '../../dist/index.mjs'

const program = new Command()

temp(program)

program.parse(process.argv)