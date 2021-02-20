"use strict";

const { Router } = require("express");
const tableNames = require("../../constants/tableNames");
const bookRouter = Router();
const yup = require("yup");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

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
    // TODO: Check if book is in db, if so add to log else add to db and to log
    try {
      await addBookToReadingListSchema.validate(
        { ...req.body },
        { abortEarly: false },
      );

      const {
        author,
        title,
        goodreads_id,
        publication_year,
        average_rating,
        image_url,
      } = req.body;

      await prisma.book.create({
        data: {
          author,
          goodreadsId: goodreads_id,
          title,
          publicationYear: Number(publication_year),
          averageRating: Number(average_rating),
          imageUrl: image_url,
          ReadingLog: {
            // TODO: mark book state
            create: {
              userId: req.user.id,
            },
          },
        },
      });

      // const user = await prisma.user.findUnique({
      //   where: {
      //     id: req.user.id,
      //   },
      //   include: {
      //     ReadingLog: {
      //       include: {
      //         book: true,
      //       },
      //     },
      //   },
      // });

      return res.status(201).end();
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
        // res.status(200);
        // return next(new Error("There is nothing on your readinglist."));
        return res.status(200).json({ data: [] });
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
