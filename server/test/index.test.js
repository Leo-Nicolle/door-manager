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
  req, callback, token = true, post = false,
  payload = {},
}) {
  if (post) {
    return chai.request(app)
      .post(req)
      .set('authorization', 'token')
      .send(payload)
      .end(callback);
  }
  return chai.request(app)
    .get(req)
    .set('authorization', 'token')
    .end(callback);
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
      post: true,
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
        sendRequest({
          req: '/user',
          callback: (err, res) => {
            expect(res).to.have.status(200);
            expect(err).to.be.null;
            expect(res.body).to.have.length(2);
            done();
          },
        });
      },
    });
  });
});
