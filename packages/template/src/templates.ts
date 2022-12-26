import fs from "fs";
import path from "path";
import chalk from 'chalk'
import { writeFile, getProjectFile } from "@zdcode/utils";
import { format, replace } from "./format";
import { Template } from "./type";

export const createTemplates = async (root: string, templates: Template[], params: Record<string, string>) => {
  for (const template of templates) {
    const templateRoot = template.root
    const name = template.name && format(template.name, params)
    const filePath = [root, templateRoot, name].filter(Boolean).join('/').replace(/\/\//g, '/')
    // 处理文件夹
    if (template.files) {
      await createTemplates(filePath, template.files, params)
      continue
    }

    if (template.type === 'replace') {
      const { replaceFile, replaceOptions } = template

      if (!replaceFile || !replaceOptions) continue

      const replaceFilePath = path.join(filePath, replaceFile)
      
      const replaceFileContent = getProjectFile(replaceFilePath)   
      for (const replaceOption of replaceOptions) {
        const { target, template, content } = replaceOption
        if (!target) throw new Error('请指定要替换内容的文件路径！')
        if (!template && !content) throw new Error('请指定要替换的内容！')

        const templateContent = getProjectFile(`.templates/${template}`)
        const replaceTarget = format(target, params)
        const newContent = replace(replaceFileContent, `// $T{${replaceTarget}}`, `// $T{${replaceTarget}}\n${format(templateContent, params)}`)
        fs.writeFileSync(replaceFilePath, newContent, 'utf8');
      }
    }

    // 处理文件
    if (template.template) {
      const templatePath = template.template
      const templateContent = getProjectFile(`.templates/${templatePath}`)
      const formatTemplateContent = format(templateContent, params)
      // @ts-ignore
      await writeFile(path.resolve(process.cwd(), filePath), formatTemplateContent)
      console.log('🎉', chalk.gray(filePath))
    }
  }
}