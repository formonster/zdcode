import classNames from 'classnames'
import React, { FC } from 'react'
import style from './index.module.css'

export interface IH1Props {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const H1: FC<IH1Props> = ({ children, ...props }) => {
  return (
    <h1
      id={children as string}
      className={classNames('mdx-h mdx-h1', style['mdx-h1'])}
      {...props}
    >
      <a className='dark:text-slate-200' href={`#${children as string}`}>
        {children}
      </a>
    </h1>
  )
}

export default React.memo(H1)
