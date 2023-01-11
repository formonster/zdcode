import React, { FC, useContext, useEffect, useRef } from 'react'
import classNames from 'classnames'
import { useState } from 'react'
import dayjs from 'dayjs'
import { getAddDayNumStr, isWeek, isWeekEnd, isToday, getMonthData } from '../../../../utils/date'
import TadyLine from '../../../TodayLine'
import { GanttContext } from '@/stories/Gantt/context'
import { MonthItem } from '@/stories/Gantt/types'
import './index.scss'

export interface IGanttWeekHeadProps {
  containerHeight: number
  columnWidth?: number
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const rootPreCls = 'titaui-gantt-head'
const preCls = 'titaui-gantt-week-head'


interface IHeadProps extends MonthItem {
  containerHeight: number
  columnWidth: number
}

const Head: FC<IHeadProps> = ({ year, month, days, columnWidth, containerHeight }) => {
  return (
    <div className={`${rootPreCls}__item`}>
      {/* year */}
      <div className={`${rootPreCls}__year-month`}>{year}/{month}</div>
      {/* days */}
      <div className={`${rootPreCls}__days`}>
        {new Array(days).fill(0).map((_, i) => <div key={i} style={{ width: columnWidth, maxWidth: columnWidth }} className={classNames(`${rootPreCls}__days-item ${rootPreCls}__days-item--week`, {
          [`${rootPreCls}__days-item--weekend`]: isWeekEnd(year, month, i + 1)
        })}>
          {isWeek(year, month, i + 1, 1) && (
            <span style={{ marginLeft: 24 }}>
              {getAddDayNumStr(year, month, i + 1, 7)}
            </span>
          )}
          {isToday(year, month, i + 1) && <TadyLine height={containerHeight - 52} />}
        </div>)}
      </div>
    </div>
  )
}

const GanttWeekHead: FC<IGanttWeekHeadProps> = ({ containerHeight, columnWidth = 14.4, className, style }) => {
  const { startTime, endTime } = useContext(GanttContext)

  const [months, setMonth] = useState<MonthItem[]>(getMonthData(startTime, endTime))

  useEffect(() => {
    setMonth(getMonthData(startTime, endTime))
  }, [startTime, endTime])

  return (
    <div className={classNames(preCls, className)} style={style}>
      {months.map(item => <Head key={`${item.year}_${item.month}`} {...item} columnWidth={columnWidth} containerHeight={containerHeight} />)}
    </div>
  )
}

export default React.memo(GanttWeekHead)
