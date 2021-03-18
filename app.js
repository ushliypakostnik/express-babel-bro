import express from 'express';
import mongoose from 'mongoose';
import AdminBro from 'admin-bro';
import AdminBroExpress from '@admin-bro/express';
import AdminBroMongoose from '@admin-bro/mongoose';
import bcrypt from 'bcrypt';

import cors from 'cors';

import config from './config';

import User from './models/user';

import Users from './resources/users';
import Banners from './resources/banners';

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
    rootPath: config.ROOT_PATH,
    resources: [
      Users,
      Banners,
    ],
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
  if (config.STATIC_SERVE) app.use(`${config.BUCKET_ROOT}${config.BUCKET}`, express.static(`${config.BUCKET}`.slice(1)));
};
run();

export default app;
