import { GET, route } from 'awilix-koa'
import Router from '@koa/router'
import { ITablesService } from './TablesInterface'
import { resSuccess } from '../../utils/common'

@route('/api')
class TableController {
  private tablesService: ITablesService
  constructor({ tablesService }: { tablesService: ITablesService }) {
    this.tablesService = tablesService
  }
  @route('/tables/get')
  @GET()
  async get(ctx: Router.RouterContext) {
    const query = ctx.query;
    const res = await this.tablesService.hello()
    ctx.body = resSuccess(res)
  }
}
export default TableController
