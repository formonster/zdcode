#!/usr/bin/env node

// src/index.ts
import { Command } from "commander";

// src/modules/template/index.ts
import chalk3 from "chalk";
import { getProjectJsonFile } from "@zdcode/utils";

// src/utils/inquirer.ts
import inquirer from "inquirer";
async function selectList(title, data) {
  const { action } = await inquirer.prompt([
    {
      name: "action",
      type: "list",
      message: title,
      choices: data.map((item) => {
        if (typeof item === "string")
          return { name: item, value: item };
        return item;
      })
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
var confirm = async (title, defaultValue) => {
  const { action } = await inquirer.prompt([
    {
      name: "action",
      type: "confirm",
      message: title,
      default: defaultValue
    }
  ]);
  return action;
};

// src/modules/template/templates.ts
import fs from "fs";
import path from "path";
import chalk2 from "chalk";
import { writeFile, getProjectFile } from "@zdcode/utils";

// src/modules/template/format.ts
import { humpToChain, lowerFirstLetter, upperFirstLetter } from "@zdcode/utils";
var formatFuns = {
  F: upperFirstLetter,
  f: lowerFirstLetter,
  "-": humpToChain
};
var replace = (str, target, value) => str.replace(new RegExp(target.replace("$", "\\$").replace("{", "\\{").replace("}", "\\}").replace("|", "\\|"), "g"), value);
var format = (str, params) => {
  let items = str.match(/(\$T\{)([A-Za-z|_|:|-])+(\})/g);
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
    if (!value)
      return;
    let res = value;
    for (const format2 of formats) {
      if (formatFuns[format2]) {
        res = formatFuns[format2](res);
      }
    }
    str = replace(str, content, res);
  });
  return str;
};

// src/modules/template/templates.ts
var createTemplates = async (root, templates, params) => {
  for (const template of templates) {
    const templateRoot = template.root;
    const name = template.name && format(template.name, params);
    const filePath = [root, templateRoot, name].filter(Boolean).join("/").replace(/\/\//g, "/");
    if (template.files) {
      await createTemplates(filePath, template.files, params);
      continue;
    }
    if (template.type === "replace") {
      const { replaceFile, replaceOptions } = template;
      if (!replaceFile || !replaceOptions)
        continue;
      const replaceFilePath = path.join(filePath, replaceFile);
      const replaceFileContent = getProjectFile(replaceFilePath);
      for (const replaceOption of replaceOptions) {
        const { target, template: template2, content } = replaceOption;
        if (!target)
          throw new Error("\u8BF7\u6307\u5B9A\u8981\u66FF\u6362\u5185\u5BB9\u7684\u6587\u4EF6\u8DEF\u5F84\uFF01");
        if (!template2 && !content)
          throw new Error("\u8BF7\u6307\u5B9A\u8981\u66FF\u6362\u7684\u5185\u5BB9\uFF01");
        const templateContent = getProjectFile(`.templates/${template2}`);
        const replaceTarget = format(target, params);
        const newContent = replace(replaceFileContent, `// $T{${replaceTarget}}`, `// $T{${replaceTarget}}
${format(templateContent, params)}`);
        fs.writeFileSync(replaceFilePath, newContent, "utf8");
      }
      console.log("\u{1F389}", chalk2.blue("replace"), chalk2.gray(replaceFilePath));
    }
    if (template.template) {
      const templatePath = template.template;
      const templateContent = getProjectFile(`.templates/${templatePath}`);
      const formatTemplateContent = format(templateContent, params);
      await writeFile(path.resolve(process.cwd(), filePath), formatTemplateContent);
      console.log("\u{1F389}", chalk2.blue("create "), chalk2.gray(filePath));
    }
  }
};

// src/modules/template/index.ts
var temp = (program2) => {
  program2.command("template").description("\u5FEB\u901F\u521B\u5EFA\u6A21\u677F\u6587\u4EF6").action(async () => {
    const templateConfig = getProjectJsonFile(".templates/template.json");
    const templateName = await selectList("\u8BF7\u9009\u62E9\u6A21\u677F", templateConfig.map(({ name }) => ({ name, value: name })));
    const templateOption = templateConfig.find(({ name }) => name === templateName);
    if (!templateOption)
      throw new Error("\u6A21\u677F\u5F02\u5E38\uFF01");
    const { params = [], root, templates } = templateOption;
    const paramsData = {};
    if (params.length) {
      for (const param of params) {
        if (typeof param === "string") {
          const value = await input(`\u8BF7\u8F93\u5165 ${param}:`);
          paramsData[param] = value;
        }
        if (Array.isArray(param)) {
          const [name, option] = param;
          if (typeof option === "string") {
            const type = option;
            if (type === "boolean") {
              const value = await confirm(`${name}?`);
              paramsData[name] = value;
            }
          }
          if (Array.isArray(option)) {
            const selectOptions = option;
            const value = await selectList(`\u8BF7\u9009\u62E9 ${name}`, selectOptions.map((name2) => ({ name: name2, value: name2 })));
            paramsData[name] = value;
          }
        }
      }
    }
    console.log("");
    console.log("\u{1F433}", chalk3.gray("\u5F00\u59CB\u751F\u6210\u6A21\u677F\u6587\u4EF6"));
    console.log("");
    await createTemplates(root, templates, paramsData);
    console.log("");
    console.log("\u{1F433}", chalk3.green("success!"));
    console.log("");
  });
};
var template_default = temp;

// src/modules/frame/index.ts
import path2 from "path";
import chalk4 from "chalk";
import fs2 from "fs";
import { list, responseError } from "@zdcode/superdb";
import { arr2Dic } from "@zdcode/utils";
import "zx/globals";

// src/modules/frame/action.ts
var createProject = async (root, projectName, frame) => {
  const cwd = process.cwd();
  const projectPath = `${root}/${projectName}`;
  console.log("");
  console.log("\u{1F433}", chalk.gray("\u60A8\u7684\u9879\u76EE\u8DEF\u5F84\u4E3A:"), chalk.yellow(projectPath));
  console.log("");
  await cd(root);
  await $`git clone -b ${frame.branch} ${frame.git_url} ${projectName}`;
  await $`rm -rf ${projectPath}/.git`;
  if (frame.whether_init_git) {
    await $`git init`;
    await $`git add .`;
    await $`git commit -m first commit`;
    await $`git branch -M main`;
  }
  await cd(cwd);
};
async function initDependency(projectPath) {
  const cwd = process.cwd();
  const action = await selectList("\u8BF7\u4F60\u9009\u62E9\u5305\u7BA1\u7406\u5DE5\u5177:", ["pnpm", "yarn", "npm"]);
  await cd(projectPath);
  await $`pwd`;
  try {
    await $`${action} install`;
  } catch (p) {
  }
  await cd(cwd);
  console.log(
    "\n\u{1F433}",
    chalk.yellowBright(projectPath),
    chalk.green(`\u521D\u59CB\u5316\u5B8C\u6210`)
  );
  console.log("\n\u{1F433}", chalk.yellowBright("$"), chalk.gray(`cd ${projectPath}`));
  console.log(
    "\u{1F433}",
    chalk.yellowBright("$"),
    chalk.gray("yarn dev")
  );
  console.log();
}

// src/modules/frame/index.ts
var frames = (program2) => {
  program2.command("create <project-name>").description("\u5FEB\u901F\u521B\u5EFA\u811A\u624B\u67B6").action(async (projectName, options) => {
    const cwd = options.cwd || process.cwd();
    const targetDir = path2.resolve(cwd, projectName || ".");
    if (fs2.existsSync(targetDir)) {
      console.log("\u274C", chalk4.red("\u76EE\u5F55\u5DF2\u5B58\u5728\uFF01"));
      process.exit(1);
    }
    console.log("");
    console.log("\u{1F433}", chalk4.gray("\u60A8\u7684\u9879\u76EE\u540D:"), chalk4.yellow(projectName));
    console.log("");
    const frameTypeRes = await list("frame_type");
    if (responseError(frameTypeRes))
      throw new Error("\u67E5\u8BE2\u811A\u624B\u67B6\u7C7B\u578B\u5931\u8D25\uFF01");
    const frameTypes = frameTypeRes.data || [];
    const frameTypesDic = arr2Dic(frameTypes, "name");
    const type = await selectList("\u8BF7\u9009\u62E9\u6A21\u677F", frameTypes.map(({ name }) => ({ name, value: name })));
    const frameType = frameTypesDic[type];
    const frameListRes = await list("frames", {
      where: { type: frameType.id }
    });
    if (responseError(frameListRes))
      throw new Error("\u67E5\u8BE2\u811A\u624B\u67B6\u5217\u8868\u5931\u8D25\uFF01");
    const frameList = frameListRes.data || [];
    const frameListDic = arr2Dic(frameList, "name");
    const frameName = await selectList("\u8BF7\u9009\u62E9\u811A\u624B\u67B6", frameList.map(({ name }) => ({ name, value: name })));
    const frame = frameListDic[frameName];
    const projectPath = `${frameType.root}/${projectName}`;
    await createProject(frameType.root, projectName, frame);
    await initDependency(projectPath);
  });
};
var frame_default = frames;

// package.json
var package_default = {
  name: "@zdcode/cli",
  version: "2.2.3",
  description: "",
  type: "module",
  main: "dist/index.mjs",
  types: "dist/index.d.ts",
  scripts: {
    dev: "tsup --watch",
    prepublish: "pnpm run build",
    build: "tsup"
  },
  keywords: [],
  author: "",
  license: "ISC",
  bin: {
    zdcode: "./dist/index.mjs",
    zd: "./dist/index.mjs"
  },
  files: [
    "dist"
  ],
  publishConfig: {
    registry: "http://43.143.167.128:4000/"
  },
  dependencies: {
    "@zdcode/superdb": "workspace:^1.0.0",
    "@zdcode/tsconfig": "workspace:^1.0.0",
    "@zdcode/utils": "workspace:^2.1.0",
    chalk: "^5.2.0",
    commander: "^9.4.1",
    inquirer: "^9.1.4",
    lodash: "^4.17.21",
    tsconfig: "^7.0.0",
    tsup: "^6.5.0",
    zx: "^7.1.1"
  },
  devDependencies: {
    "@types/inquirer": "^9.0.3",
    "@types/lodash": "^4.14.191",
    "@types/node": "^18.11.12",
    typescript: "^4.9.4"
  }
};

// src/index.ts
var program = new Command();
template_default(program);
frame_default(program);
program.version(
  package_default.version,
  "-v, --version",
  "output the current version"
);
program.parse(process.argv);
