import nc from "next-connect";
import { onError, protect } from "../../../../lib/middlewares";
import { removeEntryFromReadinglog } from "../../../../lib/models/book.model";
import { FINISHED_READING, PLAN_TO_READ } from "../../../../lib/constants";
import { UserInputError } from "../../../../lib/errors";

// import { PrismaClient } from ".prisma/client";
// const prisma = new PrismaClient();

const handler = nc({ onError });

export default handler.use(protect).delete(async (req, res, next) => {
  try {
    const { googleId, list } = req.query;

    console.log(googleId, list);

    if (!googleId || (list !== "finished" && list !== "reading")) {
      throw new UserInputError();
    }

    const status = list === "finished" ? FINISHED_READING : PLAN_TO_READ;

    await removeEntryFromReadinglog({
      userId: req.user.sub,
      bookId: googleId,
      status,
    });

    res.status(204).end();
    return;
  } catch (error) {
    next(error);
  }
});
