import PASS from './pass';

const env = process.env.NODE_ENV;

if (env === 'production') {
  require('dotenv').config();
}

const common = {
  PORT: process.env.PORT || 8080,
  STATIC_SERVE: false,
  PASS: {
    DB: {
      url: process.env.DB_URL || PASS.DB.url,
    },
    COOKIES: process.env.COOKIES || PASS.COOKIES,
  },
};

const development = {
  ...common,
  HOST: process.env.HOST || 'http://localhost:8082',
  CORS_ENABLED: true,
};

const production = {
  ...common,
  HOST: process.env.HOST || '',
  CORS_ENABLED: false,
};

const config = {
  development,
  production,
};

export default config[env];
