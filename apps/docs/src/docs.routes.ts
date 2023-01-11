import { RouteObject } from 'react-router-dom'
import createLazyComponent from './components/LazyComponent'
import { createRoutes, DocsRouteObject } from './utils/route'

const docsRoutes: DocsRouteObject[] = [
  ...createRoutes('/components', '组件库', [
    {
      path: '/base',
      label: '通用',
      children: [
        // $T{componentType:base}
        {
          path: '/split',
          label: 'Split',
          element: createLazyComponent(
            () => import('@/docs/components/split.mdx')
          ),
        },
        {
          path: '/page',
          label: 'Page',
          element: createLazyComponent(
            () => import('@/docs/components/page.mdx')
          ),
        },
        {
          path: '/panel',
          label: 'Panel',
          element: createLazyComponent(
            () => import('@/docs/components/panel.mdx')
          ),
        },
        {
          path: '/button',
          label: 'Button 按钮',
          element: createLazyComponent(
            () => import('@/docs/components/button.mdx')
          ),
        },
      ]
    },
    {
      path: '/data',
      label: '数据展示',
      children: [
        // $T{componentType:data}
        {
          path: '/gantt',
          label: 'Gantt',
          element: createLazyComponent(
            () => import('@/docs/components/gantt.mdx')
          ),
        },
      ]
    }
  ]),
  ...createRoutes('/fe-docs', '前端文档', [
    {
      path: '/components',
      label: '组件库',
      children: [
        {
          path: '/standard',
          label: '组件库文档',
          element: createLazyComponent(
            () => import('@/docs/fe/component-docs.mdx')
          ),
        },
      ]
    },
    {
      path: '/standard',
      label: '规范',
      children: [
        {
          path: '/code',
          label: '代码规范',
          element: createLazyComponent(
            () => import('@/docs/fe/standard/code.mdx')
          ),
        },
      ]
    },
  ]),
  ...createRoutes('/tita-cli', 'tita cli', [
    {
      path: '/template',
      label: '模板',
      children: [
        {
          path: '/get-start',
          label: '开始',
          element: createLazyComponent(
            () => import('@/docs/cli/template/get-start.mdx')
          ),
        },
      ]
    },
  ]),
]

export default docsRoutes
