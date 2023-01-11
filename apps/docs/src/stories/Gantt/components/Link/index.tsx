import React, { FC, useContext } from 'react'
import classNames from 'classnames'
import dayjs from 'dayjs'
import { LinkContext, TaskTime } from '../../types'
import './index.scss'
import { GanttContext } from '../../context'
import { getSpaceDays } from '../../utils/date'

export interface IGanttLinkProps {
  index: number
  type: LinkContext['currentLinkType']
  startTime: TaskTime
  endTime: TaskTime
  angle: number
  width: number
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const preCls = 'titaui-gantt-link'

const GanttLink: FC<IGanttLinkProps> = ({ type, startTime: taskStartTime, endTime: taskEndTime, index, width, angle, className, style }) => {
  const { columnWidth, startTime } = useContext(GanttContext)
  // 计算任务距离开始位置的天数
  const left = type === 'left' ? getSpaceDays(startTime, taskStartTime) * columnWidth - 12 : getSpaceDays(startTime, taskEndTime, false) * columnWidth + 12
  const top = index * 34 + 52 + 19
  return (
    <div className={classNames(preCls, className)} style={{ ...style, left, width: width - 9, top, transform: `rotate(${angle}deg)` }}></div>
  )
}

export default React.memo(GanttLink)
