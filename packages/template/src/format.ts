import { humpToChain, lowerFirstLetter, upperFirstLetter } from "@zdcode/utils";

export const formatFuns = {
  F: upperFirstLetter,
  f: lowerFirstLetter,
  '-': humpToChain
}

export const replace = (str: string, target: string, value: string) => str.replace(new RegExp(target.replace('$', '\\$').replace('{', '\\{').replace('}', '\\}').replace('|', '\\|'), 'g'), value)

export const format = (str: string, params: Record<string, string>): string => {
  let items: string[] = str.match(/(\$T\{)([A-Za-z|_|:|-])+(\})/g)
  if (!items) return str

  // 去重
  items = Array.from(new Set(items))

  const options = items.map((item) => {
    const data = item.slice(3).slice(0, -1).split("|")
    return {
      content: item,
      formats: data.slice(0, -1),
      name: data.slice(-1)[0],
    }
  })

  options.forEach(({ content, formats, name }) => {
    const value = params[name]
    if (!value) return

    let res = value
    for (const format of formats) {
      if (formatFuns[format]) {
        res = formatFuns[format](res)
      }
    }
    str = replace(str, content, res)
  })

  return str
}