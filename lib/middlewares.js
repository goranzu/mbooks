import { getCookie } from "./uitl";
import jwt from "jsonwebtoken";

function onError(err, req, res) {
  console.error(err);
  res.status(err.statusCode || 500).json({
    error: {
      path: req.url,
      message: err.message,
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
