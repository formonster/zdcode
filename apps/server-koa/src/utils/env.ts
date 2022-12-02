import dotenv from 'dotenv'

export const initEnv = () => {
  let path = '.env'
  if (process.env.NODE_ENV !== 'dev') {
    path = `.env.${process.env.NODE_ENV}`
  }
  if (!process.env.NODE_ENV) {
    path = '.env.prod'
  }
  // 加载 .env 环境变量
  dotenv.config({ path })
}