import { getCookie } from "./util";
import jwt from "jsonwebtoken";

function onError(err, req, res) {
  console.error(err);
  let message = err.message;
  let statusCode = err.statusCode || 500;

  if (err.code === "P2002") {
    if (err.meta?.target.includes("username")) {
      message = "Username taken.";
      statusCode = 401;
    } else {
      message = "Book is already on your reading list.";
      statusCode = 400;
    }
  }

  res.status(statusCode).json({
    error: {
      path: req.url,
      message,
      stack: process.env.NODE_ENV === "development" && err.stack,
    },
  });
}

function protect(req, res, next) {
  try {
    const token = getCookie(req);
    const decoded = jwt.verify(token, "secret123");
    req.user = decoded;
    next();
    return;
  } catch (error) {
    res.status(401).json({ error: { message: "Not Authorized" } });
  }
}

export { onError, protect };
