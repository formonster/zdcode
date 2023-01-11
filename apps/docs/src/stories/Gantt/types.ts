import dayjs from 'dayjs'

export type TaskKey = number | string

export interface BaseTask {
  value: TaskKey
  startTime: TaskTime
  endTime: TaskTime
  visible?: boolean
  disable?: boolean
}
export type PanelData = Record<string, any> & {
  head: string
  label: string
  theme: string
}

export interface MilepostTask extends BaseTask {
  /** 是否是里程碑 */
  isMilepost: true
}

export interface DefaultTask extends BaseTask {
  /** 所属里程碑的 key */
  milepostKey: TaskKey
  panelData: PanelData
  progress?: number
  precedingTasks?: TaskKey[]
  latterTasks?: TaskKey[]
  className?: string
}

export type Task = DefaultTask | MilepostTask

export type TaskTime = string | number | dayjs.Dayjs | Date
export type ViewMode = 'month' | 'week' | 'day'


export interface MonthItem {
  year: number
  month: number
  days: number
  date: dayjs.Dayjs
}

export type LinkContext = {
  currentKey?: TaskKey
  currentLinkType?: 'left' | 'right'
  targetKey?: TaskKey
}