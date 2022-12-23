import { Column } from '@zdcode/superdb'
import { Response } from '../../types/IData'

export interface IIndexService {
  hello(): string
  check(): Response<boolean>
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
