import { AddProps, Column, DelProps, GetProps, PutProps } from '@zdcode/superdb'
import { getPromiseData } from '@zdcode/utils'
import knex, { Knex } from 'knex'
import dbConfig from '../config/db'

const mysql = knex({
  client: 'mysql2',
  connection: dbConfig,
  pool: { min: 0, max: 7 },
})

const createColumn = (table: Knex.CreateTableBuilder, update: boolean = false) => (column: Column) => {
  const { type, name, length, default_value, not_null } = column
  let columnBuilder: Knex.ColumnBuilder | null = null

  console.log('create column', name, type, length);
  
  switch (type) {
    case 'RELATION':
      columnBuilder = table.integer(name, length || 11)
      break
    case 'INT':
      columnBuilder = table.integer(name, length || 11)
      break
    case 'UUID':
      columnBuilder = table.uuid(name)
      break
    case 'CHAR':
      columnBuilder = table.string(name, length || 255)
      break
    case 'ENUM':
      columnBuilder = table.string(name, length || 255)
      break
    case 'VARCHAR':
      columnBuilder = table.string(name, length || 255)
      break
    case 'TEXT':
      columnBuilder = table.text(name)
      break
    case 'BOOLEAN':
      columnBuilder = table.boolean(name)
      break
  }
  if (not_null) columnBuilder.notNullable()
  if (default_value) columnBuilder.defaultTo(default_value)
  if (update) columnBuilder.alter()
}

export const createTable = (
  knex: Knex<any, unknown[]>,
  name: string,
  columns: Column[] = []
) => {
  return getPromiseData(
    knex.schema.createTable(name, function (table) {
      // 预置字段
      table.primary(['id'])
      table.increments('id')
      table.boolean('is_delete').defaultTo(false)
      table.timestamps(true, true)

      // 自定义字段
      columns.forEach(createColumn(table))
    })
  )
}

export const renameTable = (knex: Knex<any, unknown[]>, name: string, newName: string) => {
  return getPromiseData(knex.schema.renameTable(newName, name))
}

export const removeTable = (knex: Knex<any, unknown[]>, name: string) => {
  return getPromiseData(knex.schema.dropTable(name))
}

export const createColumns = (knex: Knex<any, unknown[]>, tableName: string, columns: Column[]) => {
  return getPromiseData(knex.schema.alterTable(tableName, function (table) {
    columns.forEach(createColumn(table))
  }))
}

export const renameColumn = (knex: Knex<any, unknown[]>, tableName: string, columnName: string, newColumnName: string) => {
  return getPromiseData(knex.schema.alterTable(tableName, function (table) {
    table.renameColumn(columnName, newColumnName);
  }))
}

export const updateColumn = (knex: Knex<any, unknown[]>, tableName: string, column: Column) => {
  return getPromiseData(knex.schema.alterTable(tableName, function (table) {
    createColumn(table, true)(column)
  }))
}

export const removeColumn = (knex: Knex<any, unknown[]>, tableName: string, columnName: string) => {
  return getPromiseData(knex.schema.alterTable(tableName, function (table) {
    table.dropColumn(columnName)
  }))
}

export const get = <T extends {}>(
  knex: Knex<any, unknown[]>,
  props: Required<GetProps>
) => {
  const { table, columns = [], where = {} } = props

  const query = knex.select(...columns).from<T>(table)
  query.where({ is_delete: 0, ...where })

  // @ts-ignore
  return getPromiseData<T[]>(query)
}
export const add = (knex: Knex<any, unknown[]>, props: AddProps) => {
  return getPromiseData(knex(props.table).insert(props.data))
}
export const put = (knex: Knex<any, unknown[]>, props: PutProps) => {
  const { table, data, where } = props
  return getPromiseData(knex(table).where(where).update(data))
}
export const del = (knex: Knex<any, unknown[]>, props: DelProps) => {
  const { table, where } = props
  return getPromiseData(knex(table).where(where).update({ is_delete: 1 }))
}
export const remove = (knex: Knex<any, unknown[]>, props: DelProps) => {
  const { table, where } = props
  return getPromiseData(knex(table).where(where).del())
}

export default mysql
