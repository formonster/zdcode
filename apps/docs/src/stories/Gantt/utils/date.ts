import dayjs from 'dayjs'
import { TaskTime, ViewMode } from '../types'

const currentYearNum = dayjs().year()
const currentMonthNum = dayjs().month() + 1
const currentDatehNum = dayjs().date()

/** 创建某个月的日数据 */
const createMonthDays = (date: dayjs.Dayjs) => {
  const year = date.year()
  const month = date.month() + 1
  
  const days = dayjs(`${year}-${month}-01`).daysInMonth()
  return { year, month, days, date }
}

const currentMonthDate = dayjs(`${currentYearNum}-${currentMonthNum}-01`)
const firstDate = currentMonthDate.subtract(1, 'M')
const lastDate = currentMonthDate.add(1, 'M')

export const getMonthData = (startTime: TaskTime | undefined, endTime: TaskTime | undefined) => {
  let startDate = startTime ? dayjs(startTime) : firstDate
  let endDate = endTime ? dayjs(endTime) : lastDate
  // 先计算开始和结束时间相差几个月
  const months = endDate.diff(startDate, 'month')
  
  const monthData = [
    createMonthDays(startDate)
  ]
  new Array(months).fill(0).forEach((_, i) => {
    monthData.push(createMonthDays(startDate.add(i + 1, 'M')))
  })

  return monthData
}

/**
 * 如果没有指定开始时间，则生成默认的
 * @param viewMode 展示方式
 * @returns 
 */
export const getDefaultFirstDate = (viewMode: ViewMode) => {
  const currentYearNum = dayjs().year()
  const currentMonthNum = dayjs().month() + 1
  const currentMonthDate = dayjs(`${currentYearNum}-${currentMonthNum}-01`)
  switch (viewMode) {
    case 'day':
      return currentMonthDate.subtract(1, 'M')
    case 'week':
      return currentMonthDate.subtract(1, 'M')
    case 'month':
      return dayjs(`${currentYearNum - 1}-01-01`)
  }
}

export const isWeekEnd = (year: number, month: number, day: number) => {
  const date = dayjs(`${year}-${month}-${day}`)
  const curDay = date.day()
  return [6, 0].includes(curDay)
}

/**
 * 判断日期是否是周几
 * @param year 年
 * @param month 月
 * @param day 日
 * @param num 周几
 * @returns boolean
 */
export const isWeek = (year: number, month: number, day: number, num: number) => {
  const date = dayjs(`${year}-${month}-${day}`)
  const curDay = date.day()
  if (num === 7) num = 0
  return curDay === num
}

export const getAddDayNumStr = (year: number, month: number, day: number, addDayNum: number) => {
  const date = dayjs(`${year}-${month}-${day}`)
  return `${day} - ${date.add(addDayNum, 'd').date()}`
}

export const getMonthDayNum = (year: number, month: number) => {
  return dayjs(`${year}-${month}-01`).daysInMonth()
}

export const isToday = (year: number, month: number, day: number, date?: string | number | dayjs.Dayjs | Date | null | undefined) => {
  const currentDate = dayjs(date)
  return currentDate.year() === year && currentDate.month() + 1 === month && currentDate.date() === day
}

export const isCurrentMonth = (year: number, month: number) => {
  const currentDate = dayjs()
  return currentDate.year() === year && currentDate.month() + 1 === month
}

export const getSpaceDays = (startTime: string | number | dayjs.Dayjs | Date | null | undefined, endTime: string | number | dayjs.Dayjs | Date | null | undefined, ignoreLastDay: boolean = true) => {
  return dayjs(endTime).diff(startTime, 'day') + (ignoreLastDay ? 0 : 1)
}