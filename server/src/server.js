"use strict";

const express = require("express");
const morgan = require("morgan");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const config = require("./config");
const middlewares = require("./middlewares");
const { searchRouter } = require("./resources/search/search.router");
const authRouter = require("./auth/auth.router");
const connectDb = require("./db");
const User = require("./resources/user/user.model");
const handleAsync = require("./lib/handleAsync");

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

app.use(middlewares.addDBModelsToRequest);

app.use("/auth", authRouter);

app.get("/", (req, res) => {
  return res.status(200).json({ data: { message: "☸ App" } });
});

app.get("/me", middlewares.protect, (req, res) => {
  return res.status(200).json({ data: { id: req.user._id } });
});

app.use("/api/v1/search", searchRouter);

const PLAN_TO_READ = "planToRead";
const FINISHED_READING = "finishedReading";
const READING_LIST = "readingList";

function getList(status) {
  let list;

  if (status === PLAN_TO_READ) {
    list = READING_LIST;
  }

  if (status === FINISHED_READING) {
    list = FINISHED_READING;
  }

  return list;
}

app
  .route("/api/v1/book")
  .get(
    middlewares.protect,
    handleAsync(async function getList(req, res) {
      let list = [];
      const { status } = req.query;
      if (status === PLAN_TO_READ) {
        list = req.user.readingList;
      }

      if (status === FINISHED_READING) {
        list = req.user.finishedReading;
      }

      return res.status(200).json({ data: list });
    }),
  )
  .post(middlewares.protect, async function addBookToList(req, res, next) {
    try {
      const book = req.body;
      const { status } = req.query;
      let list = getList(status);

      const user = await User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { [list]: book },
        },
        { new: true },
      )
        .select(list)
        .lean()
        .exec();

      return res.status(201).json({ data: user[list] });
    } catch (error) {
      next(error);
    }
  });

app
  .route("/api/v1/book/:bookId")
  .delete(
    middlewares.protect,
    async function removeBookFromList(req, res, next) {
      try {
        const { bookId } = req.params;
        const { status } = req.query;
        let list = getList(status);

        const user = await User.findByIdAndUpdate(
          req.user._id,
          {
            $pull: { [list]: { goodreadsId: bookId } },
          },
          { new: true },
        )
          .select(list)
          .lean()
          .exec();

        return res.status(200).json({ data: user[list] });
      } catch (error) {
        next(error);
      }
    },
  );

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
