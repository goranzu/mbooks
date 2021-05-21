import { UserInputError } from "../errors";
import {
  addBookToReadingList,
  getAllBooks,
  removeEntryFromReadinglog,
  updateBookStatusToFinished,
} from "../models/book.model";
import { getBookStatus, validateListQuery } from "../uitl";

async function httpGetAllBooks(req, res) {
  const books = await getAllBooks(req.user.sub);
  res.status(200).json({ data: { books } });
  return;
}

async function httpAddBookToList(req, res, next) {
  const list = validateListQuery(req);
  let { googleId, title, authorName, imageUrl, publishedDate } = req.body;

  try {
    if (list === "reading") {
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
    } else {
      await updateBookStatusToFinished({
        userId: req.user.sub,
        bookId: googleId,
      });

      res.status(204).end();

      return;
    }
  } catch (error) {
    next(error);
    return;
  }
}

async function httpDeleteBookFromList(req, res, next) {
  try {
    const list = validateListQuery(req);
    const { id } = req.query;

    let status = getBookStatus(list);

    const userId = req.user.sub;
    const bookId = id;

    if (userId == null || bookId == null) {
      throw new UserInputError();
    }

    await removeEntryFromReadinglog({ userId, bookId, status });

    res.status(204).end();
    return;
  } catch (error) {
    next(error);
  }
}

export { httpAddBookToList, httpDeleteBookFromList, httpGetAllBooks };
