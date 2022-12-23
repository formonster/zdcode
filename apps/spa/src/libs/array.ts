import { cloneDeep } from 'lodash'

export function arr2Dic<
  T extends Record<string, any>,
  K extends keyof T,
  A extends boolean
>(
  arr: T[] = [],
  field: K,
  options: {
    alwaysArray?: A
  } = {}
): A extends true ? Record<string, T[]> : Record<string, T> {
  const { alwaysArray = false } = options
  let dic: Record<string, T | T[]> = {}
  arr.forEach((vo) => {
    if (dic[vo[field]]) {
      if (!Array.isArray(dic[vo[field]]))
        dic[vo[field]] = [dic[vo[field]]] as T[]
      dic[vo[field]].push(vo)
      return
    }
    dic[vo[field]] = alwaysArray ? [vo] : vo
  })
  // @ts-ignore
  return dic
}

export function arr2DicDeep<
  T extends Record<string, any>,
  K extends keyof T,
  A extends boolean
>(
  arr: T[] = [],
  field: K,
  childsKey: K,
  options: {
    alwaysArray?: A
  } = {}
): A extends true ? Record<string, T[]> : Record<string, T> {
  let dic: Record<string, T | T[]> = {}

  for (const currentitem of arr) {
    const item = { ...currentitem }
    if (item[childsKey] && Array.isArray(item[childsKey])) {
      item[childsKey] = arr2DicDeep(
        item[childsKey] as T[],
        field,
        childsKey,
        options
      )
    }
    dic[item[field]] = item
  }
  return dic
}

export const deepMap = <T extends any, K extends keyof T>(
  arr: T[],
  deepKey: K,
  map: (data: T, parent: T | undefined, indexPath: number[]) => any,
  parent: T | undefined = undefined,
  indexPath: number[] = []
) => {
  const _arr = cloneDeep(arr)
  
  let i = 0
  for (const item of _arr) {
    const currentIndexPath = [...indexPath, i]
    _arr[i] = map(item, parent, currentIndexPath)
    
    const childs = _arr[i][deepKey]
    if (childs && Array.isArray(childs)) {
      _arr[i][deepKey] = deepMap(
        _arr[i][deepKey] as T[],
        deepKey,
        map,
        _arr[i],
        currentIndexPath
      ) as T[K]
    }
    i++
  }
  return _arr
}

export const findFirstLeaf = <T extends any, K extends keyof T>(
  arr: T[],
  deepKey: K,
) => {
  let currentNode = arr[0]
  while (currentNode[deepKey]) {
    const childs = currentNode[deepKey] as T[]
    const next = childs[0]
    if (!next) return currentNode
    currentNode = next
  }
  return currentNode
}
