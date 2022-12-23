// src/index.ts
import { getProjectJsonFile } from "@zdcode/utils";

// src/inquirer.ts
import inquirer from "inquirer";
async function selectList(title, data) {
  const { action } = await inquirer.prompt([
    {
      name: "action",
      type: "list",
      message: title,
      choices: data
    }
  ]);
  return action;
}
var input = async (title) => {
  const { action } = await inquirer.prompt([
    {
      name: "action",
      type: "input",
      message: title
    }
  ]);
  return action;
};

// src/templates.ts
import path from "path";
import { writeFile, getProjectFile } from "@zdcode/utils";

// src/format.ts
function upperFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function lowerFirstLetter(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}
var formatFuns = {
  F: upperFirstLetter,
  f: lowerFirstLetter
};
var format = (str, params) => {
  let items = str.match(/(\$T\{)([A-Za-z | _])+(\})/g);
  if (!items)
    return str;
  items = Array.from(new Set(items));
  const options = items.map((item) => {
    const data = item.slice(3).slice(0, -1).split("|");
    return {
      content: item,
      formats: data.slice(0, -1),
      name: data.slice(-1)[0]
    };
  });
  options.forEach(({ content, formats, name }) => {
    const value = params[name];
    let res = value;
    for (const format2 of formats) {
      if (formatFuns[format2]) {
        res = formatFuns[format2](res);
      }
    }
    str = str.replace(new RegExp(content.replace("$", "\\$").replace("{", "\\{").replace("}", "\\}").replace("|", "\\|"), "g"), res);
  });
  console.log("str", str);
  return str;
};

// src/templates.ts
var createTemplates = (root, templates, params) => {
  for (const template of templates) {
    const name = format(template.name, params);
    if (template.files) {
      createTemplates(`${root}/${name}`, template.files, params);
      return;
    }
    if (template.template) {
      const templatePath = template.template;
      const templateContent = getProjectFile(`.templates/${templatePath}`);
      const formatTemplateContent = format(templateContent, params);
      writeFile(path.resolve(process.cwd(), `${root}/${name}`), formatTemplateContent);
    }
  }
};

// src/index.ts
var temp = (program) => {
  program.command("template").description("\u5FEB\u901F\u521B\u5EFA\u6A21\u677F\u6587\u4EF6").action(async () => {
    const templateConfig = getProjectJsonFile(".templates/template.json");
    const templateName = await selectList("\u8BF7\u9009\u62E9\u6A21\u677F", templateConfig.map(({ name }) => ({ name, value: name })));
    const templateOption = templateConfig.find(({ name }) => name === templateName);
    if (!templateOption)
      throw new Error("\u6A21\u677F\u5F02\u5E38\uFF01");
    const { params = [], root, templates } = templateOption;
    const paramsData = {};
    if (params.length) {
      for (const param of params) {
        const value = await input(`\u8BF7\u8F93\u5165 ${param}:`);
        paramsData[param] = value;
      }
    }
    createTemplates(root, templates, paramsData);
  });
};
var src_default = temp;
export {
  src_default as default
};
