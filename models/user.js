import mongoose from 'mongoose';

// User Model

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true, },
  surname: { type: String, required: true, },
  email: { type: String || null, default: null },
});

const User = mongoose.model('User', UserSchema);

export default User;
