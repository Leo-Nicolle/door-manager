import config from './config';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync(config.DB_PATH);
const db = low(adapter);

// Set some defaults
db.defaults({
  users: [],
  doors: [],
  groups: [],
  schedules: [],
  locks: [],
}).write();

export default db;
