import knex from '../../utils/knex'
import { getPromiseData } from '@zdcode/utils'
import { AddProps, GetProps, IBaseService } from './BaseInterface'
import { throwError } from '../../utils/throw'
import { Column, Table } from '@zdcode/superdb'

class BaseService implements IBaseService {
  async get<T extends {}>(props: GetProps): Promise<T> {
    const { table, columns = [], where } = props

    const query = knex.select(...columns).from<T>(table)

    if (where) {
      query.where(where)
    }

    // @ts-ignore
    const [data, error] = await getPromiseData<T[]>(query)

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
  async count(props: any): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async list<T extends {}>(props: any): Promise<T[]> {
    const { table, columns = [], where } = props

    const query = knex.select(...columns).from<T>(table)

    if (where) {
      query.where(where)
    }

    // @ts-ignore
    const [data, error] = await getPromiseData<T[]>(query)

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
  async add<T extends {}>(props: AddProps<T>): Promise<number> {
    const [data, error] = await getPromiseData(knex(props.table).insert(props.data))

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
  async deepAdd<T extends {}>(props: any): Promise<T | T[]> {
    throw new Error('Method not implemented.')
  }
  async put<T extends {}>(props: any): Promise<T> {
    throw new Error('Method not implemented.')
  }
  async del<T extends {}>(props: any): Promise<T> {
    throw new Error('Method not implemented.')
  }
  async remove<T extends {}>(props: any): Promise<T> {
    throw new Error('Method not implemented.')
  }
  // 创建真实表格，并且会将表格信息，列信息添加到数据库中
  async addTables(tableInfo: Table, columns: Column[]): Promise<boolean> {
    const name = tableInfo.name
    // 1. 创建一个事物
    // 2. 先查询表格表中是否有重名的表格
    //    如果有，则返回异常，提示重名
    // 3. 查询表是否已被创建
    //    如果有，则先删除，再创建
    // 4. 在 tables 中新建一条数据
    try {
      await knex.transaction(async (trx) => {
        const createTableRes = await trx.schema.createTable(name, function (table) {
          // 预置字段
          table.primary(['id']);
          table.increments('id');
          table.boolean('is_delete').defaultTo(false)
          table.timestamps(true, true)
  
          // 自定义字段
          columns.forEach(({ type, name, length, default_value }) => {
            switch (type) {
              case 'INT':
                table.integer(name, length || 11)
                break
              case 'UUID':
                table.uuid(name)
                break
              case 'CHAR':
                table.string(name, length || 255)
                break
              case 'VARCHAR':
                table.string(name, length || 255)
                break
              case 'TEXT':
                table.text(name)
                break
              case 'BOOLEAN':
                table.boolean(name).defaultTo(default_value)
                break
            }
          })
        })

        console.log('createTableRes', createTableRes);
        // const ids = await trx('tables').insert(tableInfo)
        // await trx('table_column').insert(columns.map((column) => ({ ...column, table_id: ids[0] })))
      })
      return true
    } catch (error: any) {
      console.log('error', error);
      throw new Error(error)
    }
  }
}

export default BaseService
