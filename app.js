import express from 'express';
import mongoose from 'mongoose';
import AdminBro from 'admin-bro';
import AdminBroExpress from '@admin-bro/express';
import AdminBroMongoose from '@admin-bro/mongoose';
import uploadFeature from '@admin-bro/upload';
import bcrypt from 'bcrypt';

import cors from 'cors';

import config from './config';

import provider from './utils/upload';

import User from './models/user';
import Banner from './models/banner';

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

// Roles
const canModifyUsers = ({ currentAdmin }) => currentAdmin && currentAdmin.role === config.ROLE.admin;

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
    rootPath: config.ROOT_PATH,
    resources: [{
      resource: User,
      features: [uploadFeature({
        provider,
        properties: {
          key: 'image.key',
          file: 'image.file',
          mimeType: 'image.type',
        },
        validation: {
          mimeTypes: ['image/png', 'image/jpg', 'image/jpeg'],
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
          _id: {
            isVisible: false,
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
            isAccessible: canModifyUsers,
          },
          edit: { isAccessible: canModifyUsers },
          delete: { isAccessible: canModifyUsers },
        },
      },
    },
    {
      resource: Banner,
      options: {
        properties: {
          _id: {
            isVisible: false,
          },
          /*
          content: {
            components: {
              list: AdminBro.bundle('./components/Component'),
            },
          },
          */
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
    authenticate: async (email, password) => {
      const user = await User.findOne({ email });
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
  if (config.STATIC_SERVE) app.use(`${config.BUCKET}`, express.static(`${config.BUCKET}`.slice(1)));
};
run();

export default app;
