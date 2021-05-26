import argon from "argon2";
import { serialize } from "cookie";
import jwtDecode from "jwt-decode";
import { UnauthorizedError, UserInputError } from "../errors";
import { createUser, findUserByUsername } from "../models/user.model";
import { createToken, setCookie } from "../util";

async function login(req, res, next) {
  try {
    const { password, username } = req.body;
    if (password == null || username == null) {
      throw new UserInputError();
    }

    const user = await findUserByUsername(username);

    if (user == null) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const passwordMatch = await argon.verify(user.password, password);
    if (!passwordMatch) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const userInfo = {
      id: user.id,
      username: user.username,
      books: user.books.map((b) => ({
        id: b.bookId,
        note: b.note,
        status: b.status,
      })),
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
    next(error);
  }
}

async function register(req, res, next) {
  // TODO: Handle duplicate usernames
  try {
    const { password, username } = req.body;
    if (password == null || username == null) {
      throw new UserInputError();
    }

    const user = await createUser({ username, password });

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
    next(error);
  }
}

function logout(req, res, next) {
  try {
    const cookie = serialize("cookie", "", {
      maxAge: -1,
      path: "/",
    });

    res.setHeader("Set-Cookie", cookie);
    res.status(204).end();
    return;
  } catch (error) {
    next(error);
  }
}

export { logout, register, login };
