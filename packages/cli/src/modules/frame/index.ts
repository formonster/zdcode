#!/usr/bin/env zx
import { Command } from "commander"
import path from "path"
import chalk from "chalk"
import fs from "fs"
import { list, responseError } from "@zdcode/superdb"
import { selectList } from "../../utils/inquirer"
import { Frame, FrameType } from "./type"
import { arr2Dic } from "@zdcode/utils"
import 'zx/globals'
import { createProject, initDependency } from "./action"

const frames = (program: Command) => {
  program
    .command('create <project-name>')
    .description('快速创建脚手架')
    .action(async (projectName: string, options) => {
      const cwd = options.cwd || process.cwd()
      const targetDir = path.resolve(cwd, projectName || '.')
    
      if (fs.existsSync(targetDir)) {
        console.log('❌', chalk.red('目录已存在！'))
        process.exit(1)
      }

      console.log('')
      console.log('🐳', chalk.gray('您的项目名:'), chalk.yellow(projectName))
      console.log('')

      // 选择脚手架类型
      const frameTypeRes = await list<FrameType>('frame_type')
      if (responseError(frameTypeRes)) throw new Error('查询脚手架类型失败！')

      const frameTypes = frameTypeRes.data || []
      const frameTypesDic = arr2Dic(frameTypes, 'name') as Record<string, FrameType>
      
      // 请选择模板
      const type = await selectList('请选择模板', frameTypes.map(({ name }) => ({ name, value: name })))
      const frameType = frameTypesDic[type]
      
      // 查询脚手架列表
      const frameListRes = await list<Frame>('frames', {
        where: { type: frameType.id }
      })
      if (responseError(frameListRes)) throw new Error('查询脚手架列表失败！')

      const frameList = frameListRes.data || []
      const frameListDic = arr2Dic(frameList, 'name') as Record<string, Frame>

      // 请选择脚手架
      const frameName = await selectList('请选择脚手架', frameList.map(({ name }) => ({ name, value: name })))
      const frame = frameListDic[frameName]

      const projectPath = `${frameType.root}/${projectName}`

      await createProject(frameType.root, projectName, frame)
      await initDependency(projectPath)
    })
}

export default frames