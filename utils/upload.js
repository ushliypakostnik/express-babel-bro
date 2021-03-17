import fs from 'fs';
import { BaseProvider } from '@admin-bro/upload';
import path from 'path';

import config from '../config';

class MyProvider extends BaseProvider {
  constructor() {
    super(`${config.BUCKET_ROOT}${config.BUCKET}`);
  }

  async upload(file, key) {
    const filePath = this.path(key);
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    await fs.promises.rename(file.path, filePath);
  }

  async delete(key, bucket) {
    await fs.promises.unlink(this.path(key, bucket));
  }

  path(key) {
    return `${path.join(`${config.BUCKET}`, key)}`;
  }
}

const provider = new MyProvider();

export default provider;
