import classNames from 'classnames'
import React, { FC } from 'react'
import style from './index.module.css'

export interface IH4Props {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const H4: FC<IH4Props> = ({ children, ...props }) => {
  return (
    <h4
      id={children as string}
      className={classNames('mdx-h mdx-h4', style['mdx-h4'])}
      {...props}
    >
      <a className='dark:text-slate-200' href={`#${children as string}`}>
        {children}
      </a>
    </h4>
  )
}

export default React.memo(H4)
