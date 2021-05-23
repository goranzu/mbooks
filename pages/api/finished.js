import nc from "next-connect";
import { FINISHED_READING } from "../../lib/constants";
import { onError, protect } from "../../lib/middlewares";
import prisma from "../../lib/prisma";
import { updateBookStatusToFinished } from "../../lib/models/book.model";
import { UserInputError } from "../../lib/errors";

// import { PrismaClient } from ".prisma/client";
// const prisma = new PrismaClient();

const handler = nc({ onError });

export default handler
  .use(protect)
  .get(async (req, res, next) => {
    try {
      let books = await prisma.usersReadingLog.findMany({
        where: {
          status: FINISHED_READING,
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
      let { googleId } = req.body;

      if (!googleId) {
        throw new UserInputError();
      }

      await updateBookStatusToFinished({
        bookId: googleId,
        userId: req.user.sub,
      });

      res.status(204).end();
      return;
    } catch (error) {
      next(error);
    }
  });
