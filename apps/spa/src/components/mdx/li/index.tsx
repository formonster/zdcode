import React, { FC } from 'react'
import style from './index.module.css'

export interface ILIProps {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const LI: FC<ILIProps> = (props) => {
  return <li className={style['mdx-li']} {...props} />
}

export default React.memo(LI)
