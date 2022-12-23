export * from './table'
export * from './column'
export * from './data'

export type ColumnType =
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
  enum_id?: string
  enum_item_id?: string
  relation_table_id?: string
  relation_table_column_id?: string
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