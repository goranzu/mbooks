import { FINISHED_READING, PLAN_TO_READ } from "../constants";
import { BookOnReadingListError, UserInputError } from "../errors";
import prisma from "../prisma";
import { getBookStatus, validateListQuery } from "../uitl";

// TODO: Check docs for nc-connect error handling

async function getBookOnList(req, res) {
  const list = validateListQuery(req);

  const status = getBookStatus(list);

  const readingList = await prisma.usersReadingLog.findMany({
    where: {
      userId: req.user.sub,
      status,
    },
    include: { book: true },
  });

  // Filter out UsersReadingLog meta information
  const result = readingList.map((list) => list.book);

  res.status(200).json({
    data: {
      list: result,
    },
  });
  return;
}

async function addBookToList(req, res, next) {
  const list = validateListQuery(req);

  if (list === "finished") {
    try {
      await prisma.usersReadingLog.update({
        where: {
          userId_bookId_status: {
            userId: req.user.sub,
            bookId: req.body.id,
            status: PLAN_TO_READ,
          },
        },
        data: {
          status: FINISHED_READING,
        },
      });
      res.status(204).end();
      return;
    } catch (error) {
      next(error);
    }
  }

  // Check if book is already in the database
  const bookInDB = await prisma.book.findUnique({
    where: { goodreadsId: req.body.goodreadsId },
  });

  if (list === "reading") {
    if (bookInDB == null) {
      try {
        let {
          goodreadsId,
          title,
          authorName,
          imageUrl,
          averageRating,
          publicationYear,
        } = req.body;

        averageRating = Number(averageRating);
        publicationYear = Number(publicationYear) || 0;

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
        goodreadsId: req.body.goodreadsId,
      },
    });
    return;
  }
}

async function deleteBookFromList(req, res, next) {
  try {
    const list = validateListQuery(req);
    const { id } = req.query;

    let status = getBookStatus(list);

    const userId = req.user.sub;
    const bookId = id;

    if (userId == null || bookId == null) {
      throw new UserInputError();
    }

    await prisma.usersReadingLog.delete({
      where: {
        userId_bookId_status: {
          userId,
          bookId,
          status,
        },
      },
    });

    res.status(204).end();
    return;
  } catch (error) {
    next(error);
  }
}

export { getBookOnList, addBookToList, deleteBookFromList };
