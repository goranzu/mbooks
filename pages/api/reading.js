import nc from "next-connect";
import { onError, protect } from "../../lib/middlewares";
import {
  httpAddBookToReadingList,
  httpGetReadingList,
} from "../../lib/controllers/book.controllers";

const handler = nc({ onError });

export default handler
  .use(protect)
  .get(httpGetReadingList)
  .post(httpAddBookToReadingList);
