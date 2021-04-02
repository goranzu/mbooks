import nc from "next-connect";
import { onError } from "../../lib/middlewares";
import argon from "argon2";
import prisma from "../../lib/prisma";

const handler = nc({ onError });

export default handler.post(async (req, res) => {
  const { password, username } = req.body;
  if (password == null || username == null) {
    res.status(400).json({ error: { message: "Invalid Input" } });
    return;
  }

  try {
    const hashedPassword = await argon.hash(password);
    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
      },
    });

    res.status(201).end();
  } catch (error) {
    res.status(500).json({ error: { message: "Server Error" } });
    return;
  }
});
