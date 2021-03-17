import config from '../config';

import mongoose from 'mongoose';

const { Schema } = mongoose;

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
  avatar: {
    type: String,
    required: false,
  },
});

const User = mongoose.model('User', UserSchema);

export default User;
