export function getComponentName(filePath) {
  const filePathArr = filePath.split('/')
  let componentName = filePathArr[filePathArr.length - 1].split('.')[0]
  if (componentName === 'index')
    componentName = filePathArr[filePathArr.length - 2]
  return componentName
}

export const getMetaDic = (metaStr) => {
  if (!metaStr) return []
  return metaStr.split(' | ').map((metaItem) => {
    let meta = {}
    metaItem
      .split(' ')
      .map((meta) => meta.split('='))
      .forEach(([name, value]) => {
        meta[name] = value
      })
    return meta
  })
}

export function formatFilePath(filePath, options) {
  const normalizedFilePath = filePath
    .replace(/^@/, options.rootDir)
    .replace(/\\ /g, ' ')
  return normalizedFilePath
}

export const toMeta = (metaDic) =>
  Object.entries(metaDic)
    .map(([key, value]) => `${key}=${value}`)
    .join(' ')
