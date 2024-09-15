const express = require("express");
require("express-async-errors");
require("./db");
// import express from "express";
// import "./db/index.js";
const auth = require("./routes/auth");
const audio = require("./routes/audio");
const favorite = require("./routes/favorite");
const playlist = require("./routes/playlist");
const profile = require("./routes/profile");
const history = require("./routes/history");
const errorHandler = require("./middleware/errorHandler");
require("./utils/taskScheduler");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", auth);
app.use("/audio", audio);
app.use("/favorite", favorite);
app.use("/playlist", playlist);
app.use("/profile", profile);
app.use("/history", history);
app.use("/", (req, res) => {
  res.send("main route hitted");
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log("listeng");
});
