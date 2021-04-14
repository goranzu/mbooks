import nc from "next-connect";
import { BookOnReadingListError, UserInputError } from "../../lib/errors";
import { onError, protect } from "../../lib/middlewares";
import prisma from "../../lib/prisma";

const handler = nc({ onError });

// TODO: check query param for plan-to-read or finished-reading

export default handler
  .use(protect)
  .get(async (req, res) => {
    const readingList = await prisma.usersReadingLog.findMany({
      where: {
        userId: req.user.sub,
        status: "PLAN_TO_READ",
      },
      include: { book: true },
    });

    // Filter out UsersReadingLog meta information
    const result = readingList.map((list) => list.book);

    res.status(200).json({
      data: {
        readingList: result,
      },
    });
    return;
  })
  .post(async (req, res) => {
    let {
      goodreadsId,
      title,
      authorName,
      imageUrl,
      averageRating,
      publicationYear,
    } = req.body;
    averageRating = Number(averageRating);
    publicationYear = Number(publicationYear);

    // Check if book is already in the database
    const bookInDB = await prisma.book.findUnique({ where: { goodreadsId } });

    if (bookInDB == null) {
      try {
        await prisma.book.create({
          data: {
            goodreadsId,
            title,
            authorName,
            imageUrl,
            averageRating,
            publicationYear,
            reader: {
              create: { user: { connect: { id: req.user.sub } } },
            },
          },
        });
      } catch (error) {
        // FIX: Check for bug
        throw new Error(error.message);
      }
    } else {
      try {
        console.log(bookInDB);

        await prisma.usersReadingLog.create({
          data: {
            userId: req.user.sub,
            bookId: bookInDB.id,
          },
        });
      } catch (err) {
        if (err.code === "P2002") {
          throw new BookOnReadingListError();
        }
      }
    }

    res.status(201).json({
      data: {
        goodreadsId,
      },
    });
  })
  .delete(async (req, res, next) => {
    try {
      const userId = req.user.sub;
      const bookId = req.body.id;
      console.log("BOOOOOOOK", req.params);
      if (userId == null || bookId == null) {
        throw new UserInputError();
      }

      await prisma.usersReadingLog.delete({
        where: {
          userId,
          bookId,
        },
      });
      res.status(204).end();
      return;
    } catch (error) {
      next(error);
    }
  });
