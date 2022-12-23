import useSWR from 'swr'
import axios from 'axios'

type Page = {
  current: number;
  totalNum: number;
  totalPage: number;
  size: number;
}

interface Response<T = null> {
  message: string;
  code: number;
  data: T | undefined;
  page?: Page
}
interface PageResponse<T> extends Response<T[]> {
  current: number;
  totalNum: number;
  totalPage: number;
  size: number;
}

type Where<Table> = Record<string, string
| number
| {
    table?: Table
    mode?: 'AND' | 'OR'
    field?: string
    condition: '=' | '!=' | 'LIKE'
    value: unknown
    arrMode?: 'AND' | 'OR'
  }>

type GetProps<Table> = {
  table: Table
  where?: Where<Table> | Array<Where<Table> | 'AND' | 'OR'>
}

type AddProps<Table, T = any> = {
  table: Table
  data: T | T[]
  deep?: boolean
}

type PutProps<Table, T = any> = {
  table: Table
  where?: Where<Table> | Array<Where<Table> | 'AND' | 'OR'>
  data: T
}

const Querier = <Table>({ baseURL }: { baseURL: string }) => {
  const instance = axios.create({
    baseURL
  })

  instance.interceptors.response.use(
    (response) => response.data,
    (error) => {
      return Promise.reject({
        code: 0,
        message: "网络出现问题了~，请稍后重试",
      });
    }
  );
  
  const get = function <T = any>(params: GetProps<Table>): Response<T> {
    return instance.post<Response<T>>('/api/base/get', params) as unknown as Response<T>
  }

  const useGet = (table: Table, where: Where<Table>) => useSWR<Table[]>('useGet', async () => {
    const tableRes = await get<Table>({
      table,
      where
    })
    return tableRes.data
  })
  
  const list = function <T = any>(params: GetProps<Table>) {
    return instance.post<Response<T[]>>('/api/base/list', params) as unknown as Response<T[]>
  }

  const useList = (table: Table, where: Where<Table>) => useSWR<Table[]>('useTables', async () => {
    const tableRes = await list<Table>({
      table,
      where
    })
    return tableRes.data
  })

  const count = function <T = any>(params: GetProps<Table>) {
    return instance.post<Response<T>>('/api/base/count', params)
  }
  
  const add = function <T = any>(params: AddProps<T>) {
    return instance.post<Response<T & { id: string }>>(
      '/api/base/add',
      params
    )
  }
  
  const deepAdd = function <T = any>(params: AddProps<T>) {
    return instance.post<Response<T & { id: string }>>(
      '/api/base/deepAdd',
      params
    )
  }
  
  const put = function <T = any>(params: PutProps<T>) {
    return instance.put<Response<T>>('/api/base/put', params)
  }
  
  const del = function <T = any>(params: GetProps<Table>) {
    return instance.delete<Response<T>>('/api/base/del', {
      params,
    })
  }
  
  const remove = function <T = any>(params: GetProps<Table>) {
    return instance.delete<Response<T>>('/api/base/remove', {
      params,
    })
  }

  return { get, useGet, list, useList, count, add, deepAdd, put, del, remove }
}

export default Querier