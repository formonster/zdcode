import { GET, route } from 'awilix-koa'
import Router from '@koa/router'
import { IndexServiceI } from './IIndex'

class IndexController {
  private indexService: IndexServiceI
  constructor({ indexService }: { indexService: IndexServiceI }) {
    this.indexService = indexService
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
}
export default IndexController
