import { body, validationResult } from 'express-validator';
import { v4 as uuid } from 'uuid';
import { compareHours } from './utils/index';

function validateTime(time) {
  const validate1 = time && typeof time.HH === 'string' && typeof time.mm === 'string';

  if (!validate1) return false;

  return (time.HH && time.mm) || (!time.HH && !time.mm);
}
function filterOutEmptyIntervals(schedule) {
  schedule.days.forEach((day) => {
    day.intervals = day.intervals.filter(({ start, end }) => !(!start && !end));
  });
}
function validateSchedule(schedule) {
  if (!schedule.days || schedule.days.length !== 7) {
    return [
      {
        param: 'doorAccess',
        msg: 'wrong door access',
      },
    ];
  }

  filterOutEmptyIntervals(schedule);
  return schedule.days.reduce((acc, { intervals }, i) => {
    intervals.forEach(({ start, end }, j) => {
      if (!validateTime(start)) {
        acc.push({
          indexDay: i,
          indexInterval: j,
          indexStartEnd: 0,
          msg: 'wrong start',
        });
      }

      if (!validateTime(end)) {
        acc.push({
          indexDay: i,
          indexInterval: j,
          indexStartEnd: 1,
          msg: 'wrong end',
        });
      }
      if (compareHours(start, end) > 0) {
        acc.push({
          indexDay: i,
          indexInterval: j,
          indexStartEnd: 1,
          msg: 'end should be higher than start',
        });
      }
    });
    return acc;
  }, []);
}

export default function scheduleController({ app, db, authMiddleware }) {
  app.get('/schedule', authMiddleware, (req, res) => {
    const schedules = db.get('schedules').value();
    res.send(schedules);
  });
  app.get('/schedule/:id', authMiddleware, (req, res) => {
    const schedule = db.get('schedules').find({ id: req.params.id }).value();
    res.send(schedule);
  });
  app.post(
    '/schedule/validate',
    authMiddleware,
    [body('name').isString().notEmpty(), body('days').isArray().notEmpty()],
    (req, res) => {
      const errors = validationResult(req).array();
      // validate times:
      errors.push(...validateSchedule(req.body));
      if (errors.length) {
        return res.status(422).json({ errors });
      }
      res.send(200);
    },
  );
  app.post(
    '/schedule',
    authMiddleware,
    [body('name').isString().notEmpty(), body('days').isArray().notEmpty()],
    (req, res) => {
      const errors = validationResult(req).array();
      // validate times:
      errors.push(...validateSchedule(req.body));
      if (errors.length) {
        return res.status(422).json({ errors });
      }
      console.log('post schedules', req.body.days[0]);
      // clean data
      req.body.days.forEach(
        (day) => (day.intervals = day.intervals.filter(
          ({ start, end }) => start
              && end
              && start.HH
              && start.mm
              && end.HH
              && end.mm
              && start.HH.length
              && start.mm.length
              && end.HH.length
              && end.mm.length,
        )),
      );
      // modify entry
      if (req.body.id) {
        db.get('schedules').find({ id: req.body.id }).assign(req.body).write();
      } else {
        // make new entry
        db.get('schedules')
          .push({ id: uuid(), ...req.body })
          .write();
      }
      res.send(200);
    },
  );
  app.delete('/schedule/:id', authMiddleware, (req, res) => {
    db.set(
      'schedules',
      db
        .get('schedules')
        .filter(({ id }) => id !== req.params.id)
        .value(),
    ).write();

    db.set(
      'groups',
      db
        .get('groups')
        .value()
        .map((group) => {
          const { doorAccess } = group;
          Object.entries(group.doorAccess).forEach(([key, value]) => {
            if (value !== req.params.id) return;
            delete doorAccess[key];
          });
          group.doorAccess = doorAccess;
          return group;
        }),
    ).write();
    res.send(200);
  });
}
