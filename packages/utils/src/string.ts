export const isUpperCase = (str: string) => {
  const code = str[0].charCodeAt(0);
  return code >= 65 && code <= 90
}
export const isLowerCase = (str: string) => {
  const code = str[0].charCodeAt(0);
  return code >= 97 && code <= 122
}