import classNames from 'classnames'
import React, { FC } from 'react'
import style from './index.module.css'

export interface ICodeProps {
  children: string
  className?: string
  style?: React.CSSProperties
}

const Code: FC<ICodeProps> = ({ children, className, ...other }) => {
  return (
    <code {...other} className={classNames(className, style['mdx-code'])}>
      {children}
    </code>
  )
}

export default React.memo(Code)
