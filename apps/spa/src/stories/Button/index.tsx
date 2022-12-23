import React, { FC } from 'react'
import classNames from 'classnames'
import './index.scss'

export interface IButtonProps {
  /**
   * 点击事件
   */
  onClick: (e: number) => void
  /**
   * 按钮类型
   * @default default
   */
  type?: 'default' | 'primary' | 'dashed' | 'text' | 'link'
  /**
   * 按钮内容
   * @editType string
   * @default Click me!
   */
  children: string
  className?: string
  style?: React.CSSProperties
}

const preCls = 'titaui-button'

export const Button: FC<IButtonProps> = React.memo(({
  type = 'default',
  className,
  style,
  children,
}) => {
  return (
    <button
      className={classNames(preCls, ' bg-white text-slate-900 dark:bg-slate-900 dark:text-white', className, {
        [`${preCls}-${type}`]: type,
      })}
      style={style}
    >
      {children}
    </button>
  )
})

export default Button