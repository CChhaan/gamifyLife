module.exports = {
  apps: [
    {
      name: 'gamifylife-api',
      script: 'dist/index.js',
      env: {
        NODE_ENV: process.env.NODE_ENV || 'development'
      },
      watch: false,
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      min_uptime: 5000
    },
    {
      name: 'gamifylife-cron',
      script: 'dist/cron/job.js',
      env: {
        NODE_ENV: process.env.NODE_ENV || 'development'
      },
      watch: false,
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      min_uptime: 5000
    }
  ]
};