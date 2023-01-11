import React, { FC, useContext, useEffect, useMemo } from 'react'
import classNames from 'classnames'
import dayjs from 'dayjs'
import { useSpring, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { TaskKey, TaskTime } from '../../types'
import { GanttContext } from '../../context'
import { useCallback } from 'react'
import { useState } from 'react'
import { getSpaceDays } from '../../utils/date'
import './index.scss'

export interface GanttIAutoPositionProps {
  value: TaskKey
  startTime: TaskTime
  children: React.DetailedReactHTMLElement<any, HTMLElement>
  disable?: boolean
  className?: string
}

const preCls = 'titaui-gantt-auto-position'

const GanttAutoPosition: FC<GanttIAutoPositionProps> = ({ value, disable, startTime: taskStartTime, className, children }) => {
  const { columnWidth, startTime, onMoveTask, downLink } = useContext(GanttContext)
  
  const currentDays = getSpaceDays(startTime, taskStartTime)
  // 计算任务距离开始位置的天数
  const left = currentDays * columnWidth
  const [_left, setLeft] = useState(left)
  useEffect(() => {
    setLeft(left)
  }, [left])

  const dragBind = useDrag(({ movement: [mx], last }) => {
    if (downLink) return

    const newX = left + mx
    if (last) {
      // 计算拖动后距离最近的天数
      const days = Math.round(newX / columnWidth)
      const moveDay = days - currentDays
      if (moveDay === 0) {
        setLeft(left)
        return
      }
      
      if (onMoveTask) onMoveTask(value, days - currentDays)
    }
    setLeft(newX)
  })

  const onMoveLeftHandler = useCallback((mx: number) => {
    setLeft(left + mx)
  }, [left])

  const selfChildren = React.cloneElement(children, {
    onMoveLeft: onMoveLeftHandler,
  })

  return (
    <div className={classNames(preCls, className)} style={{ left: _left }} {...(disable ? {} : dragBind())}>
      {selfChildren}
    </div>
  )
}

export default React.memo(GanttAutoPosition)
