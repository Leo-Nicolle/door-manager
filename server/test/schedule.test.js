import db from './fixtures/db';
import {
  createUsers, writeDb, sendRequest,
} from './utils';

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const { expect } = chai;

describe('Schedules', () => {
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
  it('should send all the schedules', (done) => {
    sendRequest({
      req: '/schedule',
      callback: (err, res) => {
        expect(res).to.have.status(200);
        expect(err).to.be.null;
        expect(res.body).to.have.length(1);
        done();
      },
    });
  });

  it('should add a schedule', (done) => {
    sendRequest({
      req: '/schedule',
      method: 'post',
      payload: {
        name: 'schedule 2',
        days: new Array(7).fill(0).map(() => ({ allDay: true, intervals: [] })),
      },
      callback: (err, res) => {
        expect(res).to.have.status(200);
        expect(err).to.be.null;
      },
    }).then(() => {
      sendRequest({
        req: '/schedule',
        callback: (err, res) => {
          expect(res).to.have.status(200);
          expect(err).to.be.null;
          expect(res.body).to.have.length(2);
          done();
        },
      });
    });
  });

  it('should modify a schedule', (done) => {
    sendRequest({
      req: '/schedule',
      callback: (err, res) => {
        expect(res.body).to.have.length(2);
        return res.body[1];
      },
    }).then((schedule) => sendRequest({
      req: '/schedule',
      method: 'post',
      payload: {
        ...schedule,
        name: 'new name schedule 2',
      },
      callback: (err, res) => {
        expect(res).to.have.status(200);
        expect(err).to.be.null;
        return schedule;
      },
    }))
      .then(({ id }) => {
        sendRequest({
          req: `/schedule/${id}`,
          callback: (err, res) => {
            expect(res.body.name)
              .to.be.equal('new name schedule 2');
            done();
          },
        });
      });
  });

  it('should delete a schedule', (done) => {
    sendRequest({
      req: '/schedule',
      callback: (err, res) => {
        expect(res.body).to.have.length(2);
        return res.body[1];
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
      .then(() => {
        sendRequest({
          req: '/schedule',
          callback: (err, res) => {
            expect(res.body).to.have.length(1);
            done();
          },
        });
      });
  });
});
