import React, { FC, useContext, useEffect } from 'react'
import classNames from 'classnames'
import { useState } from 'react'
import dayjs from 'dayjs'
import { getMonthData, isToday, isWeekEnd } from '../../../../utils/date'
import TadyLine from '../../../TodayLine'
import { GanttContext } from '../../../../context'
import { MonthItem } from '../../../../types'
import './index.scss'

export interface IGanttDayHeadProps {
  containerHeight: number
  columnWidth?: number
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const rootPreCls = 'titaui-gantt-head'
const preCls = 'titaui-gantt-day-head'

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
        {new Array(days).fill(0).map((_, i) => {
          const weekEnd = isWeekEnd(year, month, i + 1)
          // 是不是最后一天
          const monthLastDay = isToday(year, month, i + 1, `${year}-${month}-${days}`)
          return (
            <div key={i} style={{ width: columnWidth }} className={classNames(`${rootPreCls}__days-item`, {
              [`${rootPreCls}__days-item--weekend`]: weekEnd
            })}>
              <span>{i + 1}</span>
              {monthLastDay && <div className={`${rootPreCls}__last-day`} style={{ height: containerHeight - 54 }} />}
              {weekEnd && <div className={`${rootPreCls}__week-bg`} style={{ height: containerHeight - 54 }} />}
              {isToday(year, month, i + 1) && <TadyLine height={containerHeight - 54} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const GanttDayHead: FC<IGanttDayHeadProps> = ({ containerHeight, columnWidth = 40, className, style }) => {
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

export default React.memo(GanttDayHead)
