import React, { FC } from 'react'
import classNames from 'classnames'
import './index.scss'

export interface IGanttTadyLineProps {
  height: number
  autoCenter?: boolean
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const preCls = 'titaui-gantt-tady-line'

const GanttTadyLine: FC<IGanttTadyLineProps> = ({ autoCenter = true, height, className, style }) => {
  return (
    <div className={classNames(preCls, className, {
      [`${preCls}--autoCenter`]: autoCenter
    })} style={{ ...style, height }}></div>
  )
}

export default React.memo(GanttTadyLine)
