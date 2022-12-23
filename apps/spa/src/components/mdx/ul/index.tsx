import React, { FC } from 'react'
import style from './index.module.css'

export interface IULProps {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const UL: FC<IULProps> = (props) => {
  return <ul className={style['mdx-ul']} {...props} />
}

export default React.memo(UL)
