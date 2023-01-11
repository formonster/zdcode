import React, { FC, useEffect, MutableRefObject } from 'react'
import classNames from 'classnames'
import dayjs from 'dayjs'
import Head from './components/Head'
import { useSize } from 'ahooks'
import { useRef } from 'react'
import Works from './components/Works'
import { GanttContext, GanttContextValue } from './context'
import { LinkContext, TaskKey, ViewMode, Task, DefaultTask, TaskTime } from './types'
import { useState } from 'react'
import { getDefaultFirstDate, getSpaceDays } from './utils/date'
import { useDrag } from '@use-gesture/react'
import { defaultColumnWidth } from './constant'
import { getAngle } from './utils/math'
import Link from './components/Link'
import { useMemo } from 'react'
import { getHypotenuseWidth } from './utils/triangle'
import { arr2Dic } from '@/libs/array'
import { useCallback } from 'react'
import { createPrecedingTasks } from './utils'
import './index.scss'

export * from './types'

export type GanttViewMode = ViewMode

export interface IGanttProps {
  /**
   * 甘特图开始时间
   * @editData 2023-01-01
   */
  startTime?: TaskTime
  /**
   * 甘特图结束时间
   * @editData 2023-01-30
   */
  endTime?: TaskTime
  /**
   * 展示模式
   * @editData day
   */
  viewMode?: ViewMode
  /**
   * 任务数据
   * @editType json
   */
  tasks?: Task[]
  /**
   * 任务数据
   * @editType json
   * @editData [{"value":"0","isMilepost":true,"startTime":"2023-01-01","endTime":"2023-01-31"},{"value":"0-1","milepostKey":"0","startTime":"2023-01-01","endTime":"2023-01-05","progress":60,"panelData":{"head":"https://ts1.cn.mm.bing.net/th/id/R-C.a3dcb35d5babcffa0a032c0d74817878?rik=NPLwVdDs1R0yZw&riu=http%3a%2f%2fimg.crcz.com%2fallimg%2f202003%2f11%2f1583903640898589.jpg&ehk=3Z0G6rXkUb%2faHrH5FLPrOf%2biRUg4vqAWoKSYNKQrhUw%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1","label":"task1"}},{"value":"0-2","milepostKey":"0","startTime":"2023-01-06","endTime":"2023-01-12","progress":80,"panelData":{"head":"https://ts1.cn.mm.bing.net/th/id/R-C.a3dcb35d5babcffa0a032c0d74817878?rik=NPLwVdDs1R0yZw&riu=http%3a%2f%2fimg.crcz.com%2fallimg%2f202003%2f11%2f1583903640898589.jpg&ehk=3Z0G6rXkUb%2faHrH5FLPrOf%2biRUg4vqAWoKSYNKQrhUw%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1","label":"task1"}},{"value":"0-3","milepostKey":"0","startTime":"2023-01-15","endTime":"2023-01-30","progress":20,"panelData":{"head":"https://ts1.cn.mm.bing.net/th/id/R-C.a3dcb35d5babcffa0a032c0d74817878?rik=NPLwVdDs1R0yZw&riu=http%3a%2f%2fimg.crcz.com%2fallimg%2f202003%2f11%2f1583903640898589.jpg&ehk=3Z0G6rXkUb%2faHrH5FLPrOf%2biRUg4vqAWoKSYNKQrhUw%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1","label":"task1","name":""}}]
   */
  defaultTasks?: Task[]
  render?: (data: DefaultTask['panelData'], task?: Task, index?: number) => React.ReactNode
  /**
   * 初始位置
   */
  initialPosition?: 'today'

  onRemoveLink?: (currentTaskKey: TaskKey, latterTaskKey: TaskKey) => void
  onCreateLink?: (precedingTaskKey: TaskKey, latterTaskKey: TaskKey) => void
  onChangeTaskDate?: (taskKey: TaskKey, type: 'left' | 'right', startTime?: TaskTime, endTime?: TaskTime) => void
  onMoveTask?: (taskKey: TaskKey, day: number, startTime: TaskTime, endTime: TaskTime) => void
  onChangeTaskProgress?: (taskKey: TaskKey, progress: number) => void

  children?: React.ReactNode
  className?: string
  /**
   * style
   * @editType json
   * @editData {"height": "500px"}
   */
  style?: React.CSSProperties
}

const preCls = 'titaui-gantt'

const getStartTime = (ganttStartTime: TaskTime) => {
  const monthStart = `${dayjs(ganttStartTime).subtract(1, 'month').format('YYYY-MM')}-01`
  return dayjs(monthStart)
}

