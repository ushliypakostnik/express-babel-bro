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
      /*
      content: {
        components: {
          list: AdminBro.bundle('./components/Component'),
        },
      },
      */
    },
  },
};

export default Banners;
