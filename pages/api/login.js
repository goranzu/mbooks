import nc from "next-connect";
import { onError } from "../../lib/middlewares";
import argon from "argon2";
import * as jwtDecode from "jwt-decode";
import prisma from "../../lib/prisma";
import { createToken, setCookie } from "../../lib/uitl";

const handler = nc({ onError });

export default handler.post(async (req, res) => {
  const { password, username } = req.body;
  if (password == null || username == null) {
    res.status(400).json({ error: { message: "Invalid Input" } });
    return;
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        username,
      },
      select: {
        id: true,
        username: true,
        password: true,
      },
    });
    if (user == null) {
      res.status(401).json({ error: { message: "Not Authorized" } });
      return;
    }

    const passwordMatch = await argon.verify(user.password, password);
    if (!passwordMatch) {
      res.status(401).json({ error: { message: "Not Authorized" } });
      return;
    }

    const userInfo = { id: user.id, username: user.username };

    const token = createToken(userInfo);

    const decoded = jwtDecode(token);

    const { exp } = decoded;

    setCookie(res, token);

    res.status(200).json({
      data: {
        user: userInfo,
        expiresAt: exp,
      },
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: { message: "Server Error" } });
    return;
  }
});
