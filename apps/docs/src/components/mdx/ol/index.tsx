import React, { FC } from 'react'
import style from './index.module.css'

export interface IOLProps {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const OL: FC<IOLProps> = (props) => {
  return <ol className={style['mdx-ol']} {...props} />
}

export default React.memo(OL)
