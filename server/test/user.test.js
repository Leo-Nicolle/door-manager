import { encrypt, decrypt } from '../lib/utils/encrypt';
import { createUsers, writeDb, sendRequest } from './utils';

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const { expect } = chai;
describe('Users', () => {
  before((done) => {
    setTimeout(() => {
      writeDb(createUsers()).then(() => {
        global.app = require('../dist/server');
        done();
      });
    }, 500);
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
