import {
  createUsers, writeDb, sendRequest,
} from './utils';
import db, { schedules } from './fixtures/db';

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const { expect } = chai;

const fixture = {
  ...createUsers({}, db.groups.map(({ id }, i) => ({
    groups: [id],
    badges: [`badge${i}`],
  }))),
  ...db,

};
describe('Access', () => {
  before(() => writeDb(fixture).then(() => {
    global.app = require('../dist/server');
  }));
  after(() => sendRequest({
    req: '/badge/stop-adding',
    method: 'post',
  }));

  fixture.users.slice(1, 2).forEach(({ badges }) => {
    badges.forEach((badgeId) => {
      schedules.forEach(({ shouldAccess, doorId }) => {
        it(`should ${shouldAccess ? '' : 'not '}authorize`, () => sendRequest({
          req: `/access/${doorId}/${badgeId}`,
          callback: (err, res) => {
            expect(res).to.have.status(shouldAccess ? 200 : 400);
          },
        }));
      });
    });
  });

  it('should download badge', () => sendRequest({
    req: '/access/download/badge/idDoor1',
    callback: (err, res) => {
      expect(err).to.be.null;
      expect(res.text).to.be.equal('badge0,idSchedule1\n');
    },
  }));

  it('should download schedule', () => sendRequest({
    req: '/access/download/schedule/idDoor1',
    callback: (err, res) => {
      expect(err).to.be.null;
      expect(res.text).to.be.equal(JSON.stringify(
        {
          idSchedule1: fixture.schedules[0].days,
        },
      ));
    },
  }));

  it('should add a badge', () => sendRequest({
    req: '/user',
    callback: (err, res) => res.body[1],
  })
    .then((user) => sendRequest({
      req: '/badge/start-adding',
      method: 'post',
      payload: {
        userId: user.id,
      },
      callback: (err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200);
      },
    })).then(() => sendRequest({
      req: '/access/idDoor1/newBadge',
      callback: (err, res) => {
        expect(res.status).to.be.equal(202);
      },
    })).then(() => sendRequest({
      req: '/badge/last-unknown',
      callback: (err, res) => {
        expect(res.status).to.be.equal(200);
      },
    }))
    .then(() => sendRequest({
      req: '/badge/assign',
      method: 'post',
      callback: (err, res) => {
        expect(res.status).to.be.equal(200);
      },
    }))
    .then(() => sendRequest({
      req: '/user',
      callback: (err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body[1].badges).to.have.length(2);
        expect(res.body[1].badges).to.include.members(['newBadge']);
      },
    })));
});
