import nc from "next-connect";
import { onError, protect } from "../../lib/middlewares";
import prisma from "../../lib/prisma";

const handler = nc({ onError });

export default handler.use(protect).get(async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.sub } });
    res
      .status(200)
      .json({ data: { user: { id: user.id, username: user.username } } });
    return;
  } catch (error) {
    res.status(401).json({ error: { message: "Not Authorized" } });
  }
});
