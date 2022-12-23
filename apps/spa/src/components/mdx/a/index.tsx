import React, { FC } from 'react'
import style from './index.module.css'

export interface IAProps {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const A: FC<IAProps> = (props) => {
  return <a className={style['mdx-a']} {...props} />
}

export default React.memo(A)
