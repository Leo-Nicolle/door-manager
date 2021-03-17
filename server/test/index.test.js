import { encrypt, decrypt } from '../lib/utils/encrypt';

const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');

chai.use(chaiHttp);

const { expect } = chai;

function createDb() {
  const db = {
    users: [
      {
        firstname: encrypt({ message: 'firstname', persistant: true }),
        lastname: encrypt({ message: 'lastname', persistant: true }),
        email: encrypt({ message: 'test@mail.com', persistant: true }),
        isAdmin: true,
        token: 'token',
        badges: [],
        groups: [],
        password: encrypt({ message: 'password', persistant: true }),
      },
    ],
  };
  return new Promise((resolve, reject) => {
    fs.writeFile(process.env.DB_PATH, JSON.stringify(db), (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}
let app;
function sendRequest({
  req, callback, token = true, method = 'get',
  payload = {},
}) {
  if (method !== 'get') {
    return new Promise((resolve, reject) => {
      chai.request(app)
        [method](req)
        .set('authorization', 'token')
        .send(payload)
        .end((err, res) => {
          resolve(callback(err, res));
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

describe('Users', () => {
  before((done) => {
    createDb().then(() => {
      app = require('../dist/server');
      done();
    });
  });

  // Test to get all students record
  it('should send all the users', (done) => {
    sendRequest({
      req: '/user',
      callback: (err, res) => {
        expect(res).to.have.status(200);
        expect(err).to.be.null;
        expect(res.body).to.have.length(1);
        done();
      },
    });
  });

  it('should add a user', (done) => {
    sendRequest({
      req: '/user',
      method: 'post',
      payload: {
        firstname: encrypt({ message: 'firstname2', persistant: true }),
        lastname: encrypt({ message: 'lastname2', persistant: true }),
        isAdmin: false,
        email: '',
        groups: [],
        badges: [],
      },
      callback: (err, res) => {
        expect(res).to.have.status(200);
        expect(err).to.be.null;
      },
    }).then(() => {
      sendRequest({
        req: '/user',
        callback: (err, res) => {
          expect(res).to.have.status(200);
          expect(err).to.be.null;
          expect(res.body).to.have.length(2);
          done();
        },
      });
    });
  });

  it('should modify a user', (done) => {
    sendRequest({
      req: '/user',
      callback: (err, res) => {
        expect(res.body).to.have.length(2);
        return res.body[1];
      },
    }).then((user) => sendRequest({
      req: '/user',
      method: 'post',
      payload: {
        ...user,
        lastname: encrypt({ message: 'newLastName', persistant: true }),
      },
      callback: (err, res) => {
        expect(res).to.have.status(200);
        expect(err).to.be.null;
        return user;
      },
    }))
      .then(({ id }) => {
        sendRequest({
          req: `/user/${id}`,
          callback: (err, res) => {
            expect(decrypt({ message: res.body.lastname, persistant: true }))
              .to.be.equal('newLastName');
            done();
          },
        });
      });
  });

  it('should delete a user', (done) => {
    sendRequest({
      req: '/user',
      callback: (err, res) => {
        expect(res.body).to.have.length(2);
        return res.body[1];
      },
    })
      .then((user) => sendRequest({
        req: `/user/${user.id}`,
        method: 'delete',
        callback: (err, res) => {
          expect(res).to.have.status(200);
          expect(err).to.be.null;
          return user;
        },
      }))
      .then(() => {
        sendRequest({
          req: '/user',
          callback: (err, res) => {
            expect(res.body).to.have.length(1);
            done();
          },
        });
      });
  });
});
