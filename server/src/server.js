"use strict";

const express = require("express");
const morgan = require("morgan");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const config = require("./config");
const middlewares = require("./middlewares");
const { searchRouter } = require("./resources/search/search.router");
const bookRouter = require("./resources/book/book.router");
const authRouter = require("./resources/auth/auth.router");

const app = express();

app.use(express.json());
app.use(compression());
app.use(helmet());
app.use(cors());
config.isDev && app.use(morgan("dev"));

app.use("/auth", authRouter);

app.get("/", (req, res) => {
  return res.status(200).json({ data: { message: "☸ App" } });
});

app.get("/me", middlewares.protect, (req, res) => {
  return res.status(200).json({ data: { id: req.user.id } });
});

app.use("/api/v1/search", middlewares.protect, searchRouter);
app.use("/api/v1/book", middlewares.protect, bookRouter);

app.use(middlewares.notFound);

app.use(middlewares.errorHandler);

function start() {
  app.listen(config.port, () => {
    console.log(`Listening on http://localhost:${config.port}`);
  });
}

module.exports = { app, start };
