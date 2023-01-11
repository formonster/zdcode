import useSWR from 'swr'
import { get, list, work } from './fetch'
import { Column } from '.'

export const useViewList = () => {
  const { data, error } = useSWR(
    'http://localhost:4600/api/base/list?table=views'
  )
  console.log('data', data)
}

export const useColumns = (tableName: string | undefined) => useSWR<Column[]>(`useColumns:${tableName}`, async () => {
  if (!tableName) return []

  const tableRes = await get('tables', {
    where: {
      name: tableName
    }
  })
  
  const tableId = tableRes.data.id
  const columnRes = await list('table_column', {
    where: {
      table_id: tableId
    }
  })
  
  return columnRes.data
})

export const createColumn = (tableName: string, column: Column) => {
  return work([
    {
      type: 'createColumns',
      tableName,
      columns: [column]
    },
    {
      type: 'add',
      table: 'table_column',
      data: column
    }
  ])
}

export const removeColumn = (tableName: string, columnName: string, columnId: number) => {
  return work([
    {
      type: 'removeColumn',
      tableName,
      columnName
    },
    {
      type: 'remove',
      table: 'table_column',
      where: {
        id: columnId
      }
    }
  ])
}