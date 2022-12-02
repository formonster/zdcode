import { Page, Response } from '../types/IData';
import fs from 'fs';

export const resSuccess = <T>(data: T, message: string = "success"): Response<T> => {
    return { message, code: 200, data }
}

export const resWarning = <T>(message: string, code = 201, data?: T): Response<T> => {
    return { message, code, data }
}

export const resSuccessPage = <T>(data: T, page: Page): Response<T> => {
    return { message: "success", code: 200, data, page }
}
export const resError = (msg: string): Response<any> => {
    return { message: msg, code: 500, data: null }
}
export function sleep(time: number): Promise<void> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, time)
    })
}



/**
 * 读取路径信息
 * @param {string} path 路径
 */
 function getStat(path: fs.PathLike) {
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stats) => {
       
            if (err) {
                resolve(false);
            } else {
                resolve(stats);
            }
        })
    })
}
  

/**
* 路径是否存在，不存在则创建
* @param {string} dir 路径
*/

export const dirExists = async(dir: string) => {
    let isExists = await getStat(dir);
    //如果该路径且不是文件，返回true
    if (isExists) {
      return true;
    } else {
      //如果该路径存在但是文件，返回false
        let mkdirStatus;

        mkdirStatus = await mkdir(dir);
        
        return mkdirStatus;
    }

       
    }




/**
  * 创建路径
  * @param {string} dir 路径
  */
 function mkdir(dir: fs.PathLike) {
    return new Promise((resolve, reject) => {
      fs.mkdir(dir, err => {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      })
    })
  }
  