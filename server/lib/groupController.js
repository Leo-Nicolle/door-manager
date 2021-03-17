import { body, validationResult } from 'express-validator';
import { v4 as uuid } from 'uuid';

function validateDoorAcces(db, doorAccess) {
  if (!typeof doorAccess === 'object') {
    return {
      param: 'doorAccess',
      msg: 'wrong door access',
    };
  }
  console.log('doorAccess', doorAccess);
  return Object.entries(doorAccess)
    .map(([doorId, scheduleId]) => {
      if (!db.get('doors').find({ id: doorId }).value()) {
        return {
          param: 'doorAccess',
          msg: 'door does not exist',
        };
      }
      if (!db.get('schedules').find({ id: scheduleId }).value()) {
        return {
          param: 'doorAccess',
          msg: 'schedule does not exist',
        };
      }
    })
    .filter((e) => e);
}
export default function groupController({ app, db, authMiddleware }) {
  app.get('/group', authMiddleware, (req, res) => {
    const groups = db.get('groups').value();
    res.send(groups);
  });
  app.get('/group/:id', authMiddleware, (req, res) => {
    const group = db.get('groups').find({ id: req.params.id }).value();
    res.send(group);
  });
  app.post(
    '/group',
    authMiddleware,
    [body('name').isString().notEmpty()],
    (req, res) => {
      const errors = validationResult(req).array();
      errors.push(...validateDoorAcces(db, req.body.doorAccess));
      if (errors.length) {
        return res.status(422).json({ errors });
      }
      // modify entry
      if (req.body.id) {
        db.get('groups').find({ id: req.body.id }).assign(req.body).write();
      } else {
        // make new entry
        db.get('groups')
          .push({ id: uuid(), ...req.body })
          .write();
      }
      res.sendStatus(500);
    },
  );
  app.delete('/group/:id', authMiddleware, (req, res) => {
    const group = db.get('groups')
      .find({ id: req.params.id })
      .value();
    if (!group) {
      res.sendStatus(400);
    }
    // delete the group from users who have it;
    const users = db.get('users').value();
    users.forEach((user) => {
      if (!user.groups.includes(group.id)) return;
      user.groups = user.groups.filter((groupId) => groupId !== group.id);
      db.get('users')
        .find({ id: user.id })
        .assign(user)
        .write();
    });
    // delete group from db
    db.set(
      'groups',
      db
        .get('groups')
        .filter(({ id }) => id !== group.id)
        .value(),
    ).write();
    res.sendStatus(500);
  });
}
