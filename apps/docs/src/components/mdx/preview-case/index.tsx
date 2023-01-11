import React, {
  FC,
  JSXElementConstructor,
  ReactElement,
  useMemo,
  useState,
} from 'react'
import classNames from 'classnames'
import { SyntaxKind } from 'typescript'
import { Tabs } from 'antd'
import { CodeOutlined, EditOutlined } from '@ant-design/icons'
import styles from './index.module.css'
import PropsEditor, { PropsOptions } from '../../propsEditor'
import usePreviewDefaultPorps from '../hooks/usePreviewDefaultPorps'

export interface IPreviewProps {
  codeSource?: string
  componentName?: string
  componentPropsOptions?: PropsOptions
  children: ReactElement<any, string | JSXElementConstructor<any>>[]
  className?: string
  style?: React.CSSProperties
}

const Preview: FC<IPreviewProps> = (params) => {
  const { className, style, children, componentPropsOptions } = params

  const defaultPorps = usePreviewDefaultPorps(componentPropsOptions)

  const [props, setProps] = useState(defaultPorps)
  const items = useMemo(() => {
    const items = [
      {
        label: (
          <p className='flex items-center'>
            <CodeOutlined /> 代码
          </p>
        ),
        key: 'source',
        children: children ? children[1] : <></>,
      },
    ]
    if (componentPropsOptions) {
      items.push({
        label: (
          <p className='flex items-center'>
            <EditOutlined /> 编辑
          </p>
        ),
        key: 'editor',
        children: (
          <PropsEditor
            defaultPorps={props}
            options={componentPropsOptions}
            onChangePorps={setProps}
          />
        ),
      })
    }
    return items
  }, [children, componentPropsOptions, setProps])

  const component = children ? React.cloneElement(children[0], props) : <></>
  return (
    <div
      className={classNames(
        styles.preview,
        className,
        'border border-slate-100 dark:border-slate-500 dark:bg-slate-800'
      )}
      style={style}
    >
      <div className={classNames(styles.componentContainer, 'border-b border-slate-100 dark:border-slate-500')}>{component}</div>
      <Tabs
        className={styles.codeContainer}
        defaultActiveKey='1'
        centered
        items={items}
      />
    </div>
  )
}

export default React.memo(Preview)
