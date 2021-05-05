import nc from "next-connect";
import { UnauthorizedError } from "../../lib/errors";
import { onError, protect } from "../../lib/middlewares";
import { findUserById } from "../../lib/models/user.model";

const handler = nc({ onError });

export default handler.use(protect).get(async (req, res, next) => {
  try {
    // const user = await prisma.user.findUnique({
    //   where: { id: req.user.sub },
    //   include: {
    //     books: { include: { book: true } },
    //   },
    // });

    const user = await findUserById(req.user.sub);

    const userInfo = {
      id: user.id,
      username: user.username,
      books: user.books.map((b) => b.book.goodreadsId),
    };

    const expiresAt = req.user.exp;
    res.status(200).json({
      data: { user: userInfo, expiresAt },
    });

    return;
  } catch (error) {
    next(new UnauthorizedError());
    // console.error(error);
    // res.status(401).json({ error: { message: "Not Authorized" } });
  }
});
