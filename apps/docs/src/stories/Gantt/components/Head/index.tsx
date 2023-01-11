import React, { FC, useMemo } from 'react'
import classNames from 'classnames'
import dayjs from 'dayjs'
import DayHead from './mode/DayHead'
import WeekHead from './mode/WeekHead'
import MonthHead from './mode/MonthHead'
import { isWeekEnd } from '../../utils/date'
import './index.scss'

export interface IGanttHeadProps {
  containerHeight: number
  viewMode: 'month' | 'week' | 'day'
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const preCls = 'titaui-gantt-head'

const GanttHead: FC<IGanttHeadProps> = ({ containerHeight, viewMode, className, style }) => {
  const head = useMemo(() => {
    switch (viewMode) {
      case 'day':
        return <DayHead containerHeight={containerHeight} />
      case 'week':
        return <WeekHead containerHeight={containerHeight} />
      case 'month':
        return <MonthHead containerHeight={containerHeight} />
    }
  }, [viewMode, containerHeight])
  return (
    <div className={classNames(preCls, className)} style={style}>
      {head}
    </div>
  )
}

export default React.memo(GanttHead)
