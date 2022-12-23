import path from "path";
import { writeFile, getProjectFile } from "@zdcode/utils";
import { format } from "./format";
import { Template } from "./type";

export const createTemplates = (root: string, templates: Template[], params: Record<string, string>) => {
  for (const template of templates) {
    const name = format(template.name, params)
    // 处理文件夹
    if (template.files) {
      createTemplates(`${root}/${name}`, template.files, params)
      return
    }

    // 处理文件
    if (template.template) {
      const templatePath = template.template
      const templateContent = getProjectFile(`.templates/${templatePath}`)
      const formatTemplateContent = format(templateContent, params)
      // @ts-ignore
      writeFile(path.resolve(process.cwd(), `${root}/${name}`), formatTemplateContent)
    }
  }
}