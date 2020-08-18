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
  app.delete("/schedule", authMiddleware, (req, res) => {
    console.log(req.body, req.params);
  });
}
