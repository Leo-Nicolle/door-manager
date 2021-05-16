import { body, validationResult } from 'express-validator';
import { v4 as uuid } from 'uuid';

export default function doorController({ app, db, authMiddleware }) {
  app.get('/door', authMiddleware, (req, res) => {
    const doors = db.get('doors').value();
    res.send(doors);
  });
  app.get('/door/:id', authMiddleware, (req, res) => {
    if (req.params.id === 'new') {
      return res.send({
        name: '',
      });
    }
    const door = db.get('doors').find({ id: req.params.id }).value();
    res.send(door);
  });
  app.post(
    '/door',
    authMiddleware,
    [body('name').isString().notEmpty()],
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      // modify entry
      const door = db.get('doors').find({ id: req.body.id });
      if (req.body.id && door) {
        db.get('doors').assign({ ...door, ...req.body }).write();
      } else {
        // make new entry
        db.get('doors')
          .push({ id: uuid(), ...req.body, codeDate: 0 })
          .write();
      }
      res.sendStatus(200);
    },
  );
  app.delete('/door/:id', authMiddleware, (req, res) => {
    db.set(
      'doors',
      db
        .get('doors')
        .filter(({ id }) => id !== req.params.id)
        .value(),
    ).write();

    // remove entries concerning the deleted door in the groups
    db.set(
      'groups',
      db
        .get('groups')
        .value()
        .map((group) => {
          const { doorAccess } = group;
          delete doorAccess[req.params.id];
          group.doorAccess = doorAccess;
          return group;
        }),
    ).write();

    res.sendStatus(200);
  });
  app.get('/ping/:id', (req, res) => {
    const door = db.get('doors').find({ id: req.params.id }).value();
    if (!door) {
      return res.sendStatus(500);
    }
    const lastPing = Date.now();
    // console.log('diff', (lastPing - door.lastPing) / (60 * 1000));
    db.get('doors').find({ id: req.params.id }).assign({
      ...door,
      lastPing,
    }).write();

    res.sendStatus(200);
  });
}
