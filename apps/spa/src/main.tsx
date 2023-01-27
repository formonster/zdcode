import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN';
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from '@/store'
import Popup from '@/features/popup'
import routes from './routes'
import 'antd/dist/antd.min.css'
import './index.css'
import './reset.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <Provider store={store}>
        <RouterProvider router={routes} />
        <Popup />
      </Provider>
    </ConfigProvider>
  </React.StrictMode>
)
