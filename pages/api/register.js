import nc from "next-connect";
import { onError } from "../../lib/middlewares";
import argon from "argon2";
import prisma from "../../lib/prisma";
import session from "../../lib/session";

const handler = nc({ onError });

export default handler.use(session).post(async (req, res) => {
  const { password, username } = req.body;
  if (password == null || username == null) {
    res.status(400).json({ error: { message: "Invalid Input" } });
    return;
  }

  try {
    const hashedPassword = await argon.hash(password);
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
      },
    });

    req.session.set("user", { id: user.id, username: user.username });

    await req.session.save();

    res.status(201).json({
      data: {
        isLoggedIn: true,
        user: { id: user.id, username: user.username },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: { message: "Server Error" } });
    return;
  }
});
