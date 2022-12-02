const fs = require('fs')
const dotenv = require('dotenv')

const envDevBuf = Buffer.from(fs.readFileSync('.env'))
const envProdBuf = Buffer.from(fs.readFileSync('.env.prod'))

const devConfig = dotenv.parse(envDevBuf)
const prodConfig = dotenv.parse(envProdBuf)

module.exports = {
  apps: [
    {
      name: 'koa-server',
      script: 'dist/index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '4G',
      env_production: prodConfig,
      env_dev: devConfig,
      env_prod: prodConfig,
    }
  ]
}