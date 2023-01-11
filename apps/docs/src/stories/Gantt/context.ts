import { createContext } from 'react'
import dayjs from 'dayjs'
import { DefaultTask, LinkContext, Task, TaskKey, TaskTime, ViewMode } from './types'
import { defaultColumnWidth } from './constant'

export type GanttContextValue = {
  tasks: Task[]
  tasksDic: Record<Task['value'], Task & { _index: number }>

  render?: (data: DefaultTask['panelData'], task: Task, index: number) => React.ReactNode

  viewMode: ViewMode
  columnWidth: number

  startTime?: TaskTime
  setStartTime?: React.Dispatch<React.SetStateAction<dayjs.Dayjs>>
  endTime?: TaskTime
  setEndTime?: React.Dispatch<React.SetStateAction<dayjs.Dayjs>>

  downLink?: boolean
  setDownLink?: React.Dispatch<React.SetStateAction<boolean>>
  linkContextRef?: React.MutableRefObject<LinkContext>

  containerWidth: number
  containerHeight: number
  scrollContentWidth: number
  scrollContentHeight: number

  onRemoveLink?: (currentTaskKey: TaskKey, latterTaskKey: TaskKey) => void
  onCreateLink?: (precedingTaskKey: TaskKey, latterTaskKey: TaskKey) => void
  onChangeTaskDate?: (event: { value: TaskKey, type: 'left' | 'right', days: number, startTime?: TaskTime, endTime?: TaskTime }) => void
  onMoveTask?: (taskKey: TaskKey, day: number) => void
  onChangeTaskProgress?: (taskKey: TaskKey, progress: number) => void
}
export const GanttContext = createContext<GanttContextValue>({
  tasks: [],
  tasksDic: {},
  viewMode: 'day',
  columnWidth: defaultColumnWidth.day,
  startTime: undefined,
  setStartTime: undefined,
  containerWidth: 0,
  containerHeight: 0,
  scrollContentWidth: 0,
  scrollContentHeight: 0
})