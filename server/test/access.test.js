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
});
