import mongoose from 'mongoose';

// User Model

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  encryptedPassword: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'restricted'],
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
});

const User = mongoose.model('User', UserSchema);

export default User;
