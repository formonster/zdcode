export type Param = {
  name: string
  label?: string
  type: 'select' | 'input' | 'boolean'
  options: string[]
}
export type Select = [string, string[]]
export type Boolean = [string, 'boolean']

export interface TemplateOption {
  name: string
  root: string
  params: (string | Select | Boolean)[]
  templates: Template[]
}

export type ReplaceOption = {
  target: string
  template?: string
  content?: string
}

export interface Template {
  name: string;
  type: 'dir' | 'file' | 'replace';
  replaceFile?: string;
  replaceOptions?: ReplaceOption[];
  root: string;
  template?: string;
  files?: Template[];
}
