import knex, { add, createColumns, createTable, del, get, put, remove, removeColumn, removeTable, renameColumn, renameTable, updateColumn } from '../../utils/knex'
import { getPromiseData } from '@zdcode/utils'
import { IBaseService, Work } from './BaseInterface'
import { AddProps, Column, DelProps, GetProps, PutProps, Table } from '@zdcode/superdb'

class BaseService implements IBaseService {
  async createTable(name: string, columns: Column[]): Promise<boolean> {
    const [data, error] = await createTable(knex, name, columns)

    if (error) {
      console.log('-- error log', name, columns);
      throw new Error(error)
    }
    if (data === null) {
      console.log('-- error log', name, columns);
      throw new Error('创建失败')
    }
    return true
  }
  async renameTable(name: string, newName: string): Promise<boolean> {
    const [data, error] = await renameTable(knex, name, newName)

    if (error) {
      console.log('-- error log', name, newName);
      throw new Error(error)
    }
    if (data === null) {
      console.log('-- error log', name, newName);
      throw new Error('创建失败')
    }
    return true
  }
  async removeTable(name: string): Promise<boolean> {
    const [data, error] = await removeTable(knex, name)

    if (error) {
      console.log('-- error log', name);
      throw new Error(error)
    }
    if (data === null) {
      console.log('-- error log', name);
      throw new Error('创建失败')
    }
    return true
  }
  async renameColumn(tableName: string, columnName: string, newColumnName: string): Promise<boolean> {
    const [data, error] = await renameColumn(knex, tableName, columnName, newColumnName)

    if (error) {
      console.log('-- error log', tableName, columnName, newColumnName);
      throw new Error(error)
    }
    if (data === null) {
      console.log('-- error log', tableName, columnName, newColumnName);
      throw new Error('创建失败')
    }
    return true
  }
  async createColumn(tableName: string, columns: Column[]): Promise<boolean> {
    const [data, error] = await createColumns(knex, tableName, columns)

    if (error) {
      console.log('-- error log', tableName, columns);
      throw new Error(error)
    }
    if (data === null) {
      console.log('-- error log', tableName, columns);
      throw new Error('创建失败')
    }
    return true
  }
  async updateColumn(tableName: string, column: Column): Promise<boolean> {
    const [data, error] = await updateColumn(knex, tableName, column)

    if (error) {
      console.log('-- error log', tableName, column);
      throw new Error(error)
    }
    if (data === null) {
      console.log('-- error log', tableName, column);
      throw new Error('创建失败')
    }
    return true
  }
  async removeColumn(tableName: string, columnName: string): Promise<boolean> {
    const [data, error] = await removeColumn(knex, tableName, columnName)

    if (error) {
      console.log('-- error log', tableName, columnName);
      throw new Error(error)
    }
    if (data === null) {
      console.log('-- error log', tableName, columnName);
      throw new Error('创建失败')
    }
    return true
  }
  async get<T extends {}>(props: GetProps): Promise<T> {
    // @ts-ignore
    const [data, error] = await get<T>(knex, props)

    if (error) {
      console.log('-- error log', props);
      throw new Error(error)
    }
    if (data === null) {
      console.log('-- error log', props);
      throw new Error('创建失败')
    }
    return data[0]
  }
  async list<T extends {}>(props: GetProps): Promise<T[]> {
    // @ts-ignore
    const [data, error] = await get<T>(knex, props)

    if (error) {
      console.log('-- error log', props);
      throw new Error(error)
    }
    if (data === null) {
      console.log('-- error log', props);
      throw new Error('创建失败')
    }
    return data
  }
  async add(props: AddProps): Promise<number> {
    const [data, error] = await add(knex, props)

    if (error) {
      console.log('-- error log', props);
      throw new Error(error)
    }
    if (data === null) {
      console.log('-- error log', props);
      throw new Error('创建失败')
    }
    return data[0]
  }
  async put<T extends {}>(props: PutProps): Promise<T> {
    const [data, error] = await put(knex, props)

    if (error) {
      console.log('-- error log', props);
      throw new Error(error)
    }
    if (data === null) {
      console.log('-- error log', props);
      throw new Error('创建失败')
    }
    return data as unknown as Promise<T>
  }
  async del<T extends {}>(props: DelProps): Promise<T> {
    const [data, error] = await del(knex, props)

    if (error) {
      console.log('-- error log', props);
      throw new Error(error)
    }
    if (data === null) {
      console.log('-- error log', props);
      throw new Error('创建失败')
    }
    return data as unknown as Promise<T>
  }
  async remove<T extends {}>(props: DelProps): Promise<T> {
    const [data, error] = await remove(knex, props)

    if (error) {
      console.log('-- error log', props);
      throw new Error(error)
    }
    if (data === null) {
      console.log('-- error log', props);
      throw new Error('创建失败')
    }
    return data as unknown as Promise<T>
  }
  async work<T extends {}>(works: Work[]): Promise<any> {
    try {
      const result = await knex.transaction(async (trx) => {
        for (const work of works) {
          switch (work.type) {
            case 'createTable':
              await createTable(trx, work.name, work.columns)
              break
            case 'renameTable':
              await renameTable(trx, work.name, work.newName)
              break
            case 'removeTable':
              await removeTable(trx, work.name)
              break
            case 'createColumns':
              await createColumns(trx, work.tableName, work.columns)
              break
            case 'renameColumn':
              await renameColumn(trx, work.tableName, work.columnName, work.newColumnName)
              break
            case 'updateColumn':
              await updateColumn(trx, work.tableName, work.column)
              break
            case 'removeColumn':
              await removeColumn(trx, work.tableName, work.columnName)
              break
            case 'get':
              await get(trx, work as Required<GetProps>)
              break
            case 'list':
              await get(trx, work as Required<GetProps>)
              break
            case 'add':
              await add(trx, work)
              break
            case 'put':
              await put(trx, work)
              break
            case 'del':
              await del(trx, work)
              break
            case 'remove':
              await remove(trx, work)
              break
          }
        }
      })
      console.log('work result', result);
      return true
    } catch (error: any) {
      console.log('error', error);
      throw new Error(error)
    }
  }
}

export default BaseService
