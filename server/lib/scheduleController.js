import { body, validationResult } from "express-validator";
import { v4 as uuid } from "uuid";

export default function scheduleController({ app, db, authMiddleware }) {
  app.get("/schedule", authMiddleware, (req, res) => {
    const schedules = db.get("schedules").value();
    res.send(schedules);
  });
  app.get("/schedule/:id", authMiddleware, (req, res) => {
    const schedule = db.get("schedules").find({ id: req.params.id }).value();
    res.send(schedule);
  });
  app.post(
    "/schedule",
    authMiddleware,
    [body("name").isString().notEmpty(), body("days").isArray().notEmpty()],
    (req, res) => {
      let errors = validationResult(req);
      // validate times:
      // TODO!!
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      console.log("post schedules", req.body.days[0]);
      // clean data
      req.body.days.forEach(
        (day) =>
          (day.intervals = day.intervals.filter(
            ({ start, end }) => start.HH && start.mm && end.HH && end.mm
          ))
      );
      // modify entry
      if (req.body.id) {
        db.get("schedules").find({ id: req.body.id }).assign(req.body).write();
      } else {
        // make new entry
        db.get("schedules")
          .push({ id: uuid(), ...req.body })
          .write();
      }
      res.send(200);
    }
  );
  app.delete("/schedule/:id", authMiddleware, (req, res) => {
    db.set(
      "schedules",
      db
        .get("schedules")
        .filter(({ id }) => id !== req.params.id)
        .value()
    ).write();

    db.set(
      "groups",
      db
        .get("groups")
        .value()
        .map((group) => {
          const doorAccess = group.doorAccess;
          Object.entries(group.doorAccess).forEach(([key, value]) => {
            if (value !== req.params.id) return;
            delete doorAccess[key];
          });
          group.doorAccess = doorAccess;
          return group;
        })
    ).write();
    res.send(200);
  });
}
