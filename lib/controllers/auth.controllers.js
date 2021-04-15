import argon from "argon2";
import { serialize } from "cookie";
import jwtDecode from "jwt-decode";
import prisma from "../prisma";
import { createToken, setCookie } from "../uitl";

async function login(req, res) {
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
      include: {
        books: { include: { book: true } },
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

    const userInfo = {
      id: user.id,
      username: user.username,
      books: user.books.map((b) => b.book.goodreadsId),
    };

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
}

async function register(req, res) {
  // TODO: Handle duplicate usernames
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

    const userInfo = {
      id: user.id,
      username: user.username,
      books: [],
    };

    const token = createToken(userInfo);

    const decoded = jwtDecode(token);

    const { exp } = decoded;

    setCookie(res, token);

    res.status(201).json({
      data: {
        user: userInfo,
        expiresAt: exp,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: { message: "Server Error" } });
    return;
  }
}

function logout(req, res) {
  try {
    const cookie = serialize("cookie", "", {
      maxAge: -1,
      path: "/",
    });

    res.setHeader("Set-Cookie", cookie);
    res.status(204).json({ data: { message: "Logged Out" } });
    return;
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: { message: "Something went wrong..." } });
  }
}

export { logout, register, login };
