import ts from 'typescript'
import fs from 'fs'
import { formatFilePath, getComponentName } from './common'
import { firstFetterCase } from './string'

export function findType(rootNode, typeName) {
  return rootNode.statements.find(
    // @ts-ignore
    (node) => node.name?.escapedText === typeName
  )
}
const filterParent = ({ parent, ...other }) => other

export function getComponentPropsOptions(normalizedFilePath, componentName) {
  const rootNode = ts.createSourceFile(
    normalizedFilePath,
    fs.readFileSync(normalizedFilePath).toString(),
    ts.ScriptTarget.ES2015,
    /*setParentNodes */ true
  )
  const propsNode = findPropsType(rootNode, componentName)
  if (!propsNode) {
    console.warn(
      `没有找到 ${componentName} 组件的类型声明，请按照如下规则声明组件类型：IDemoProps`
    )
    return
  }
  const propsOptions = getEditorPropsOptions(propsNode, rootNode)
  return propsOptions
}

export function findPropsType(rootNode, componentName) {
  return rootNode.statements.find((node) => {
    var _a
    // @ts-ignore
    return (
      ((_a = node.name) === null || _a === void 0 ? void 0 : _a.escapedText) ===
      `I${firstFetterCase(componentName)}Props`
    )
  })
}

export function getEditorPropsOptions(propsNode, rootNode) {
  return propsNode.members?.map((node) => {
    // console.log(filterParent(node).type.getText())
    return getOption(node, rootNode)
  })
}

function getOption(node, rootNode) {
  let options = {}
  options.name = node.name.escapedText
  options.remarks = node.jsDoc?.map(({ comment }) => comment)[0]
  options.tags = {}
  // @ts-ignore
  node.jsDoc?.map(({ tags }) =>
    // @ts-ignore
    tags?.map(({ tagName, comment }) => {
      const value = comment === undefined ? true : comment
      if (tagName) options.tags[tagName.escapedText] = value
    })
  )[0]
  options.require = !node.questionToken
  options.type = node.type.getText().replace(/\n/g, '\\n').replace(/'/g, '"')
  options.kind = node.type?.kind

  formatNodeOption(options, node, rootNode)
  return options
}

export function formatNodeOption(options, node, rootNode) {
  if (node.type?.kind === ts.SyntaxKind.TypeLiteral) {
    options.attribute = getEditorPropsOptions(node.type, rootNode)
  }

  if (node.type?.kind === ts.SyntaxKind.UnionType) {
    options.selectOptions = []
    // 只允许基础类型
    node.type.types.forEach((item) => {
      if (item?.kind === ts.SyntaxKind.LiteralType) {
        options.selectOptions.push(item.literal.text)
      }
    })
  }

  if (node.type?.kind === ts.SyntaxKind.TypeReference) {
    const typeName = node.type.typeName.escapedText
    const linkType = findType(rootNode, typeName)
    // @ts-ignore
    options.kind = linkType.type?.kind

    formatNodeOption(options, linkType, rootNode)
  }
}
