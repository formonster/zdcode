"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);
var import_utils2 = require("@zdcode/utils");

// src/inquirer.ts
var import_inquirer = __toESM(require("inquirer"));
async function selectList(title, data) {
  const { action } = await import_inquirer.default.prompt([
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
  const { action } = await import_inquirer.default.prompt([
    {
      name: "action",
      type: "input",
      message: title
    }
  ]);
  return action;
};

// src/templates.ts
var import_path = __toESM(require("path"));
var import_utils = require("@zdcode/utils");

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
      const templateContent = (0, import_utils.getProjectFile)(`.templates/${templatePath}`);
      const formatTemplateContent = format(templateContent, params);
      (0, import_utils.writeFile)(import_path.default.resolve(process.cwd(), `${root}/${name}`), formatTemplateContent);
    }
  }
};

// src/index.ts
var temp = (program) => {
  program.command("template").description("\u5FEB\u901F\u521B\u5EFA\u6A21\u677F\u6587\u4EF6").action(async () => {
    const templateConfig = (0, import_utils2.getProjectJsonFile)(".templates/template.json");
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
