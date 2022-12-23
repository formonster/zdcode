import { Command } from 'commander'
import chalk from 'chalk'
import { getProjectJsonFile } from '@zdcode/utils'
import { input, selectList } from './inquirer'
import { TemplateOption } from './type'
import { createTemplates } from './templates'

// 读取项目配置文件
// 根据配置文件提示选项
// 先选择要创建的模板
// 然后依次展示模板中配置的输入项
const temp = (program: Command) => {
program
  .command('template')
  .description('快速创建模板文件')
  .action(async () => {
    const templateConfig: TemplateOption[] = getProjectJsonFile('.templates/template.json')

    // 1. 选择模板
    const templateName = await selectList('请选择模板', templateConfig.map(({ name }) => ({ name, value: name })))
    const templateOption = templateConfig.find(({ name }) => name === templateName)
    
    if (!templateOption) throw new Error('模板异常！')

    const { params = [], root, templates } = templateOption
    
    // 2. 依次输入模板参数
    const paramsData: Record<string, string> = {}
    if (params.length) {
      for (const param of params) {
        const value = await input(`请输入 ${param}:`)
        paramsData[param] = value
      }
    }

    console.log('')
    console.log('🐳', chalk.gray('开始生成模板文件'))
    console.log('')

    await createTemplates(root, templates, paramsData)
    
    console.log('')
    console.log('🐳', chalk.green('success!'))
    console.log('')

  })
}

export default temp