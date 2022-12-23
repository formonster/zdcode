import React, { FC } from 'react'
import classNames from 'classnames'
import './index.scss'

export interface IPageProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  /**
   * 内边距
   * @editType string
   * @default 20px
   */
  padding?: string
  /**
   * 外边距
   * @editType string
   */
  margin?: React.CSSProperties['margin']
  /** class */
  className?: string
  /**
   * 自定义样式
   * @editType json
   */
  style?: React.CSSProperties
  /**
   * 子元素
   * @editType string
   * @default ...
   */
  children?: React.ReactNode
}

const preCls = 'titaui-Page'

export const Page: FC<IPageProps> = React.memo(({ className, padding, margin, style, children, ...other }) => {
  return (
    <div className={classNames(preCls, 'bg-page dark:bg-page-dark', className)} style={{ padding, margin, ...style }} { ...other }>
      {children}
    </div>
  )
})

export default Page