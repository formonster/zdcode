export function upperFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
export function lowerFirstLetter(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export const formatFuns = {
  F: upperFirstLetter,
  f: lowerFirstLetter
}

export const format = (str: string, params: Record<string, string>): string => {
  let items: string[] = str.match(/(\$T\{)([A-Za-z | _])+(\})/g)
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
    let res = value
    for (const format of formats) {
      if (formatFuns[format]) {
        res = formatFuns[format](res)
      }
    }
    str = str.replace(new RegExp(content.replace('$', '\\$').replace('{', '\\{').replace('}', '\\}').replace('|', '\\|'), 'g'), res)
  })

  console.log('str', str);

  return str
}