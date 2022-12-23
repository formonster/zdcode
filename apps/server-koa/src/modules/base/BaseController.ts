import { GET, POST, route } from 'awilix-koa'
import Router from '@koa/router'
import { GetProps, IBaseService } from './BaseInterface'
import { resSuccess } from '../../utils/common'
import { Column, Table } from '@zdcode/superdb'

@route('/api')
class BaseController {
  private baseService: IBaseService
  constructor({ baseService }: { baseService: IBaseService }) {
    this.baseService = baseService
  }
  @route('/:table/get')
  @POST()
  async get(ctx: Router.RouterContext) {
    const { table } = ctx.params
    const datas = ctx.request.body as GetProps;
    const res = await this.baseService.get(datas)
    ctx.body = resSuccess(res)
  }
  @route('/:table/list')
  @POST()
  async list(ctx: Router.RouterContext) {
    const { table } = ctx.params
    const datas = ctx.request.body as GetProps;
    const res = await this.baseService.list(datas)
    ctx.body = resSuccess(res)
  }
  @route('/:table/addTables')
  @POST()
  async addTables(ctx: Router.RouterContext) {
    const { table, columns } = ctx.request.body as { table: Table, columns: Column[] };
    const res = await this.baseService.addTables(table, columns)
    ctx.body = resSuccess(res)
  }
}
export default BaseController
