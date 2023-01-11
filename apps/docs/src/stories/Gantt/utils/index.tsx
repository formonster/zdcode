import { arr2Dic } from "@/libs/array";
import { Task, TaskKey } from "../types";

export const createPrecedingTasks = (tasks: Task[]) => {
  const taskDic = arr2Dic(tasks, 'value', { withIndex: true })
  // @ts-ignore
  tasks.forEach(({ latterTasks, value }) => {
    if (latterTasks && latterTasks.length) {
      latterTasks.forEach((latterId: TaskKey) => {
        // 任务可能被隐藏
        if (!taskDic[latterId]) return
        // @ts-ignore
        const taskIndex = taskDic[latterId]._index
        // @ts-ignore
        if (!tasks[taskIndex].precedingTasks) tasks[taskIndex].precedingTasks = []
        // @ts-ignore
        if (!tasks[taskIndex].precedingTasks.includes(value)) tasks[taskIndex].precedingTasks.push(value)
      })
    }
  })
  return tasks
}