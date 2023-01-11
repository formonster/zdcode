module.exports = {
  apps: [
    {
      name: 'tita-fe-docs',
      script: 'npm',
      args: "run serve",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '4G',
    }
  ]
}