export const Gantt = ({ startTime: ganttStartTime, endTime: ganttEndTime, tasks, defaultTasks, viewMode = 'day', render, onRemoveLink, onCreateLink, onChangeTaskDate, onMoveTask, onChangeTaskProgress, className, style }: IGanttProps) => {
  const [_tasks, setTasks] = useState(createPrecedingTasks((defaultTasks || tasks) as Task[]))
  useEffect(() => {
    if (tasks) setTasks(createPrecedingTasks(tasks))
  }, [tasks])

  const containerRef = useRef() as MutableRefObject<HTMLDivElement>
  const scrollContentRef = useRef() as MutableRefObject<HTMLDivElement>
  const { width: containerWidth, height: containerHeight } = useSize(containerRef) || { width: 0, height: 0 }
  const { width: scrollContentWidth, height: scrollContentHeight } = useSize(scrollContentRef) || { width: 0, height: 0 }

  const [startTime, setStartTime] = useState(ganttStartTime ? getStartTime(ganttStartTime) : getDefaultFirstDate(viewMode))
  useEffect(() => {
    setStartTime(ganttStartTime ? getStartTime(ganttStartTime) : getDefaultFirstDate(viewMode))
  }, [viewMode, ganttStartTime])

  const [endTime, setEndTime] = useState(ganttEndTime ? dayjs(ganttEndTime).add(1, 'month') : getDefaultFirstDate(viewMode))
  useEffect(() => {
    setEndTime(ganttEndTime ? dayjs(ganttEndTime).add(1, 'month') : getDefaultFirstDate(viewMode))
  }, [viewMode, ganttEndTime])

  const [downLink, setDownLink] = useState(false)
  const [angle, setAngle] = useState(0)
  const [width, setWdith] = useState(0)
  const linkContextRef = useRef<LinkContext>({}) as React.MutableRefObject<LinkContext>

  const dragBind = useDrag(({ movement: [mx, my] }) => {
    if (!downLink) return

    setWdith(getHypotenuseWidth(mx, my));
    setAngle(getAngle(mx, my, 0, 0));
  })

  const currentDragTaskInfo = useMemo(() => {
    if (!downLink) {
      setWdith(0)
      setAngle(0)
      return
    }
    const taskIndex = _tasks.findIndex(({ value }) => linkContextRef.current.currentKey === value)
    return { taskIndex, task: _tasks[taskIndex] }
  }, [downLink, linkContextRef.current])

  const tasksDic = useMemo(() => {
    return arr2Dic(_tasks, 'value', { withIndex: true }) as Record<TaskKey, Task & { _index: number }>
  }, [_tasks])

  const onMouseOverHandler = () => {
    if (downLink) setDownLink(false)
  }

  // 删除关联
  const onRemoveLinkHandler = useCallback((currentTaskKey: TaskKey, latterTaskKey: TaskKey) => {
    const currentTask = tasksDic[currentTaskKey]
    const latterTask = tasksDic[latterTaskKey]
    
    // @ts-ignore
    currentTask.latterTasks = currentTask.latterTasks.filter(key => key !== latterTaskKey)
    _tasks[currentTask._index] = { ...currentTask }

    // @ts-ignore
    latterTask.precedingTasks = latterTask.precedingTasks.filter(key => key !== currentTaskKey)
    _tasks[latterTask._index] = { ...latterTask }

    setTasks([..._tasks])

    if (onRemoveLink) onRemoveLink(currentTaskKey, latterTaskKey)
  }, [onRemoveLink, _tasks, tasksDic])

  // 创建关联
  const onCreateLinkHandler = useCallback((precedingTaskKey: TaskKey, latterTaskKey: TaskKey) => {
    const precedingTask = tasksDic[precedingTaskKey]
    const latterTask = tasksDic[latterTaskKey]

    // 判断是否可进行连接
    // @ts-ignore
    if (precedingTask.precedingTasks && precedingTask.precedingTasks.includes(latterTaskKey)) return
    // @ts-ignore
    if (precedingTask.latterTasks && precedingTask.latterTasks.includes(latterTaskKey)) return

    // 创建连接
    // @ts-ignore
    if (!precedingTask.latterTasks) precedingTask.latterTasks = []
    // @ts-ignore
    precedingTask.latterTasks.push(latterTaskKey)
    _tasks[precedingTask._index] = { ...precedingTask }

    // 自动调整时间
    loopLatter(precedingTaskKey, precedingTask.endTime)
    
    setTasks([..._tasks])

    if (onCreateLink) onCreateLink(precedingTaskKey, latterTaskKey)
  }, [onCreateLink, _tasks, tasksDic])

  // 如果时间冲突，则修改前后置任务时间
  // TODO: 自动调整前后置任务的时间
  const loopPre = (value: TaskKey, currentStartTime: TaskTime) => {
    const task = tasksDic[value]
    // @ts-ignore
    const precedingTasks: TaskKey[] = task.precedingTasks
    if (!precedingTasks || !precedingTasks.length) return
    
    // 循环判断所有的前置任务与当前任务之间的天数是否小于移动的天数，如果小于，则移动差值的天数，然后继续 loop
    precedingTasks.forEach((value) => {
      const preTask = tasksDic[value]
      const diffDays = dayjs(currentStartTime).diff(preTask.endTime, 'day') - 1
      
      // 如果小于 0，说明有交叉，需要将该任务也向前移动
      if (diffDays < 0) {
        // @ts-ignore
        console.log(preTask.panelData.label, '向前移动', Math.abs(diffDays), '天');
        
        preTask.startTime = dayjs(preTask.startTime).add(diffDays, 'day').format('YYYY-MM-DD HH:mm:ss')
        preTask.endTime = dayjs(preTask.endTime).add(diffDays, 'day').format('YYYY-MM-DD HH:mm:ss')
        _tasks[preTask._index] = { ...preTask }

        loopPre(preTask.value, preTask.startTime)
      }
    })
  }
  const loopLatter = (value: TaskKey, currentEndTime: TaskTime) => {
    const task = tasksDic[value]
    // @ts-ignore
    const latterTasks: TaskKey[] = task.latterTasks
    if (!latterTasks || !latterTasks.length) return
    // 循环判断所有的前置任务与当前任务之间的天数是否小于移动的天数，如果小于，则移动差值的天数，然后继续 loop
    latterTasks.forEach((value) => {
      const latterTask = tasksDic[value]
      const diffDays = dayjs(currentEndTime).diff(latterTask.startTime, 'day') + 1
      // 如果小于 0，说明有交叉，需要将该任务也向前移动
      if (diffDays > 0) {
        // @ts-ignore
        console.log(latterTask.panelData.label, '向后移动', Math.abs(diffDays), '天');

        latterTask.startTime = dayjs(latterTask.startTime).add(diffDays, 'day').format('YYYY-MM-DD HH:mm:ss')
        latterTask.endTime = dayjs(latterTask.endTime).add(diffDays, 'day').format('YYYY-MM-DD HH:mm:ss')
        _tasks[latterTask._index] = { ...latterTask }

        loopLatter(latterTask.value, latterTask.endTime)
      }
    })
  }

  // 更新任务时间
  const onChangeTaskDateHandler = useCallback<Required<GanttContextValue>['onChangeTaskDate']>(({ value, days, type, startTime, endTime}) => {
    const task = tasksDic[value]

    // 修改自身的时间
    if (startTime) task.startTime = startTime
    if (endTime) task.endTime = endTime
    _tasks[task._index] = { ...task }

    switch (type) {
      // 修改前置任务
      case 'left':
        loopPre(value, startTime as TaskTime)
        break

      // 修改后置任务
      case 'right':
        loopLatter(value, endTime as TaskTime)
        break
    }

    setTasks([..._tasks])

    if (onChangeTaskDate) onChangeTaskDate(value, type, task.startTime, task.endTime)
  }, [onChangeTaskDate, _tasks, tasksDic])

  const onMoveTaskHandler = useCallback((taskKey: TaskKey, day: number) => {
    const task = tasksDic[taskKey]

    task.startTime = dayjs(task.startTime).add(day, 'd').format('YYYY-MM-DD HH:mm:ss')
    task.endTime = dayjs(task.endTime).add(day, 'd').format('YYYY-MM-DD HH:mm:ss')
    _tasks[task._index] = { ...task }

    if (day < 0) loopPre(taskKey, task.startTime)
    else loopLatter(taskKey, task.endTime)

    setTasks([..._tasks])

    if (onMoveTask) onMoveTask(taskKey, day, task.startTime, task.endTime)
  }, [onMoveTask, _tasks, tasksDic])

  const onChangeTaskProgressHandler = useCallback((taskKey: TaskKey, progress: number) => {
    const task = tasksDic[taskKey]

    // @ts-ignore
    task.progress = progress

    _tasks[task._index] = { ...task }
    setTasks([..._tasks])

    if (onChangeTaskProgress) onChangeTaskProgress(taskKey, progress)
  }, [onChangeTaskProgress, _tasks, tasksDic])

  return (
    <GanttContext.Provider value={{
      tasks: _tasks,
      tasksDic,

      render,

      viewMode,
      columnWidth: defaultColumnWidth[viewMode],

      startTime,
      setStartTime,
      endTime,
      setEndTime,

      downLink,
      setDownLink,
      linkContextRef,

      containerWidth,
      containerHeight,
      scrollContentWidth,
      scrollContentHeight,

      onRemoveLink: onRemoveLinkHandler,
      onCreateLink: onCreateLinkHandler,
      onChangeTaskDate: onChangeTaskDateHandler,
      onMoveTask: onMoveTaskHandler,
      onChangeTaskProgress: onChangeTaskProgressHandler,
    }}>
      <div ref={containerRef} className={classNames(preCls, className)} style={style} {...dragBind()}>
        <div className={`${preCls}__scroll`} onMouseOver={onMouseOverHandler}>
          <div className={`${preCls}__scroll-content`} ref={scrollContentRef}>
            {/* 头部区域 */}
            <Head viewMode={viewMode} containerHeight={containerHeight} />
            {/* 任务区域 */}
            <Works tasks={_tasks} />
            {/* @ts-ignore */}
            {downLink && currentDragTaskInfo && <Link index={currentDragTaskInfo.taskIndex} type={linkContextRef.current.currentLinkType} startTime={currentDragTaskInfo.task.startTime} endTime={currentDragTaskInfo.task.endTime} angle={angle} width={width} />}
          </div>
        </div>
      </div>
    </GanttContext.Provider>
  )
}

export default React.memo(Gantt)