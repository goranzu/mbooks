import jwt from "jsonwebtoken";
import { serialize, parse } from "cookie";

function createToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      username: user.username,
      iss: "api.mbooks",
      aud: "api.mbooks",
    },
    "secret123",
    {
      algorithm: "HS256",
      expiresIn: "1h",
    },
  );
}

const MAX_AGE = 1000 * 60 * 60 * 24;
const COOKIE_NAME = "cookie";

function setCookie(res, token) {
  const cookie = serialize(COOKIE_NAME, token, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });

  res.setHeader("Set-Cookie", cookie);
}

function removeCookie(res) {
  const cookie = serialize(COOKIE_NAME, "", {
    maxAge: -1,
    path: "/",
  });

  res.setHeader("Set-Cookie", cookie);
}

function parseCookie(req) {
  if (req.cookies) return req.cookies;

  const cookie = req.headers?.cookie;
  return parse(cookie || "");
}

function getCookie(req) {
  const cookie = parseCookie(req);
  return cookie[COOKIE_NAME];
}

export { createToken, setCookie, removeCookie, getCookie };
