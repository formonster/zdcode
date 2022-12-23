export interface TemplateOption {
  name: string
  root: string
  params: string[]
  templates: Template[]
}

export interface Template {
  name:  string;
  type:  string;
  files: TemplateFile[];
}

export interface TemplateFile {
  name:     string;
  template: string;
}