"use strict";
import express from "express";
import * as Utils from "./Utils";
import db from "./database";
import cors from "cors";
import { body, validationResult } from "express-validator";
import bodyParser from "body-parser";
import passport from "passport";
import { v4 as uuid } from "uuid";
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  let user = users.find((user) => {
    return user.id === id;
  });

  done(null, user);
});

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const user = db.get("users").find({ token }).value();
    if (!user) {
      console.log("auth failed");
      throw new Error("Authtentication failed");
    }
    console.log("logged in");
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Authentification Failed",
    });
  }
};

let app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("text");
});

app.post("/login", (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = db.get("users").find({ email, password }).value();
  if (!user) {
    return res.status(401).send("Wrong email or password");
  }
  const token = uuid();
  db.get("users").find({ email, password }).assign({ token }).write();
  res.status(201).json({ user, token });
});

app.get("/api/logout", function (req, res) {
  const token = db
    .get("users")
    .find({ email, password })
    .assign({ token })
    .write()
    .then(() => res.status(201).json({ user, token }));
  return res.send();
});

app.get("/testAuth", authMiddleware, (req, res) => {
  console.log("test auth");
  res.send(200);
});

app.get("/user", authMiddleware, (req, res) => {
  console.log("/USER ! ");
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
    body("groups").isArray(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    // modify entry
    if (req.body.id) {
      console.log("modify entry", req.body);
      db.get("users")
        .find({ id: +req.body.id })
        .assign(req.body)
        .write();
    } else {
      // make new entry
      db.get("users").push(req.body).write();
    }
    res.send(200);
  }
);
app.delete("/user", authMiddleware, (req, res) => {
  console.log(req.body, req.params);
});

app.get("/group", authMiddleware, (req, res) => {
  console.log("request groups");
  const groups = db.get("groups").value();
  res.send(groups);
});

// app.post("/user", (req, res) => {});

let server = app.listen(3000, () => {
  console.log(
    `server running at port http://localhost/${server.address().port}`
  );
});
