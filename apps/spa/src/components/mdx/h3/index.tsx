import classNames from 'classnames'
import React, { FC } from 'react'
import style from './index.module.css'

export interface IH3Props {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const H3: FC<IH3Props> = ({ children, ...props }) => {
  return (
    <h3
      id={children as string}
      className={classNames('mdx-h mdx-h3', style['mdx-h3'])}
      {...props}
    >
      <a className='dark:text-slate-200' href={`#${children as string}`}>
        {children}
      </a>
    </h3>
  )
}

export default React.memo(H3)
