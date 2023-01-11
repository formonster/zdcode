import { Outlet, useMatches, useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import { Menu } from 'antd'
import { arr2DicDeep, deepMap, findFirstLeaf } from '@/libs/array'
import { ThemeToggle, useTheme } from '@/components/ThemeToggle'
import docsRoutes from '@/docs.routes'
import styles from './index.module.css'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { DocsRouteObject } from '@/utils/route'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import Page from '@/stories/Page'

const docsRoutesDic = arr2DicDeep(docsRoutes, 'path', 'children') as Record<
  string,
  DocsRouteObject
>

type Nav = {
  title: any
  id: string
  level: number
}

export default function Expenses() {
  const navigate = useNavigate()
  const matches = useMatches()
  const [theme] = useTheme()

  const openKeys = matches.map(({ pathname }) => pathname)

  const pathname = matches[matches.length - 1].pathname
  const modulePath = matches[1].pathname
  
  const menuData = docsRoutes.find(({ path }) => path === modulePath) || { children: [] }

  useEffect(() => {
    // 跳转至模块第一个页面
    if (matches.length === 2) {
      const firstDoc = findFirstLeaf(menuData.children, 'children')
      
      if (firstDoc && firstDoc.path) navigate(firstDoc.path)
    }
  }, [matches])

  const [nav, setNav] = useState<Nav[]>([])
  const docContentRef = useRef<any>()

  useLayoutEffect(() => {
    if (docContentRef.current) {
      setNav([])
      setTimeout(() => {
        const hList = docContentRef.current.querySelectorAll(
          '.mdx-h'
        ) as NodeListOf<Element & { innerText: string }>

        const navs: Nav[] = Array.from(hList).map(
          ({ innerText, id, nodeName }) => ({
            title: innerText,
            id,
            level: +nodeName.slice(1) - 1,
          })
        )
        setNav(navs)
      }, 1000)
    }
  }, [docContentRef.current, pathname])

  const onSelectChange = useCallback(({ key }: { key: string }) => {
    navigate(key)
  }, [])

  return (
    <Page className=' dark:bg-gradient-to-tr'>
      <header
        className={classNames(
          styles.header,
          'fixed top-0 w-screen h-16 flex justify-between items-center px-7 bg-slate-100/75 dark:bg-slate-900/75 z-10'
        )}
      >
        <div className='font-bold text-2xl dark:text-slate-200 text-slate-700'>
          TITA-FE
        </div>

        <div className='flex items-center space-x-10'>
          <ul className='flex space-x-6'>
            {docsRoutes.map(({ path, label }) => (
              <li><Link className={classNames('dark:text-slate-300 dark:hover:text-slate-100 text-slate-800', {
                'dark:text-blue-500': path === modulePath
              })} to={path as string}>{label}</Link></li>
            ))}
          </ul>
          <ThemeToggle panelClassName='mt-8' />
        </div>
      </header>

      <main
        className={classNames(
          styles.docs,
          'flex h-screen'
        )}
      >
        <div className='w-52 mt-16'>
          <Menu
            className='h-full'
            defaultOpenKeys={openKeys}
            items={menuData.children}
            defaultSelectedKeys={[pathname]}
            mode='inline'
            theme={theme}
            onSelect={onSelectChange}
          />
        </div>
        <div
          className={classNames(
            styles.content,
            'flex-1 overflow-y-auto flex flex-col items-center relative dark:bg-slate-800 pt-16'
          )}
        >
          <div
            ref={docContentRef}
            className={classNames(styles.docContent, 'py-10 px-16 flex')}
          >
            <div className={classNames(styles.docContentMdx, 'w-full')}>
              <Outlet />
            </div>
            <div className={classNames('w-40 shrink-0')}>
              <nav
                className={classNames(styles['docs-nav'], {
                  [styles['docs-nav--hide']]: !nav.length,
                })}
              >
                <ul>
                  {nav.map(({ level, title, id }) => (
                    <li
                      key={id}
                      className='hover:text-blue-400'
                      style={{
                        paddingLeft: (level - 1) * 15,
                      }}
                    >
                      <a href={`#${id}`}>{title}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </main>
    </Page>
  )
}
