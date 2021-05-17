import { PrismaClient } from ".prisma/client";
import nc from "next-connect";
import { FINISHED_READING, PLAN_TO_READ } from "../../../../lib/constants";
import { UserInputError } from "../../../../lib/errors";
import { onError, protect } from "../../../../lib/middlewares";
import prisma from "../../../../lib/prisma";
import { validateListQuery } from "../../../../lib/uitl";

// const prisma = new PrismaClient();

const handler = nc({ onError });

export default handler.use(protect).post(async (req, res, next) => {
  const { note, googleId } = req.body;
  const list = validateListQuery(req);

  const status = list === "reading" ? PLAN_TO_READ : FINISHED_READING;

  if (!note || !googleId) {
    throw new UserInputError();
  }

  console.log(note, googleId, list);
  try {
    const update = await prisma.usersReadingLog.update({
      where: {
        userId_bookId_status: {
          userId: req.user.sub,
          bookId: googleId,
          status,
        },
      },
      data: {
        note,
      },
    });
    res.status(200).json(update);
    return;
  } catch (error) {
    next(error);
  }
});
