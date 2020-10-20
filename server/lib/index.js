"use strict";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import passport from "passport";
import { v4 as uuid } from "uuid";
import db from "./database";
import doorController from "./doorController";
import userController from "./userController";
import scheduleController from "./scheduleController";
import groupController from "./groupController";
import accessController from "./accessController";
import logController from "./logController";

import { existsSync } from "fs";
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

app.get("/api/logout/:token", function (req, res) {
  const token = req.params.token;
  db.get("users").find({ token }).assign({ token: uuid() }).write();
  return res.send(200);
});

app.get("/api/loggedin", authMiddleware, (req, res) => {
  res.send(200);
});

if (existsSync("public")) {
  console.log("server static");
  app.use(express.static("public"));
}

doorController({ authMiddleware, app, db });
userController({ authMiddleware, app, db });
scheduleController({ authMiddleware, app, db });
groupController({ authMiddleware, app, db });
accessController({ authMiddleware, app, db });
logController({ authMiddleware, app, db });

let server = app.listen(5051, () => {
  console.log(
    `server running at port http://localhost/${server.address().port}`
  );
});
