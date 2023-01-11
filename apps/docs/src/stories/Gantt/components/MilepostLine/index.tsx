import React, { FC, useContext, useMemo } from 'react'
import { DefaultTask, TaskTime } from '../../types'
import MilepostLine from './ui'
import { GanttContext } from '../../context'
import { getSpaceDays } from '../../utils/date'

export interface IGanttMilepostLineProps {
  panelData: DefaultTask['panelData']
  startTime: TaskTime
  endTime: TaskTime
  children?: React.ReactNode
}

const GanttMilepostLine: FC<IGanttMilepostLineProps> = ({ panelData, startTime: taskStartTime, endTime: taskEndTime }) => {
  const { columnWidth } = useContext(GanttContext)
  const width = useMemo(() => {
    return getSpaceDays(taskStartTime, taskEndTime, false) * columnWidth
  }, [taskStartTime, taskEndTime, columnWidth])
  
  return (
    <MilepostLine theme={panelData && panelData.theme} width={width} />
  )
}

export default React.memo(GanttMilepostLine)
