export type RecordCtl<T = Record<string, any>> = {
  diff: <K extends keyof T>(newObj: T, retain?: K[]) => Partial<T>;
  done: () => void;
}
export const record = <T extends Record<string, any>>(obj: T): RecordCtl<T> => {
  return {
    diff: <K extends keyof T>(newObj: T, retain?: K[]) => {
      let res: Partial<T> = {}
      if (retain) retain.forEach(key => res[key] = newObj[key])
      Object.entries(newObj).forEach(([key, value]) => {
        if (obj[key] === value) return
        // @ts-ignore
        res[key] = value
      })
      return res
    },
    done: () => {
      // @ts-ignore
      obj = null
    }
  }
}