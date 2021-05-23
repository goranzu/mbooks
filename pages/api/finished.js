import nc from "next-connect";
import { onError, protect } from "../../lib/middlewares";
import {
  httpGetFinishedList,
  httpUpdateBookStatusToFinished,
} from "../../lib/controllers/book.controllers";

const handler = nc({ onError });

export default handler
  .use(protect)
  .get(httpGetFinishedList)
  .post(httpUpdateBookStatusToFinished);
