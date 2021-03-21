import db from './fixtures/db';
import {
  createUsers, writeDb, sendRequest,
} from './utils';

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const { expect } = chai;

describe('Schedules', () => {
  before(() => writeDb({
    ...createUsers(),
    ...db,
  }).then(() => {
    global.app = require('../dist/server');
  }));

  // Test to get all students record
  it('should send all the schedules', () => sendRequest({
    req: '/schedule',
    callback: (err, res) => {
      expect(res).to.have.status(200);
      expect(err).to.be.null;
      expect(res.body).to.have.length(3);
    },
  }));

  it('should add a schedule', () => sendRequest({
    req: '/schedule',
    method: 'post',
    payload: {
      name: 'test-schedule',
      days: new Array(7).fill(0).map(() => ({ allDay: true, intervals: [] })),
    },
    callback: (err, res) => {
      expect(res).to.have.status(200);
      expect(err).to.be.null;
    },
  }).then(() => sendRequest({
    req: '/schedule',
    callback: (err, res) => {
      expect(res).to.have.status(200);
      expect(err).to.be.null;
      expect(res.body).to.have.length(4);
    },
  })));

  it('should modify a schedule', () => sendRequest({
    req: '/schedule',
    callback: (err, res) => res.body.find(({ name }) => name === 'test-schedule'),
  }).then((schedule) => sendRequest({
    req: '/schedule',
    method: 'post',
    payload: {
      ...schedule,
      name: 'new name schedule',
    },
    callback: (err, res) => {
      expect(res).to.have.status(200);
      expect(err).to.be.null;
      return schedule;
    },
  }))
    .then(({ id }) => sendRequest({
      req: `/schedule/${id}`,
      callback: (err, res) => {
        expect(res.body.name)
          .to.be.equal('new name schedule');
      },
    })));

  it('should delete a schedule', () => sendRequest({
    req: '/schedule',
    callback: (err, res) => {
      expect(res.body).to.have.length(4);
      return res.body[res.body.length - 1];
    },
  })
    .then((schedule) => sendRequest({
      req: `/schedule/${schedule.id}`,
      method: 'delete',
      callback: (err, res) => {
        expect(res).to.have.status(200);
        expect(err).to.be.null;
        return schedule;
      },
    }))
    .then(() => sendRequest({
      req: '/schedule',
      callback: (err, res) => {
        expect(res.body).to.have.length(3);
      },
    })));
});
