import express from 'express';
import mongoose from 'mongoose';
import AdminBro from 'admin-bro';
import AdminBroExpress from '@admin-bro/express';
import AdminBroMongoose from '@admin-bro/mongoose';
import uploadFeature from '@admin-bro/upload';
import bcrypt from 'bcrypt';

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
    resources: [{
      resource: User,
      features: [uploadFeature({
        provider: { local: { bucket: 'public' } },
        properties: {
          key: 'fileKey',
          mimeType: ['image/jpeg', 'image/jpg', 'image/png'],
        },
      })],
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
                const email = request.payload.email.length === 0 ? '???????' : request.payload.email;
                request.payload = {
                  ...request.payload,
                  email,
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
      companyName: config.TITLE,
      softwareBrothers: false,
    },
    dashboard: {
      handler: async () => ({ header: 'Test admin panel!!!' }),
      component: AdminBro.bundle('./components/Dashboard'),
    },
    pages: {
      page1: {
        label: 'Custom page 1',
        component: AdminBro.bundle('./components/Page'),
      },
    },
    version: {
      admin: false,
      app: config.VERSION,
    },
  });
  AdminBro.bundle('./components/UserMenu', 'LoggedIn');

  // const router = AdminBroExpress.buildRouter(adminBro);
  const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
    authenticate: async (name, password) => {
      const user = await User.findOne({ name });
      if (user) {
        const matched = await bcrypt.compare(password, user.encryptedPassword);
        if (matched) return user;
      }
      return false;
    },
    cookieName: 'adminbro',
    cookiePassword: config.PASS.COOKIES,
  });

  app.use(adminBro.options.rootPath, router);
  app.use('/public', express.static('public'));
};
run();

export default app;
