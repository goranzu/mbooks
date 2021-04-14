import nc from "next-connect";
import { onError, protect } from "../../lib/middlewares";
import prisma from "../../lib/prisma";

const handler = nc({ onError });

export default handler.use(protect).get(async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.sub },
      include: {
        books: { include: { book: true } },
      },
    });

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
    console.error(error);
    res.status(401).json({ error: { message: "Not Authorized" } });
  }
});
