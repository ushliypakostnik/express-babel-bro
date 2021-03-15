import express from 'express';
import mongoose from 'mongoose';
import AdminBro from 'admin-bro';
import AdminBroExpress from '@admin-bro/express';
import AdminBroMongoose from '@admin-bro/mongoose';

import cors from 'cors';

import config from './config';

import User from './models/user';

const app = express();

AdminBro.registerAdapter(AdminBroMongoose);

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

// db url
const mongoDB = process.env.MONGOLAB_URI || config.PASS.DB.url;

// Admin Bro

const run = async () => {
  const connection = await mongoose.connect(mongoDB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  const adminBro = new AdminBro({
    Databases: [connection],
    rootPath: '/admin',
    resources: [User],
    branding: {
      companyName: 'Test Company Name',
    },
    dashboard: {
      handler: async () => ({ header: 'Test admin panel!!!' }),
      component: AdminBro.bundle('./components/Dashboard.jsx'),
    },
  });

  const router = AdminBroExpress.buildRouter(adminBro);
  app.use(adminBro.options.rootPath, router);
};
run();

export default app;
