import useSWR from 'swr'
import axios, { CreateAxiosDefaults } from 'axios'

const Querier = (axiosDefault: CreateAxiosDefaults) => {
  const instance = axios.create(axiosDefault)

  instance.interceptors.response.use(
    (response) => response.data,
    (error) => {
      return Promise.reject({
        code: 0,
        message: "网络出现问题了~，请稍后重试",
      });
    }
  );

  return instance
}

export default Querier