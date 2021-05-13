import { UserInputError } from "../errors";
import {
  addBookToReadingList,
  getBookOnList,
  removeEntryFromReadinglog,
  updateBookStatusToFinished,
} from "../models/book.model";
import { getBookStatus, validateListQuery } from "../uitl";

async function httpGetBookOnList(req, res) {
  const list = validateListQuery(req);

  const status = getBookStatus(list);

  const listRes = await getBookOnList({ status, userId: req.user.sub });

  // Filter out UsersReadingLog meta information
  const result = listRes.map((list) => list.book);

  res.status(200).json({
    data: {
      list: result,
    },
  });
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
        bookId: req.body.id,
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

export { httpGetBookOnList, httpAddBookToList, httpDeleteBookFromList };
