import React, { FC } from 'react'
import classNames from 'classnames'
import './index.scss'

export interface IPanelProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
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

const preCls = 'titaui-panel'

export const Panel: FC<IPanelProps> = React.memo(({ className, padding, margin, style, children, ...other }) => {
  return (
    <div className={classNames(preCls, 'bg-panel dark:bg-panel-dark', className)} style={{ padding, margin, ...style }} { ...other }>
      {children}
    </div>
  )
})

export default Panel