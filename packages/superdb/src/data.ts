import useSWR from 'swr'
import fetch from '@/utils/fetch'

export const useData = (table: string | undefined) => {
  return useSWR<any[]>(['useData', table], async () => {
    if (!table) return []

    const tableRes = await fetch.list<any>({
      table: table,
    })
    return tableRes.data || []
  })
}