module.exports = {
  apps: [{
    name: 'backend',
    script: './backend/app.js',
    env: {
      NODE_ENV: 'production',
      PORT: 3005
    },
    wait_ready: true,
    kill_timeout: 3000
  }, {
    name: 'frontend',
    script: './frontend/server.js',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      BACKEND_URL: 'http://3.89.226.26:3005'
    },
    wait_ready: true,
    kill_timeout: 3000
  }]
};
