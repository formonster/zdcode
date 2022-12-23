// src/array.ts
import { clone, flattenDeep } from "lodash";
var arr2Dic = function(arr = [], field, other) {
  let dic = {};
  if (Array.isArray(field)) {
    arr.forEach((vo) => {
      dic[vo[field[0]]] = other ? Object.assign(vo, clone(other)) : vo[field[1]];
    });
  } else {
    arr.forEach((vo) => {
      dic[vo[field]] = other ? Object.assign(vo, clone(other)) : vo;
    });
  }
  return dic;
};
var sortAsc = function(arr, field) {
  function compare(path2) {
    return function(a, b) {
      var value1 = path2 ? a[path2] : a;
      var value2 = path2 ? b[path2] : b;
      if (typeof value1 === "number" && typeof value2 === "number")
        return value1 - value2;
    };
  }
  return arr.sort(compare(field));
};
var sortDesc = function(arr, field) {
  function compare(path2) {
    return function(a, b) {
      var value1 = path2 ? a[path2] : a;
      var value2 = path2 ? b[path2] : b;
      if (typeof value1 === "number" && typeof value2 === "number")
        return value2 - value1;
    };
  }
  return arr.sort(compare(field));
};
var flattenDeepByField = (arr, field) => {
  const map = (item) => {
    if (!item[field])
      return item;
    return [item, item[field].map(map)];
  };
  return flattenDeep(arr.map(map));
};
var mapFields = (arr, fields) => {
  return arr.map((item) => {
    let res = {};
    fields.forEach((key) => {
      res[key] = item[key];
    });
    return res;
  });
};

// src/fs.ts
import path from "path";
import fs from "fs";
var getProjectFile = (file) => {
  const filePath = path.resolve(process.cwd(), file);
  return fs.readFileSync(filePath, { encoding: "utf-8" });
};
var getProjectJsonFile = (file) => {
  const filePath = path.resolve(process.cwd(), file);
  const content = fs.readFileSync(filePath, { encoding: "utf-8" });
  try {
    return JSON.parse(content);
  } catch (error) {
    return {};
  }
};
var checkExist = (path2) => {
  return new Promise((resolve, reject) => {
    fs.access(path2, (err) => {
      resolve(!err);
    });
  });
};
var writeFile = async (path2, content, basePath) => {
  const isExist = await checkExist(path2);
  if (isExist)
    return console.log("\u26A0\uFE0F \u6587\u4EF6\u5DF2\u5B58\u5728\uFF1A", path2);
  const pathArr = path2.split("/");
  const fileName = pathArr[pathArr.length - 1];
  const dirPath = path2.replace(RegExp(`${fileName}$`), "");
  await createDir(dirPath, { basePath });
  fs.writeFileSync(path2, content, "utf8");
};
var createDir = async (path2, options) => {
  let { basePath = "" } = options || {};
  if (!RegExp(`^${basePath}`).test(path2)) {
    console.warn("\u4F20\u5165\u591A\u8DEF\u5F84\u4E0D\u662F\u4EE5", basePath, "\u5F00\u5934\uFF0C\u914D\u7F6E\u65E0\u6548\uFF01");
  }
  const checkDirPath = path2.replace(basePath, "").replace(/^\//, "");
  const paths = checkDirPath.split("/");
  while (paths.length) {
    const path3 = paths.shift();
    const fullPath = `${basePath}/${path3}`;
    const isExist = await checkExist(fullPath);
    try {
      if (!isExist)
        fs.mkdirSync(fullPath);
    } catch (error) {
      if (error && error.message && !error.message.includes("file already exists")) {
        throw new Error(error);
      }
    } finally {
      basePath = fullPath;
    }
  }
};
var createFile = async (path2, file, basePath) => {
  const isExist = await checkExist(path2);
  if (isExist)
    return console.log("\u26A0\uFE0F \u6587\u4EF6\u5DF2\u5B58\u5728\uFF1A", path2);
  const pathArr = path2.split("/");
  const fileName = pathArr[pathArr.length - 1];
  const dirPath = path2.replace(RegExp(`${fileName}$`), "");
  await createDir(dirPath, { basePath });
  return new Promise((resolve, reject) => {
    const render = fs.createReadStream(file.path);
    const upStream = fs.createWriteStream(path2);
    render.pipe(upStream);
    let errFlag = false;
    upStream.on("error", (err) => {
      errFlag = true;
      upStream.destroy();
      reject(err);
    });
    upStream.on("finish", () => {
      if (errFlag)
        return;
      resolve("finish");
      upStream.close();
    });
  });
};

// src/promise.ts
var getPromiseData = (func) => {
  return func.then((res) => [res]).catch((err) => [null, err]);
};
var getSettledData = (result, throwError = true) => {
  if (result.status === "fulfilled") {
    return [result.value];
  } else {
    if (throwError)
      throw new Error(result.reason);
    return [null, result.reason];
  }
};
var getAllSettledPromiseData = (promiseSettledResult, throwError = true) => {
  return promiseSettledResult.map((item) => getSettledData(item, throwError));
};
export {
  arr2Dic,
  checkExist,
  createDir,
  createFile,
  flattenDeepByField,
  getAllSettledPromiseData,
  getProjectFile,
  getProjectJsonFile,
  getPromiseData,
  getSettledData,
  mapFields,
  sortAsc,
  sortDesc,
  writeFile
};
