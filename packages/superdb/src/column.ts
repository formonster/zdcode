import useSWR from 'swr'
import fetch from '@/utils/fetch'
import { Column } from '.'

export const useViewList = () => {
  const { data, error } = useSWR(
    'http://localhost:4600/api/base/list?table=views'
  )
  console.log('data', data)
}

export const useColumns = (tableName: string | undefined) => useSWR<Column[]>(`useColumns:${tableName}`, async () => {
  if (!tableName) return []

  const tableRes = await fetch.get({
    table: 'tables',
    where: {
      name: tableName,
    },
  })
  
  const tableId = tableRes.data.id
  const columnRes = await fetch.list({
    table: 'table_column',
    where: {
      table_id: tableId,
    },
  })
  
  return columnRes.data
})
