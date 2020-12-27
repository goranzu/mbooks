"use strict";

const express = require("express");
const morgan = require("morgan");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const config = require("./config");
const middlewares = require("./middlewares");
const { searchRouter } = require("./resources/search/search.router");
const authRouter = require("./resources/auth/auth.router");
const connectDb = require("./db");
const User = require("./resources/user/user.model");

const app = express();

app.use(express.json());
app.use(compression());
app.use(helmet());
app.use(
  cors({
    origin: config.corsOrigin,
  }),
);
config.isDev && app.use(morgan("dev"));

// app.use(middlewares.addDBModelsToRequest);

app.use("/auth", authRouter);

app.get("/", (req, res) => {
  return res.status(200).json({ data: { message: "☸ App" } });
});

app.get("/me", middlewares.protect, (req, res) => {
  return res.status(200).json({ data: { id: req.user._id } });
});

app.use("/api/v1/search", searchRouter);

app
  .route("/api/v1/user/:id/readinglist")
  .get(middlewares.protect, async function getReadingList(req, res, next) {
    try {
      return res
        .status(200)
        .json({ data: { readingList: req.user.readingList } });
    } catch (error) {
      next(error);
    }
  });

app.use(middlewares.notFound);

app.use(middlewares.errorHandler);

function start() {
  connectDb(config.dbUrl)
    .then(() => {
      app.listen(config.port, () => {
        console.log(`Listening on http://localhost:${config.port}`);
      });
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { app, start };
