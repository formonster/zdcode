import React, { FC } from 'react'
import classNames from 'classnames'
import TaskPanel from '../TaskPanel'
import MilepostLine from '../MilepostLine'
import { Task } from '../../types'
import AutoPosition from '../AutoPosition'
import './index.scss'

export interface IGanttWorksProps {
  tasks: Task[]
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const preCls = 'titaui-gantt-works'

const GanttWorks: FC<IGanttWorksProps> = ({ tasks = [], className, style }) => {
  return (
    <div className={classNames(preCls, className)} style={style}>
      {tasks.map((task) => (
        <div key={task.value} className={`${preCls}__task-line`}>
          {/* @ts-ignore */}
          {!task.isMilepost && <AutoPosition value={task.value} disable={task.disable} startTime={task.startTime}><TaskPanel {...task} /></AutoPosition>}
          {/* @ts-ignore */}
          {task.isMilepost && <AutoPosition value={task.value} disable={task.disable} startTime={task.startTime}><MilepostLine panelData={task.panelData} startTime={task.startTime} endTime={task.endTime} /></AutoPosition>}
        </div>
      ))}
    </div>
  )
}

export default React.memo(GanttWorks)
