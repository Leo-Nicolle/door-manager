"use strict";
import express from "express";
import db from "./database";
import cors from "cors";
import bodyParser from "body-parser";
import passport from "passport";
import doorController from "./doorController";
import userController from "./userController";
import scheduleController from "./scheduleController";
import groupController from "./groupController";

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

doorController({ authMiddleware, app, db });
userController({ authMiddleware, app, db });
scheduleController({ authMiddleware, app, db });
groupController({ authMiddleware, app, db });

app.get("/group", authMiddleware, (req, res) => {
  console.log("request groups");
  const groups = db.get("groups").value();
  res.send(groups);
});

// app.post("/user", (req, res) => {});

let server = app.listen(5050, () => {
  console.log(
    `server running at port http://localhost/${server.address().port}`
  );
});
