import db from './fixtures/db';
import {
  createUsers, writeDb, sendRequest,
} from './utils';

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const { expect } = chai;

describe('Doors', () => {
  before((done) => {
    writeDb({
      ...createUsers(),
      ...db,
    }).then(() => {
      global.app = require('../dist/server');
      done();
    });
  });

  // Test to get all students record
  it('should send all the doors', (done) => {
    sendRequest({
      req: '/door',
      callback: (err, res) => {
        expect(res).to.have.status(200);
        expect(err).to.be.null;
        expect(res.body).to.have.length(3);
        done();
      },
    });
  });

  it('should add a door', (done) => {
    sendRequest({
      req: '/door',
      method: 'post',
      payload: {
        name: 'test-door',
      },
      callback: (err, res) => {
        expect(res).to.have.status(200);
        expect(err).to.be.null;
      },
    }).then(() => {
      sendRequest({
        req: '/door',
        callback: (err, res) => {
          expect(res).to.have.status(200);
          expect(err).to.be.null;
          expect(res.body).to.have.length(4);
          done();
        },
      });
    });
  });

  it('should modify a door', (done) => {
    sendRequest({
      req: '/door',
      callback: (err, res) => res.body.find(({ name }) => name === 'test-door'),
    }).then((door) => sendRequest({
      req: '/door',
      method: 'post',
      payload: {
        ...door,
        name: 'new name door',
      },
      callback: (err, res) => {
        expect(res).to.have.status(200);
        expect(err).to.be.null;
        return door;
      },
    }))
      .then(({ id }) => {
        sendRequest({
          req: `/door/${id}`,
          callback: (err, res) => {
            expect(res.body.name)
              .to.be.equal('new name door');
            done();
          },
        });
      });
  });

  it('should delete a door', () => sendRequest({
    req: '/door',
    callback: (err, res) => {
      expect(res.body).to.have.length(4);
      return res.body[res.body.length - 1];
    },
  })
    .then((door) => sendRequest({
      req: `/door/${door.id}`,
      method: 'delete',
      callback: (err, res) => {
        expect(res).to.have.status(200);
        expect(err).to.be.null;
        return door;
      },
    }))
    .then(() => sendRequest({
      req: '/door',
      callback: (err, res) => {
        expect(res.body).to.have.length(3);
      },
    })));
});
