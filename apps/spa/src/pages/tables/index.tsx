import React, { FC } from 'react'
import classNames from 'classnames'
import Tables from '@/features/tables'
import './index.scss'

export interface ITablesProps {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const preCls = 'zdcode-tables'

const TablesPage: FC<ITablesProps> = ({ className, style }) => {
  return (
    <div className={classNames(preCls, className, "h-screen")} style={style}>
      <Tables />
    </div>
  )
}

export default React.memo(TablesPage)
