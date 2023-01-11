import classNames from 'classnames'
import React, { FC } from 'react'
import style from './index.module.css'

export interface IBlockquoteProps {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const Blockquote: FC<IBlockquoteProps> = (props) => (
  <blockquote className={classNames(style['mdx-blockquote'])} {...props} />
)

export default React.memo(Blockquote)
