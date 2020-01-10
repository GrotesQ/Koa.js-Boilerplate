'use strict';

// Load environment variables from .env file
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const configs = {
  base: {
    env,
    name: process.env.APP_NAME || 'app-name',
    host: process.env.APP_HOST || '0.0.0.0',
    port: process.env.APP_PORT || parseInt(Math.random() * 8000, 10) + 1000,
  },
  production: {
    port: process.env.APP_PORT || 8081,
  },
  development: {},
  test: {
    port: 8082,
  },
};

const config = Object.assign(configs.base, configs[env]);

module.exports = config;
