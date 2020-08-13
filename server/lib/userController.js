import { body, validationResult } from "express-validator";
import { v4 as uuid } from "uuid";

export default function userController({ app, db, authMiddleware }) {
  app.get("/user", authMiddleware, (req, res) => {
    const users = db.get("users").value();
    res.send(users);
  });
  app.get("/user/:id", authMiddleware, (req, res) => {
    const user = db
      .get("users")
      .find({ id: +req.params.id })
      .value();
    res.send(user);
  });
  app.post(
    "/user",
    authMiddleware,
    [
      body("lastname").isString().notEmpty(),
      body("firstname").isString().notEmpty(),
      body("email").isString().notEmpty(),
      body("password").isString().notEmpty(),
      body("groups").isArray(),
      body("badges").isArray(),
    ],
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      // modify entry
      console.log("ICI", req.body);
      if (req.body.id) {
        db.get("users").find({ id: req.body.id }).assign(req.body).write();
        setTimeout(() => {
          console.log("ICI", db.get("users").find({ id: req.body.id }).value());
        });
      } else {
        // make new entry
        db.get("users")
          .push({ id: uuid(), ...req.body })
          .write();
        setTimeout(() => {
          console.log("LA", db.get("users").find({ lastname: "test" }).value());
        }, 200);
      }
      res.send(200);
    }
  );
  app.delete("/user", authMiddleware, (req, res) => {
    console.log(req.body, req.params);
  });
}
