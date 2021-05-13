import { FINISHED_READING, PLAN_TO_READ } from "../constants";
import prisma from "../prisma";

async function getBookOnList({ status, userId }) {
  return prisma.usersReadingLog.findMany({
    where: {
      userId,
      status,
    },
    include: { book: true },
  });
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

export {
  getBookOnList,
  updateBookStatusToFinished,
  addBookToReadingList,
  removeEntryFromReadinglog,
};
