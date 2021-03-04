const env = process.env.NODE_ENV;

if (env === 'production') {
  require('dotenv').config();
}

const common = {
  PORT: process.env.PORT || 8082,
  MEDIA_DIR: process.env.MEDIA_DIR || 'media',
  STATIC_SERVE: false,
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
