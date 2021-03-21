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
  it('should send all the doors', () => sendRequest({
    req: '/door',
    callback: (err, res) => {
      expect(res).to.have.status(200);
      expect(err).to.be.null;
      expect(res.body).to.have.length(3);
    },
  }));

  it('should add a door', () => sendRequest({
    req: '/door',
    method: 'post',
    payload: {
      name: 'test-door',
    },
    callback: (err, res) => {
      expect(res).to.have.status(200);
      expect(err).to.be.null;
    },
  }).then(() => sendRequest({
    req: '/door',
    callback: (err, res) => {
      expect(res).to.have.status(200);
      expect(err).to.be.null;
      expect(res.body).to.have.length(4);
    },
  })));

  it('should modify a door', () => sendRequest({
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
    .then(({ id }) => sendRequest({
      req: `/door/${id}`,
      callback: (err, res) => {
        expect(res.body.name)
          .to.be.equal('new name door');
      },
    })));

  it('should delete a door', () => sendRequest({
    req: '/door',
    callback: (err, res) => {
      expect(res.body).to.have.length(4);
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
    .then((door) => sendRequest({
      req: '/door',
      callback: (err, res) => {
        expect(res.body).to.have.length(3);
        return door;
      },
    }))
    .then((door) => sendRequest({
      req: '/group',
      callback: (err, res) => {
        // check if the groups has been updated
        const wrongGroups = res.body.reduce((wrongGroups, group) => {
          if (Object.values(group.doorAccess).find((v) => v === door.id)) {
            wrongGroups.push(group);
          }
          return wrongGroups;
        }, []);
        expect(wrongGroups).to.have.length(0);
      },
    })));
});
