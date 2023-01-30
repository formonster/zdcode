// src/array.ts
import cloneDeep from "lodash/cloneDeep";
import flattenDeep from "lodash/flattenDeep";
function arr2Dic(arr = [], field, options = {}) {
  const { alwaysArray = false, withIndex = false } = options;
  let dic = {};
  arr.forEach((vo, i) => {
    if (withIndex)
      vo._index = i;
    if (dic[vo[field]]) {
      if (!Array.isArray(dic[vo[field]]))
        dic[vo[field]] = [dic[vo[field]]];
      dic[vo[field]].push(vo);
      return;
    }
    dic[vo[field]] = alwaysArray ? [vo] : vo;
  });
  return dic;
}
function arr2DicDeep(arr = [], field, childsKey, options = {}) {
  let dic = {};
  for (const currentitem of arr) {
    const item = { ...currentitem };
    if (item[childsKey] && Array.isArray(item[childsKey])) {
      item[childsKey] = arr2DicDeep(
        item[childsKey],
        field,
        childsKey,
        options
      );
    }
    dic[item[field]] = item;
  }
  return dic;
}
var deepMap = (arr, deepKey, map, parent = void 0, indexPath = []) => {
  const _arr = cloneDeep(arr);
  let i = 0;
  for (const item of _arr) {
    const currentIndexPath = [...indexPath, i];
    _arr[i] = map(item, parent, currentIndexPath);
    const childs = _arr[i][deepKey];
    if (childs && Array.isArray(childs)) {
      _arr[i][deepKey] = deepMap(
        _arr[i][deepKey],
        deepKey,
        map,
        _arr[i],
        currentIndexPath
      );
    }
    i++;
  }
  return _arr;
};
var findFirstLeaf = (arr, deepKey) => {
  let currentNode = arr[0];
  while (currentNode[deepKey]) {
    const childs = currentNode[deepKey];
    const next = childs[0];
    if (!next)
      return currentNode;
    currentNode = next;
  }
  return currentNode;
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

// src/string.ts
var isUpperCase = (str) => {
  const code = str[0].charCodeAt(0);
  return code >= 65 && code <= 90;
};
var isLowerCase = (str) => {
  const code = str[0].charCodeAt(0);
  return code >= 97 && code <= 122;
};

// src/format.ts
function upperFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function lowerFirstLetter(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}
var humpToChain = (str) => {
  return str.split("").map((char) => isUpperCase(char) ? `-${char.toLowerCase()}` : char).join("");
};

// src/object.ts
var record = (obj) => {
  return {
    diff: (newObj, retain) => {
      let res = {};
      if (retain)
        retain.forEach((key) => res[key] = newObj[key]);
      Object.entries(newObj).forEach(([key, value]) => {
        if (obj[key] === value)
          return;
        res[key] = value;
      });
      return res;
    },
    done: () => {
      obj = null;
    }
  };
};
export {
  arr2Dic,
  arr2DicDeep,
  checkExist,
  createDir,
  createFile,
  deepMap,
  findFirstLeaf,
  flattenDeepByField,
  getAllSettledPromiseData,
  getProjectFile,
  getProjectJsonFile,
  getPromiseData,
  getSettledData,
  humpToChain,
  isLowerCase,
  isUpperCase,
  lowerFirstLetter,
  mapFields,
  record,
  sortAsc,
  sortDesc,
  upperFirstLetter,
  writeFile
};
