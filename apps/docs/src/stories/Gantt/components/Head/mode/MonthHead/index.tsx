import React, { FC, useEffect, useRef } from 'react'
import classNames from 'classnames'
import { useState } from 'react'
import dayjs from 'dayjs'
import { useUnInitEffect } from '@/hooks/useUnInitEffect'
import { getMonthDayNum, isCurrentMonth, isWeekEnd } from '../../../../utils/date'
import TadyLine from '../../../TodayLine'
import './index.scss'

export interface IGanttMonthHeadProps {
  containerHeight: number
  columnWidth?: number
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const rootPreCls = 'titaui-gantt-head'
const preCls = 'titaui-gantt-month-head'

export interface YearMonthItem {
  year: number
  monthDays: number[]
}

const currentYear = dayjs().year()
const currentMonth = dayjs().month() + 1
const currentDateNum = dayjs().date()

/** 创建某个月的日数据 */
const createYearMonthDays = (year: number) => {
  const monthDays = new Array(12).fill(0).map((_, i) => {
    const month = i + 1
    const days = getMonthDayNum(year, month)
    return days
  })
  
  return { year, monthDays }
}

const currentDate = dayjs(`${currentYear}-${currentMonth}-01`)
const firstDate = currentDate.subtract(1, 'M')
const lastDate = currentDate.add(1, 'M')

const defaultMonthData = [
  createYearMonthDays(currentYear - 1),
  createYearMonthDays(currentYear),
  createYearMonthDays(currentYear + 1),
]

interface IHeadProps extends YearMonthItem {
  containerHeight: number
  columnWidth: number
}

const Head: FC<IHeadProps> = ({ year, monthDays, columnWidth, containerHeight }) => {
  return (
    <div className={`${rootPreCls}__item`}>
      {/* year */}
      <div className={`${rootPreCls}__year-month`}>{year}</div>
      {/* days */}
      <div className={`${rootPreCls}__days`}>
        {monthDays.map((days, i) => <div key={i} style={{ width: days * columnWidth }} className={classNames(`${rootPreCls}__days-item`)}>
          <span>{i + 1} 月</span>
          {isCurrentMonth(year, i + 1) && <TadyLine autoCenter={false} height={containerHeight - 52} style={{ left: currentDateNum * columnWidth - columnWidth / 2 }} />}
        </div>)}
      </div>
    </div>
  )
}

const GanttMonthHead: FC<IGanttMonthHeadProps> = ({ containerHeight, columnWidth = 4, className, style }) => {
  const [years, setYears] = useState<YearMonthItem[]>(defaultMonthData)

  // 默认只生成三个月的数据
  const [firstYears, setFirstYears] = useState(firstDate)
  const [lastYears, setLastYears] = useState(lastDate)

  return (
    <div className={classNames(preCls, className)} style={style}>
      {years.map(item => <Head key={item.year} {...item} columnWidth={columnWidth} containerHeight={containerHeight} />)}
    </div>
  )
}

export default React.memo(GanttMonthHead)
