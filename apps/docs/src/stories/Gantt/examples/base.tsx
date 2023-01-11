import React, { FC, useCallback } from 'react'
import Gantt, { TaskKey, Task, IGanttProps, PanelData } from '../'

const headLink = 'https://ts1.cn.mm.bing.net/th/id/R-C.a3dcb35d5babcffa0a032c0d74817878?rik=NPLwVdDs1R0yZw&riu=http%3a%2f%2fimg.crcz.com%2fallimg%2f202003%2f11%2f1583903640898589.jpg&ehk=3Z0G6rXkUb%2faHrH5FLPrOf%2biRUg4vqAWoKSYNKQrhUw%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1'

const mockTask: Task[] = [
  {
    value: '0',
    isMilepost: true,
    startTime: '2023-01-01',
    endTime: '2023-01-31'
  },
  {
    value: '0-1',
    milepostKey: '0',
    startTime: '2023-01-01',
    endTime: '2023-01-05',
    progress: 60,
    panelData: {
      head: headLink,
      label: 'task1'
    }
  },
  {
    value: '0-2',
    milepostKey: '0',
    startTime: '2023-01-06',
    endTime: '2023-01-12',
    progress: 80,
    panelData: {
      head: headLink,
      label: 'task1'
    }
  },
  {
    value: '0-3',
    milepostKey: '0',
    startTime: '2023-01-15',
    endTime: '2023-01-30',
    progress: 20,
    panelData: {
      head: headLink,
      label: 'task1',
      name: ''
    }
  },
]

export interface IBaseProps {
  children?: React.ReactNode
  className?: string
  /**
   * style
   * @editType json
   * @editData {"height": "500px"}
   */
  style?: React.CSSProperties
}

const preCls = 'titaui-Base'

const Base: FC<IBaseProps> = () => {
  const onRemoveLinkHandler = useCallback((currentTaskKey: TaskKey, latterTaskKey: TaskKey) => {

  }, [])
  return (
    <div>
      <Gantt defaultTasks={mockTask} style={{ height: 300 }} startTime="2023-01-01" endTime="2023-02-01" onRemoveLink={onRemoveLinkHandler} />
      {/* <Gantt tasks={mockTask} style={{ height: 200 }} /> */}
    </div>
  )
}

export default React.memo(Base)
