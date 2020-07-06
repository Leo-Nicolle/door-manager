"use strict";
import express from "express";
import * as Utils from "./Utils";
import db from "./database";
import cors from "cors";
// var cors = require("cors");
import { body, validationResult } from "express-validator";
import bodyParser from "body-parser";

let app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("text");
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
  const groups = db.get("groups").value();
  res.send(groups);
});

// app.post("/user", (req, res) => {});

let server = app.listen(3000, () => {
  console.log(
    `server running at port http://localhost/${server.address().port}`
  );
});
