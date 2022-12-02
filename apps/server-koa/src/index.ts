import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'

import { loadMiddware } from './middware'
import { initEnv } from './utils/env'
import { initRouter } from './utils/router'

initEnv()

const PORT = process.env.PORT

const app = new Koa()

app.use(
  cors({
    credentials: true,
  })
)

// POST 请求获取 body
app.use(bodyParser())
// 加载自定义中间件
loadMiddware(app)

app.keys = ['zdcode_server']

// 初始化路由
initRouter(app)

app.listen(PORT, function () {
  console.log(`🚀 starting http://localhost:${PORT}`)
})
