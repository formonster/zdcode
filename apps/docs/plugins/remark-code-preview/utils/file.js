import path from 'path'
import fs from 'fs'
import { EOL } from 'node:os'
import stripIndent from 'strip-indent'

export function getFileContent(filePath, file, options) {
  const fileMeta = `file=${filePath}`
  const res =
    /^file=(?<path>.+?)(?:(?:#(?:L(?<from>\d+)(?<dash>-)?)?)(?:L(?<to>\d+))?)?$/.exec(
      fileMeta
    )
  if (!res || !res.groups || !res.groups.path) {
    throw new Error(`Unable to parse file path ${fileMeta}`)
  }
  const fromLine = res.groups.from ? parseInt(res.groups.from, 10) : undefined
  const hasDash = !!res.groups.dash || fromLine === undefined
  const toLine = res.groups.to ? parseInt(res.groups.to, 10) : undefined
  const fileAbsPath = path.resolve(file.dirname, filePath)
  const fileContent = fs.readFileSync(fileAbsPath, 'utf8')
  let value = extractLines(
    fileContent,
    fromLine,
    hasDash,
    toLine,
    options.preserveTrailingNewline
  )
  if (options.removeRedundantIndentations) {
    value = stripIndent(value)
  }
  return value
}

function extractLines(
  content,
  fromLine,
  hasDash,
  toLine,
  preserveTrailingNewline = false
) {
  const lines = content.split(EOL)
  const start = fromLine || 1
  let end
  if (!hasDash) {
    end = start
  } else if (toLine) {
    end = toLine
  } else if (lines[lines.length - 1] === '' && !preserveTrailingNewline) {
    end = lines.length - 1
  } else {
    end = lines.length
  }
  return lines.slice(start - 1, end).join('\n')
}
