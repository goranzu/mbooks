import { BookOnReadingListError, UserInputError } from "../errors";
import prisma from "../prisma";

const listMap = {
  readingList: "PLAN_TO_READ",
  finishedList: "FINISHED_READING",
};

async function getBookOnList(req, res) {
  const { list } = req.query;
  if (list == null || !(list in listMap)) {
    throw new UserInputError();
  }

  const status = listMap[list];

  const listResult = await prisma.usersReadingLog.findMany({
    where: {
      userId: req.user.sub,
      status,
    },
    include: { book: true },
  });

  // Filter out UsersReadingLog meta information
  const result = listResult.map((list) => list.book);

  res.status(200).json({
    data: {
      [list]: result,
    },
  });
  return;
}

async function addBookToList(req, res) {
  const { list } = req.query;
  if (list == null || !(list in listMap)) {
    throw new UserInputError();
  }

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

  const bookInDB = await prisma.book.findUnique({ where: { goodreadsId } });

  if (list === "readingList") {
    // Check if book is already in the database

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
    return;
  }

  if (list === "finishedList") {
    // Update the entry in the many to many table to FINISHED_READING
    await prisma.usersReadingLog.update({
      where: {
        userId_bookId_status: {
          userId: req.user.sub,
          bookId: bookInDB.id,
          status: "PLAN_TO_READ",
        },
      },
      data: {
        status: "FINISHED_READING",
      },
    });

    res.status(201).json({
      data: {
        goodreadsId,
      },
    });
    return;
  }
}

async function deleteBookFromList(req, res, next) {
  try {
    const userId = req.user.sub;
    const { id: bookId, list } = req.query;

    if (userId == null || bookId == null || !(list in listMap)) {
      throw new UserInputError();
    }

    const status = listMap[list];

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
