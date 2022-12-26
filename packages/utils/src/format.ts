import { isUpperCase } from "./string";

export function upperFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
export function lowerFirstLetter(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

/**
 * 将驼峰形式的字符串转为链式的
 * @param str 字符串
 */
export const humpToChain = (str: string) => {
  return str.split('').map(char => isUpperCase(char) ? `-${char.toLowerCase()}` : char).join('')
}