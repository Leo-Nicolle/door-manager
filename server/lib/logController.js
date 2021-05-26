import config from './config';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync(config.LOGS_PATH);
const db = low(adapter);

db.defaults({
  logs: [],
}).write();

export { db as dbLogs };

export default function logController({ app, authMiddleware }) {
  app.get('/log', authMiddleware, (req, res) => {
    const logs = db.get('logs').value();
    res.send(logs);
  });
  app.get('/log/before/:period', authMiddleware, (req, res) => {
    const minDate = new Date();
    if (req.params.period === 'month') {
      minDate.setMonth(minDate.getMonth() - 1);
    } else if (req.params.period === 'week') {
      minDate.setDate(minDate.getDate() - 7);
    } else {
      minDate.setDate(minDate.getDate() - 1);
    }
    const logs = db.get('logs').value()
      .filter(({ date }) => date > minDate);
    res.send(logs);
  });

  app.get('/log/:id', authMiddleware, (req, res) => {
    const log = db.get('logs').find({ id: req.params.id }).value();
    res.send(log);
  });
  app.delete('/log/:id', authMiddleware, (req, res) => {
    db.set(
      'logs',
      db
        .get('logs')
        .filter(({ id }) => id !== req.params.id)
        .value(),
    ).write();

    res.sendStatus(200);
  });

  app.delete('/log', authMiddleware, (req, res) => {
    db.set('logs', []).write();
    res.sendStatus(200);
  });
}
