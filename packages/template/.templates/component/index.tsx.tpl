import React, { FC } from 'react'
import classNames from 'classnames'
import './index.scss'

export interface I$T{F|componentName}Props {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const preCls = 'titaui-$T{-|componentName}'

const $T{F|componentName}: FC<I$T{F|componentName}Props> = ({ className, style }) => {
  return (
    <div className={classNames(preCls, className)} style={style}>
      $T{F|componentName}
    </div>
  )
}

export default React.memo($T{F|componentName})