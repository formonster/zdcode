import Fetch from '@zdcode/fetch'

const fetchInstance = Fetch({ baseURL: ' http://localhost:4700' })

export type Page = {
  current: number;
  totalNum: number;
  totalPage: number;
  size: number;
}

export interface Response<T = null> {
  message: string;
  code: number;
  data: T;
  page?: Page
}
export interface PageResponse<T> extends Response<T[]> {
  current: number;
  totalNum: number;
  totalPage: number;
  size: number;
}

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

export const get = <T>(table: string, params?: GetProps) => fetchInstance.post<Response<T>>(`/api/${table}/get`, params).then(res => res.data)
export const list = <T>(table: string, params?: GetProps) => fetchInstance.post<Response<T[]>>(`/api/${table}/list`, params).then(res => res.data)
export const add = <T>(table: string, params?: AddProps) => fetchInstance.post<Response<T>>(`/api/${table}/add`, params).then(res => res.data)
export const put = <T>(table: string, params?: PutProps) => fetchInstance.put<Response<T>>(`/api/${table}/put`, params).then(res => res.data)
export const del = (table: string, params?: DelProps) => fetchInstance.post<Response<Boolean>>(`/api/${table}/del`, params).then(res => res.data)
export const remove = (table: string, params?: DelProps) => fetchInstance.post<Response<Boolean>>(`/api/${table}/remove`, params).then(res => res.data)
export const work = (works: Work[]) => fetchInstance.post<Response<any>>('/api/base/work', works).then(res => res.data)

export const responseError = (res: Response<any>) => {
  if (res.code !== 200) {
    return true
  }
  return false
}

export default fetch