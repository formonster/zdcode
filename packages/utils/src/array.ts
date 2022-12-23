import { clone, flattenDeep } from 'lodash'

export const arr2Dic = function <T, K extends keyof T>(
  arr: T[] = [],
  field: K,
  other?: object
): { [name: string]: T } {
  let dic = {}
  if (Array.isArray(field)) {
    arr.forEach((vo) => {
      // @ts-ignore
      dic[vo[field[0]]] = other
        ? // @ts-ignore
          Object.assign(vo, clone(other))
        : // @ts-ignore
          vo[field[1]]
    })
  } else {
    arr.forEach((vo) => {
      // @ts-ignore
      dic[vo[field]] = other ? Object.assign(vo, clone(other)) : vo
    })
  }
  return dic
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