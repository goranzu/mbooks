"use strict";

const { Router } = require("express");
const tableNames = require("../../constants/tableNames");
const db = require("../../db");
const bookRouter = Router();
const yup = require("yup");

const addBookToReadingListSchema = yup.object().shape({
  goodreads_id: yup.string().required(),
  title: yup.string().required(),
  author: yup.string().required(),
  publication_year: yup.string().required(),
  average_rating: yup.string().required(),
  image_url: yup.string().url().required(),
});

const getListSchema = yup.object().shape({
  status: yup
    .string()
    .equals(["is_reading", "finished", "stopped_reading"])
    .required(),
});

bookRouter
  .route("/")
  .post(async function addBookToReadingList(req, res, next) {
    try {
      await addBookToReadingListSchema.validate(
        { ...req.body },
        { abortEarly: false },
      );
      const readinglist = await req.user.$relatedQuery("book");

      const bookIsOnReadingList = readinglist.find(
        (b) => b.goodreads_id === req.body.goodreads_id,
      );

      if (bookIsOnReadingList) {
        res.status(403);
        return next(new Error("This book is already on your readinglist."));
      }

      const book = await req.user.$relatedQuery("book").insert(req.body);

      return res.status(201).json({ data: book });
    } catch (error) {
      next(error);
    }
  })
  .get(async function getList(req, res, next) {
    try {
      await getListSchema.validate({ ...req.query }, { abortEarly: false });
      const { status } = req.query;
      const limit = 10;
      const readingList = await req.user
        .$relatedQuery("book")
        .for(req.user)
        .limit(limit)
        .where({ status });

      if (readingList.length === 0) {
        res.status(403);
        return next(new Error("There is nothing on your readinglist."));
      }

      return res.status(200).json({ data: readingList });
    } catch (error) {
      next(error);
    }
  });

bookRouter.route("/:id").post(async function addNewBookState(req, res, next) {
  try {
    // Use knex directly to update join table
    const { status } = req.body;
    const { id } = req.params;
    await db(tableNames.userReadingLog)
      .where({
        user_id: req.user.id,
        book_id: id,
      })
      .update({ status });
    return res.status(200).json({ data: { message: "update complete" } });
  } catch (error) {
    next(error);
  }
});

module.exports = bookRouter;
