import { GET, route } from 'awilix-koa'
import Router from '@koa/router'
import { I$T{F|moduleName}Service } from './$T{F|moduleName}Interface'
import { resSuccess } from '../../utils/common'

@route('/api')
class $T{F|moduleName}Controller {
  private $T{moduleName}Service: I$T{F|moduleName}Service
  constructor({ $T{moduleName}Service }: { $T{moduleName}Service: I$T{F|moduleName}Service }) {
    this.$T{moduleName}Service = $T{moduleName}Service
  }
  @route('/$T{moduleName}/get')
  @GET()
  async get(ctx: Router.RouterContext) {
    const query = ctx.query;
    const res = await this.$T{moduleName}Service.hello()
    ctx.body = resSuccess(res)
  }
}
export default $T{F|moduleName}Controller
