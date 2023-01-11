import { useEffect } from 'react'
import { createBrowserRouter, useNavigate } from 'react-router-dom'
import createLazyComponent from './components/LazyComponent'
import docsRoutes from './docs.routes'

function Redirect({ to }: { to: string }) {
  let navigate = useNavigate();
  useEffect(() => {
    navigate(to);
  });
  return null;
}

const routes = createBrowserRouter([
  { path: '/', element: <Redirect to={docsRoutes[0].path as string} /> },
  {
    path: '/expenses',
    element: createLazyComponent(() => import('@/pages/expenses/expenses')),
  },
  {
    path: '/invoices',
    element: createLazyComponent(() => import('@/pages/invoices')),
  },
  {
    path: '/docs',
    element: createLazyComponent(() => import('@/pages/docs')),
    children: docsRoutes,
  },
  {
    path: '/',
    errorElement: createLazyComponent(() => import('@/pages/error')),
  },
])

export default routes
