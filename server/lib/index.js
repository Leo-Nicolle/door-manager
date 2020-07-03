"use strict";
import express from "express";
import * as Utils from "./Utils";
import db from "./database";
import cors from "cors";
// var cors = require("cors");

let app = express();
app.use(
  cors()
  // cors({
  //   origin: "*",
  // })
);

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

// app.post("/user", (req, res) => {});

let server = app.listen(3000, () => {
  console.log(
    `server running at port http://localhost/${server.address().port}`
  );
});
