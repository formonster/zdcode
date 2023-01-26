import { useFetch } from '@zdcode/fetch'
import { list, responseError, Table, work } from '.'

export const useTables = () => useFetch<Table[]>(async () => {
  const res = await list<Table>('tables')
  if (responseError(res)) return []
  return res.data || []
}, [], [])

export const createTable = (name: string, title: string) => {
  return work([
    {
      type: 'createTable',
      name,
    },
    {
      type: 'add',
      table: 'tables',
      data: {
        name,
        title
      }
    }
  ])
}

export const removeTable = (name: string) => {
  return work([
    {
      type: 'removeTable',
      name,
    },
    {
      type: 'remove',
      table: 'tables',
      where: {
        name
      }
    }
  ])
}