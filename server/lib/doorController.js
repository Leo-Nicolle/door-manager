import { body, validationResult } from "express-validator";
import { v4 as uuid } from "uuid";

export default function doorController({ app, db, authMiddleware }) {
  app.get("/door", authMiddleware, (req, res) => {
    console.log("/USER ! ");
    const doors = db.get("doors").value();
    res.send(doors);
  });
  app.get("/door/:id", authMiddleware, (req, res) => {
    const door = db
      .get("doors")
      .find({ id: +req.params.id })
      .value();
    res.send(door);
  });
  app.post(
    "/door",
    authMiddleware,
    [body("name").isString().notEmpty()],
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      // modify entry
      console.log("door post", req.body);
      if (req.body.id) {
        console.log("modify entry", req.body);
        db.get("doors").find({ id: req.body.id }).assign(req.body).write();
      } else {
        // make new entry
        db.get("doors")
          .push({ id: uuid(), ...req.body })
          .write();
      }
      res.send(200);
    }
  );
  app.delete("/door", authMiddleware, (req, res) => {
    console.log(req.body, req.params);
  });
}
