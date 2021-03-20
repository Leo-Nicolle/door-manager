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
        expect(res.body).to.have.length(1);
        done();
      },
    });
  });

  it('should add a door', (done) => {
    sendRequest({
      req: '/door',
      method: 'post',
      payload: {
        name: 'door 2',
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
          expect(res.body).to.have.length(2);
          done();
        },
      });
    });
  });

  it('should modify a door', (done) => {
    sendRequest({
      req: '/door',
      callback: (err, res) => {
        expect(res.body).to.have.length(2);
        return res.body[1];
      },
    }).then((door) => sendRequest({
      req: '/door',
      method: 'post',
      payload: {
        ...door,
        name: 'new name door 2',
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
              .to.be.equal('new name door 2');
            done();
          },
        });
      });
  });

  it('should delete a door', (done) => {
    sendRequest({
      req: '/door',
      callback: (err, res) => {
        expect(res.body).to.have.length(2);
        return res.body[1];
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
      .then(() => {
        sendRequest({
          req: '/door',
          callback: (err, res) => {
            expect(res.body).to.have.length(1);
            done();
          },
        });
      });
  });
});
