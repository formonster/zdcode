import { Column, Table } from '@zdcode/superdb'
import { TableName } from '../../types/table'

export type WhereItem = {
  [key in string]:
    | string
    | number
    | {
        table?: TableName
        mode?: 'AND' | 'OR'
        field?: string
        condition: '=' | '!=' | 'LIKE' | '>' | '>=' | '<' | '<='
        value: unknown
        arrMode?: 'AND' | 'OR'
      }
    | string[]
    | number[]
}
export type Where = WhereItem | Array<WhereItem | 'AND' | 'OR'>

export type LeftJoinItem = {
  table: TableName
  on?: string
  columns?: string[]
}

export type LeftJoin = LeftJoinItem | LeftJoinItem[]

export interface GetProps {
  table: TableName
  columns?: string[]
  where?: Where
  leftJoin?: LeftJoin
}
export interface CountProps {
  table?: TableName
  where?: Where
  pageKey?: string
  leftJoin?: LeftJoin
}
export interface ListProps {
  table?: TableName
  columns?: string[]
  where?: Where
  order?: string[]
  pageIndex?: number
  pageSize?: number
  leftJoin?: LeftJoin
}
export interface AddProps<T = object> {
  table: TableName
  data: T | T[]
  // deep 为 true 代表是循环结构，拥有 pid、parent_path 等属性
  deep?: boolean
}
export interface PutProps<T = object> {
  table?: TableName
  where: Where
  data: Partial<T> | Partial<T>[]
}
export interface DelProps {
  table?: TableName
  where: Where
}

export interface IBaseService {
  get<T extends {}>(props: GetProps): Promise<T>
  count(props: CountProps): Promise<number>
  list<T extends {}>(props: ListProps): Promise<T[]>
  add<T extends {}>(props: AddProps<T>): Promise<number>
  deepAdd<T extends {}>(props: AddProps<T>): Promise<T | T[]>
  put<T extends {}>(props: PutProps<T>): Promise<T>
  del<T extends {}>(props: DelProps): Promise<T>
  remove<T extends {}>(props: DelProps): Promise<T>
  addTables(table: Table, columns: Column[]): Promise<boolean>
  createTable(name: string, columns: Column[]): Promise<boolean>
  removeTable(name: string): Promise<boolean>
  addColumn(name: string, columns: Column[]): Promise<boolean>
  updateColumn(
    name: string,
    columnName: string,
    column: Column
  ): Promise<boolean>
  removeColumn(name: string, columnName: string): Promise<boolean>
}
