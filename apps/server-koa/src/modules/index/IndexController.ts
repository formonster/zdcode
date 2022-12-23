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
    // 创建预设表
    await Promise.allSettled(
      presetTable.map(({ name, title, is_original, columns }) => {
        return this.baseService.createTable(name, columns)
      })
    )

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

    ctx.body = resSuccess(true)
  }
}
export default IndexController
