import { GET, POST, route } from 'awilix-koa'
import Router from '@koa/router'
import { IBaseService, Work } from './BaseInterface'
import { resSuccess } from '../../utils/common'
import { AddProps, Column, DelProps, GetProps, Table } from '@zdcode/superdb'
import { TableName } from 'types/table'

@route('/api')
class BaseController {
  private baseService: IBaseService
  constructor({ baseService }: { baseService: IBaseService }) {
    this.baseService = baseService
  }
  @route('/:table/get')
  @POST()
  async get(ctx: Router.RouterContext) {
    const { table } = ctx.params as { table: TableName }
    const datas = ctx.request.body as GetProps;
    const res = await this.baseService.get({ ...datas, table })
    ctx.body = resSuccess(res)
  }
  @route('/:table/list')
  @POST()
  async list(ctx: Router.RouterContext) {
    const { table } = ctx.params as { table: TableName }
    const datas = ctx.request.body as GetProps;
    const res = await this.baseService.list({ ...datas, table })
    ctx.body = resSuccess(res)
  }
  @route('/:table/add')
  @POST()
  async add(ctx: Router.RouterContext) {
    const { table } = ctx.params as { table: TableName }
    const datas = ctx.request.body as AddProps;
    const res = await this.baseService.add({ ...datas, table })
    ctx.body = resSuccess(res)
  }
  @route('/:table/remove')
  @POST()
  async remove(ctx: Router.RouterContext) {
    const { table } = ctx.params as { table: TableName }
    const datas = ctx.request.body as DelProps;
    const res = await this.baseService.remove({ ...datas, table })
    ctx.body = resSuccess(res)
  }
  @route('/base/work')
  @POST()
  async work(ctx: Router.RouterContext) {
    const works = ctx.request.body as Work[];
    const res = await this.baseService.work(works)
    ctx.body = resSuccess(res)
  }
}
export default BaseController
