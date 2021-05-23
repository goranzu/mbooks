import nc from "next-connect";
import { httpGetAllBooks } from "../../../lib/controllers/book.controllers";
import { onError, protect } from "../../../lib/middlewares";

const handler = nc({ onError });

// TODO: check query param for plan-to-read or finished-reading

export default handler.use(protect).get(httpGetAllBooks);
