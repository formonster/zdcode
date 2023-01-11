import ts from 'typescript'
import { toMeta } from './common'
import { findType } from './ts'

export const getNodeValue = (value) => {
  let nodeValue = undefined
  if (Array.isArray(value)) {
    nodeValue = {
      type: 'ArrayExpression',
      elements: value.map((valueItem) => getNodeValue(valueItem)),
    }
  } else if (typeof value === 'object' && !Array.isArray(value)) {
    nodeValue = {
      type: 'ObjectExpression',
      properties: getProperties(value),
    }
  } else {
    nodeValue = {
      type: 'Literal',
      value: value,
      raw: typeof value === 'string' ? `'${value}'` : `${value}`,
    }
  }
  return nodeValue
}

export function importComponent(tree, path, name) {
  const hasName = !!name
  if (!hasName) name = getRandomName()
  tree.children.unshift({
    // @ts-ignore
    type: 'mdxjsEsm',
    value: hasName ? `import { ${name} } from "${path}"` : `import ${name} from "${path}"`,
    data: {
      estree: {
        type: 'Program',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [
              {
                type: 'ImportDefaultSpecifier',
                local: {
                  type: 'Identifier',
                  name,
                },
              },
            ],
            source: {
              type: 'Literal',
              value: path,
              raw: `"${path}"`,
            },
          },
        ],
        sourceType: 'module',
      },
    },
  })
  return name
}

export const createTextAttributes = (name, value) => ({
  type: 'mdxJsxAttribute',
  name,
  value,
})
export const createArrayAttributes = (name, value) => {
  return {
    type: 'mdxJsxAttribute',
    name,
    value: {
      type: 'mdxJsxAttributeValueExpression',
      value: JSON.stringify(value),
      data: {
        estree: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrayExpression',
                elements: value.map((propsOption) => ({
                  type: 'ObjectExpression',
                  properties: getProperties(propsOption),
                })),
              },
            },
          ],
          sourceType: 'module',
          comments: [],
        },
      },
    },
  }
}
export const createObjectAttributes = (name, value) => {
  return {
    type: 'mdxJsxAttribute',
    name,
    value: {
      type: 'mdxJsxAttributeValueExpression',
      value: JSON.stringify(value),
      data: {
        estree: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ObjectExpression',
                properties: getProperties(value),
              },
            },
          ],
          sourceType: 'module',
          comments: [],
        },
      },
    },
  }
}

let cacheName = {}
export function getRandomName() {
  let name = `Com${(Math.random() * 10000000).toFixed(0)}`
  while (cacheName[name]) {
    name = `Com${(Math.random() * 10000000).toFixed(0)}`
  }
  return name
}

const getProperties = (params) =>
  Object.entries(params).map(([key, value]) => {
    return {
      type: 'Property',
      method: false,
      shorthand: false,
      computed: false,
      key: {
        type: 'Identifier',
        name: key,
      },
      value: getNodeValue(value),
      kind: 'init',
    }
  })

export function propsToMdxAttributes(props) {
  return Object.entries(props).map(([key, value]) => {
    if (Array.isArray(value)) {
      return createArrayAttributes(key, value)
    }
    if (typeof value === 'object') {
      return createObjectAttributes(key, value)
    }
    return createTextAttributes(key, value)
  })
}

export function formatNodeToJSX({ node, name, props, children }) {
  node.name = name
  node.type = 'mdxJsxFlowElement'
  node.attributes = propsToMdxAttributes(props)
  node.children = children
}

export function createJSXNode({ name, props = [], children = [] }) {
  return {
    type: 'mdxJsxFlowElement',
    name,
    attributes: propsToMdxAttributes(props),
    children,
    data: {
      _mdxExplicitJsx: true,
    },
  }
}

export function createCodeNode({ meta, content }) {
  return {
    type: 'code',
    lang: 'js',
    meta,
    value: content,
  }
}
