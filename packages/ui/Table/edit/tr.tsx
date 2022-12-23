import React, { FC } from 'react'
import './index.scss'

export interface ITrProps {
 children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const preCls = 'titaui-super-table-tr'

const Tr: FC<ITrProps> = ({ className, style, children }) => {
  return (
    <tr className={`${preCls} ${className}`} style={style}>
     {children}
    </tr>
  )
}

export default React.memo(Tr)
