import {
  createUsers, writeDb, sendRequest,
} from './utils';
import db from './fixtures/db';

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const { expect } = chai;

describe('Groups', () => {
  before((done) => {
    const d = {
      ...createUsers(),
      ...db,

    };
    writeDb(d).then(() => {
      global.app = require('../dist/server');
      done();
    });
  });

  // Test to get all students record
  it('should send all the groups', () => sendRequest({
    req: '/group',
    callback: (err, res) => {
      expect(res).to.have.status(200);
      expect(err).to.be.null;
      expect(res.body).to.have.length(1);
    },
  }));

  it('should add a group', () => sendRequest({
    req: '/group',
    method: 'post',
    payload: {
      name: 'test-group',
      doorAccess: {
        idDoor1: 'idSchedule1',
      },
    },
    callback: (err, res) => {
      expect(res).to.have.status(200);
      expect(err).to.be.null;
    },
  }).then(() => {
    sendRequest({
      req: '/group',
      callback: (err, res) => {
        expect(res).to.have.status(200);
        expect(err).to.be.null;
        expect(res.body).to.have.length(2);
      },
    });
  }));

  it('should modify a group', () => sendRequest({
    req: '/group',
    callback: (err, res) => res.body.find(({ name }) => name === 'test-group'),
  }).then((group) => sendRequest({
    req: '/group',
    method: 'post',
    payload: {
      ...group,
      name: 'new name group',
    },
    callback: (err, res) => {
      expect(res).to.have.status(200);
      expect(err).to.be.null;
      return group;
    },
  }))
    .then(({ id }) => {
      sendRequest({
        req: `/group/${id}`,
        callback: (err, res) => {
          expect(res.body.name)
            .to.be.equal('new name group');
        },
      });
    }));

  it('should delete a group', () => sendRequest({
    req: '/group',
    callback: (err, res) => {
      expect(res.body).to.have.length(2);
      return res.body[res.body.length - 1];
    },
  })
    .then((group) => sendRequest({
      req: `/group/${group.id}`,
      method: 'delete',
      callback: (err, res) => {
        expect(res).to.have.status(200);
        expect(err).to.be.null;
        return group;
      },
    }))
    .then(() => {
      sendRequest({
        req: '/group',
        callback: (err, res) => {
          expect(res.body).to.have.length(1);
        },
      });
    }));
});
