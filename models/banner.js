import mongoose from 'mongoose';

const { Schema } = mongoose;

const BannerSchema = new Schema({
  order: {
    type: Number,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
});

const Banner = mongoose.model('Banner', BannerSchema);

export default Banner;
