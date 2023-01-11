import React, { FC } from 'react'
import classNames from 'classnames'
// import { IButtonProps } from './interface'
import { preCls } from './preCls'
import DefaultButton from './default'
export interface IButtonProps {
  /**
   * 点击事件
   */
  onClick: (e: number) => void
  /**
   * 按钮类型
   * @default default
   */
  type?: 'default' | 'primary' | 'cancel' | 'delete' | 'link'
  /**
   * 按钮大小
   * @default default
   */
  size?: 'large' | 'default' | 'small'
  /**
   * 按钮内容
   * @editType string
   * @default Click me!
   */
  children: string
  className?: string
  style?: React.CSSProperties
}
import './index.scss'

export const Button: FC<IButtonProps> = (props) => {
  const {
    type = 'default',
    size = 'default',
    className,
    style,
    children,
  } = props
  if (type === 'default') return <DefaultButton {...props} />
  return (
    <button
      className={classNames(preCls, ' bg-white text-slate-900 dark:bg-slate-900 dark:text-white', className, {
        [`${preCls}-${type}`]: type,
        [`${preCls}-size-${size}`]: size,
      })}
      style={style}
    >
      {children}
    </button>
  )
}

export default Button