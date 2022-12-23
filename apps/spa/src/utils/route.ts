import { deepMap } from '@/libs/array';
import { RouteObject } from 'react-router-dom'

export type DocsRouteObject = RouteObject & { label?: string; key?: string, children: DocsRouteObject }

export const createRoutes = (
  type: string,
  label: string,
  routeOptions: DocsRouteObject[]
): DocsRouteObject[] => [
  {
    path: `/docs${type}`,
    label,
    children: deepMap(routeOptions, 'children', (route, parent) => {
      const path = `${parent ? parent.path : `/docs${type}`}${route.path}`
      return {
        ...route,
        path,
        key: path,
      }
    })
  },
]
