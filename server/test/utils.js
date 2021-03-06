import fs from 'fs';
import { encrypt } from '../lib/utils/encrypt';

const chai = require('chai');

export function sendRequest({
  req, callback, method = 'get',
  payload = {},
}) {
  if (method !== 'get') {
    return new Promise((resolve, reject) => {
      chai.request(app)
        [method](req)
        .set('authorization', 'token')
        .send(payload)
        .end((err, res) => {
          resolve(callback ? callback(err, res) : () => {});
        });
    });
  }
  return new Promise((resolve, reject) => {
    chai.request(app)
      .get(req)
      .set('authorization', 'token')
      .end((err, res) => {
        resolve(callback(err, res));
      });
  });
}

export function createUsers(options = {}, us = []) {
  return {
    users: [
      {
        firstname: encrypt({ message: 'firstname', persistant: true }),
        lastname: encrypt({ message: 'lastname', persistant: true }),
        email: encrypt({ message: 'test@mail.com', persistant: true }),
        isAdmin: true,
        token: 'token',
        badges: [],
        groups: [],
        id: 'idUser1',
        password: encrypt({ message: 'password', persistant: true }),
        ...options,
      },
      ...us.map((user, i) => (
        {
          id: `idUser${i + 2}`,
          ...user,
          ...['firstname', 'lastname', 'email', 'password'].reduce((acc, key) => {
            acc[key] = encrypt({ message: user[key] || `${key}-${i}`, persistant: true });
            return acc;
          }, {}),
        }
      )),
    ],
  };
}

export function createSchedules(options = {}) {
  return {
    schedules: [
      {
        name: 'schedule 1',
        days: new Array(7).fill(0).map(() => ({ alLDay: true })),
        ...options,
      },
    ],
  };
}

export function writeDb(db) {
  return new Promise((resolve, reject) => {
    fs.writeFile(process.env.DB_PATH, JSON.stringify(db), (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}
