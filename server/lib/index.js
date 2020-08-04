"use strict";
import express from "express";
import * as Utils from "./Utils";
import db from "./database";
import cors from "cors";
// var cors = require("cors");
import { body, validationResult } from "express-validator";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import passport from "passport";
import { Strategy } from "passport-local";

let app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  cookieSession({
    name: "labaux-session",
    keys: ["vueauthrandomkey"],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new Strategy(
    {
      usernameField: "email",
      passwordField: "password",
    },

    (username, password, done) => {
      const user = db.get("users").find({ email: username, password }).value();
      if (user) {
        done(null, user);
      } else {
        done(null, false, { message: "Incorrect username or password" });
      }
    }
  )
);
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
  if (!req.isAuthenticated()) {
    res.status(401).send("You are not authenticated");
  } else {
    return next();
  }
};
// app.use(authMiddleware);
app.get("/", (req, res) => {
  res.send("text");
});

app.post("/login", (req, res, next) => {
  console.log("log in !");
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      console.log("cannot log in !", info);

      return res.status(400).send([user, "Cannot log in", info]);
    }
    req.login(user, (err) => {
      res.send("Logged in");
    });
  })(req, res, next);
});

app.get("/api/logout", function (req, res) {
  req.logout();

  console.log("logged out");

  return res.send();
});

app.get("/testAuth", authMiddleware, (req, res) => {
  console.log("test auth");
  res.send(400);
  // let user = users.find((user) => {
  //   return user.id === req.session.passport.user;
  // });

  // console.log([user, req.session]);

  // res.send({ user: user });
});

app.get("/user", (req, res) => {
  const users = db.get("users").value();
  res.send(users);
});
app.get("/user/:id", (req, res) => {
  const user = db
    .get("users")
    .find({ id: +req.params.id })
    .value();
  res.send(user);
});
app.post(
  "/user/",
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
    // // modify entry
    if (req.body.id) {
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
app.delete("/user", (req, res) => {
  console.log(req.body, req.params);
});

app.get("/group", (req, res) => {
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
