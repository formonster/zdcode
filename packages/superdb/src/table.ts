import { useState, useEffect } from 'react'
import { list, work } from '.'

export const useTables = () => {
  const [tables, setTables] = useState([])
  useEffect(() => {
    list('tables').then(res => {
      setTables(res.data || [])
    })
  }, [])
  return tables
}

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