import Koa from 'koa'
import path from 'path'
import { createContainer, Lifetime } from 'awilix'
import { scopePerRequest, loadControllers } from 'awilix-koa'

const IS_BUILD_ENV = process.env.IS_BUILD_ENV === 'true'

const root = path.join(__dirname, '../')

export const initRouter = (app: Koa<Koa.DefaultState, Koa.DefaultContext>) => {
  // 创建一个基础容器，负责装载服务
  const container = createContainer()
  // 加载 Service 模块
  container.loadModules(
    IS_BUILD_ENV ? [`${root}/modules/**/*Service.js`] : [`${root}/modules/**/*Service.ts`, `${root}/modules/**/*Service.tsx`],
    {
      // 定义命名方式：驼峰形式
      formatName: 'camelCase',
      resolverOptions: {
        // 每次调用都创建新的实例
        lifetime: Lifetime.SCOPED,
      },
    }
  )

  // 注入 container
  app.use(scopePerRequest(container))
  // 加载路由
  app.use(
    IS_BUILD_ENV
      ? loadControllers(
      `${root}/modules/**/*Controller.js`,
      )
      : loadControllers(
        `${root}/modules/**/*Controller.ts`,
        `${root}/modules/**/*Controller.tsx`
      )
  )
}