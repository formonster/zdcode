import path from 'path'
import fs from 'fs'
import { File } from 'formidable';

export const getProjectFile = (file: string) => {
  const filePath = path.resolve(process.cwd(), file);
  return fs.readFileSync(filePath, { encoding: 'utf-8' })
}
export const getProjectJsonFile = (file: string) => {
  const filePath = path.resolve(process.cwd(), file);
  const content = fs.readFileSync(filePath, { encoding: 'utf-8' })
  try {
    return JSON.parse(content)
  } catch (error) {
    return {}
  }
}

export const checkExist = (path: string) => {
  return new Promise((resolve, reject) => {
      fs.access(path, (err) => {
          resolve(!err)
      })
  });
}
export type CreateDirOption = {
  // 基础路径，默认肯定存在，不会进行检测
  basePath: string
}

export const writeFile = async (path: string, content: string, basePath?: string) => {
  const isExist = await checkExist(path);
  if (isExist) return console.log("⚠️ 文件已存在：", path);

  const pathArr = path.split('/')
  const fileName = pathArr[pathArr.length - 1];
  const dirPath = path.replace(RegExp(`${fileName}$`), '')

  await createDir(dirPath, { basePath })

  fs.writeFileSync(path, content, 'utf8');
}
export const createDir = async (path: string, options?: CreateDirOption) => {
  let { basePath = '' } = options || {};
  if (!RegExp(`^${basePath}`).test(path)) {
      console.warn('传入多路径不是以', basePath, '开头，配置无效！');
  }
  const checkDirPath = path.replace(basePath, '').replace(/^\//, '');
  const paths = checkDirPath.split('/');

  while (paths.length) {
      const path = paths.shift();
      const fullPath = `${basePath}/${path}`
      const isExist = await checkExist(fullPath);
      try {
          if (!isExist) fs.mkdirSync(fullPath)
      } catch (error) {
          if (error && error.message && !error.message.includes('file already exists')) {
              throw new Error(error)
          }
      } finally {
          basePath = fullPath
      }
  }
}
export const createFile = async (path: string, file: File, basePath?: string) => {
  const isExist = await checkExist(path);
  if (isExist) return console.log("⚠️ 文件已存在：", path);

  const pathArr = path.split('/')
  const fileName = pathArr[pathArr.length - 1];
  const dirPath = path.replace(RegExp(`${fileName}$`), '')

  await createDir(dirPath, { basePath })

  return new Promise((resolve, reject) => {
      const render = fs.createReadStream(file.path);
      const upStream = fs.createWriteStream(path);
      render.pipe(upStream);

      let errFlag = false;
      upStream.on('error', err => {
          errFlag = true;
          upStream.destroy();
          reject(err);
      })
      upStream.on('finish', () => {
          if (errFlag) return;
          resolve("finish")
          upStream.close();
      })
  });
}
