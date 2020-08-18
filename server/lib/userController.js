import { body, validationResult } from "express-validator";
import { v4 as uuid } from "uuid";
import encrypt from "quick-encrypt";
import fs from "fs";

const keys = encrypt.generate(1024); // Use either 2048 bits or 1024 bits.
const publicKey = keys.public;
const privateKey = keys.private;

let persitantKeys = null;
fs.readFile("./keys.json", (err, data) => {
  if (err) return;
  persitantKeys = JSON.parse(data);
});

export default function userController({ app, db, authMiddleware }) {
  app.get("/encrypt", (req, res) => {
    res.send(publicKey);
  });
  app.post("/login", (req, res, next) => {
    const email = req.body.email;

    const decryptedPassword = encrypt.decrypt(req.body.password, privateKey);
    if (!emaeil.length || !decryptedPassword || !decryptedPassword.length) {
      return res.status(401).send("Wrong email or password");
    }
    const user = db.get("users").find({ email }).value();
    if (
      !user ||
      encrypt.decrypt(user.password, persitantKeys.private) !==
        decryptedPassword
    ) {
      return res.status(401).send("Wrong email or password");
    }
    const token = uuid();
    db.get("users").find({ id: user.id }).assign({ token }).write();
    res.status(201).json({ token });
  });

  app.get("/user", authMiddleware, (req, res) => {
    const users = db.get("users").value();
    res.send(
      users.map((user) => ({
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        groups: user.groups,
        badges: user.badges,
        email: user.email,
        isAdmin: user.isAdmin,
      }))
    );
  });
  app.get("/user/:id", authMiddleware, (req, res) => {
    const user = db.get("users").find({ id: req.params.id }).value();
    res.send({
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      groups: user.groups,
      badges: user.badges,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  });
  app.post(
    "/user",
    authMiddleware,
    [
      body("lastname").isString().notEmpty(),
      body("firstname").isString().notEmpty(),
      body("email").isString(),
      body("isAdmin").isBoolean(),
      body("password").isString(),
      body("groups").isArray(),
      body("badges").isArray(),
    ],
    (req, res) => {
      const errors = validationResult(req).array();

      if (req.body.isAdmin) {
        const { password, email } = req.body;
        if (!password.length)
          errors.push({
            param: "password",
            msg: "password should not be empty",
          });
        if (!email.length)
          errors.push({ param: "email", msg: "email should not be empty" });
      }

      if (!persitantKeys) {
        return res.status(400);
      }
      if (errors.length) {
        return res.status(400).json({ errors });
      }
      if (req.body.password) {
        req.body.password = encrypt.encrypt(
          encrypt.decrypt(req.body.password, privateKey),
          persitantKeys.public
        );
      }
      // modify entry
      if (req.body.id) {
        db.get("users").find({ id: req.body.id }).assign(req.body).write();
      } else {
        // make new entry
        db.get("users")
          .push({ id: uuid(), ...req.body })
          .write();
      }
      res.send(200);
    }
  );
  app.delete("/user", authMiddleware, (req, res) => {
    console.log(req.body, req.params);
  });
}
