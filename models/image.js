import mongoose from 'mongoose';

const Image = new mongoose.Schema({
  key: String,
  type: String,
});

export default Image;
