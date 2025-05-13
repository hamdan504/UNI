const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '.env') });

module.exports = {
  apps: [{
    name: "app",
    script: "./app.js",
    env: {
      NODE_ENV: "production",
      DB_HOST: process.env.DB_HOST,
      DB_PORT: process.env.DB_PORT,
      DB_USERNAME: process.env.DB_USERNAME,
      DB_PASSWORD: process.env.DB_PASSWORD,
      DB_NAME: process.env.DB_NAME
    },
    env_file: path.join(__dirname, '.env'),
    node_args: '--experimental-modules --es-module-specifier-resolution=node'
  }]
};
