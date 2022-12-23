import classNames from 'classnames'
import React, { FC } from 'react'
import style from './index.module.css'

export interface IH2Props {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const H2: FC<IH2Props> = ({ children, ...props }) => {
  return (
    <h2
      id={children as string}
      className={classNames('mdx-h mdx-h2', style['mdx-h2'])}
      {...props}
    >
      <a className='dark:text-slate-200' href={`#${children as string}`}>
        {children}
      </a>
    </h2>
  )
}

export default React.memo(H2)
