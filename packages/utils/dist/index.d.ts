import { File } from 'formidable';

declare const arr2Dic: <T, K extends keyof T>(arr: T[] | undefined, field: K, other?: object) => {
    [name: string]: T;
};
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

export { CreateDirOption, arr2Dic, checkExist, createDir, createFile, flattenDeepByField, getAllSettledPromiseData, getProjectFile, getProjectJsonFile, getPromiseData, getSettledData, mapFields, sortAsc, sortDesc, writeFile };
