import React, { FC, useCallback, useContext } from 'react'
import dayjs from 'dayjs'
import { TaskKey } from '../../types'
import { GanttContext } from '../../context'
import Path from './ui'
import { getSpaceDays } from '../../utils/date'

export interface IGanttPathProps {
  isMini: boolean
  currentTaskKey: TaskKey
  targetTaskKey: TaskKey
  disable?: boolean
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const GanttPath: FC<IGanttPathProps> = ({ isMini, disable, currentTaskKey, targetTaskKey, className, style }) => {
  const { tasksDic, columnWidth, startTime, onRemoveLink } = useContext(GanttContext)

  const onRemoveLinkHandler = useCallback(() => {
    if (onRemoveLink) onRemoveLink(currentTaskKey, targetTaskKey)
  }, [onRemoveLink])

  const currentTask = tasksDic[currentTaskKey]
  const currentTaskEndTime = currentTask.endTime
  const currentTaskIndex = currentTask._index
  const currentX = getSpaceDays(startTime, currentTaskEndTime, false) * columnWidth
  const currentY = currentTaskIndex * 34 + 52 + 19

  const targetTask = tasksDic[targetTaskKey]

  // 任务可能被隐藏
  if (!targetTask) return <></>

  const targetTaskStartTime = targetTask.startTime
  const targetTaskIndex = targetTask._index
  let targetX = getSpaceDays(startTime, targetTaskStartTime) * columnWidth
  const targetY = targetTaskIndex * 34 + 52 + 19

  return <Path onRemoveLink={onRemoveLinkHandler} disable={disable} className={className} style={style} x1={0} y1={0} x2={targetX - currentX + (isMini ? 32 : 0)} y2={targetY - currentY} />
}

export default React.memo(GanttPath)
