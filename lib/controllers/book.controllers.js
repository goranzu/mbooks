import { PrismaClient } from ".prisma/client";
import { BookOnReadingListError, UserInputError } from "../errors";
import prisma from "../prisma";

async function getBookOnList(req, res) {
  const { list } = req.query;

  if (list == null || (list !== "reading" && list !== "finished")) {
    throw new UserInputError();
  }

  let status;

  if (list === "finished") {
    status = "FINISHED_READING";
  } else {
    status = "PLAN_TO_READ";
  }

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

async function addBookToList(req, res) {
  const { list } = req.query;

  if (list == null || (list !== "reading" && list !== "finished")) {
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

  // Check if book is already in the database
  const bookInDB = await prisma.book.findUnique({ where: { goodreadsId } });

  if (list === "reading") {
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
  }
}

async function deleteBookFromList(req, res, next) {
  try {
    const { list, id } = req.query;

    if (list == null || (list !== "reading" && list !== "finished")) {
      throw new UserInputError();
    }

    let status;

    if (list === "finished") {
      status = "FINISHED_READING";
    } else {
      status = "PLAN_TO_READ";
    }

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
