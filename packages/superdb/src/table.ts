import useSWR from 'swr'
import fetch from '@/utils/fetch'
import { Table } from '.'

export const useTables = () => useSWR<Table[]>('useTables', async () => {
  const tableRes = await fetch.list<Table>({
    table: 'tables',
  })
  return tableRes.data
})