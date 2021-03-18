import AdminBro from 'admin-bro';
import uploadFeature from '@admin-bro/upload';

import provider from '../utils/upload';

import Banner from '../models/banner';

const Banners = {
  resource: Banner,
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
      _id: {
        isVisible: false,
      },
      image: {
        components: {
          list: AdminBro.bundle('../components/Image'),
          show: AdminBro.bundle('../components/Image'),
        },
      },
    },
  },
};

export default Banners;
