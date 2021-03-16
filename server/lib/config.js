const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();
console.log('path', process.env.CONFIG_PATH);
class Config {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      fs.readFile(process.env.CONFIG_PATH, 'utf-8', (err, data) => {
        if (err)reject(err);
        resolve({ ...JSON.parse(data), ...process.env });
      });
    });
    Object.entries(process.env)
      .forEach(([key, value]) => {
        Object.defineProperty(this, key, {
          get() { return value; },
        });
      });
  }

  getValue(path) {
    return this.promise.then((data) => {
      if (!path.length) return undefined;
      return path.split('.').reduce((result, word) => result[word], data);
    });
  }
}
const config = new Config();
export default config;
