export type Page = {
    current: number;
    totalNum: number;
    totalPage: number;
    size: number;
}

export interface Response<T = null> {
    message: string;
    code: number;
    data: T | undefined;
    page?: Page
}
export interface PageResponse<T> extends Response<T[]> {
    current: number;
    totalNum: number;
    totalPage: number;
    size: number;
}