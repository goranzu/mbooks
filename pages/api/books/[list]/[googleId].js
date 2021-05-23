import nc from "next-connect";
import { onError, protect } from "../../../../lib/middlewares";
import {
  httpDeleteBookFromList,
  httpUpdateBookNote,
} from "../../../../lib/controllers/book.controllers";

const handler = nc({ onError });

export default handler
  .use(protect)
  .put(httpUpdateBookNote)
  .delete(httpDeleteBookFromList);
