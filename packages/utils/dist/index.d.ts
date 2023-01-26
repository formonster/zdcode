import { File } from 'formidable';

declare function arr2Dic<T extends Record<string, any>, K extends keyof T, A extends boolean>(arr: T[] | undefined, field: K, options?: {
    alwaysArray?: A;
    withIndex?: boolean;
}): A extends true ? Record<string, (T & {
    _index?: number;
})[]> : Record<string, (T & {
    _index?: number;
})>;
declare function arr2DicDeep<T extends Record<string, any>, K extends keyof T, A extends boolean>(arr: T[] | undefined, field: K, childsKey: K, options?: {
    alwaysArray?: A;
}): A extends true ? Record<string, T[]> : Record<string, T>;
declare const deepMap: <T extends unknown, K extends keyof T>(arr: T[], deepKey: K, map: (data: T, parent: T | undefined, indexPath: number[]) => any, parent?: T | undefined, indexPath?: number[]) => T[];
declare const findFirstLeaf: <T extends unknown, K extends keyof T>(arr: T[], deepKey: K) => T;
declare const sortAsc: <T, K extends keyof T>(arr: T[], field: K) => T[];
declare const sortDesc: <T, K extends keyof T>(arr: T[], field: K) => T[];
declare const flattenDeepByField: (arr: any[], field: string) => any[];
declare const mapFields: <T, K extends keyof T>(arr: T[], fields: K[]) => Partial<Record<K, T[K]>>[];

declare const getProjectFile: (file: string) => string;
declare const getProjectJsonFile: (file: string) => any;
declare const checkExist: (path: string) => Promise<unknown>;
type CreateDirOption = {
    basePath?: string;
};
declare const writeFile: (path: string, content: string, basePath?: string) => Promise<void>;
declare const createDir: (path: string, options?: CreateDirOption) => Promise<void>;
declare const createFile: (path: string, file: File, basePath?: string) => Promise<unknown>;

declare const getPromiseData: <T extends unknown>(func: Promise<T>) => Promise<[T] | [null, string]>;
declare const getSettledData: <T>(result: PromiseSettledResult<T>, throwError?: boolean) => any[];
declare const getAllSettledPromiseData: <T>(promiseSettledResult: PromiseSettledResult<T>[], throwError?: boolean) => any[][];

declare const isUpperCase: (str: string) => boolean;
declare const isLowerCase: (str: string) => boolean;

declare function upperFirstLetter(str: string): string;
declare function lowerFirstLetter(str: string): string;
/**
 * 将驼峰形式的字符串转为链式的
 * @param str 字符串
 */
declare const humpToChain: (str: string) => string;

export { CreateDirOption, arr2Dic, arr2DicDeep, checkExist, createDir, createFile, deepMap, findFirstLeaf, flattenDeepByField, getAllSettledPromiseData, getProjectFile, getProjectJsonFile, getPromiseData, getSettledData, humpToChain, isLowerCase, isUpperCase, lowerFirstLetter, mapFields, sortAsc, sortDesc, upperFirstLetter, writeFile };
