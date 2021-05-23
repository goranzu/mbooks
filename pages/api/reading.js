import nc from "next-connect";
import { PLAN_TO_READ } from "../../lib/constants";
import { onError, protect } from "../../lib/middlewares";
import prisma from "../../lib/prisma";
import { addBookToReadingList } from "../../lib/models/book.model";

// import { PrismaClient } from ".prisma/client";
// const prisma = new PrismaClient();

const handler = nc({ onError });

export default handler
  .use(protect)
  .get(async (req, res, next) => {
    try {
      let books = await prisma.usersReadingLog.findMany({
        where: {
          status: PLAN_TO_READ,
          userId: req.user.sub,
        },
        include: {
          book: true,
        },
      });

      books = books.map(({ note, book }) => ({ ...book, note }));
      res.status(200).json({ data: { books } });
      return;
    } catch (error) {
      next(error);
    }
  })
  .post(async (req, res, next) => {
    try {
      let { googleId, title, authorName, imageUrl, publishedDate } = req.body;

      await addBookToReadingList({
        googleId,
        title,
        authorName,
        imageUrl,
        publishedDate,
        userId: req.user.sub,
      });

      res.status(201).json({ data: { googleId } });
      return;
    } catch (error) {
      next(error);
    }
  });
