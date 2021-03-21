import quickEncrypt from 'quick-encrypt';
import fs from 'fs';

const keys = quickEncrypt.generate(1024); // Use either 2048 bits or 1024 bits.

let persitantKeys = null;
fs.readFile(process.env.KEYS_PATH, (err, data) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.log('generate new one');
      persitantKeys = quickEncrypt.generate(1024); // Use either 2048 bits or 1024 bits.
      fs.writeFile(process.env.KEYS_PATH, JSON.stringify(persitantKeys), (err) => {
        if (err) throw err;
      });
      return;
    } throw err;
  }
  persitantKeys = JSON.parse(data);
});
/**
 *
 * @param {Object} options
 * @param {string} string to encrypt
 * @param {boolean}[false] use persistant or on the fly
 * @returns {string} encrypted
 */
export function encrypt({ message = '', persitant = false } = {}) {
  const key = persitant ? persitantKeys.public : keys.public;
  return quickEncrypt.encrypt(message, key);
}
export function decrypt({ message = '', persitant = false } = {}) {
  const key = persitant ? persitantKeys.private : keys.private;
  return quickEncrypt.decrypt(message, key);
}
