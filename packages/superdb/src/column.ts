import { get, list, responseError, Table, work } from './fetch'
import { useFetch } from '@zdcode/fetch'
import { Column } from '.'

export const useColumns = (tableName?: string) => useFetch<Column[]>(async () => {
  if (!tableName) return []

  const tableRes = await get<Table>('tables', {
    where: {
      name: tableName
    }
  })
  if (responseError(tableRes)) return []
  
  const tableId = tableRes.data.id
  const columnRes = await list<Column>('table_column', {
    where: {
      table_id: tableId
    }
  })
  
  return columnRes.data || []
}, [], [tableName])

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