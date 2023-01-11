import React, { FC, useCallback, useContext, useMemo } from 'react'
import dayjs from 'dayjs'
import { TaskKey, TaskTime, DefaultTask } from '../../types'
import TaskPanel from './ui'
import { GanttContext } from '../../context'
import DragBar from '../DragBar'
import Path from '../Path'
import { getSpaceDays } from '../../utils/date'

export interface IGanttTaskPanelProps {
  value: TaskKey
  latterTasks: DefaultTask['latterTasks']
  startTime: TaskTime
  endTime: TaskTime
  disable: boolean
  panelData: DefaultTask['panelData']
  onMoveLeft: (mx: number) => void
  onMoveRight: (mx: number) => void
  progress?: number
  children?: React.ReactNode
}

const preCls = 'titaui-gantt-task-panel'

const GanttTaskPanel: FC<IGanttTaskPanelProps> = ({ value, disable, progress, latterTasks = [], startTime: taskStartTime, endTime: taskEndTime, panelData, onMoveLeft, onMoveRight }) => {
  const { columnWidth, render, tasksDic, onChangeTaskProgress, onChangeTaskDate } = useContext(GanttContext)
  const width = useMemo(() => {
    return getSpaceDays(taskStartTime, taskEndTime, false) * columnWidth
  }, [taskStartTime, taskEndTime, columnWidth])

  const content = useMemo(() => {
    const { head, label } = panelData
    if (render) {
      const currentTask = tasksDic[value]
      return render(panelData, currentTask, currentTask._index)
    }
    return (
      <>
        {head && <div className={`${preCls}__head`}><img src={head} alt="head" /></div>}
        <p className={`${preCls}__label`}>{label}</p>
      </>
    )
  }, [render, panelData])

  const onChangeProgressHandler = useCallback((progress: number) => {
    if (onChangeTaskProgress) onChangeTaskProgress(value, progress)
  }, [onChangeTaskProgress])

  const onChangeWidthHandler = useCallback((mx: number, type: 'left' | 'right') => {
    if (!onChangeTaskDate) return

    let days = Math.round(mx / columnWidth)
    switch (type) {
      case 'left':
        onChangeTaskDate({
          value,
          type: 'left',
          days,
          startTime: dayjs(taskStartTime).add(days, 'day').format('YYYY-MM-DD HH:mm:ss'),
          endTime: undefined
        })
        return
      case 'right':
        onChangeTaskDate({
          value,
          type: 'right',
          days,
          startTime: undefined,
          endTime: dayjs(taskEndTime).add(days, 'day').format('YYYY-MM-DD HH:mm:ss')
        })
        return
    }
  }, [onChangeTaskProgress, columnWidth])

  const isMini = width <= 40

  return (
    <DragBar value={value} disable={disable}>
      <TaskPanel {...panelData} width={width} disable={disable} progress={progress} content={content} onChangeProgress={onChangeProgressHandler} onChangeWidth={onChangeWidthHandler} onMoveLeft={onMoveLeft} onMoveRight={onMoveRight} unitWidth={columnWidth} />
      <svg className={`${preCls}__svg-path`} style={{ left: isMini ? 8 : width }}>
        {latterTasks.map(taskKey => <Path key={taskKey} disable={disable} isMini={isMini} currentTaskKey={value} targetTaskKey={taskKey}  />)}
      </svg>
    </DragBar>
  )
}

export default React.memo(GanttTaskPanel)
