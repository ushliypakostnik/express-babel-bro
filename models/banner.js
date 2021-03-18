import mongoose from 'mongoose';

import Image from './image';

const BannerSchema = new mongoose.Schema({
  order: {
    type: Number,
    required: false,
  },
  image: Image,
});

const Banner = mongoose.model('Banner', BannerSchema);

export default Banner;
