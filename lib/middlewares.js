import { getCookie } from "./uitl";
import jwt from "jsonwebtoken";

function onError(err, req, res) {
  console.error(err);
  let message = req.message;
  let statusCode = err.code || 500;

  if (err.code === "P2002") {
    message = "Book is already on your reading list.";
    statusCode = 400;
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
