import { body, validationResult } from "express-validator";
import { v4 as uuid } from "uuid";

export default function groupController({ app, db, authMiddleware }) {
  app.get("/group", authMiddleware, (req, res) => {
    const groups = db.get("groups").value();
    res.send(groups);
  });
  app.get("/group/:id", authMiddleware, (req, res) => {
    const group = db
      .get("groups")
      .find({ id: +req.params.id })
      .value();
    res.send(group);
  });
  app.post(
    "/group",
    authMiddleware,
    [body("name").isString().notEmpty()],
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      // modify entry
      if (req.body.id) {
        db.get("groups").find({ id: req.body.id }).assign(req.body).write();
      } else {
        // make new entry
        db.get("groups")
          .push({ id: uuid(), ...req.body })
          .write();
      }
      res.send(200);
    }
  );
  app.delete("/group", authMiddleware, (req, res) => {
    console.log(req.body, req.params);
  });
}
