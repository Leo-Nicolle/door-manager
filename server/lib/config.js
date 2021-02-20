const fs = require('fs');

class Config {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      fs.readFile('./config.json', 'utf-8', (err, data) => {
        if (err)reject(err);
        resolve(JSON.parse(data));
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
