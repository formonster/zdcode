import classNames from 'classnames'
import React, { FC } from 'react'
import style from './index.module.css'

export interface IH5Props {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const H5: FC<IH5Props> = ({ children, ...props }) => {
  return (
    <h5
      id={children as string}
      className={classNames('mdx-h mdx-h5', style['mdx-h5'])}
      {...props}
    >
      <a className='dark:text-slate-200' href={`#${children as string}`}>
        {children}
      </a>
    </h5>
  )
}

export default React.memo(H5)
