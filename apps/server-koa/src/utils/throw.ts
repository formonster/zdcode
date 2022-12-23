export const throwError = (message: string, log?: any): Error => {
  if (log) console.log('-- error log', log);
  throw new Error(message)
}