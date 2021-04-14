import nc from "next-connect";
import { UserInputError } from "../../../lib/errors";
import { onError, protect } from "../../../lib/middlewares";
import prisma from "../../../lib/prisma";

const handler = nc({ onError });

// TODO: check query param for plan-to-read or finished-reading

export default handler
  .use(protect)

  .delete(async (req, res, next) => {
    try {
      const userId = req.user.sub;
      const bookId = req.query.id;
      console.log("BOOOOOOOK", req.query);
      if (userId == null || bookId == null) {
        throw new UserInputError();
      }

      await prisma.usersReadingLog.delete({
        where: {
          userId_bookId: {
            userId,
            bookId,
          },
        },
      });
      res.status(204).end();
      return;
    } catch (error) {
      next(error);
    }
  });
