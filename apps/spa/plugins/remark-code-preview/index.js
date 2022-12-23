import path from 'node:path'
import { visit } from 'unist-util-visit'
import { getComponentPropsOptions } from './utils/ts'
import { formatFilePath, getComponentName, getMetaDic } from './utils/common'
import { getFileContent } from './utils/file'
import {
  createCodeNode,
  createJSXNode,
  formatNodeToJSX,
  importComponent,
} from './utils/mdx'

function codePreview(options = {}) {
  if (!options.rootDir) options.rootDir = process.cwd()
  const rootDir = options.rootDir
  if (!path.isAbsolute(rootDir)) {
    throw new Error(`"rootDir" has to be an absolute path`)
  }

  return function transformer(tree, file) {
    if (!file.dirname) {
      throw new Error('"file" should be an instance of VFile')
    }

    const codes = []
    visit(tree, 'code', (node, index, parent) => {
      codes.push([node, index, parent])
    })

    // 计算相对于 docs-components 的层级，用于自动引入组件
    const hierarchy = file.dirname
      .replace(`${file.cwd}/src/`, '')
      .split('/')
      .map(() => '../')
      .join('')

    for (const [node] of codes) {
      const metas = getMetaDic(node.meta)

      const meta = metas[0]
      if (!meta.type) continue

      if (meta.type === 'case') {
        const { file: filePath } = meta
        // 1. 获取全路径
        const normalizedFilePath = formatFilePath(filePath, options)
        const componentName = getComponentName(filePath)
        // 2. 获取 TS 类型声明
        const propsOptions = getComponentPropsOptions(
          normalizedFilePath,
          componentName
        )
        const fileContent = getFileContent(normalizedFilePath, file, options)
        const importName = importComponent(tree, normalizedFilePath)

        formatNodeToJSX({
          node,
          name: 'PreviewCase',
          props: {
            componentName,
            meta,
            componentPropsOptions: propsOptions,
          },
          children: [
            createJSXNode({ name: importName }),
            createCodeNode({ meta: node.meta, content: fileContent }),
          ],
        })
      } else if (meta.type === 'component') {
        const { file: filePath } = meta
        // 1. 获取全路径
        const normalizedFilePath = formatFilePath(filePath, options)
        const componentName = getComponentName(filePath)
        // 2. 获取 TS 类型声明
        const propsOptions = getComponentPropsOptions(
          normalizedFilePath,
          componentName
        )
        const fileContent = getFileContent(normalizedFilePath, file, options)
        const importName = importComponent(tree, normalizedFilePath, componentName)

        formatNodeToJSX({
          node,
          name: 'PreviewComponent',
          props: {
            componentName,
            meta,
            componentPropsOptions: propsOptions,
          },
          children: [
            createJSXNode({ name: importName }),
            createCodeNode({ meta: node.meta, content: fileContent }),
          ],
        })
      }
    }
  }
}

export { codePreview }
