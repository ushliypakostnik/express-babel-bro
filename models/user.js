import config from '../config';

import mongoose from 'mongoose';

const { Schema } = mongoose;

const Image = new mongoose.Schema({
  key: String,
  type: String,
});

const UserSchema = new Schema({
  email: {
    type: String,
    required: false,
  },
  encryptedPassword: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: [config.ROLE.admin, config.ROLE.user],
    required: true,
  },
  image: Image,
});

const User = mongoose.model('User', UserSchema);

export default User;
