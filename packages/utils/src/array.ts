import cloneDeep from 'lodash/cloneDeep'
import flattenDeep from 'lodash/flattenDeep'

export function arr2Dic<
  T extends Record<string, any>,
  K extends keyof T,
  A extends boolean
>(
  arr: T[] = [],
  field: K,
  options: {
    alwaysArray?: A,
    withIndex?: boolean
  } = {}
): A extends true ? Record<string, (T & { _index?: number })[]> : Record<string, (T & { _index?: number })> {
  const { alwaysArray = false, withIndex = false } = options
  let dic: Record<string, T | T[]> = {}
  arr.forEach((vo, i) => {
    // @ts-ignore
    if (withIndex) vo._index = i
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
      // @ts-ignore
      item[childsKey] = arr2DicDeep(
        item[childsKey] as T[],
        field,
        childsKey,
        options
      )
    }
    dic[item[field]] = item
  }
  // @ts-ignore
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


export const sortAsc = function <T, K extends keyof T>(arr: T[], field: K) {
  function compare(path: K) {
    return function (a: T, b: T) {
      var value1 = path ? a[path] : a
      var value2 = path ? b[path] : b
      if (typeof value1 === 'number' && typeof value2 === 'number')
        return value1 - value2
    }
  }
  // @ts-ignore
  return arr.sort(compare(field))
}
export const sortDesc = function <T, K extends keyof T>(arr: T[], field: K) {
  function compare(path: K) {
    return function (a: T, b: T) {
      var value1 = path ? a[path] : a
      var value2 = path ? b[path] : b
      if (typeof value1 === 'number' && typeof value2 === 'number')
        return value2 - value1
    }
  }
  // @ts-ignore
  return arr.sort(compare(field))
}

export const flattenDeepByField = (arr: any[], field: string) => {
  const map = (item: any) => {
    if (!item[field]) return item
    return [item, item[field].map(map)]
  }
  return flattenDeep(arr.map(map))
}

export const mapFields = <T, K extends keyof T>(arr: T[], fields: K[]) => {
  return arr.map((item) => {
    let res: Partial<Record<K, T[K]>> = {}
    fields.forEach((key) => {
      res[key] = item[key]
    })
    return res
  })
}