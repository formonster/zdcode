import useSWR from 'swr'
import { list } from './fetch'

export const useData = (table: string | undefined) => {
  return useSWR<any[]>(['useData', table], async () => {
    if (!table) return []

    const tableRes = await list(table, {})
    return tableRes.data || []
  })
}