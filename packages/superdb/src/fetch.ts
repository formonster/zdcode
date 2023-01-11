import Fetch from '@zdcode/fetch'

const fetch = Fetch({ baseURL: ' http://localhost:4600' })

export type ColumnType =
  | 'RELATION'
  | 'INT'
  | 'CHAR'
  | 'VARCHAR'
  | 'TEXT'
  | 'BOOLEAN'
  | 'UUID'
  | 'ENUM'

export interface Column {
  id?: number
  name: string
  title: string
  type: ColumnType
  is_primary?: boolean
  enum_id?: number
  relation_table_id?: number
  relation_table_column_id?: number
  not_null?: boolean
  length?: number
  comment?: string
  default_value?: any
}

export interface Table {
  id?:          number;
  name:        string;
  title:       string;
  is_original?: boolean;
  is_delete?:   boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface GetProps {
  table?: string
  columns?: string[]
  where?: any
}
export interface AddProps {
  table?: string
  data: Record<string, any>
}
export interface PutProps {
  table?: string
  data: Record<string, any>
  where: any
}
export interface DelProps {
  table?: string
  where: any
}
export interface RemoveProps {
  table?: string
  where: any
}

export type Work =
  | {
      type: 'createTable'
      name: string
      columns?: Column[]
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

export const get = (table: string, params?: GetProps) => fetch.post<Table>(`/api/${table}/get`, params)
export const list = (table: string, params?: GetProps) => fetch.post<Table>(`/api/${table}/list`, params)
export const add = (table: string, params?: AddProps) => fetch.post<Table>(`/api/${table}/add`, params)
export const put = (table: string, params?: PutProps) => fetch.post<Table>(`/api/${table}/put`, params)
export const del = (table: string, params?: DelProps) => fetch.post<Table>(`/api/${table}/del`, params)
export const remove = (table: string, params?: DelProps) => fetch.post<Table>(`/api/${table}/remove`, params)
export const work = (works: Work[]) => fetch.post<Table>('/api/base/work', works)

export default fetch