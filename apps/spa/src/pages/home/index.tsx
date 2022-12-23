import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'antd'
import Counter from '@/features/counter'
import { usePopupCtl } from '@/features/popup/index.store'
import logo from './logo.svg'
import './index.css'

function App() {
  const [count, setCount] = useState(0)
  const demoPopup = usePopupCtl('demo')

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p className="text-red-300">Hello Vite + React!</p>
        <p>
          <Button type="primary" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </Button>
        </p>
        <Button
          onClick={() =>
            demoPopup.show({
              title: '这是自定义标题',
              foo: '这是自定义属性，可以传递给弹窗',
            })
          }
        >
          弹窗
        </Button>
        <Counter />
        <div className="mt-5">
          <nav
            style={{
              borderBottom: 'solid 3px',
              paddingBottom: '1rem',
            }}
          >
            <Link to="/invoices">Invoices</Link> |{' '}
            <Link to="/expenses">Expenses</Link>
          </nav>
        </div>
      </header>
    </div>
  )
}

export default App
