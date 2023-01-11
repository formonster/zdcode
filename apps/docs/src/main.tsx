import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { MDXProvider } from '@mdx-js/react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from '@/store'
import Popup from '@/features/popup'
import { component } from '@/components/mdx'
import routes from './routes'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <MDXProvider components={component}>
        <RouterProvider router={routes} />
        <Popup />
      </MDXProvider>
    </Provider>
  </React.StrictMode>
)
