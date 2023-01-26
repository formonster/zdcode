import { useEffect, useState } from 'react'
import axios, { CreateAxiosDefaults } from 'axios'

const Querier = (axiosDefault: CreateAxiosDefaults) => {
  const instance = axios.create(axiosDefault)

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      return Promise.reject({
        code: 0,
        message: "网络出现问题了~，请稍后重试",
      });
    }
  );

  return instance
}

export const useFetch = <T>(fetch: () => Promise<T>, defaultData: T, deps?: React.DependencyList | undefined) => {
  const [data, setData] = useState<T>(defaultData)
  const [loading, setLoading] = useState(true)

  const send = () => {
    setLoading(true)
    fetch().then(res => setData(res)).finally(() => setLoading(false))
  }
  useEffect(() => {
    send()
  }, deps)

  return { data, loading, refresh: send }
}

export default Querier