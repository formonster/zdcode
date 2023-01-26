import { useFetch } from '@zdcode/fetch'
import { list, responseError } from './fetch'

export const useData = (table: string | undefined) => useFetch<any[]>(async () => {
  if (!table) return []

  const res = await list<any>(table)
  if (responseError(res)) return []
  return res.data || []
}, [], [table])