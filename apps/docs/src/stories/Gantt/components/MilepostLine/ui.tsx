import React, { FC } from 'react'
import classNames from 'classnames'
import { Tooltip } from 'antd'
import { DefaultTask } from '../../types'
import './index.scss'

export interface IGanttMilepostLineProps {
  width: number
  theme: string
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const preCls = 'titaui-gantt-milepost-line'

const GanttMilepostLine: FC<IGanttMilepostLineProps> = ({ theme, width, className, style }) => {
  const line = <div className={classNames(preCls, className)} style={{ ...style, width, backgroundColor: theme }} />
  // if (panelData.tootip) return <Tooltip title={panelData.tootip}>{line}</Tooltip>
  return line
}

export default React.memo(GanttMilepostLine)
