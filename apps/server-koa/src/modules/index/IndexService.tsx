import React from 'react'
import knex from '../../utils/knex'
import { getPromiseData } from '@zdcode/utils'
import { renderToString } from 'react-dom/server'
import { Response } from '../../types/IData'
import { resSuccess } from '../../utils/common'
import { IIndexService } from './IndexInterface'

class IndexService implements IIndexService {
  check(): Response<boolean> {
    return resSuccess(true)
  }
  hello(): string {
    return renderToString(
      <div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          display: 'flex',
          height: '100vh',
          width: '100vw',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#000',
        }}
      >
        <h1 style={{ color: '#fff' }}>Hello KoaServer!</h1>
      </div>
    )
  }
  async createTable(name: string, columns: Column[]): Promise<boolean> {
    // 1. 创建一个事物
    // 2. 先查询表格表中是否有重名的表格
    //    如果有，则返回异常，提示重名
    // 3. 查询表是否已被创建
    //    如果有，则先删除，再创建
    // 4. 在 tables 中新建一条数据
    const [data, error] = await getPromiseData(
      knex.schema.createTable(name, function (table) {
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
    )

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
  async removeTable(name: string): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
  async addColumn(name: string, columns: Column[]): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
  async updateColumn(
    name: string,
    columnName: string,
    column: Column
  ): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
  async removeColumn(name: string, columnName: string): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
}

export default IndexService
