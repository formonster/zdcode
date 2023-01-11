import { GET, route } from 'awilix-koa'
import Router from '@koa/router'
import { mapFields } from '@zdcode/utils'
import { IBaseService } from '../base/BaseInterface'
import { resSuccess } from '../../utils/common'
import { IIndexService } from './IndexInterface'
import presetTable from './config/presetTable'

class IndexController {
  private indexService: IIndexService
  private baseService: IBaseService
  constructor({ indexService, baseService }: { indexService: IIndexService, baseService: IBaseService }) {
    this.indexService = indexService
    this.baseService = baseService
  }
  @route('/')
  @GET()
  async home(ctx: Router.RouterContext) {
    ctx.body = this.indexService.hello()
  }
  @route('/api/check')
  @GET()
  async check(ctx: Router.RouterContext) {
    ctx.body = this.indexService.check()
  }
  @route('/api/init')
  @GET()
  async init(ctx: Router.RouterContext) {
    // 创建预设表（这里需要保证创建顺序）
    for (const { name, columns } of presetTable) {
      await this.baseService.createTable(name, columns)
    }

    // 填充预设表的数据
    const tableStartId = await this.baseService.add({
      table: 'tables',
      data: mapFields(presetTable, ['name', 'title', 'is_original'])
    })
    
    await Promise.allSettled(mapFields(presetTable, ['columns']).map(({ columns }, i) => this.baseService.add({
      table: 'table_column',
      // @ts-ignore
      data: columns?.map((column) => ({ table_id: tableStartId + i, ...column }))
    })))
    
    const enumId = await this.baseService.add({
      table: 'enums',
      data: {
        name: 'ColumnType',
        title: '列类型',
      }
    })
    
    await this.baseService.add({
      table: 'enums_item',
      data: [
        {
          enum_id: enumId,
          name: 'RELATION',
          title: 'RELATION'
        },
        {
          enum_id: enumId,
          name: 'INT',
          title: 'INT'
        },
        {
          enum_id: enumId,
          name: 'CHAR',
          title: 'CHAR'
        },
        {
          enum_id: enumId,
          name: 'VARCHAR',
          title: 'VARCHAR'
        },
        {
          enum_id: enumId,
          name: 'TEXT',
          title: 'TEXT'
        },
        {
          enum_id: enumId,
          name: 'BOOLEAN',
          title: 'BOOLEAN'
        },
        {
          enum_id: enumId,
          name: 'UUID',
          title: 'UUID'
        },
        {
          enum_id: enumId,
          name: 'ENUM',
          title: 'ENUM'
        },
      ]
    })

    ctx.body = resSuccess(true)
  }
}
export default IndexController
