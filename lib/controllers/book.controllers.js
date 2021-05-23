import { FINISHED_READING, PLAN_TO_READ } from "../constants";
import { UserInputError } from "../errors";
import * as model from "../models/book.model";

function validateQueryParams(req) {
  const { googleId, list } = req.query;

  if (!googleId || (list !== "finished" && list !== "reading")) {
    throw new UserInputError();
  }

  return {
    status: list === "finished" ? FINISHED_READING : PLAN_TO_READ,
    googleId,
  };
}

async function httpGetAllBooks(req, res) {
  const books = await model.getAllBooks(req.user.sub);
  res.status(200).json({ data: { books } });
  return;
}

async function httpDeleteBookFromList(req, res, next) {
  try {
    const { status, googleId } = validateQueryParams(req);

    await model.removeEntryFromReadinglog({
      userId: req.user.sub,
      bookId: googleId,
      status,
    });

    res.status(204).end();
    return;
  } catch (error) {
    next(error);
  }
}

async function httpUpdateBookNote(req, res, next) {
  try {
    const { status, googleId } = validateQueryParams(req);

    const { note } = req.body;

    await model.addNoteToBook({
      userId: req.user.sub,
      googleId,
      status,
      note,
    });

    res.status(201).end();
    return;
  } catch (error) {
    next(error);
  }
}

async function httpGetReadingList(req, res, next) {
  try {
    const books = await model.getReadingList({ userId: req.user.sub });

    res.status(200).json({ data: { books } });
    return;
  } catch (error) {
    next(error);
  }
}

async function httpAddBookToReadingList(req, res, next) {
  try {
    let { googleId, title, authorName, imageUrl, publishedDate } = req.body;

    await model.addBookToReadingList({
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
}

async function httpGetFinishedList(req, res, next) {
  try {
    const books = await model.getFinishedList({ userId: req.user.sub });
    res.status(200).json({ data: { books } });
    return;
  } catch (error) {
    next(error);
  }
}

async function httpUpdateBookStatusToFinished(req, res, next) {
  try {
    let { googleId } = req.body;

    if (!googleId) {
      throw new UserInputError();
    }

    await model.updateBookStatusToFinished({
      bookId: googleId,
      userId: req.user.sub,
    });

    res.status(204).end();
    return;
  } catch (error) {
    next(error);
  }
}

export {
  httpDeleteBookFromList,
  httpGetAllBooks,
  httpUpdateBookNote,
  httpGetReadingList,
  httpAddBookToReadingList,
  httpGetFinishedList,
  httpUpdateBookStatusToFinished,
};
