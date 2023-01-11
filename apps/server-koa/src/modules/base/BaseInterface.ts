import { AddProps, Column, DelProps, GetProps, PutProps, Table } from '@zdcode/superdb'
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

// export interface GetProps {
//   table: TableName
//   columns?: string[]
//   where?: Where
//   leftJoin?: LeftJoin
// }
// export interface CountProps {
//   table?: TableName
//   where?: Where
//   pageKey?: string
//   leftJoin?: LeftJoin
// }
// export interface ListProps {
//   table?: TableName
//   columns?: string[]
//   where?: Where
//   order?: string[]
//   pageIndex?: number
//   pageSize?: number
//   leftJoin?: LeftJoin
// }
// export interface AddProps<T = object> {
//   table: TableName
//   data: T | T[]
//   // deep 为 true 代表是循环结构，拥有 pid、parent_path 等属性
//   deep?: boolean
// }
// export interface PutProps<T = object> {
//   table?: TableName
//   where: Where
//   data: Partial<T> | Partial<T>[]
// }
// export interface DelProps {
//   table?: TableName
//   where: Where
// }

export type Work =
  | {
      type: 'createTable'
      name: string
      columns: Column[]
    }
  | {
      type: 'renameTable'
      name: string
      newName: string
    }
  | {
      type: 'removeTable'
      name: string
    }
  | {
      type: 'createColumns'
      tableName: string
      columns: Column[]
    }
  | {
      type: 'renameColumn'
      tableName: string
      columnName: string
      newColumnName: string
    }
  | {
      type: 'updateColumn'
      tableName: string
      column: Column
    }
  | {
      type: 'removeColumn'
      tableName: string
      columnName: string
    }
  | ({ type: 'get' } & GetProps)
  | ({ type: 'list' } & GetProps)
  | ({ type: 'add' } & AddProps)
  | ({ type: 'put' } & PutProps)
  | ({ type: 'del' } & DelProps)
  | ({ type: 'remove' } & DelProps)

export interface IBaseService {
  // 原接口
  createTable(name: string, columns: Column[]): Promise<boolean>
  renameTable(name: string, newName: string): Promise<boolean>
  removeTable(name: string): Promise<boolean>
  createColumn(tableName: string, columns: Column[]): Promise<boolean>
  renameColumn(
    tableName: string,
    columnName: string,
    newColumnName: string
  ): Promise<boolean>
  updateColumn(tableName: string, column: Column): Promise<boolean>
  removeColumn(tableName: string, columnName: string): Promise<boolean>

  // 基础接口
  get<T extends {}>(props: GetProps): Promise<T>
  list<T extends {}>(props: GetProps): Promise<T[]>
  add<T extends {}>(props: AddProps): Promise<number>
  put<T extends {}>(props: PutProps): Promise<T>
  del<T extends {}>(props: DelProps): Promise<T>
  remove<T extends {}>(props: DelProps): Promise<T>

  // 事物
  work(works: Work[]): Promise<any>
}
