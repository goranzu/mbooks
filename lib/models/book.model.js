// import { PrismaClient } from ".prisma/client";
import { FINISHED_READING, PLAN_TO_READ } from "../constants";

import prisma from "../prisma";
// const prisma = new PrismaClient();

async function addNoteToBook({ userId, googleId, note, status }) {
  return await prisma.usersReadingLog.update({
    where: {
      userId_bookId_status: {
        userId,
        bookId: googleId,
        status,
      },
    },
    data: {
      note,
    },
  });
}

async function getAllBooks(userId) {
  const books = await prisma.usersReadingLog.findMany({
    where: {
      userId,
    },
    include: {
      book: {
        select: {
          id: true,
          googleId: true,
          title: true,
          authorName: true,
          imageUrl: true,
          publishedDate: true,
        },
      },
    },
  });

  return books.map((b) => ({ ...b.book, note: b.note, status: b.status }));
}

async function updateBookStatusToFinished({ userId, bookId }) {
  return prisma.usersReadingLog.update({
    where: {
      userId_bookId_status: {
        userId,
        bookId,
        status: PLAN_TO_READ,
      },
    },
    data: {
      status: FINISHED_READING,
    },
  });
}

async function addBookToReadingList({
  googleId,
  title,
  authorName,
  imageUrl,
  publishedDate,
  userId,
}) {
  return prisma.book.upsert({
    where: {
      googleId,
    },
    create: {
      googleId,
      title,
      authorName,
      imageUrl,
      publishedDate,
      reader: {
        create: {
          userId,
          status: PLAN_TO_READ,
        },
      },
    },
    update: {
      googleId,
      title,
      authorName,
      imageUrl,
      publishedDate,
      reader: {
        create: {
          userId,
          status: PLAN_TO_READ,
        },
      },
    },
  });
}

async function removeEntryFromReadinglog({ userId, bookId, status }) {
  return prisma.usersReadingLog.delete({
    where: {
      userId_bookId_status: {
        userId,
        bookId,
        status,
      },
    },
  });
}

async function getReadingList({ userId }) {
  let books = await prisma.usersReadingLog.findMany({
    where: {
      status: PLAN_TO_READ,
      userId,
    },
    include: {
      book: true,
    },
  });

  return books.map(({ note, book }) => ({ ...book, note }));
}

async function getFinishedList({ userId }) {
  let books = await prisma.usersReadingLog.findMany({
    where: {
      status: FINISHED_READING,
      userId,
    },
    include: {
      book: true,
    },
  });

  return books.map(({ note, book }) => ({ ...book, note }));
}

export {
  addNoteToBook,
  updateBookStatusToFinished,
  addBookToReadingList,
  removeEntryFromReadinglog,
  getAllBooks,
  getReadingList,
  getFinishedList,
};
