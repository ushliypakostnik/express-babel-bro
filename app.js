import express from 'express';
import AdminBro from 'admin-bro';
import AdminBroExpress from '@admin-bro/express';

import cors from 'cors';

import config from './config';

const app = express();

// CORS
if (config.CORS_ENABLED) {
  const corsOptions = {
    credentials: true,
    origin: (origin, callback) => {
      callback(null, origin);
    },
  };

  app.use(cors(corsOptions));
}

const adminBro = new AdminBro({
  Databases: [],
  rootPath: '/admin',
});

const router = AdminBroExpress.buildRouter(adminBro);

app.use(adminBro.options.rootPath, router);

export default app;
