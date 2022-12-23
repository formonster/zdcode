import useSWR from 'swr'
import fetch from '@/utils/fetch'

/**
 * 待定
 */
export type FetchKey = '/api/base/get' | '/api/base/list' | '/api/base/count' | '/api/base/add'
export const useFetch = async (key: FetchKey) => {
  switch (key) {
    case '/api/base/get':
      const tableRes = await fetch.get({
        table: 'tables',
        where: {
          // name: tableName,
        },
      })
  }
}