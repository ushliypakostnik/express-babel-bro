import express from 'express';
import mongoose from 'mongoose';
import AdminBro from 'admin-bro';
import AdminBroExpress from '@admin-bro/express';
import AdminBroMongoose from '@admin-bro/mongoose';
import bcrypt from 'bcrypt';

import cors from 'cors';

import config from './config';

import User from './models/user';

const app = express();

/*
// Session config
app.use(session({
  secret: config.PASS.COOKIES,
  cookie: { maxAge: 60000 },
  resave: false,
  rolling: true,
  saveUninitialized: false,
}));
*/

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
    resources: [{
      resource: User,
      options: {
        properties: {
          encryptedPassword: {
            isVisible: false,
          },
          password: {
            type: 'string',
            isVisible: {
              list: false,
              edit: true,
              filter: false,
              show: false,
            },
          },
        },
        actions: {
          new: {
            before: async (request) => {
              if (request.payload.password) {
                request.payload = {
                  ...request.payload,
                  encryptedPassword: await bcrypt.hash(request.payload.password, 10),
                  password: undefined,
                };
              }
              return request;
            },
          },
        },
      },
    }],
    branding: {
      companyName: 'Test Company Name',
      softwareBrothers: false,
    },
    dashboard: {
      handler: async () => ({ header: 'Test admin panel!!!' }),
      component: AdminBro.bundle('./components/Dashboard.jsx'),
    },
    version: {
      admin: false,
      app: '0.0.1',
    },
  });

  const router = AdminBroExpress.buildRouter(adminBro);
  app.use(adminBro.options.rootPath, router);
};
run();

export default app;
