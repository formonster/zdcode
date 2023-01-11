import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { MDXProvider } from '@mdx-js/react'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN';
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from '@/store'
import Popup from '@/features/popup'
import { component } from '@/components/mdx'
import routes from './routes'
import 'antd/dist/antd.min.css'
import './index.css'
import './reset.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <Provider store={store}>
        <MDXProvider components={component}>
          <RouterProvider router={routes} />
          <Popup />
        </MDXProvider>
      </Provider>
    </ConfigProvider>
  </React.StrictMode>
)
