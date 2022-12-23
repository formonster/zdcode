import { RouteObject } from 'react-router-dom'
import createLazyComponent from './components/LazyComponent'
import { createRoutes, DocsRouteObject } from './utils/route'

const docsRoutes: DocsRouteObject[] = [
  ...createRoutes('/components', '组件库', [
    {
      path: '/base',
      label: '通用',
      children: [
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
          label: '按钮',
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
        {
          path: '/table',
          label: 'Table',
          element: createLazyComponent(
            () => import('@/docs/components/table.mdx')
          ),
        },
      ]
    }
  ]),
  ...createRoutes('/fe-docs', '前端文档', [
    {
      path: '/standard',
      label: '规范',
      children: [
        {
          path: '/code',
          label: '代码规范',
          element: createLazyComponent(
            () => import('@/docs/standard/code.mdx')
          ),
        },
      ]
    },
  ]),
]

console.log('init docsRoutes', docsRoutes);

export default docsRoutes
