export const getPromiseData = <T extends unknown>(func: Promise<T>) => {
  return func.then<[T]>((res) => [res]).catch<[null, string]>((err) => [null, err])
}

export const getSettledData = <T>(
  result: PromiseSettledResult<T>,
  throwError: boolean = true
) => {
  if (result.status === 'fulfilled') {
    return [result.value]
  } else {
    if (throwError) throw new Error(result.reason)
    return [null, result.reason]
  }
}

export const getAllSettledPromiseData = <T>(
  promiseSettledResult: PromiseSettledResult<T>[],
  throwError: boolean = true
) => {
  return promiseSettledResult.map((item) => getSettledData(item, throwError))
}
