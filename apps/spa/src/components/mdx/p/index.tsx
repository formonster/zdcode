import classNames from 'classnames'
import React, { FC } from 'react'
import style from './index.module.css'

export interface IH1Props {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const H1: FC<IH1Props> = ({ className, ...other }) => {
  return (
    <p
      className={classNames(
        className,
        style['mdx-p'],
        'text-slate-700 dark:text-slate-300'
      )}
      {...other}
    />
  )
}

export default React.memo(H1)
