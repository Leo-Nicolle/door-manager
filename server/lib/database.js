const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db/db.json');
const db = low(adapter);

// Set some defaults
db.defaults({
  users: [],
  doors: [],
  groups: [],
  schedules: [],
  locks: [],
  code: [],
}).write();

export default db;
